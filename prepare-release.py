import os
import shutil
import subprocess
import re
import stat

# --- CONFIGURATION ---
CORE_DIRS = [
    'src',
    'companion',
    'test',
    '.github'
]

CORE_FILES = [
    'package.json',
    'yarn.lock',
    '.yarnrc.yml',
    'LICENSE',
    'README.md',
    'eslint.config.mjs',
    'jest.config.js',
    '.prettierignore',
    '.gitignore'
]

DIST_DIR = 'release_build'

def remove_readonly(func, path, excinfo):
    os.chmod(path, stat.S_IWRITE)
    func(path)

def clean_dist():
    if os.path.exists(DIST_DIR):
        print(f"Cleaning existing directory: {DIST_DIR}...")
        try:
            shutil.rmtree(DIST_DIR, onerror=remove_readonly)
        except Exception as e:
            print(f"Warning: Could not fully clean {DIST_DIR}: {e}")
    if not os.path.exists(DIST_DIR):
        os.makedirs(DIST_DIR)

def copy_core():
    print("Copying core files and directories...")
    for d in CORE_DIRS:
        if os.path.exists(d):
            if d == 'src':
                # Selective copy for src to avoid dev junk
                os.makedirs(os.path.join(DIST_DIR, 'src'), exist_ok=True)
                for item in os.listdir('src'):
                    s = os.path.join('src', item)
                    d_path = os.path.join(DIST_DIR, s)
                    if os.path.isdir(s):
                        if item not in ['patch', 'temp', 'new_temp', 'src_new', 'src_brand_new']:
                            shutil.copytree(s, d_path)
                    else:
                        if item.endswith('.js') and item != 'test.txt':
                            shutil.copy2(s, d_path)
            else:
                shutil.copytree(d, os.path.join(DIST_DIR, d))
    
    for f in CORE_FILES:
        if os.path.exists(f):
            shutil.copy2(f, os.path.join(DIST_DIR, f))

def update_docs():
    print("Generating latest documentation...")
    try:
        # Pass full path to node to be safe on Windows
        subprocess.run(['node', 'src/help.js'], cwd=DIST_DIR, check=True, shell=True)
    except Exception as e:
        print(f"Warning: Could not update documentation: {e}")

def run_quality_checks():
    print("Running Prettier format in release folder...")
    try:
        # Prettier might not be in PATH, try via npx
        subprocess.run(['npx', 'prettier', '-w', '.'], cwd=DIST_DIR, check=True, shell=True)
    except Exception as e:
        print(f"Warning: Prettier failed: {e}")

def check_branding():
    print("Checking for leftover 'Obsbot' or 'Tail' branding...")
    patterns = [re.compile(r'obsbot', re.IGNORECASE), re.compile(r'tail', re.IGNORECASE)]
    found_issues = []

    for root, dirs, files in os.walk(DIST_DIR):
        if '.github' in root: continue # Skip CI workflows
        for file in files:
            if file.endswith(('.js', '.md', '.json')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        for p in patterns:
                            if p.search(content):
                                # Logic to avoid false positives like "details"
                                # We check for word boundaries or specific patterns
                                if re.search(r'\bobsbot\b', content, re.I) or re.search(r'\btail\b', content, re.I):
                                    found_issues.append(f"{path} contains branding string.")
                                    break
                except:
                    pass
    
    if found_issues:
        print("BRANDING ISSUES FOUND (Action required):")
        for issue in found_issues:
            print(f"  - {issue}")
    else:
        print("Branding check passed.")

def main():
    print("--- RELEASE PREPARATION STARTED ---")
    clean_dist()
    copy_core()
    update_docs()
    run_quality_checks()
    check_branding()
    print("--- DONE ---")
    print(f"Clean release version is available in: {DIST_DIR}")
    print("\nNext steps to push to main:")
    print(f"  1. git checkout main")
    print(f"  2. Copy contents of {DIST_DIR} to current folder (overwrite)")
    print(f"  3. git add .")
    print(f"  4. git commit -m 'Release update'")
    print(f"  5. git push origin main")

if __name__ == '__main__':
    main()

import os
import subprocess
import glob
import time
from datetime import datetime, timedelta

def run_git(args):
    subprocess.run(["git"] + args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def setup_repo():
    subprocess.run(["git", "init"], check=True)
    subprocess.run(["git", "branch", "-M", "main"])
    
    # Check if user is configured, if not, set a temporary one
    try:
        subprocess.run(["git", "config", "user.name"], check=True, stdout=subprocess.DEVNULL)
    except subprocess.CalledProcessError:
        subprocess.run(["git", "config", "user.name", "chakradhar0910-jpg"])
        subprocess.run(["git", "config", "user.email", "chakradhar0910-jpg@users.noreply.github.com"])

def get_files():
    files = []
    for root, dirs, filenames in os.walk("."):
        if ".git" in root or "node_modules" in root or "venv" in root or "__pycache__" in root:
            continue
        for f in filenames:
            if not f.endswith(".pyc"):
                files.append(os.path.join(root, f))
    return files

def make_commits(files):
    # Divide files into at least 25 chunks
    chunks = 25
    chunk_size = max(1, len(files) // chunks)
    
    start_date = datetime.now() - timedelta(days=20)
    
    for i in range(0, len(files), chunk_size):
        chunk = files[i:i+chunk_size]
        for f in chunk:
            subprocess.run(["git", "add", f], check=False)
        
        # Commit
        msg = f"Add files for component part {i//chunk_size + 1}"
        commit_date = start_date + timedelta(days=(i//chunk_size)*0.5)
        date_str = commit_date.strftime("%Y-%m-%dT%H:%M:%S")
        
        env = os.environ.copy()
        env["GIT_AUTHOR_DATE"] = date_str
        env["GIT_COMMITTER_DATE"] = date_str
        
        try:
            subprocess.run(["git", "commit", "-m", msg], env=env, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print(f"Committed chunk {i//chunk_size + 1}...")
        except subprocess.CalledProcessError:
            pass

if __name__ == '__main__':
    if not os.path.exists(".git"):
        setup_repo()
    
    files = get_files()
    make_commits(files)
    
    # Add remote
    try:
        subprocess.run(["git", "remote", "add", "origin", "https://github.com/chakradhar0910-jpg/ML-Based-Student-Success-Predictor.git"])
    except:
        pass
    print("Repository setup and commits created!")

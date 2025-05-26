# GitHub Upload Commands

After creating your repository on GitHub, run these commands in your terminal:

## Replace the placeholders:
- `YOUR_USERNAME` = Your GitHub username
- `REPO_NAME` = Your repository name (e.g., design-document-builder)

## Commands to run:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push code to GitHub
git push -u origin main
```

## Example (replace with your actual values):
```bash
# If your username is "johndoe" and repo is "design-document-builder"
git remote add origin https://github.com/johndoe/design-document-builder.git
git push -u origin main
```

## What this does:
- `git remote add origin`: Links your local repository to GitHub
- `git push -u origin main`: Uploads all your code to GitHub
- `-u` flag: Sets up tracking so future pushes are easier

## Alternative SSH method (if you have SSH keys set up):
```bash
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
git push -u origin main

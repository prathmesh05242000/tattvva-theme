$gitCmd = "C:\Users\prath\AppData\Local\Programs\MinGit\cmd"
$env:PATH = "$gitCmd;" + $env:PATH

# Add to user permanent PATH if not already present
$userPath = [Environment]::GetEnvironmentVariable("PATH", [EnvironmentVariableTarget]::User)
if ($userPath -notlike "*MinGit*") {
    [Environment]::SetEnvironmentVariable("PATH", "$userPath;$gitCmd", [EnvironmentVariableTarget]::User)
}

# Remove setup script
Remove-Item -Force -ErrorAction SilentlyContinue setup_git.ps1

Write-Output "--- Initializing Git ---"
& git init -b main

# Configure identity if not already set
$userName = & git config user.name
if (-not $userName) {
    & git config user.name "prathmesh05242000"
    & git config user.email "prathmesh05242000@users.noreply.github.com"
}

Write-Output "Git user: $(& git config user.name) <$(& git config user.email)>"

Write-Output "--- Configuring Remote ---"
& git remote remove origin 2>$null
& git remote add origin "https://github.com/prathmesh05242000/tattvva-theme.git"
& git remote -v

Write-Output "--- Staging Files ---"
& git add -A
& git reset HEAD git_init_commit.ps1 2>$null
& git status --short

Write-Output "--- Committing Files ---"
& git commit -m "Initial commit: Complete Tattvva Shopify OS 2.0 theme with compressed WebP assets and 7 products"

Write-Output "--- Pushing to GitHub (main) ---"
& git push -u origin main

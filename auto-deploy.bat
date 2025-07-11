@echo off
echo ================================================
echo    ARCADE HIMAFI ITB - Auto Deploy Script
echo ================================================
echo.

:: Set window title
title ARCADE Auto Deploy

:: Change to project directory
cd /d "%~dp0"

:: Display current directory
echo Current directory: %CD%
echo.

:: Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git first
    pause
    exit /b 1
)

:: Check if we're in a git repository
if not exist ".git" (
    echo ERROR: This is not a Git repository
    echo Please run 'git init' first
    pause
    exit /b 1
)

:: Show current git status
echo Checking Git status...
git status --porcelain > temp_status.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to check Git status
    del temp_status.txt 2>nul
    pause
    exit /b 1
)

:: Check if there are changes to commit
for /f %%i in ("temp_status.txt") do set size=%%~zi
del temp_status.txt

if %size% equ 0 (
    echo.
    echo ✅ No changes to commit. Repository is up to date.
    echo.
    pause
    exit /b 0
)

echo.
echo 📋 Changes detected. Preparing to commit and push...
echo.

:: Show what will be committed
echo Changes to be committed:
git status --short
echo.

:: Ask for commit message
set /p commit_message="Enter commit message (press Enter for default): "
if "%commit_message%"=="" (
    set "commit_message=Auto deploy: Update website content and configurations"
)

echo.
echo 🔄 Adding all changes...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

echo ✅ Files added successfully
echo.

echo 🔄 Committing changes...
git commit -m "%commit_message%"
if %errorlevel% neq 0 (
    echo ERROR: Failed to commit changes
    pause
    exit /b 1
)

echo ✅ Changes committed successfully
echo.

echo 🔄 Pushing to remote repository...
git push
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Push failed. Trying to set upstream...
    git push --set-upstream origin main
    if %errorlevel% neq 0 (
        echo ERROR: Failed to push to remote repository
        echo Please check your internet connection and repository access
        pause
        exit /b 1
    )
)

echo.
echo ================================================
echo           🎉 DEPLOY SUCCESSFUL! 🎉
echo ================================================
echo.
echo ✅ All changes have been committed and pushed
echo ✅ Website will be automatically deployed by Netlify
echo ✅ Check your Netlify dashboard for build status
echo.
echo 🌐 Your website will be available at:
echo    https://your-site-name.netlify.app
echo.
echo 📊 Check deployment status:
echo    https://app.netlify.com/sites/your-site-name/deploys
echo.

:: Show final git status
echo Final repository status:
git status
echo.

echo Press any key to close...
pause >nul

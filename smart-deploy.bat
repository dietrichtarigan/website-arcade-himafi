@echo off
chcp 65001 >nul
echo ================================================
echo    🎯 ARCADE HIMAFI ITB - Smart Deploy Tool
echo ================================================
echo.

:: Set window title
title ARCADE Smart Deploy

:: Change to project directory
cd /d "%~dp0"

:MAIN_MENU
cls
echo ================================================
echo    🎯 ARCADE HIMAFI ITB - Smart Deploy Tool
echo ================================================
echo.
echo Current directory: %CD%
echo.
echo Choose an option:
echo.
echo 1. 🚀 Quick Deploy (Auto commit + push)
echo 2. 📝 Custom Commit Message Deploy
echo 3. 📊 Check Status Only
echo 4. 🔄 Pull Latest Changes
echo 5. 🌐 Open Netlify Dashboard
echo 6. 📖 Open GitHub Repository
echo 7. ❌ Exit
echo.
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" goto QUICK_DEPLOY
if "%choice%"=="2" goto CUSTOM_DEPLOY
if "%choice%"=="3" goto CHECK_STATUS
if "%choice%"=="4" goto PULL_CHANGES
if "%choice%"=="5" goto OPEN_NETLIFY
if "%choice%"=="6" goto OPEN_GITHUB
if "%choice%"=="7" goto EXIT

echo Invalid choice. Please try again.
timeout /t 2 >nul
goto MAIN_MENU

:QUICK_DEPLOY
cls
echo ================================================
echo           🚀 Quick Deploy Mode
echo ================================================
echo.

:: Check git status
git status --porcelain > temp_status.txt
for /f %%i in ("temp_status.txt") do set size=%%~zi
del temp_status.txt

if %size% equ 0 (
    echo ✅ No changes detected. Repository is up to date.
    echo.
    pause
    goto MAIN_MENU
)

echo Changes detected:
git status --short
echo.

:: Generate timestamp for commit message
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set mydate=%%c-%%a-%%b
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a:%%b
set timestamp=%mydate% %mytime%

set "commit_message=Auto deploy: Website update - %timestamp%"

echo Commit message: %commit_message%
echo.

call :DO_DEPLOY "%commit_message%"
goto MAIN_MENU

:CUSTOM_DEPLOY
cls
echo ================================================
echo        📝 Custom Commit Message Deploy
echo ================================================
echo.

:: Check git status
git status --porcelain > temp_status.txt
for /f %%i in ("temp_status.txt") do set size=%%~zi
del temp_status.txt

if %size% equ 0 (
    echo ✅ No changes detected. Repository is up to date.
    echo.
    pause
    goto MAIN_MENU
)

echo Changes to be committed:
git status --short
echo.

echo Common commit message templates:
echo 1. Fix: Bug fixes and error corrections
echo 2. Feature: New features and enhancements
echo 3. Update: Content updates and modifications
echo 4. Style: UI/UX improvements and styling
echo 5. Docs: Documentation updates
echo 6. Config: Configuration and setup changes
echo.

set /p commit_message="Enter your commit message: "
if "%commit_message%"=="" (
    echo No commit message provided. Using default...
    set "commit_message=Update: General website improvements"
)

call :DO_DEPLOY "%commit_message%"
goto MAIN_MENU

:CHECK_STATUS
cls
echo ================================================
echo            📊 Repository Status
echo ================================================
echo.

echo Git Status:
git status
echo.

echo Recent Commits:
git log --oneline -5
echo.

echo Remote Information:
git remote -v
echo.

echo Branch Information:
git branch -a
echo.

pause
goto MAIN_MENU

:PULL_CHANGES
cls
echo ================================================
echo           🔄 Pull Latest Changes
echo ================================================
echo.

echo Fetching latest changes from remote...
git fetch
echo.

echo Pulling changes...
git pull
if %errorlevel% equ 0 (
    echo ✅ Successfully pulled latest changes
) else (
    echo ❌ Failed to pull changes
)
echo.

pause
goto MAIN_MENU

:OPEN_NETLIFY
echo 🌐 Opening Netlify Dashboard...
start https://app.netlify.com/
goto MAIN_MENU

:OPEN_GITHUB
echo 📖 Opening GitHub Repository...
for /f "tokens=2 delims= " %%a in ('git remote get-url origin') do set repo_url=%%a
if defined repo_url (
    start %repo_url%
) else (
    echo ❌ No remote repository found
    pause
)
goto MAIN_MENU

:DO_DEPLOY
echo 🔄 Adding all changes...
git add .
if %errorlevel% neq 0 (
    echo ❌ ERROR: Failed to add files
    pause
    exit /b 1
)

echo ✅ Files added successfully
echo.

echo 🔄 Committing changes...
git commit -m %1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Failed to commit changes
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
        echo ❌ ERROR: Failed to push to remote repository
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
echo ✅ Netlify will automatically deploy your changes
echo ✅ Build process will start in a few moments
echo.
echo 🌐 Website: https://your-site-name.netlify.app
echo 📊 Deploy Status: https://app.netlify.com/sites/your-site-name/deploys
echo.

timeout /t 3 >nul
exit /b 0

:EXIT
echo.
echo Thank you for using ARCADE Smart Deploy Tool!
echo Website: https://arcade.himafi.org
echo.
pause
exit

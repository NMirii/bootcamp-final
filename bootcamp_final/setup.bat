@echo off
REM Bootcamp Login System - One-Click Setup for Windows
REM This batch file prepares everything for Vercel deployment

echo.
echo 🚀 Bootcamp Login Sistemi - Vercel Deploy Hazirlamasi
echo ================================================
echo.

REM Step 1: Check if git is installed
echo 1️⃣  Git kontrol edilir...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git yüklü deyil. Git-i yükleyin: https://git-scm.com/download
    pause
    exit /b 1
)
echo ✅ Git OK
echo.

REM Step 2: Check if npm is installed
echo 2️⃣  npm kontrol edilir...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js yüklü deyil. Node.js-i yükleyin: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js OK
echo.

REM Step 3: Initialize git repository
echo 3️⃣  Git repository baslatilir...
if not exist .git (
    git init
    git config user.name "Bootcamp Developer"
    git config user.email "dev@bootcamp.com"
    echo ✅ Git repository yaradildi
) else (
    echo ✅ Git repository artiq var
)
echo.

REM Step 4: Create .env file
echo 4️⃣  Environment fayli yaradilir...
if not exist .env (
    copy .env.example .env
    echo ✅ .env fayli yaradildi
) else (
    echo ⚠️  .env fayli artiq var (skip)
)
echo.

REM Step 5: Install dependencies
echo 5️⃣  Dependencies kurulur...
call npm install
echo ✅ Dependencies kuruldu
echo.

REM Step 6: Add all files
echo 6️⃣  Fayllar git-ə əlavə edilir...
git add .
echo ✅ Fayllar əlavə edildi
echo.

REM Step 7: Initial commit
echo 7️⃣  İlk commit yaradilir...
git commit -m "Initial commit: Bootcamp Login System - Production Ready"
if errorlevel 0 (
    echo ✅ Commit yaradildi
) else (
    echo ⚠️  Dəyişiklik yoxdur yaxud commit uğursuz (skip)
)
echo.

REM Step 8: Show next steps
echo ================================================
echo ✅ HAZIRLANMA TAMAMLANDI!
echo ================================================
echo.
echo 📋 SONRAKİ ADDIMLAR:
echo.
echo 1️⃣  GITHUB-A PUSH ET:
echo    git remote add origin https://github.com/YOUR_USERNAME/bootcamp-login.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 2️⃣  VERCEL-DE DEPLOY ET:
echo    npm i -g vercel
echo    vercel
echo.
echo 3️⃣  YOXLA:
echo    - Vercel dashboard-da URL-i tap
echo    - test@bootcamp.com / Password123 ilə giriş yap
echo.
echo ================================================
echo.
echo 🎯 TEST HESABLARI:
echo    Email: test@bootcamp.com
echo    Şifrə: Password123
echo.
echo    Email: user@bootcamp.com
echo    Şifrə: Test1234
echo.
echo ================================================
echo.
echo 📚 DOKUMENTASIYA:
echo    - README.md → Başlangiç
echo    - QUICK_START.md → Tez Setup
echo    - API_DOCUMENTATION.md → API Ref
echo.
echo ================================================
echo.
echo Sənə kömək lazımdır? README.md oxu!
echo 🚀 Hazırsan? Yukarıdaki addımları izlə!
echo.
pause

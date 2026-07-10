#!/bin/bash

# Bootcamp Login System - One-Click Setup & Deploy Script
# This script prepares everything for Vercel deployment

echo "🚀 Bootcamp Login Sistemi - Vercel Deploy Hazırlama"
echo "================================================"
echo ""

# Step 1: Check if git is installed
echo "1️⃣  Git kontrol edilir..."
if ! command -v git &> /dev/null; then
    echo "❌ Git yüklü deyil. Git-i yükləyin: https://git-scm.com/download"
    exit 1
fi
echo "✅ Git OK"
echo ""

# Step 2: Check if npm is installed
echo "2️⃣  npm kontrol edilir..."
if ! command -v npm &> /dev/null; then
    echo "❌ Node.js yüklü deyil. Node.js-i yükləyin: https://nodejs.org"
    exit 1
fi
echo "✅ Node.js OK"
echo ""

# Step 3: Initialize git repository
echo "3️⃣  Git repository başlatılır..."
if [ ! -d .git ]; then
    git init
    git config user.name "Bootcamp Developer"
    git config user.email "dev@bootcamp.com"
    echo "✅ Git repository yaradıldı"
else
    echo "✅ Git repository artıq var"
fi
echo ""

# Step 4: Create .env file
echo "4️⃣  Environment faylı yaradılır..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ .env faylı yaradıldı"
else
    echo "⚠️  .env faylı artıq var (skip)"
fi
echo ""

# Step 5: Install dependencies
echo "5️⃣  Dependencies qurulur..."
npm install
echo "✅ Dependencies quruldu"
echo ""

# Step 6: Add all files
echo "6️⃣  Fayllar git-ə əlavə edilir..."
git add .
echo "✅ Fayllar əlavə edildi"
echo ""

# Step 7: Initial commit
echo "7️⃣  İlk commit yaradılır..."
if ! git diff --cached --quiet; then
    git commit -m "Initial commit: Bootcamp Login System - Production Ready"
    echo "✅ Commit yaradıldı"
else
    echo "⚠️  Dəyişiklik yoxdur (skip)"
fi
echo ""

# Step 8: Show next steps
echo "================================================"
echo "✅ HAZIRLANMA TAMAMLANDI!"
echo "================================================"
echo ""
echo "📋 SONRAKİ ADDIMLAR:"
echo ""
echo "1️⃣  GITHUB-A PUSH ET:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/bootcamp-login.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "2️⃣  VERCEL-DE DEPLOY ET:"
echo "   npm i -g vercel"
echo "   vercel"
echo ""
echo "3️⃣  YOXLA:"
echo "   - Vercel dashboard-da URL-i tap"
echo "   - test@bootcamp.com / Password123 ilə giriş yap"
echo ""
echo "================================================"
echo ""
echo "🎯 TEST HESABLARI:"
echo "   Email: test@bootcamp.com"
echo "   Şifrə: Password123"
echo ""
echo "   Email: user@bootcamp.com"
echo "   Şifrə: Test1234"
echo ""
echo "================================================"
echo ""
echo "📚 DOKUMENTASIYA:"
echo "   - README.md → Başlangıç"
echo "   - QUICK_START.md → Tez Setup"
echo "   - API_DOCUMENTATION.md → API Ref"
echo ""
echo "================================================"
echo ""
echo "Sənə kömək lazımdır? README.md oxu!"
echo "🚀 Hazırsan? Yukarıdaki addımları izlə!"

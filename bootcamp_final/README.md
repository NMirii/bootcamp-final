# 🚀 Bootcamp Login Sistemi

Bootcamp bitirənləri üçün hazırlanmış sade və funksional login sistemi.

## 📋 Xüsusiyyətlər

✅ Modernm UI dizayn  
✅ HTML, CSS və JavaScript ilə hazırlanıb  
✅ Backend API Vercel serverless funksiyaları ilə  
✅ Responsive (mobil dostu)  
✅ Şifrə şifrələmə (demo versiyada sadə)  
✅ JWT token əsaslı autentifikasiya  
✅ Dashboard səhifəsi  

## 📁 Layihə Strukturu

```
bootcamp-login/
├── index.html           # Login səhifəsi
├── dashboard.html       # Yönetim panelidə
├── api/
│   └── login.js        # Vercel serverless funksiyası
├── vercel.json         # Vercel konfigürasyonu
├── package.json        # NPM dependencies
└── README.md           # Bu fayl
```

## 🔑 Demo Hesablar

```
Email: test@bootcamp.com
Şifrə: Password123

Email: user@bootcamp.com  
Şifrə: Test1234
```

## 🚀 Vercel-də Deploy Etmə

### 1. Proje Hazırlığı

```bash
# Proje klasörünə daxil ol
cd bootcamp-login

# Dependencies quraş
npm install
```

### 2. Vercel-də Account Yaratma

- https://vercel.com qeydiyyatdan keçin
- GitHub, GitLab və ya Bitbucket hesabınızla daxil olun

### 3. Loyihəni Deploy Etmə

**Seçim 1: CLI istifadə etmə**
```bash
# Vercel CLI quraş (əgər yoxdursa)
npm i -g vercel

# Deploy et
vercel
```

**Seçim 2: GitHub ilə**
1. GitHub-a layihəni push et
2. Vercel Dashboard-dan "Import Project" düymə tap
3. GitHub repo-nu seç
4. Deploy düymə tap

### 4. Environment Dəyişənləri

Vercel Dashboard-da əgər JWT_SECRET quraşdırmaq istəsən:

1. Loyalsan Ayarlar (Settings) tab-ə keç
2. Environment Variables bölümünə keç
3. Əlavə et: `JWT_SECRET` = səninçün seçdiyən sifir

## 🔧 Quraşdırma

### Lokal Testlər

```bash
# Vercel dev serveri ilə test et
npm run dev

# Səhifə açılacaq: http://localhost:3000
```

## 🔒 Şifrə Şifrələmə (Produksiya üçün)

Həqiqi layihədə şifrə şifrələmə üçün `bcrypt` istifadə edin:

```bash
npm install bcrypt
```

`api/login.js` əlavə edin:

```javascript
const bcrypt = require('bcrypt');

// Şifrə yoxlaması
const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
```

## 📊 Backend Qoşma (Database)

### MongoDB ilə:

```bash
npm install mongodb
```

### PostgreSQL ilə:

```bash
npm install pg
```

## 🎨 Özelleştirme

### Rəngləri Dəyişmə

`index.html` və `dashboard.html` faylında:

```css
/* Rəngi buradan dəyişdir */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Logo/İkon Dəyişmə

HTML-də `<div class="logo">🚀</div>` dəyişdir

## 📱 Mobil Uyumluluğu

Loyalstan CSS media queries ilə responsive hazırlanıb:

```css
@media (max-width: 768px) {
  /* Mobil stilləri */
}
```

## 🐛 Tez-tez Baş Verən Problemlər

### "CORS Error" Xətası

API route-da CORS headers əlavə et:

```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

### Deploy sonra 404 xətası

`vercel.json` doxru quraşdırılıb yoxla:

```json
"routes": [
  {
    "src": "/api/(.*)",
    "dest": "/api/$1"
  }
]
```

## 📧 İletişim & Dəstək

Hər hansı sual üçün bootcamp qrupuna yazın.

## 📄 Lisansiya

MIT License - Azad istifadə edin

---

**Başarılı layihə!** 🎉

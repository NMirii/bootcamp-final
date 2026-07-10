# 🔒 Təhlükəsizlik Bələdçisi

Bootcamp Login Sisteminin təhlükəsiz şəkildə istifadəsi üçün.

## ⚠️ Critical Security Issues

### 1. API Keys və Secrets Açıq Olmasın

❌ **YANLIŞ:**
```javascript
// Frontend-də SECRET saxlamayın
const API_KEY = "sk_test_123456789";
```

✅ **DOĞRU:**
```javascript
// Yalnız backend-də
// .env faylında
API_KEY=sk_test_123456789
```

### 2. Şifrə Şifrələmə (Bcrypt)

❌ **YANLIŞ:**
```javascript
// Şifrəni açıq saxlamayın
user.password = password;
```

✅ **DOĞRU:**
```javascript
const bcrypt = require('bcrypt');
const salt = await bcrypt.genSalt(10);
user.passwordHash = await bcrypt.hash(password, salt);
```

### 3. JWT Token Xüsusiyyətləri

```javascript
import jwt from 'jsonwebtoken';

// Token yaratma - Expiration tələb olunur
const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }  // ← MÜTLƏQ
);

// Token yoxlaması
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
} catch (error) {
    // Token keçərsizdir (EXPIRED, MODIFIED, etc)
}
```

### 4. CORS Xüsusu Olmayan Domen Mühafizəsi

❌ **YANLIŞ:**
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');  // Hamı üçün açıq
```

✅ **DOĞRU:**
```javascript
const allowedOrigins = [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
];

const origin = req.headers.origin;
if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
}
```

### 5. SQL İnjection / NoSQL İnjection

❌ **YANLIŞ:**
```javascript
// String birləşdirmə
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

✅ **DOĞRU:**
```javascript
// Parametrləşdirilmiş sorğular
const user = await usersCollection.findOne({ email: email });
```

### 6. Environment Dəyişənləri

```bash
# .env - Git-ə push ETMƏYIN
JWT_SECRET=very_secret_key_123
MONGODB_URI=mongodb+srv://user:pass@cluster
DATABASE_PASSWORD=db_password

# .gitignore əlavə edin:
*.env
.env.local
.env.*.local
```

### 7. Input Validasiyası

❌ **YANLIŞ:**
```javascript
// Hər şeyi qəbul et
const user = await createUser(req.body);
```

✅ **DOĞRU:**
```javascript
function validateInput(email, password, fullName) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Email keçərsiz');
    }
    if (!password || password.length < 8) {
        throw new Error('Şifrə qısa');
    }
    if (!fullName || fullName.trim().length < 3) {
        throw new Error('Ad qısa');
    }
    return true;
}
```

### 8. Sensitive Məlumat Açıklaması

❌ **YANLIŞ:**
```javascript
// Şifrə hash-ı qaytarmayın
return {
    user: {
        email: user.email,
        passwordHash: user.passwordHash  // ← YANLIŞ
    }
};
```

✅ **DOĞRU:**
```javascript
return {
    user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName
        // passwordHash - QATILMIŞ
    }
};
```

### 9. Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 dəqiqə
    max: 5,                     // 5 cəhd
    message: 'Çox sayda cəhd. Sonra yenidən yoxlayın'
});

app.post('/api/login', loginLimiter, (req, res) => {
    // Login logic
});
```

### 10. HTTPS İstifadəsi

❌ **YANLIŞ:**
```
http://yourdomain.com  // Şəxsi məlumat açıq
```

✅ **DOĞRU:**
```
https://yourdomain.com  // Şəxsi məlumat şifrəli
```

Vercel avtomatik HTTPS verir! ✅

## 📋 Security Checklist

Deploy etməzdən əvvəl:

- [ ] `.env` faylı `.gitignore` -də var
- [ ] Şifrəlar bcrypt ilə şifrəlidir
- [ ] JWT token-lərin expiration vaxtı var
- [ ] CORS hər domen üçün açıq deyil
- [ ] Input validasiyası hər endpoint-də var
- [ ] Şifrə hash-ləri qaytarılmır
- [ ] API rate limiting var
- [ ] HTTPS istifadə olunur
- [ ] Environment dəyişənləri Vercel-də qurulubdur
- [ ] Error messages hil olmayan olmayan (Internal error)

## 🛡️ Production Checklist

### 1. Dependencies Güncəllə

```bash
npm update
npm audit
npm audit fix
```

### 2. Secrets Qur

Vercel Dashboard:
```
Settings → Environment Variables

JWT_SECRET=your-random-secret-key
MONGODB_URI=mongodb+srv://...
DATABASE_PASSWORD=secure_password
```

### 3. HTTPS-ni Fəallaş

Vercel avtomatik edir ✅

### 4. Email Notifikasiyaları

```bash
npm install nodemailer
```

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Şifrə Sıfırlama',
    html: '<h1>Şifrə Sıfırla</h1>'
});
```

### 5. Monitoring

```bash
npm install sentry
```

```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV
});

try {
    // Risky code
} catch (error) {
    Sentry.captureException(error);
}
```

## 🚨 Common Vulnerabilities (OWASP Top 10)

### 1. Injection
- ✅ Parametrləşdirilmiş sorğular istifadə et
- ✅ ORM kitabxanası istifadə et (Mongoose, Sequelize)

### 2. Authentication
- ✅ Güclü şifrə tətbiq et
- ✅ 2FA əlavə et (iki-faktora doğrulama)
- ✅ Session timeout-u qur

### 3. Sensitive Data Exposure
- ✅ HTTPS istifadə et
- ✅ Şifrələri şifrələ
- ✅ Sensitive veriləri log etmə

### 4. XML External Entities (XXE)
- ✅ XML parser-i əsas XML eninə deaktiv et

### 5. Broken Access Control
- ✅ Authorization kontrol et hər endpoint-də
- ✅ Role-based access control (RBAC) istifadə et

### 6. Security Misconfiguration
- ✅ Default passwords dəyişdir
- ✅ Unnecessary services sil
- ✅ Security headers əlavə et

### 7. XSS (Cross-Site Scripting)
- ✅ Input sanitize et
- ✅ Output encode et

```javascript
// Sanitize input
const sanitizeHtml = require('sanitize-html');
const clean = sanitizeHtml(userInput);
```

### 8. CSRF (Cross-Site Request Forgery)
- ✅ CSRF token istifadə et
- ✅ SameSite cookie attribute

### 9. Using Components with Known Vulnerabilities
- ✅ `npm audit` tezən çalıştır
- ✅ Dependencies güncəl tut

### 10. Insufficient Logging
- ✅ Error log-ları tutmuş tut
- ✅ Access log-ları saxla
- ✅ Suspicious activity-ni alert et

## 📚 Security Headers

```javascript
// api/middleware/securityHeaders.js

export function setSecurityHeaders(res) {
    // XSS Protection
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Content Security Policy
    res.setHeader('Content-Security-Policy', 
        "default-src 'self'; script-src 'self' 'unsafe-inline'"
    );
    
    // Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions Policy
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
}
```

## 🔑 Access Levels (RBAC)

```javascript
const roles = {
    USER: 'user',
    ADMIN: 'admin',
    MODERATOR: 'moderator'
};

const permissions = {
    user: ['read_profile', 'update_profile'],
    admin: ['read_all', 'write_all', 'delete_all'],
    moderator: ['read_all', 'write_moderated']
};

function checkPermission(userRole, requiredPermission) {
    return permissions[userRole]?.includes(requiredPermission);
}
```

## 🎯 Audit Logging

```javascript
async function logAction(userId, action, details) {
    await auditLogs.insertOne({
        userId,
        action,
        details,
        timestamp: new Date(),
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
    });
}
```

---

**Təhlükəsiz kodlama! 🛡️**

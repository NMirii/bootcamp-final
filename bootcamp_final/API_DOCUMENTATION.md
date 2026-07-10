# 📚 API Dokumentasiyası

Bootcamp Login Sistemi API Reference

---

## 🔐 Authentication

Bütün protektə olunmuş endpoint-lər əgər token tələb edirsə:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📋 Endpoints

### 1. Giriş (Login)

**POST** `/api/login`

İstifadəçini autentifikasiya et

**Request:**
```json
{
    "email": "user@bootcamp.com",
    "password": "Password123",
    "remember": true
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Giriş uğurlu oldu",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "email": "user@bootcamp.com",
        "name": "User Name"
    }
}
```

**Error Response (401 Unauthorized):**
```json
{
    "message": "Email və ya şifrə yanlışdır"
}
```

**Status Codes:**
- `200 OK` - Giriş uğurlu
- `400 Bad Request` - Məlumat eksik
- `401 Unauthorized` - Email/şifrə yanlış
- `500 Internal Server Error` - Serverdə xəta

---

### 2. Qeydiyyat (Register)

**POST** `/api/register`

Yeni istifadəçi hesabı yaratma

**Request:**
```json
{
    "email": "newuser@bootcamp.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123",
    "fullName": "Pərviz Əliyev"
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "message": "Qeydiyyat uğurlu oldu",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 123,
        "email": "newuser@bootcamp.com",
        "fullName": "Pərviz Əliyev"
    }
}
```

**Validasiya Qaydaları:**
- Email: Keçərli format olmalı (user@example.com)
- Password: Minimum 8 simvol, böyük/kiçik hərf, rəqəm
- Full Name: Minimum 3 simvol
- Email: Unikal olmalı (daha öncə istifadə edilməmiş)

**Status Codes:**
- `201 Created` - Qeydiyyat uğurlu
- `400 Bad Request` - Validasiya xətası
- `409 Conflict` - Email artıq qeydiyyatdan keçmiş

---

### 3. Profil Al (Get Profile)

**GET** `/api/profile`

İstifadəçi profilini əldə et

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK):**
```json
{
    "success": true,
    "profile": {
        "id": 123,
        "email": "user@bootcamp.com",
        "fullName": "Pərviz Əliyev",
        "avatar": "https://...",
        "joinDate": "2024-01-15",
        "courses": 5,
        "certificates": 3,
        "completionRate": 85
    }
}
```

**Status Codes:**
- `200 OK` - Profil alındı
- `401 Unauthorized` - Token tələb olunur/keçərsizdir
- `404 Not Found` - İstifadəçi tapılmadı

---

### 4. Profil Yenilə (Update Profile)

**POST** `/api/profile`

İstifadəçi profilini güncəllə

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
    "fullName": "Pərviz Əliyev",
    "avatar": "https://...",
    "bio": "Software Developer"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Profil yeniləndi"
}
```

**Status Codes:**
- `200 OK` - Profil yeniləndi
- `400 Bad Request` - Məlumat yanlış
- `401 Unauthorized` - Token keçərsizdir

---

### 5. Şifrə Unuttum (Forgot Password)

**POST** `/api/forgot-password`

Şifrə sıfırlama linki göndər

**Request:**
```json
{
    "email": "user@bootcamp.com"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Şifrə sıfırlama linki email-inizə göndərildi"
}
```

**Security Note:**
- Hər zaman `200 OK` qaytarılır (email mövcud olsun ya da olmadeğerse)
- Bu brute force saldırılarını əngəlləyir

---

### 6. Şifrə Sıfırla (Reset Password)

**POST** `/api/reset-password`

Yeni şifrə qur

**Request:**
```json
{
    "token": "reset_token_from_email",
    "newPassword": "NewPassword123"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Şifrə uğurla sıfırlandı"
}
```

**Status Codes:**
- `200 OK` - Şifrə sıfırlandı
- `400 Bad Request` - Şifrə validasiyası uğursuz
- `401 Unauthorized` - Token keçərsiz/keçən

---

### 7. Çıxış (Logout)

**POST** `/api/logout`

Istifadəçini çıxış yap

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Çıxış uğurlu oldu",
    "timestamp": "2024-01-20T10:30:00Z"
}
```

---

## 🔑 JWT Token Strukturu

Hazırlanmış token:
```
HEADER.PAYLOAD.SIGNATURE
```

**Payload məlumatı:**
```json
{
    "userId": 123,
    "email": "user@bootcamp.com",
    "iat": 1642610400,
    "exp": 1642696800
}
```

**Xüsusiyyətlər:**
- `iat` - Token yaradıldığı zaman (Unix timestamp)
- `exp` - Token vaxtının keçən zaman (24 saat sonra)
- Tokenin vaxtı keçə bilər, yeni giriş tələb olunur

---

## 📊 Error Responses

Bütün xətalar bu formatda qaytarılır:

```json
{
    "message": "Xətanın açıklaması",
    "status": 400,
    "timestamp": "2024-01-20T10:30:00Z"
}
```

### Common Error Codes:

| Status | Meaning | Həll |
|--------|---------|------|
| 400 | Bad Request | Məlumat yanlış/natamamdır |
| 401 | Unauthorized | Token tələb olunur/keçərsiz |
| 403 | Forbidden | Bu əməliyyatın icazəsi yoxdur |
| 404 | Not Found | Resurс tapılmadı |
| 409 | Conflict | Email artıq mövcuddur |
| 500 | Server Error | Serverdə daxili xəta |

---

## 🧪 cURL Nümunələri

### Login:
```bash
curl -X POST https://your-app.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@bootcamp.com",
    "password": "Password123"
  }'
```

### Get Profile:
```bash
curl -X GET https://your-app.vercel.app/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Profile:
```bash
curl -X POST https://your-app.vercel.app/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Yeni Ad",
    "bio": "Yazılım Mühəndisi"
  }'
```

---

## 📱 JavaScript Client Nümunəsi

```javascript
// Login
async function login(email, password) {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    
    if (data.token) {
        localStorage.setItem('authToken', data.token);
    }
    return data;
}

// Get Profile
async function getProfile() {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// Update Profile
async function updateProfile(fullName, bio) {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fullName, bio })
    });
    return await response.json();
}

// Logout
async function logout() {
    const token = localStorage.getItem('authToken');
    await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    localStorage.removeItem('authToken');
}
```

---

## 🔒 Security Best Practices

1. **Token Saxlama:**
   - localStorage-də saxla (HTML5 apps)
   - HttpOnly cookies (daha təhlükəsiz)

2. **Token Göndərmə:**
   - Authorization header istifadə et
   - POST/PUT: Request body-də GÖNDƏRMƏ

3. **Token Refresh:**
   - Refresh token istifadə et (production-da)
   - Access token keçdikdə yeni giriş tələb et

4. **CORS:**
   - Yalnız trusted domains-ə icazə ver
   - Credentials ilə requests

---

## 📝 Rate Limiting

- Login endpoint: 5 cəhd / 15 dəqiqə
- Forgot Password: 3 cəhd / saat
- API requests: 100 / dəqiqə (user başına)

---

## 🔄 Pagination (Əgər list endpoints varsa)

```json
{
    "data": [...],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 45,
        "pages": 5
    }
}
```

---

## 📞 Dəstək

API ilə bağlı suallar üçün:
- GitHub Issues aç
- Bootcamp qrupunda soruş
- support@bootcamp.com

---

**Son Güncəlleme:** 2024-01-20

---

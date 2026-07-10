# ⚡ Sürətli Başlama Bələdçisi

5 dəqiqədə Vercel-də layihəni deploy edin!

## 📋 Tələb Olunanlar

- GitHub hesabı (vercel.com ilə qeydiyyatdan keçmənin asanı)
- Internet bağlantısı
- Kod redaktoru (VS Code tövsiyə edilir)

## 🚀 1-ci Addım: Lahiyəni Klonla

```bash
# Terminalı aç və çalıştır:
git clone https://github.com/[SENIN_USERNAME]/bootcamp-login.git
cd bootcamp-login
```

**Əgər git yoxdursa:**
1. Bütün faylları zip-ə download et
2. Açıl və lokalda klasöre qoy

## 💻 2-ci Addım: Lokal Testlər

```bash
# Dependencies quraş
npm install

# Vercel dev serveri ilə test et
npm run dev

# Səhifə açılacaq: http://localhost:3000
```

**Test Hesabları:**
```
Email: test@bootcamp.com
Şifrə: Password123

Email: user@bootcamp.com
Şifrə: Test1234
```

## 📤 3-ci Addım: GitHub-a Push Et

```bash
# Git quraş (əgər yoxdursa)
git config --global user.name "Adın"
git config --global user.email "email@example.com"

# Dəyişiklikləri commit et
git add .
git commit -m "Initial commit: bootcamp login system"

# GitHub-a push et
git push origin main
```

## 🌐 4-ci Addım: Vercel-də Deploy Et

### Seçim A: Vercel CLI
```bash
# Vercel quraş
npm i -g vercel

# Deploy et
vercel

# Sualları cavablandır:
# - Vercel hesabına giriş etmə seçimi? → Y
# - Proje adı? → bootcamp-login
# - Proje yolunu seçin? → ./
```

### Seçim B: Vercel Web UI
1. https://vercel.com qeydiyyatdan keçin
2. "Import Project" düymə tap
3. GitHub-u bağla
4. Repo seçin: `bootcamp-login`
5. "Deploy" düymə tap

## ✅ 5-ci Addım: Verify Edin

1. Vercel loğu kontrol et - xəta varsa göstərəcək
2. Provided URL-ni açıl: `https://your-project.vercel.app`
3. Test hesabı ilə giriş yap
4. Dashboard açılıbsa - uğurlu! 🎉

## 🔧 Sonra Nə?

### Şifrə Şifrələmə Əlavə Et
```bash
npm install bcrypt
# DATABASE_GUIDE.md-ni oxu
```

### Database Qoşa
```bash
# DATABASE_GUIDE.md-ni oxu
npm install mongodb
```

### E-mail Göndərmə
```bash
npm install nodemailer
```

### Custom Domain
1. Vercel Dashboard → Settings → Domains
2. Custom domain əlavə et
3. DNS records quraş

## 📝 Faylları Özelleştirə

### UI Rəngini Dəyişmə

`index.html` faylında Ctrl+F:
```css
#667eea  ← Rəngi dəyişdir (6-rəqəmli kod)
#764ba2  ← Qradent rəngi
```

[Color Picker istifadə et](https://htmlcolorcodes.com)

### Texti Dəyişmə

`index.html` və `dashboard.html` fayllarında:

Ara: `Bootcamp` → Dəyişdir: `Sənin Bootcamp Adı`

### Logo Dəyişmə

```html
<!-- Bunu dəyişdir: -->
<div class="logo">🚀</div>

<!-- Buna (emoji seç): -->
<div class="logo">📚</div>
<div class="logo">💻</div>
<div class="logo">🎓</div>
```

## 🐛 Tez-tez Xətalar

### "404 Not Found"
```
Səbəb: Vercel deployment düzgün olmamış
Həll: vercel.json-ə baxın, doğru qurulubsa yenidən deploy edin
```

### "CORS Error"
```
Səbəb: API bağlantısı məsələsi
Həll: Vercel URL-inə baxın, index.html-də API URL-ni yeniləyin
```

### "Login olmur"
```
Səbəb: Verilən Bazası bağlı deyil
Həll: Lokal testdə işləyirsə database tələb olunmadığı deməkdir
      DATABASE_GUIDE.md-ni oxu
```

## 📱 Mobile Test

```bash
# Lokal test zamanı:
# Telefonun IP-ni tap: 192.168.x.x
# Telefonda açıl: http://192.168.x.x:3000

# Vercel-də: Telefondan URL-ni aç
```

## 🎯 Sonrakı Addımlar

- [ ] Database əlavə et (MongoDB)
- [ ] Email verificasiyası qoşa
- [ ] Password reset funksiyası yaz
- [ ] Admin panel yarat
- [ ] User dashboard genişlət
- [ ] API dokumentasiyası yazıl
- [ ] Unit testləri əlavə et
- [ ] CI/CD pipeline qur

## 📚 Öyrənmə Resurları

- [Vercel Docs](https://vercel.com/docs)
- [JavaScript Tutorial](https://javascript.info)
- [MongoDB Guide](https://docs.mongodb.com)
- [JWT Explanation](https://jwt.io/introduction)

## 💬 Kömək al

- Bootcamp qrupunda soruş
- Vercel support: support@vercel.com
- GitHub Issues aç

---

**Başarı!** İlk layihənizi deploy etdiniz! 🚀

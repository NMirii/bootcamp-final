# 🗄️ Database İntegrasiyonu Bələdçisi

Bu bələdçi Bootcamp Login Sisteminə database əlavə etməyi göstərir.

## 📊 Verilən Bazası Seçimi

### MongoDB (Tövsiyə Edilir)
- NoSQL
- JSON formatında məlumat
- Tez və fəlakətli
- Vercel ilə əla işlədir

### PostgreSQL
- Relational Database
- Güclü sorğular
- Daha çox konfigüratsiya

## 🚀 MongoDB Qurulması

### 1. MongoDB Cloud Hesabı

```bash
1. https://www.mongodb.com/cloud/atlas qeydiyyatdan keçin
2. Free tier seçin
3. Cluster yaratın (M0 - Free)
4. Connection string kopyalayın
```

### 2. Paketləri Quraş

```bash
npm install mongodb dotenv
```

### 3. Environment Dəyişəni Əlavə Edin

`.env` faylında:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bootcamp
```

### 4. Verilən Bazası Bağlantısı

`lib/db.js` yaratın:

```javascript
import { MongoClient } from 'mongodb';

let cachedClient = null;

export async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient;
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    cachedClient = await client.connect();
    return cachedClient;
}

export async function getDatabase() {
    const client = await connectToDatabase();
    return client.db('bootcamp');
}
```

## 👥 İstifadəçi Koleksiyonu Sxemi

```javascript
{
    _id: ObjectId,
    email: string (unique),
    passwordHash: string,
    fullName: string,
    avatar: string (URL),
    createdAt: Date,
    updatedAt: Date,
    status: 'active' | 'inactive',
    profile: {
        bio: string,
        joinDate: Date,
        courses: number,
        certificates: number
    }
}
```

## 🔐 Login API ilə Database

`api/login.js` yenilənir:

```javascript
import { getDatabase } from '../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    const db = await getDatabase();
    const usersCollection = db.collection('users');

    const { email, password } = req.body;

    try {
        // Istifadəçini tap
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(401).json({ 
                message: 'Email və ya şifrə yanlışdır' 
            });
        }

        // Şifrəni yoxla (bcrypt ilə)
        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            return res.status(401).json({ 
                message: 'Email və ya şifrə yanlışdır' 
            });
        }

        // Token yaratma
        const token = generateToken(user._id, email);

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Serverdə xəta' });
    }
}
```

## 📝 Qeydiyyat API ilə Database

`api/register.js` yenilənir:

```javascript
import { getDatabase } from '../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    const db = await getDatabase();
    const usersCollection = db.collection('users');

    const { email, password, fullName } = req.body;

    try {
        // Email mövcuddur?
        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ 
                message: 'Bu email artıq qeydiyyatdan keçmişdir' 
            });
        }

        // Şifrəni şifrələ
        const passwordHash = await bcrypt.hash(password, 10);

        // Yeni istifadəçi yaratma
        const result = await usersCollection.insertOne({
            email,
            passwordHash,
            fullName,
            avatar: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'active',
            profile: {
                bio: '',
                joinDate: new Date(),
                courses: 0,
                certificates: 0
            }
        });

        const token = generateToken(result.insertedId, email);

        return res.status(201).json({
            success: true,
            message: 'Qeydiyyat uğurlu oldu',
            token,
            user: {
                id: result.insertedId,
                email,
                fullName
            }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Qeydiyyat xətası' });
    }
}
```

## 🔄 Profil API ilə Database

```javascript
import { getDatabase } from '../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    const db = await getDatabase();
    const usersCollection = db.collection('users');

    const token = req.headers.authorization?.split(' ')[1];
    const payload = parseToken(token);

    if (!payload) {
        return res.status(401).json({ message: 'Token keçərsizdir' });
    }

    if (req.method === 'GET') {
        try {
            const user = await usersCollection.findOne({ 
                _id: new ObjectId(payload.userId) 
            });

            if (!user) {
                return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
            }

            return res.status(200).json({
                success: true,
                profile: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    avatar: user.avatar,
                    ...user.profile
                }
            });

        } catch (error) {
            return res.status(500).json({ message: 'Profil məlumatı alınamadı' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { fullName, bio, avatar } = req.body;

            await usersCollection.updateOne(
                { _id: new ObjectId(payload.userId) },
                {
                    $set: {
                        fullName: fullName || undefined,
                        avatar: avatar || undefined,
                        'profile.bio': bio || undefined,
                        updatedAt: new Date()
                    }
                }
            );

            return res.status(200).json({
                success: true,
                message: 'Profil yeniləndi'
            });

        } catch (error) {
            return res.status(500).json({ message: 'Profil yenilənə bilmədi' });
        }
    }
}
```

## 🛡️ Şifrə Şifrələmə

```javascript
import bcrypt from 'bcrypt';

// Şifrə şifrələmə
const salt = await bcrypt.genSalt(10);
const passwordHash = await bcrypt.hash(password, salt);

// Şifrə yoxlaması
const isValid = await bcrypt.compare(password, passwordHash);
```

## 🔐 JWT Token (Produksion)

```javascript
import jwt from 'jsonwebtoken';

// Token yaratma
const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
);

// Token yoxlaması
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

## 📋 Migrations (Seçimli)

İlk dətər verilənlər yaratma üçün:

```bash
npm install migrate-mongo
```

Migration faylı yaratın `migrations/001_create_users.js`:

```javascript
module.exports = {
    up: async (db) => {
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
    },

    down: async (db) => {
        await db.collection('users').dropIndex('email_1');
    }
};
```

## 🚨 Vercel Environment Dəyişənləri

Vercel Dashborda əlavə edin:
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=production
```

---

Tamamlayan! Hazırda produksion səviyyəsində login sisteminiz var! 🎉

# 🛠️ Development Guide

Bootcamp Login Sistemini genişləndirmə bələdçisi

---

## 📦 Project Setup

### Prerequisites
- Node.js 14+ 
- npm ya da yarn
- Code Editor (VS Code recommended)
- Git

### Installation

```bash
# Repo klonla
git clone https://github.com/yourusername/bootcamp-login.git
cd bootcamp-login

# Dependencies quraş
npm install

# .env faylı yaratma
cp .env.example .env

# Lokal testlər
npm run dev
```

---

## 📁 Folder Structure

```
bootcamp-login/
├── api/                  # Serverless API routes
│   ├── login.js
│   ├── register.js
│   ├── logout.js
│   ├── profile.js
│   ├── forgot-password.js
│   └── reset-password.js
│
├── utils/                # Frontend utilities
│   └── helpers.js        # Helper functions
│
├── index.html            # Login page
├── register.html         # Registration page
├── dashboard.html        # User dashboard
├── reset-password.html   # Password reset page
│
├── vercel.json          # Vercel config
├── package.json         # Dependencies
├── .env.example         # Environment template
├── .gitignore          # Git ignore file
│
├── README.md           # Project overview
├── QUICK_START.md      # Quick start guide
├── DATABASE_GUIDE.md   # Database setup
├── SECURITY.md         # Security best practices
└── API_DOCUMENTATION.md # API docs
```

---

## 🎨 Frontend Development

### Adding New Pages

1. **Create HTML file:**
```bash
touch new-page.html
```

2. **Basic Template:**
```html
<!DOCTYPE html>
<html lang="az">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
    <style>
        /* Styling */
    </style>
</head>
<body>
    <!-- Content -->
    <script src="utils/helpers.js"></script>
    <script>
        // Əgər login tələb edərsə
        redirectIfNotAuthenticated();
    </script>
</body>
</html>
```

### Using Helper Functions

```javascript
// Import helpers
import { 
    isAuthenticated, 
    getAuthToken, 
    fetchAPI, 
    showMessage 
} from './utils/helpers.js';

// Authentication yoxla
if (!isAuthenticated()) {
    window.location.href = '/index.html';
}

// API çağırış
const response = await fetchAPI('/api/profile', {
    method: 'GET'
});

if (response.success) {
    const profile = response.data.profile;
    console.log(profile);
} else {
    showMessage(response.error, 'error');
}

// Mesaj göstər
showMessage('Success!', 'success', 3000);
```

### Form Validation Example

```javascript
const formData = {
    email: 'user@example.com',
    password: 'SecurePass123'
};

const rules = {
    email: {
        required: true,
        type: 'email',
        label: 'Email Address'
    },
    password: {
        required: true,
        type: 'password',
        minLength: 8
    }
};

const validation = validateForm(formData, rules);

if (!validation.isValid) {
    console.log('Errors:', validation.errors);
} else {
    console.log('Form is valid!');
}
```

---

## 🔌 Backend API Development

### Creating New API Endpoint

1. **Create API file:**
```bash
touch api/new-endpoint.js
```

2. **Template:**
```javascript
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Validate request
        const { data } = req.body;

        if (!data) {
            return res.status(400).json({ message: 'Data required' });
        }

        // Authenticate if needed
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token required' });
        }

        // Process request
        // TODO: Your logic here

        return res.status(200).json({
            success: true,
            message: 'Operation successful'
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
```

### Middleware Pattern

```javascript
// middleware/auth.js
export function verifyToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = JSON.parse(atob(parts[1]));
        
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

// Usage in endpoint
import { verifyToken } from '../middleware/auth.js';

const token = req.headers.authorization?.split(' ')[1];
const payload = verifyToken(token);

if (!payload) {
    return res.status(401).json({ message: 'Invalid token' });
}

// Token valid - continue
```

---

## 🗄️ Database Integration

### MongoDB Example

```javascript
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db('bootcamp');
        const users = db.collection('users');

        if (req.method === 'GET') {
            const user = await users.findOne({ 
                _id: new ObjectId(payload.userId) 
            });
            return res.status(200).json({ success: true, user });
        }

    } finally {
        await client.close();
    }
}
```

### PostgreSQL Example

```javascript
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export default async function handler(req, res) {
    const client = await pool.connect();
    
    try {
        if (req.method === 'GET') {
            const result = await client.query(
                'SELECT * FROM users WHERE id = $1',
                [userId]
            );
            return res.status(200).json({ success: true, user: result.rows[0] });
        }
    } finally {
        client.release();
    }
}
```

---

## 🧪 Testing

### Unit Testing Example

```bash
npm install jest @testing-library/jest-dom
```

```javascript
// __tests__/helpers.test.js

import { 
    isValidEmail, 
    validatePassword 
} from '../utils/helpers.js';

describe('Email Validation', () => {
    test('should validate correct email', () => {
        expect(isValidEmail('user@example.com')).toBe(true);
    });

    test('should reject invalid email', () => {
        expect(isValidEmail('invalid-email')).toBe(false);
    });
});

describe('Password Validation', () => {
    test('should validate strong password', () => {
        const result = validatePassword('SecurePass123!');
        expect(result.isStrong).toBe(true);
    });

    test('should reject weak password', () => {
        const result = validatePassword('weak');
        expect(result.isStrong).toBe(false);
    });
});
```

### API Testing

```bash
npm install supertest
```

```javascript
// __tests__/api.test.js

import { handler } from '../api/login.js';

describe('Login API', () => {
    test('should return token on valid credentials', async () => {
        const req = {
            method: 'POST',
            body: {
                email: 'test@bootcamp.com',
                password: 'Password123'
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                token: expect.any(String)
            })
        );
    });
});
```

---

## 🚀 Deployment

### Vercel Deployment

```bash
# Login
vercel login

# Deploy
vercel

# Check status
vercel status

# View logs
vercel logs
```

### Environment Variables

```bash
# Set on Vercel
vercel env add JWT_SECRET
vercel env add MONGODB_URI
vercel env add DATABASE_PASSWORD
```

### Custom Domain

```bash
# Add domain
vercel domains add yourdomain.com

# Verify DNS
vercel domains verify yourdomain.com
```

---

## 📊 Performance Optimization

### API Optimization

```javascript
// 1. Add caching
const cache = new Map();

export default async function handler(req, res) {
    const cacheKey = req.url;
    
    if (cache.has(cacheKey)) {
        return res.status(200).json(cache.get(cacheKey));
    }

    // Process and cache
    const data = { /* ... */ };
    cache.set(cacheKey, data);
    
    return res.status(200).json(data);
}

// 2. Add compression
import compression from 'compression';

// 3. Batch requests
// Client: /api/batch?requests=[...]
```

### Frontend Optimization

```javascript
// 1. Lazy loading
const image = document.querySelector('img');
image.loading = 'lazy';

// 2. Debounce
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// 3. Minimize repaints
requestAnimationFrame(() => {
    element.style.transform = 'translateX(100px)';
});
```

---

## 🐛 Debugging

### Browser Developer Tools

```javascript
// Network tab: Check API requests
// Console: Errors and logs
// Application: LocalStorage inspection
// Performance: Measure speed
```

### Server Logging

```javascript
// Use console for development
console.log('Debug info:', data);

// Use structured logging for production
const logger = {
    info: (msg) => console.log(`[INFO] ${msg}`),
    error: (msg) => console.error(`[ERROR] ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${msg}`)
};
```

### Error Tracking

```bash
npm install @sentry/node
```

```javascript
import * as Sentry from "@sentry/node";

Sentry.init({ dsn: process.env.SENTRY_DSN });

try {
    // Code
} catch (error) {
    Sentry.captureException(error);
}
```

---

## 📚 Useful Resources

- **JavaScript**: https://javascript.info
- **Node.js**: https://nodejs.org/docs
- **MongoDB**: https://docs.mongodb.com
- **Vercel**: https://vercel.com/docs
- **Web APIs**: https://developer.mozilla.org/en-US/docs/Web/API

---

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request
# Then merge to main
```

---

## 📝 Code Style

Follow Airbnb JavaScript Style Guide:

```javascript
// ✓ Good
const getUserData = async (userId) => {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    return data;
};

// ✗ Bad
const getUserData = (userId) => {
    let data = fetch(`/api/users/${userId}`)
        .then(r => r.json());
    return data;
};
```

---

## 🎯 Contributing

1. Fork repository
2. Create feature branch
3. Make changes and test
4. Commit with clear messages
5. Push and create PR
6. Wait for review

---

**Happy Coding! 🚀**

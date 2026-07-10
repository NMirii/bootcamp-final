// Vercel Serverless Function - Login API
// /api/login.js

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONS zamanı CORS-u qəbul et
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, password, remember } = req.body;

        // Validasiya
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email və şifrə tələb olunur' 
            });
        }

        // Demo istifadəçiləri
        // Həqiqi layihədə bunlar verilənlər bazasından olacaq
        const demoUsers = [
            {
                id: 1,
                email: 'test@bootcamp.com',
                password: 'Password123',
                name: 'Test User'
            },
            {
                id: 2,
                email: 'user@bootcamp.com',
                password: 'Test1234',
                name: 'Bootcamp User'
            }
        ];

        // İstifadəçini tap
        const user = demoUsers.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ 
                message: 'Email və ya şifrə yanlışdır' 
            });
        }

        // Şifrəni yoxla
        if (user.password !== password) {
            return res.status(401).json({ 
                message: 'Email və ya şifrə yanlışdır' 
            });
        }

        // JWT token yaratma (sadə versiya)
        // Həqiqi layihədə 'jsonwebtoken' paketi istifadə edin
        const token = generateSimpleToken(user.id, user.email);

        return res.status(200).json({
            success: true,
            message: 'Giriş uğurlu oldu',
            token: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ 
            message: 'Serverdə xəta baş verdi' 
        });
    }
}

// Sadə token generatoru
function generateSimpleToken(userId, email) {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const payload = Buffer.from(JSON.stringify({
        userId: userId,
        email: email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 saat
    })).toString('base64');
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const signature = Buffer.from(userId + email + secret).toString('base64');
    
    return `${header}.${payload}.${signature}`;
}

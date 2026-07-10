// Vercel Serverless Function - User Registration API
// /api/register.js

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, password, confirmPassword, fullName } = req.body;

        // Validasiya
        const validation = validateInput(email, password, confirmPassword, fullName);
        if (validation.error) {
            return res.status(400).json({ message: validation.error });
        }

        // Email artıq mövcuddur (demo məlumatı)
        const existingUsers = [
            'test@bootcamp.com',
            'user@bootcamp.com'
        ];

        if (existingUsers.includes(email)) {
            return res.status(409).json({ 
                message: 'Bu email artıq qeydiyyatdan keçmişdir' 
            });
        }

        // Yeni istifadəçi yaratma (həqiqi layihədə bazaya saxla)
        const newUser = {
            id: Date.now(),
            email,
            password, // Həqiqi layihədə şifrə şifrələ
            fullName,
            createdAt: new Date().toISOString()
        };

        // Token yaratma
        const token = generateSimpleToken(newUser.id, email);

        return res.status(201).json({
            success: true,
            message: 'Qeydiyyat uğurlu oldu',
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                fullName: newUser.fullName
            }
        });

    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ 
            message: 'Qeydiyyat müddətində xəta baş verdi' 
        });
    }
}

function validateInput(email, password, confirmPassword, fullName) {
    // Email validasiyası
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { error: 'Keçərli email daxil edin' };
    }

    // Tam ad validasiyası
    if (!fullName || fullName.trim().length < 3) {
        return { error: 'Tam ad ən azı 3 hərf olmalıdır' };
    }

    // Şifrə validasiyası
    if (!password || password.length < 8) {
        return { error: 'Şifrə ən azı 8 simvol olmalıdır' };
    }

    // Şifrə güclü olmalı
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        return { error: 'Şifrə böyük hərf, kiçik hərf və rəqəm olmalıdır' };
    }

    // Şifrələr eynə olmalı
    if (password !== confirmPassword) {
        return { error: 'Şifrələr uyğun gəlmir' };
    }

    return { error: null };
}

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

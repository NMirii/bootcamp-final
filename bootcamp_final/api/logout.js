// Vercel Serverless Function - Logout API
// /api/logout.js

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ 
                message: 'Token tələb olunur' 
            });
        }

        // Token-i validate et (optional)
        const payload = parseToken(token);
        if (!payload) {
            return res.status(401).json({ 
                message: 'Keçərsiz token' 
            });
        }

        // Həqiqi layihədə logout işlərini gör:
        // 1. Token-i blacklist-ə əlavə et
        // 2. Session sil
        // 3. Refresh token sil
        
        return res.status(200).json({
            success: true,
            message: 'Çıxış uğurlu oldu',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Logout Error:', error);
        return res.status(500).json({ 
            message: 'Çıxış işləmədi' 
        });
    }
}

function parseToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = JSON.parse(atob(parts[1]));
        
        // Token vaxtı keçibmi?
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

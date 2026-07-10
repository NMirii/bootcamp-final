// Vercel Serverless Function - User Profile API
// /api/profile.js

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Token yoxla
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token tələb olunur' });
    }

    if (req.method === 'GET') {
        return handleGetProfile(token, res);
    }

    if (req.method === 'POST') {
        return handleUpdateProfile(req, token, res);
    }

    return res.status(405).json({ message: 'Method not allowed' });
}

function handleGetProfile(token, res) {
    try {
        const payload = parseToken(token);
        if (!payload) {
            return res.status(401).json({ message: 'Keçərsiz token' });
        }

        // Demo profil məlumatı
        const profile = {
            id: payload.userId,
            email: payload.email,
            name: payload.email.split('@')[0],
            avatar: '👤',
            joinDate: '2024-01-15',
            courses: 5,
            certificates: 3,
            completionRate: 85
        };

        return res.status(200).json({
            success: true,
            profile
        });

    } catch (error) {
        return res.status(500).json({ message: 'Profil məlumatı alınamadı' });
    }
}

function handleUpdateProfile(req, token, res) {
    try {
        const payload = parseToken(token);
        if (!payload) {
            return res.status(401).json({ message: 'Keçərsiz token' });
        }

        const { name, avatar } = req.body;

        // Demo update
        const updatedProfile = {
            id: payload.userId,
            email: payload.email,
            name: name || payload.email.split('@')[0],
            avatar: avatar || '👤'
        };

        return res.status(200).json({
            success: true,
            message: 'Profil yeniləndi',
            profile: updatedProfile
        });

    } catch (error) {
        return res.status(500).json({ message: 'Profil yenilənə bilmədi' });
    }
}

// Token parsing - həqiqi layihədə JWT library istifadə et
function parseToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        
        // Tokenin vaxtı keçibmi yoxla
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

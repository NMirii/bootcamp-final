// Vercel Serverless Function - Reset Password API
// /api/reset-password.js

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
        const { token, newPassword } = req.body;

        // Validasiya
        if (!token || !newPassword) {
            return res.status(400).json({ 
                message: 'Token və yeni şifrə tələb olunur' 
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ 
                message: 'Şifrə ən azı 8 simvol olmalıdır' 
            });
        }

        // Token-i validate et
        if (!isValidResetToken(token)) {
            return res.status(401).json({ 
                message: 'Keçərsiz və ya keçən token' 
            });
        }

        // Həqiqi layihədə:
        // 1. Token-dən email-i al
        // 2. Şifrəni şifrələ
        // 3. Verilənlər bazasında güncəllə
        // 4. Token-i sil
        
        return res.status(200).json({
            success: true,
            message: 'Şifrə uğurla sıfırlandı',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Reset Password Error:', error);
        return res.status(500).json({ 
            message: 'Şifrə sıfırlama xətası' 
        });
    }
}

function isValidResetToken(token) {
    // Sadə validasiya - həqiqi layihədə database-də yoxla
    if (!token || token.length < 20) {
        return false;
    }

    // Tokenin zamanı keçibmi yoxla (optional)
    // Həqiqi layihədə: database-də exp zamanını yoxla
    
    return true;
}

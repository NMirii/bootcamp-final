// Vercel Serverless Function - Forgot Password API
// /api/forgot-password.js

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
        const { email } = req.body;

        // Email validasiyası
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ 
                message: 'Keçərli email daxil edin' 
            });
        }

        // Demo: Email mövcuddur?
        const demoUsers = [
            'test@bootcamp.com',
            'user@bootcamp.com'
        ];

        if (!demoUsers.includes(email)) {
            // Səbətlik olması üçün həmişə uğurlu cavab ver (Security)
            return res.status(200).json({
                success: true,
                message: 'Şifrə sıfırlama linki email-inizə göndərildi'
            });
        }

        // Reset token yaratma
        const resetToken = generateResetToken();
        const resetExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 saat

        // Həqiqi layihədə:
        // 1. Token-i bazaya saxla
        // 2. Email göndər
        
        const resetLink = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password.html?token=${resetToken}`;

        // Email göndərmə (nodemailer ilə)
        // await sendEmail({
        //     to: email,
        //     subject: 'Şifrə Sıfırlama',
        //     html: `
        //         <h1>Şifrə Sıfırlama</h1>
        //         <p>Aşağıdaki linki kliklə:</p>
        //         <a href="${resetLink}">Şifrəni Sıfırla</a>
        //         <p>Bu link 1 saat ərzində keçərlidir.</p>
        //     `
        // });

        console.log('Reset Link (Demo):', resetLink);

        return res.status(200).json({
            success: true,
            message: 'Şifrə sıfırlama linki email-inizə göndərildi',
            // Demo üçün (produksiyada sil):
            demo_reset_token: resetToken,
            demo_reset_link: resetLink
        });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        return res.status(500).json({ 
            message: 'Şifrə sıfırlama xətası' 
        });
    }
}

function generateResetToken() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

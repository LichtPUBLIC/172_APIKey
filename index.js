const express = require('express')
const path = require('path')
const crypto = require('crypto') // <-- BARU
const mysql = require('mysql2/promise')
const app = express()
const port = 3000

// Pool Koneksi Database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Simbada662004',
    database: 'apikey',
    port: 3309,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')))

// Endpoint GET '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Endpoint POST '/create' (BARU)
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

// Jalankan server
app.listen(port, () => {
    console.log(`🚀 Server berjalan di http://localhost:${port}`)
})
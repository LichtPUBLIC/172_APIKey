const express = require('express')
const path = require('path')
const mysql = require('mysql2/promise') // <-- BARU
const app = express()
const port = 3000

// Pool Koneksi Database (BARU)
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
app.use(express.static(path.join(__dirname, 'public')))

// Endpoint GET '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Jalankan server
app.listen(port, () => {
    console.log(`🚀 Server berjalan di http://localhost:${port}`)
})
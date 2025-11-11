const express = require('express')
const path = require('path') // <-- BARU
const app = express()
const port = 3000

// Middleware (BARU)
app.use(express.static(path.join(__dirname, 'public')))

// Endpoint GET '/' (BARU)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Jalankan server
app.listen(port, () => {
    console.log(`🚀 Server berjalan di http://localhost:${port}`)
})
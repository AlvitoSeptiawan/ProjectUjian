const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');  // kamu memakai async/await jadi pakai promise

const app = express();
const PORT = 5000;

// middleware
app.use(cors());
app.use(bodyParser.json());

// konfigurasi database
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ujian-web' // ganti sesuai database kamu
};

// ========== GET: ambil semua siswa ==========
app.get('/siswa', async (req, res) => {
    try {
        const conn = await mysql.createConnection(dbConfig);
        const [rows] = await conn.query('SELECT * FROM siswa');
        res.json(rows);
        await conn.end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

// ========== POST: tambah siswa ==========
app.post('/siswa', async (req,res) => {
    const { nama, kelas, umur, npm, jurusan, jenjang } = req.body;
    const conn = await mysql.createConnection(dbConfig);
    await conn.query(
        'INSERT INTO siswa (nama, kelas, umur, npm, jurusan, jenjang) VALUES (?,?,?,?,?,?)',
        [nama, kelas, umur, npm, jurusan, jenjang]
    );
    res.json({ message: 'Siswa added' });
    await conn.end();
});

// ========== PUT: update siswa ==========
app.put('/siswa/:id', async (req,res) => {
    const { id } = req.params;
    const { nama, kelas, umur, npm, jurusan, jenjang } = req.body;
    const conn = await mysql.createConnection(dbConfig);
    await conn.query(
        'UPDATE siswa SET nama=?, kelas=?, umur=?, npm=?, jurusan=?, jenjang=? WHERE id=?',
        [nama, kelas, umur, npm, jurusan, jenjang, id]
    );
    res.json({ message: 'Siswa updated' });
    await conn.end();
});

// server listen
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});

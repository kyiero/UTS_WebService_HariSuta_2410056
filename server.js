
const express = require('express');

const app = express();
const PORT = 3000;

// Middleware untuk membaca JSON
app.use(express.json());

// Penyimpanan data sementara menggunakan Array
let biodata = [];
let nextId = 1;

// Fungsi untuk memeriksa kelengkapan data
function validasiData(data) {
    const { nama, umur, alamat, pekerjaan } = data;

    return (
        typeof nama === 'string' && nama.trim() !== '' &&
        Number.isInteger(umur) &&
        umur > 0 &&
        typeof alamat === 'string' && alamat.trim() !== '' &&
        typeof pekerjaan === 'string' && pekerjaan.trim() !== ''
    );
}

// 1. GET: Menampilkan semua biodata
app.get('/api/biodata', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Berhasil menampilkan semua biodata',
        data: biodata
    });
});

// 2. GET: Menampilkan biodata berdasarkan ID
app.get('/api/biodata/:id', (req, res) => {
    const id = Number(req.params.id);
    const data = biodata.find(item => item.id === id);

    if (!data) {
        return res.status(404).json({
            status: 'fail',
            message: 'Biodata tidak ditemukan',
            data: null
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Biodata berhasil ditemukan',
        data: data
    });
});

// 3. POST: Menambahkan biodata baru
app.post('/api/biodata', (req, res) => {
    if (!validasiData(req.body)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Semua field wajib diisi dan umur harus berupa angka bulat positif',
            data: null
        });
    }

    const dataBaru = {
        id: nextId++,
        nama: req.body.nama.trim(),
        umur: req.body.umur,
        alamat: req.body.alamat.trim(),
        pekerjaan: req.body.pekerjaan.trim()
    };

    biodata.push(dataBaru);

    res.status(201).json({
        status: 'success',
        message: 'Biodata berhasil ditambahkan',
        data: dataBaru
    });
});

// 4. PUT: Memperbarui biodata
app.put('/api/biodata/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = biodata.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            status: 'fail',
            message: 'Biodata tidak ditemukan',
            data: null
        });
    }

    if (!validasiData(req.body)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Semua field wajib diisi dan umur harus berupa angka bulat positif',
            data: null
        });
    }

    biodata[index] = {
        id: id,
        nama: req.body.nama.trim(),
        umur: req.body.umur,
        alamat: req.body.alamat.trim(),
        pekerjaan: req.body.pekerjaan.trim()
    };

    res.status(200).json({
        status: 'success',
        message: 'Biodata berhasil diperbarui',
        data: biodata[index]
    });
});

// 5. DELETE: Menghapus biodata
app.delete('/api/biodata/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = biodata.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            status: 'fail',
            message: 'Biodata tidak ditemukan',
            data: null
        });
    }

    const dataDihapus = biodata.splice(index, 1)[0];

    res.status(200).json({
        status: 'success',
        message: 'Biodata berhasil dihapus',
        data: dataDihapus
    });
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

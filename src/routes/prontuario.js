// src/routes/prontuario.js
const express = require('express');
const path = require('path');
const router = express.Router();
const prontuarioController = require('../controllers/prontuarioController');

// Rota para exibir a página HTML de prontuários
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'prontuario.html'));
});

// Definindo as rotas para o controlador
router.get('/api', prontuarioController.getAll); // Alterado para '/api'
router.get('/api/:id', prontuarioController.getById);
router.post('/api', prontuarioController.create);
router.put('/api/:id', prontuarioController.update);
router.delete('/api/:id', prontuarioController.deleteById);

module.exports = router;

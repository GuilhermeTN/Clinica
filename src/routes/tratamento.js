// src/routes/tratamento.js
const path = require('path');
const express = require('express');
const router = express.Router();
const tratamentoController = require('../controllers/tratamentoController');


// Rota para renderizar o HTML
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'tratamento.html'));
});

// Rota para obter todos os tratamentos
router.get('/', tratamentoController.getAll);

// Rota para obter um tratamento específico por ID
router.get('/:id', tratamentoController.getById);

// Rota para criar um novo tratamento
router.post('/', tratamentoController.create);

// Rota para atualizar um tratamento por ID
router.put('/:id', tratamentoController.update);

// Rota para excluir um tratamento por ID
router.delete('/:id', tratamentoController.delete);

module.exports = router;

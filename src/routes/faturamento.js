// src/routes/faturamento.js
const express = require('express');
const router = express.Router();
const faturamentoController = require('../controllers/faturamentoController');

// Rota para obter todos os faturamentos
router.get('/', faturamentoController.getAll);

// Rota para obter um faturamento específico por ID
router.get('/:id', faturamentoController.getById);

// Rota para criar um novo faturamento
router.post('/', faturamentoController.create);

// Rota para atualizar um faturamento por ID
router.put('/:id', faturamentoController.update);

// Rota para excluir um faturamento por ID
router.delete('/:id', faturamentoController.delete);

module.exports = router;

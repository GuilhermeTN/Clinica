// src/routes/prontuario.js
const express = require('express');
const router = express.Router();
const prontuarioController = require('../controllers/prontuarioController');

// Rota para obter todos os prontuários
router.get('/', prontuarioController.getAll);

// Rota para obter um prontuário específico por ID
router.get('/:id', prontuarioController.getById);

// Rota para criar um novo prontuário
router.post('/', prontuarioController.create);

// Rota para atualizar um prontuário por ID
router.put('/:id', prontuarioController.update);

// Rota para excluir um prontuário por ID
router.delete('/:id', prontuarioController.delete);

module.exports = router;

const express = require('express');
const router = express.Router();
const path = require('path');
const pacienteController = require('../controllers/pacienteController');

// Rota para a página de pacientes
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'pacientes.html'));
});

// Rota para obter todos os pacientes
router.get('/data', pacienteController.getAll);

// Rota para obter um paciente específico
router.get('/:id', pacienteController.getById);

// Rota para criar um novo paciente
router.post('/', pacienteController.create);

// Rota para atualizar um paciente existente
router.put('/:id', pacienteController.update);

// Rota para excluir um paciente
router.delete('/:id', pacienteController.delete);

module.exports = router;

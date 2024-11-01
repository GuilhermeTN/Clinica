const express = require('express');
const router = express.Router();
const path = require('path');
const consultaController = require('../controllers/consultaController');

// Rota para obter consultas por data
router.get('/data', consultaController.getConsultasPorData);


// Rota para a página de consultas
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'consultas.html'));
});

// Rota para obter todos os registros de consultas
router.get('/data', consultaController.getAll);

// Rota para obter uma consulta específica
router.get('/:id', consultaController.getById);

// Rota para criar uma nova consulta
router.post('/', consultaController.create);

// Rota para atualizar uma consulta existente
router.put('/:id', consultaController.update);

// Rota para excluir uma consulta
router.delete('/:id', consultaController.delete);

module.exports = router;

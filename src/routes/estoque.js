// src/routes/estoque.js
const express = require('express');
const path = require('path');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController');

// Rota para a página HTML
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'estoque.html'));
});

// Rota para obter todos os itens
router.get('/itens', estoqueController.getItems);

// Rota para adicionar um novo item
router.post('/create', estoqueController.create);

// Rota para atualizar a quantidade do item
router.put('/update/:id', estoqueController.updateQuantity);

// Rota para remover um item
router.delete('/delete/:id', estoqueController.remove);

module.exports = router;

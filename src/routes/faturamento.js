const express = require('express');
const path = require('path');
const router = express.Router();
const faturamentoController = require('../controllers/faturamentoController');

// Rota para renderizar o HTML
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'faturamento.html'));
});

// Rota para registrar pagamento
router.post('/registrar', faturamentoController.registrarPagamento);
router.get('/pagamentos', faturamentoController.obterPagamentos); // Nova rota para obter pagamentos

module.exports = router;

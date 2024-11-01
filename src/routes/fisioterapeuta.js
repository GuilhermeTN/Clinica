const express = require('express');
const router = express.Router();
const fisioterapeutaController = require('../controllers/fisioterapeutaController');
const path = require('path');

router.get('/data', fisioterapeutaController.getAll);

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'fisioterapeutas.html'));
});

router.get('/api', fisioterapeutaController.getAll);
router.get('/api/:id', fisioterapeutaController.getById);
router.post('/api', fisioterapeutaController.create);
router.put('/api/:id', fisioterapeutaController.update);
router.delete('/api/:id', fisioterapeutaController.delete);

module.exports = router;

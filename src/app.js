const express = require('express');
const path = require('path');
const pacienteRoutes = require('./routes/paciente');
const consultaRoutes = require('./routes/consulta');
const prontuarioRoutes = require('./routes/prontuario');
const faturamentoRoutes = require('./routes/faturamento');
const fisioterapeutaRoutes = require('./routes/fisioterapeuta');
const tratamentoRoutes = require('./routes/tratamento');
const estoqueRoutes = require('./routes/estoque');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/db', express.static(path.join(__dirname, 'db')));

// Configure as rotas, certifique-se de que está correto
app.use('/pacientes', pacienteRoutes);
app.use('/consultas', consultaRoutes);
app.use('/prontuarios', prontuarioRoutes);
app.use('/faturamentos', faturamentoRoutes);
app.use('/fisioterapeutas', fisioterapeutaRoutes);
app.use('/tratamentos', tratamentoRoutes);
app.use('/estoque', estoqueRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = (req, res) => {
    app(req, res); // Passa as requisições para o Express
};
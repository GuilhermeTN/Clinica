document.getElementById('pagamentoForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const patientName = document.getElementById('patientName').value;
    const paymentType = document.getElementById('paymentType').value;
    const amount = document.getElementById('amount').value;

    const pagamentoData = {
        patientName,
        paymentType,
        amount: parseFloat(amount)
    };

    // Enviar os dados para a rota de registrar pagamento
    fetch('/faturamento/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pagamentoData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao registrar pagamento');
        }
        return response.json();
    })
    .then(data => {
        console.log('Pagamento registrado:', data);
        // Aqui você pode atualizar a UI, por exemplo, adicionando o pagamento à lista exibida
        document.getElementById('paymentList').innerHTML += `<p>Pagamento de ${data.nome} no valor de R$${data.total} registrado com sucesso!</p>`;
        document.getElementById('totalReceived').textContent = (parseFloat(document.getElementById('totalReceived').textContent) + data.total).toFixed(2);
        // Resetar o formulário
        document.getElementById('pagamentoForm').reset();
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});

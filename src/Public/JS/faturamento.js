// Função para buscar pagamentos existentes e atualizar a lista e o total recebido
const fetchPayments = () => {
    fetch('/faturamento/pagamentos')
        .then(response => response.json())
        .then(payments => {
            let totalReceived = 0; // Inicializa o total recebido
            document.getElementById('paymentList').innerHTML = ''; // Limpa a lista antes de adicionar

            payments.forEach(payment => {
                document.getElementById('paymentList').innerHTML += `<p>Pagamento de ${payment.nome} no valor de R$${payment.total.toFixed(2)} registrado!</p>`;
                totalReceived += payment.total; // Acumula o total recebido
            });

            // Atualiza o valor total recebido na interface
            document.getElementById('totalReceived').textContent = totalReceived.toFixed(2);
        })
        .catch(error => {
            console.error('Erro ao carregar pagamentos:', error);
        });
};

// Chama a função para carregar pagamentos ao iniciar a página
fetchPayments();

// Adiciona um listener para o formulário de registro de pagamentos
document.getElementById('pagamentoForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const pagamentoData = {
        patientName: document.getElementById('patientName').value,
        paymentType: document.getElementById('paymentType').value,
        amount: parseFloat(document.getElementById('amount').value)
    };

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
        document.getElementById('paymentList').innerHTML += `<p>Pagamento de ${data.nome} no valor de R$${data.total.toFixed(2)} registrado com sucesso!</p>`;
        
        // Atualiza o total recebido diretamente com o novo pagamento
        const totalReceivedElement = document.getElementById('totalReceived');
        totalReceivedElement.textContent = (parseFloat(totalReceivedElement.textContent) + data.total).toFixed(2);
        
        // Reinicia o formulário
        document.getElementById('pagamentoForm').reset();
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});

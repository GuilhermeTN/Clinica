document.addEventListener('DOMContentLoaded', async () => {
    const pacienteSelect = document.getElementById('pacienteSelect');
    const fisioterapeutaSelect = document.getElementById('fisioterapeutaSelect');

    // Buscar pacientes da API
    try {
        const response = await fetch('/pacientes/data');
        const pacientes = await response.json();

        pacientes.forEach(paciente => {
            const option = document.createElement('option');
            option.value = paciente.id;
            option.textContent = paciente.nome;
            pacienteSelect.appendChild(option);
        });
    } catch (err) {
        console.error('Erro ao buscar pacientes:', err);
    }

    // Buscar fisioterapeutas da API
    try {
        const response = await fetch('/fisioterapeutas/data');
        const fisioterapeutas = await response.json();

        fisioterapeutas.forEach(fisioterapeuta => {
            const option = document.createElement('option');
            option.value = fisioterapeuta.id;
            option.textContent = fisioterapeuta.nome;
            fisioterapeutaSelect.appendChild(option);
        });
    } catch (err) {
        console.error('Erro ao buscar fisioterapeutas:', err);
    }
});

async function agendarConsulta(event) {
    event.preventDefault();

    const pacienteId = document.getElementById('pacienteSelect').value;
    const fisioterapeutaId = document.getElementById('fisioterapeutaSelect').value;
    const data = document.getElementById('data').value; // Verifique se o campo 'data' está no HTML
    const tipoTratamento = document.getElementById('tipoTratamento').value;
    const observacoes = document.getElementById('observacoes').value;

    const consulta = {
        pacienteId,
        fisioterapeutaId,
        data,
        tipoTratamento,
        status: 'Agendado',
        observacoes
    };

    try {
        const response = await fetch('/consultas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(consulta),
        });
        const result = await response.json();
        if (response.ok) {
            alert('Consulta agendada com sucesso! ID: ' + result.id);
        } else {
            alert('Erro ao agendar consulta: ' + result.message);
        }
    } catch (err) {
        console.error('Erro ao agendar consulta:', err);
    }
}

// Função para chamar o pop-up de agendamento com a data selecionada
const agendarConsultaPopup = (data) => {
    const modal = document.getElementById('modal');
    const dataSelecionadaText = document.getElementById('dataSelecionadaText');
    const fecharModal = document.querySelector('.close');

    // Atualiza o texto com a data selecionada
    dataSelecionadaText.textContent = `Você selecionou a data: ${data}`;

    // Preenche o input de data
    document.getElementById('data').value = data;

    // Exibe o modal
    modal.style.display = 'flex';

    // Fecha o modal ao clicar no "X"
    fecharModal.onclick = () => {
        modal.style.display = 'none';
    };

    // Fecha o modal ao clicar fora do conteúdo
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
};
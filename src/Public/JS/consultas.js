document.addEventListener("DOMContentLoaded", async () => {
    // Preencher select de pacientes
    await loadPacientes();
    // Preencher select de fisioterapeutas
    await loadFisioterapeutas();

    const form = document.getElementById('consulta-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const pacienteId = form.paciente.value;
        const fisioterapeutaId = form.fisioterapeuta.value;
        const data = form.data.value;
        const tipoTratamento = form.tipoTratamento.value;
        const observacoes = form.observacoes.value;

        const response = await fetch('/consultas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pacienteId, fisioterapeutaId, data, tipoTratamento, observacoes }),
        });

        const result = await response.json();
        alert(result.message);
        form.reset();
        loadConsultas(); // Recarregar consultas
    });
});

async function loadPacientes() {
    const response = await fetch('/db/paciente.json');
    const pacientes = await response.json();
    const pacienteSelect = document.getElementById('paciente');

    pacientes.forEach(paciente => {
        const option = document.createElement('option');
        option.value = paciente.id;
        option.textContent = paciente.nome; // Altere 'nome' se o campo tiver outro nome
        pacienteSelect.appendChild(option);
    });
}

async function loadFisioterapeutas() {
    const response = await fetch('/db/fisioterapeuta.json');
    const fisioterapeutas = await response.json();
    const fisioterapeutaSelect = document.getElementById('fisioterapeuta');

    fisioterapeutas.forEach(fisioterapeuta => {
        const option = document.createElement('option');
        option.value = fisioterapeuta.id;
        option.textContent = fisioterapeuta.nome; // Altere 'nome' se o campo tiver outro nome
        fisioterapeutaSelect.appendChild(option);
    });
}

async function loadConsultas() {
    const response = await fetch('/consultas/data');
    const { consultas } = await response.json();
    const consultaList = document.getElementById('consulta-list');
    consultaList.innerHTML = '';

    consultas.forEach(consulta => {
        const div = document.createElement('div');
        div.textContent = `Consulta: ${consulta.tipoTratamento} - ${consulta.data}`;
        consultaList.appendChild(div);
    });
}

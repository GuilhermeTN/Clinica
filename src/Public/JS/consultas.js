document.addEventListener("DOMContentLoaded", async () => {
    await loadPacientes();
    await loadFisioterapeutas();

    const form = document.getElementById('consulta-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const { paciente, fisioterapeuta, data, tipoTratamento, observacoes } = form;
        const response = await fetch('/consultas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pacienteId: paciente.value,
                fisioterapeutaId: fisioterapeuta.value,
                data: data.value,
                tipoTratamento: tipoTratamento.value,
                observacoes: observacoes.value,
            }),
        });

        const result = await response.json();
        alert(result.message);
        form.reset();
        loadConsultas();
    });
});

async function loadPacientes() {
    const response = await fetch('/db/paciente.json');
    const pacientes = await response.json();
    const pacienteSelect = document.getElementById('paciente');

    pacientes.forEach(paciente => {
        const option = document.createElement('option');
        option.value = paciente.id;
        option.textContent = paciente.nome;
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
        option.textContent = fisioterapeuta.nome;
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

// public/js/main.js
document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");

    // Função para carregar os dados do paciente
    async function loadPaciente(id) {
        try {
            const response = await fetch(`/paciente/visualizar/${id}`);
            if (!response.ok) {
                throw new Error(`Erro ao carregar dados do paciente: ${response.statusText}`);
            }
            const paciente = await response.json();
            displayPacienteData(paciente);
        } catch (error) {
            console.error('Erro:', error);
            content.innerHTML = `<p>Erro ao carregar os dados do paciente. Tente novamente mais tarde.</p>`;
        }
    }

    // Função para exibir os dados do paciente
    function displayPacienteData(paciente) {
        content.innerHTML = `
            <h2>${paciente.nome}</h2>
            <p>Data de Nascimento: ${paciente.dataNascimento}</p>
            <p>Telefone: ${paciente.telefone}</p>
            <p>Email: ${paciente.email}</p>
            <!-- Outros dados do paciente -->
        `;
    }

    // Carregar o paciente com ID 1 (pode ser alterado dinamicamente)
    loadPaciente(1);
});

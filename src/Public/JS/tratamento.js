document.getElementById('treatment-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const patientName = document.getElementById('patient-name').value.trim();
  const treatmentPlan = document.getElementById('treatment-plan').value.trim();

  if (!patientName || !treatmentPlan) {
      alert('Por favor, preencha todos os campos.');
      return;
  }

  addTreatmentEntry(patientName, treatmentPlan);
  document.getElementById('treatment-form').reset();
});

function addTreatmentEntry(patientName, treatmentPlan) {
  const treatmentEntry = document.createElement('div');
  treatmentEntry.classList.add('treatment-entry');
  treatmentEntry.innerHTML = `
      <h3>Paciente: ${patientName}</h3>
      <p>Plano de Tratamento: ${treatmentPlan}</p>
      <button onclick="addProcedure(this)">Adicionar Procedimento</button>
      <div class="procedures-list"></div>
  `;

  document.getElementById('procedures-list').appendChild(treatmentEntry);
}

function addProcedure(button) {
  const procedureEntry = document.createElement('p');
  procedureEntry.textContent = 'Procedimento realizado em ' + new Date().toLocaleDateString();
  const proceduresList = button.parentElement.querySelector('.procedures-list');
  proceduresList.appendChild(procedureEntry);
}

function updateRecord() {
  const status = document.getElementById('update-status');
  status.textContent = 'Prontuário atualizado com sucesso!';
  setTimeout(() => status.textContent = '', 3000); // Limpa a mensagem após 3 segundos
}

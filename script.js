// ---------- Sélecteurs ----------
const durationInput = document.getElementById('duration-minutes');
const participantsContainer = document.getElementById('participants-container');
const addBtn = document.getElementById('add-participant');
const totalCostEl = document.getElementById('total-cost');

// ---------- Helpers ----------
const formatEuro = v => v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '\u00A0€';

function hourlyRate(row) {
  const type = row.querySelector('.salary-type').value;
  const salary = parseFloat(row.querySelector('.salary-input').value) || 0;
  if (type === 'annuel') {
    const hours = parseFloat(row.querySelector('.hours-input').value) || 35;
    return hours > 0 ? salary / (hours * 52) : 0;
  }
  return salary;
}

function updateTotal() {
  const durationMinutes = parseFloat(durationInput.value) || 0;
  const durationHours = durationMinutes / 60;
  let total = 0;
  participantsContainer.querySelectorAll('.participant-row').forEach(row => {
    total += hourlyRate(row) * durationHours;
  });
  totalCostEl.textContent = formatEuro(total);
}

function toggleHoursInput(row) {
  const salaryType = row.querySelector('.salary-type');
  const hoursInput = row.querySelector('.hours-input');
  hoursInput.style.display = salaryType.value === 'annuel' ? 'inline-block' : 'none';
}

function createParticipantRow() {
  const row = document.createElement('div');
  row.className = 'participant-row';
  row.innerHTML = `
    <input name="name" type="text" placeholder="Nom (optionnel)">
    <input class="salary-input" type="number" min="0" placeholder="Salaire">
    <select class="salary-type">
      <option value="annuel">€/an</option>
      <option value="horaire">€/h</option>
    </select>
    <input class="hours-input" type="number" min="1" max="60" value="35" title="Heures/sem">
    <button class="remove-btn" title="Supprimer">🗑️</button>`;

  row.querySelector('.salary-type').addEventListener('change', () => { toggleHoursInput(row); updateTotal(); });
  row.querySelectorAll('input,select').forEach(el => el.addEventListener('input', updateTotal));
  row.querySelector('.remove-btn').addEventListener('click', () => { row.remove(); updateTotal(); });

  toggleHoursInput(row);
  participantsContainer.appendChild(row);
}

// ---------- Événements ----------
addBtn.addEventListener('click', () => { createParticipantRow(); updateTotal(); });
durationInput.addEventListener('input', updateTotal);

// ---------- Init ----------
createParticipantRow();
updateTotal();


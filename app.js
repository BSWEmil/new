const STORAGE_KEY = 'ernaehrungstracker_heute';

function safeReadArray(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMeals(meals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
}

function formatNumber(value, unit) {
  const numeric = Number.isFinite(value) ? value : 0;
  return `${numeric.toFixed(1)} ${unit}`;
}

function sumMeals(meals) {
  return meals.reduce(
    (sum, meal) => {
      sum.calories += Number(meal.calories) || 0;
      sum.protein += Number(meal.protein) || 0;
      sum.carbs += Number(meal.carbs) || 0;
      sum.fat += Number(meal.fat) || 0;
      return sum;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

const form = document.getElementById('mealForm');
const mealList = document.getElementById('mealList');
const emptyState = document.getElementById('emptyState');
const totalCaloriesEl = document.getElementById('totalCalories');
const totalProteinEl = document.getElementById('totalProtein');
const totalCarbsEl = document.getElementById('totalCarbs');
const totalFatEl = document.getElementById('totalFat');

if (!form || !mealList || !emptyState || !totalCaloriesEl || !totalProteinEl || !totalCarbsEl || !totalFatEl) {
  throw new Error('Ernährungstracker konnte nicht initialisiert werden: Fehlende DOM-Elemente.');
}

let meals = safeReadArray(STORAGE_KEY);

function renderTotals() {
  const totals = sumMeals(meals);
  totalCaloriesEl.textContent = formatNumber(totals.calories, 'kcal');
  totalProteinEl.textContent = formatNumber(totals.protein, 'g');
  totalCarbsEl.textContent = formatNumber(totals.carbs, 'g');
  totalFatEl.textContent = formatNumber(totals.fat, 'g');
}

function renderMeals() {
  mealList.innerHTML = '';

  if (meals.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  meals.forEach((meal, index) => {
    const item = document.createElement('li');
    item.className = 'meal-item';

    const content = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = meal.food;

    const br = document.createElement('br');
    const meta = document.createElement('span');
    meta.className = 'meal-meta';
    meta.textContent = `${meal.amount} g • ${formatNumber(meal.calories, 'kcal')} • Protein ${formatNumber(meal.protein, 'g')} • KH ${formatNumber(meal.carbs, 'g')} • Fett ${formatNumber(meal.fat, 'g')}`;

    content.append(title, br, meta);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.type = 'button';
    removeBtn.textContent = 'Löschen';
    removeBtn.addEventListener('click', () => {
      meals.splice(index, 1);
      saveMeals(meals);
      renderAll();
    });

    item.append(content, removeBtn);
    mealList.appendChild(item);
  });
}

function renderAll() {
  renderTotals();
  renderMeals();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const meal = {
    food: document.getElementById('food').value.trim(),
    amount: Number(document.getElementById('amount').value),
    calories: Number(document.getElementById('calories').value),
    protein: Number(document.getElementById('protein').value),
    carbs: Number(document.getElementById('carbs').value),
    fat: Number(document.getElementById('fat').value),
  };

  if (!meal.food) {
    return;
  }

  meals.push(meal);
  saveMeals(meals);
  form.reset();
  renderAll();
});

renderAll();

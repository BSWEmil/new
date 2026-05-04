const STORAGE_KEY = 'ernaehrungstracker_heute';

function getMeals() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveMeals(meals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
}

function formatNumber(value, unit) {
  return `${value.toFixed(1)} ${unit}`;
}

function sumMeals(meals) {
  return meals.reduce(
    (sum, meal) => {
      sum.calories += meal.calories;
      sum.protein += meal.protein;
      sum.carbs += meal.carbs;
      sum.fat += meal.fat;
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

let meals = getMeals();

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
    item.innerHTML = `
      <div>
        <strong>${meal.food}</strong><br />
        <span class="meal-meta">${meal.amount} g • ${formatNumber(meal.calories, 'kcal')} • Protein ${formatNumber(meal.protein, 'g')} • KH ${formatNumber(meal.carbs, 'g')} • Fett ${formatNumber(meal.fat, 'g')}</span>
      </div>
    `;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.type = 'button';
    removeBtn.textContent = 'Löschen';
    removeBtn.addEventListener('click', () => {
      meals.splice(index, 1);
      saveMeals(meals);
      renderAll();
    });

    item.appendChild(removeBtn);
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

  if (!meal.food) return;
  meals.push(meal);
  saveMeals(meals);
  form.reset();
  renderAll();
});

renderAll();

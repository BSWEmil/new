const STORAGE_KEY = 'ernaehrungstracker_heute';
const GOAL_KEY = 'ernaehrungstracker_ziele';

const defaultGoals = { calories: 2200, protein: 140, carbs: 250, fat: 70 };

function getMeals() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
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

function getGoals() {
  const parsed = JSON.parse(localStorage.getItem(GOAL_KEY) || 'null');
  return parsed || defaultGoals;
}

function saveGoals(goals) {
  localStorage.setItem(GOAL_KEY, JSON.stringify(goals));
}

const goalForm = document.getElementById('goalForm');
const canvas = document.getElementById('goalChart');
const ctx = canvas.getContext('2d');

function drawChart(consumed, goals) {
  const entries = [
    { key: 'calories', label: 'Kalorien', unit: 'kcal' },
    { key: 'protein', label: 'Protein', unit: 'g' },
    { key: 'carbs', label: 'Kohlenhydrate', unit: 'g' },
    { key: 'fat', label: 'Fett', unit: 'g' },
  ];

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const maxValue = Math.max(...entries.map((e) => Math.max(consumed[e.key], goals[e.key])), 1);

  entries.forEach((entry, i) => {
    const y = 35 + i * 70;
    const consumedWidth = (consumed[entry.key] / maxValue) * 560;
    const goalWidth = (goals[entry.key] / maxValue) * 560;

    ctx.fillStyle = '#9fb2cc';
    ctx.fillRect(150, y, goalWidth, 20);
    ctx.fillStyle = '#2f80ed';
    ctx.fillRect(150, y + 24, consumedWidth, 20);

    ctx.fillStyle = '#1d2733';
    ctx.font = '14px Arial';
    ctx.fillText(entry.label, 20, y + 18);
    ctx.fillText(`Soll: ${goals[entry.key]} ${entry.unit}`, 150 + goalWidth + 8, y + 15);
    ctx.fillText(`Ist: ${consumed[entry.key].toFixed(1)} ${entry.unit}`, 150 + consumedWidth + 8, y + 39);
  });
}

function initGoalsForm(goals) {
  document.getElementById('goalCalories').value = goals.calories;
  document.getElementById('goalProtein').value = goals.protein;
  document.getElementById('goalCarbs').value = goals.carbs;
  document.getElementById('goalFat').value = goals.fat;
}

goalForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const goals = {
    calories: Number(document.getElementById('goalCalories').value),
    protein: Number(document.getElementById('goalProtein').value),
    carbs: Number(document.getElementById('goalCarbs').value),
    fat: Number(document.getElementById('goalFat').value),
  };

  saveGoals(goals);
  drawChart(sumMeals(getMeals()), goals);
});

const goals = getGoals();
initGoalsForm(goals);
drawChart(sumMeals(getMeals()), goals);

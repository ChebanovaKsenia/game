const mainMenu = document.getElementById('main-menu');
const gameContainer = document.getElementById('game-container');
const gameOverScreen = document.getElementById('game-over');
const gameResult = document.getElementById('game-result');
const scoreDisplay = document.getElementById('score');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Кнопки
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);

// Изображения
const girlImg = new Image();
girlImg.src = 'anime.png';

const lemonImg = new Image();
lemonImg.src = 'limon.png';

const enemyImg = new Image();
enemyImg.src = 'arara.png';

// Размеры спрайтов
const GIRL_SIZE = 150;
const LEMON_SIZE = 100;
const ENEMY_SIZE = 100;

// Игровые переменные
let score = 0;
let gameRunning = false;
let girl = { x: 400, y: 300, speed: 5, width: GIRL_SIZE, height: GIRL_SIZE };
let currentLemon = null; // только один лимон на поле
let enemy = { x: -100, y: -100, speed: 1, active: false, width: ENEMY_SIZE, height: ENEMY_SIZE };

// Управление
const keys = { w: false, a: false, s: false, d: false, ц: false, ф: false, ы: false, в: false };

// Генерация одного лимона в случайном месте
function spawnLemon() {
  const x = Math.random() * (canvas.width - LEMON_SIZE);
  const y = Math.random() * (canvas.height - LEMON_SIZE);
  currentLemon = { x, y, width: LEMON_SIZE, height: LEMON_SIZE };
}

// Проверка столкновения
function isColliding(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

// Начало игры
function startGame() {
  mainMenu.style.display = 'none';
  gameOverScreen.style.display = 'none';
  gameContainer.style.display = 'block';

  score = 0;
  girl.x = 800;
  girl.y = 600;
  enemy.active = false;
  enemy.x = -100;
  enemy.y = -100;

  scoreDisplay.textContent = 'Лимоны: 0';
  gameRunning = true;

  // Спавним первый лимон
  spawnLemon();

  gameLoop();
}

// Основной цикл
function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Движение девушки
  if (keys.w  && girl.y > 0) girl.y -= girl.speed;
  if (keys.s && girl.y < canvas.height - girl.height) girl.y += girl.speed;
  if (keys.a && girl.x > 0) girl.x -= girl.speed;
  if (keys.d && girl.x < canvas.width - girl.width) girl.x += girl.speed;
  if (keys.ц  && girl.y > 0) girl.y -= girl.speed;
  if (keys.ы && girl.y < canvas.height - girl.height) girl.y += girl.speed;
  if (keys.ф && girl.x > 0) girl.x -= girl.speed;
  if (keys.в && girl.x < canvas.width - girl.width) girl.x += girl.speed;

  // Отрисовка девушки
  ctx.drawImage(girlImg, girl.x, girl.y, girl.width, girl.height);

  // Отрисовка лимона (всегда один)
  if (currentLemon) {
    ctx.drawImage(lemonImg, currentLemon.x, currentLemon.y, currentLemon.width, currentLemon.height);

    if (isColliding(girl, currentLemon)) {
      score++;
      scoreDisplay.textContent = `Лимоны: ${score}`;

      // Победа при 50
      if (score >= 50) {
        endGame(true);
        return;
      }

      // Активация врага после 10 лимонов
      if (score >= 10 && !enemy.active) {
        enemy.active = true;
        // Спавним врага в случайном углу или краю
        const side = Math.floor(Math.random() * 4);
        if (side === 0) { enemy.x = 0; enemy.y = Math.random() * canvas.height; }
        else if (side === 1) { enemy.x = canvas.width - ENEMY_SIZE; enemy.y = Math.random() * canvas.height; }
        else if (side === 2) { enemy.x = Math.random() * canvas.width; enemy.y = 0; }
        else { enemy.x = Math.random() * canvas.width; enemy.y = canvas.height - ENEMY_SIZE; }
      }

      // Ускорение врага каждые 5 лимонов после 10
      if (score >= 10) {
        enemy.speed = 1 + Math.floor((score - 10) / 5) * 0.6;
        if (enemy.speed > 8) enemy.speed = 8;
      }

      // Спавним следующий лимон
      spawnLemon();
    }
  }

  // Движение врага
  if (enemy.active) {
    const dx = girl.x - enemy.x;
    const dy = girl.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      enemy.x += (dx / dist) * enemy.speed;
      enemy.y += (dy / dist) * enemy.speed;
    }

    ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);

    if (isColliding(girl, enemy)) {
      endGame(false);
      return;
    }
  }

  requestAnimationFrame(gameLoop);
}

// Завершение игры
function endGame(isWin) {
  gameRunning = false;
  gameContainer.style.display = 'none';
  gameOverScreen.style.display = 'block';
  gameResult.textContent = isWin ? 'Вы выиграли!' : 'Игра закончена! Вы проиграли!';
}

// Управление
window.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (k === 'w') keys.w = true;
  if (k === 'a') keys.a = true;
  if (k === 's') keys.s = true;
  if (k === 'd') keys.d = true;
  if (k === 'ц') keys.w = true;
  if (k === 'ф') keys.a = true;
  if (k === 'ы') keys.s = true;
  if (k === 'в') keys.d = true;
});

window.addEventListener('keyup', (e) => {
  const k = e.key.toLowerCase();
  if (k === 'w') keys.w = false;
  if (k === 'a') keys.a = false;
  if (k === 's') keys.s = false;
  if (k === 'd') keys.d = false;
  if (k === 'ц') keys.w = false;
  if (k === 'ф') keys.a = false;
  if (k === 'ы') keys.s = false;
  if (k === 'в') keys.d = false;
});
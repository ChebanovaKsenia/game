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
const kuromiImg = new Image();
kuromiImg.src = 'kuromi.png';

const lemonImg = new Image();
lemonImg.src = 'limon.png';

const kittyImg = new Image();
kittyImg.src = 'helloKitty.png';

// Размеры спрайтов
const KUROMI_SIZE = 150;
const LEMON_SIZE = 100;
const KITTY_SIZE = 100;

// Игровые переменные
let score = 0;
let gameRunning = false;
let kuromi = { x: 400, y: 300, speed: 5, width: KUROMI_SIZE, height: KUROMI_SIZE };
let currentLemon = null; // только один лимон на поле
let kitty = { x: -100, y: -100, speed: 1, active: false, width: KITTY_SIZE, height: KITTY_SIZE };

// Управление
const keys = { w: false, a: false, s: false, d: false, ц: false, ф: false, ы: false, в: false };

// Генерация лимона случайно
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
  kuromi.x = 800;
  kuromi.y = 600;
  kitty.active = false;
  kitty.x = -100;
  kitty.y = -100;

  scoreDisplay.textContent = 'Лимоны: 0';
  gameRunning = true;

  // Первый лимон
  spawnLemon();

  gameLoop();
}

// Основной игровой цикл
function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Движение Куроми
  if (keys.w && kuromi.y > 0) kuromi.y -= kuromi.speed;
  if (keys.s && kuromi.y < canvas.height - kuromi.height) kuromi.y += kuromi.speed;
  if (keys.a && kuromi.x > 0) kuromi.x -= kuromi.speed;
  if (keys.d && kuromi.x < canvas.width - kuromi.width) kuromi.x += kuromi.speed;
  if (keys.ц && kuromi.y > 0) kuromi.y -= kuromi.speed;
  if (keys.ы && kuromi.y < canvas.height - kuromi.height) kuromi.y += kuromi.speed;
  if (keys.ф && kuromi.x > 0) kuromi.x -= kuromi.speed;
  if (keys.в && kuromi.x < canvas.width - kuromi.width) kuromi.x += kuromi.speed;

  // Отрисовка Куроми
  ctx.drawImage(kuromiImg, kuromi.x, kuromi.y, kuromi.width, kuromi.height);

  // Отрисовка лимона
  if (currentLemon) {
    ctx.drawImage(lemonImg, currentLemon.x, currentLemon.y, currentLemon.width, currentLemon.height);

    if (isColliding(kuromi, currentLemon)) {
      score++;
      scoreDisplay.textContent = `Лимоны: ${score}`;

      // Победа при 50 лимонах
      if (score >= 50) {
        endGame(true);
        return;
      }

      // Появление Китти после 10 лимонов
      if (score >= 10 && !kitty.active) {
        kitty.active = true;
        // Спавн Китти у края или в углу
        const side = Math.floor(Math.random() * 4);
        if (side === 0) { 
          kitty.x = 0; 
          kitty.y = Math.random() * canvas.height; 
        } else if (side === 1) { 
          kitty.x = canvas.width - KITTY_SIZE; 
          kitty.y = Math.random() * canvas.height; 
        } else if (side === 2) { 
          kitty.x = Math.random() * canvas.width; 
          kitty.y = 0; 
        } else { 
          kitty.x = Math.random() * canvas.width; 
          kitty.y = canvas.height - KITTY_SIZE; 
        }
      }

      // Ускорение Китти
      if (score >= 10) {
        kitty.speed = 1 + Math.floor((score - 10) / 5) * 0.6;
        if (kitty.speed > 8) kitty.speed = 8;
      }

      // Спавн нового лимона
      spawnLemon();
    }
  }

  // Движение Китти
  if (kitty.active) {
    const dx = kuromi.x - kitty.x;
    const dy = kuromi.y - kitty.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      kitty.x += (dx / dist) * kitty.speed;
      kitty.y += (dy / dist) * kitty.speed;
    }

    ctx.drawImage(kittyImg, kitty.x, kitty.y, kitty.width, kitty.height);

    if (isColliding(kuromi, kitty)) {
      endGame(false);
      return;
    }
  }

  requestAnimationFrame(gameLoop);
}

// Конец игры
function endGame(isWin) {
  gameRunning = false;
  gameContainer.style.display = 'none';
  gameOverScreen.style.display = 'block';
  gameResult.textContent = isWin ? 'Вы выиграли!' : 'Игра закончена! Вы проиграли!';
}

// Обработка клавиш
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
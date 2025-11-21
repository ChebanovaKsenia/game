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
girlImg.src = 'kuromi.png';

const lemonImg = new Image();
lemonImg.src = 'limon.png';

const kittyImg = new Image();
kittyImg.src = 'helloKitty.png';

//размеры спрайтов
const GIRL_SIZE = 150;
const LEMON_SIZE = 100;
const KITTY_SIZE = 100;

//игровые переменные
let score = 0;
let gameRunning = false;
let girl = { x: 400, y: 300, speed: 5, width: GIRL_SIZE, height: GIRL_SIZE };
let currentLemon = null; // только один лимон на поле
let kitty = { x: -100, y: -100, speed: 1, active: false, width: KITY_SIZE, height: KITTY_SIZE };

//управление
const keys = { w: false, a: false, s: false, d: false, ц: false, ф: false, ы: false, в: false };

//генерация лимона рандомно
function spawnLemon() {
  const x = Math.random() * (canvas.width - LEMON_SIZE);
  const y = Math.random() * (canvas.height - LEMON_SIZE);
  currentLemon = { x, y, width: LEMON_SIZE, height: LEMON_SIZE };
}

//проверка столкновения
function isColliding(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

//начало
function startGame() {
  mainMenu.style.display = 'none';
  gameOverScreen.style.display = 'none';
  gameContainer.style.display = 'block';

  score = 0;
  girl.x = 800;
  girl.y = 600;
  kitty.active = false;
  kitty.x = -100;
  kitty.y = -100;

  scoreDisplay.textContent = 'Лимоны: 0';
  gameRunning = true;

  //первый лимон
  spawnLemon();

  gameLoop();
}

//основа
function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //куроми
  if (keys.w  && girl.y > 0) girl.y -= girl.speed;
  if (keys.s && girl.y < canvas.height - girl.height) girl.y += girl.speed;
  if (keys.a && girl.x > 0) girl.x -= girl.speed;
  if (keys.d && girl.x < canvas.width - girl.width) girl.x += girl.speed;
  if (keys.ц  && girl.y > 0) girl.y -= girl.speed;
  if (keys.ы && girl.y < canvas.height - girl.height) girl.y += girl.speed;
  if (keys.ф && girl.x > 0) girl.x -= girl.speed;
  if (keys.в && girl.x < canvas.width - girl.width) girl.x += girl.speed;

  //её отрисовка
  ctx.drawImage(girlImg, girl.x, girl.y, girl.width, girl.height);

  //отрисовка лимона 
  if (currentLemon) {
    ctx.drawImage(lemonImg, currentLemon.x, currentLemon.y, currentLemon.width, currentLemon.height);

    if (isColliding(girl, currentLemon)) {
      score++;
      scoreDisplay.textContent = `Лимоны: ${score}`;

      //победа при 50
      if (score >= 50) {
        endGame(true);
        return;
      }

      //враг после  10 лимона
      if (score >= 10 && !kitty.active) {
        kitty.active = true;
        //спавн врага скаю или в углу
        const side = Math.floor(Math.random() * 4);
        if (side === 0) { kitty.x = 0; kitty.y = Math.random() * canvas.height; }
        else if (side === 1) { kitty.x = canvas.width - KITTY_SIZE; kitty.y = Math.random() * canvas.height; }
        else if (side === 2) { kitty.x = Math.random() * canvas.width; kitty.y = 0; }
        else { kitty.x = Math.random() * canvas.width; kitty.y = canvas.height - KITTY_SIZE_SIZE; }
      }

      //ускорение 
      if (score >= 10) {
        kitty.speed = 1 + Math.floor((score - 10) / 5) * 0.6;
        if (kitty.speed > 8) kitty.speed = 8;
      }

      //спавн лимона
      spawnLemon();
    }
  }

  //движение китти
  if (kitty.active) {
    const dx = girl.x - kitty.x;
    const dy = girl.y - kitty.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      kitty.x += (dx / dist) * kitty.speed;
      kitty.y += (dy / dist) * kitty.speed;
    }

    ctx.drawImage(kittyImg, kitty.x, kitty.y, kitty.width, kitty.height);

    if (isColliding(girl, kitty)) {
      endGame(false);
      return;
    }
  }

  requestAnimationFrame(gameLoop);
}

//конец
function endGame(isWin) {
  gameRunning = false;
  gameContainer.style.display = 'none';
  gameOverScreen.style.display = 'block';
  gameResult.textContent = isWin ? 'Вы выиграли!' : 'Игра закончена! Вы проиграли!';
}

//управление
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
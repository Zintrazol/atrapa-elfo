// app.js - Versión de prueba mínima para "Atrapa al Elfo"
// Reemplaza TODO el contenido de app.js por este código y guarda.

(() => {
  // Elementos del DOM (asegúrate de que los IDs coincidan con index.html)
  const startBtn = document.getElementById('start');
  const shareBtn = document.getElementById('share');
  const scoreEl = document.getElementById('score');
  const timeEl = document.getElementById('time');
  const board = document.getElementById('board');

  // Configuración
  const GRID_SIZE = 4;              // 4x4 = 16 casillas
  const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
  const MOVE_INTERVAL_MS = 700;     // cada cuánto se mueve el elfo
  const GAME_TIME_S = 30;           // segundos de partida

  let score = 0;
  let timeLeft = GAME_TIME_S;
  let intervalId = null;
  let moveId = null;
  let playing = false;
  let currentIndex = -1;

  // Crea la cuadrícula
  function createBoard() {
    board.innerHTML = ''; // limpia
    board.style.display = 'grid';
    board.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
    board.style.gap = '10px';
    board.style.maxWidth = '420px';
    board.style.marginTop = '20px';

    for (let i = 0; i < TOTAL_CELLS; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = i;
      cell.style.minHeight = '60px';
      cell.style.borderRadius = '8px';
      cell.style.background = '#f1f1f1';
      cell.style.display = 'flex';
      cell.style.alignItems = 'center';
      cell.style.justifyContent = 'center';
      cell.style.fontSize = '28px';
      cell.style.cursor = 'pointer';
      // Handler: si le das y está el elfo sumas
      cell.addEventListener('click', (e) => {
        if (!playing) return;
        const idx = Number(cell.dataset.index);
        if (idx === currentIndex) {
          score++;
          scoreEl.textContent = score;
          // quita el elfo inmediatamente para evitar clicks repetidos
          removeElf();
        }
      });
      board.appendChild(cell);
    }
  }

  // Pone el elfo (emoji) en una casilla aleatoria
  function placeElfRandom() {
    removeElf();
    const cells = board.querySelectorAll('.cell');
    const idx = Math.floor(Math.random() * cells.length);
    currentIndex = idx;
    const cell = cells[idx];
    cell.textContent = '🎄'; // elfo/árbol emoji
    // animación simple
    cell.style.transform = 'scale(1.05)';
    setTimeout(()=> cell.style.transform = 'scale(1)', 120);
  }

  function removeElf() {
    const prev = board.querySelector('.cell').parentElement; // no usado; mejor limpiar todas
    board.querySelectorAll('.cell').forEach(c => c.textContent = '');
    currentIndex = -1;
  }

  function startMovingElf() {
    // mueve inmediatamente y luego con intervalo
    placeElfRandom();
    moveId = setInterval(placeElfRandom, MOVE_INTERVAL_MS);
  }

  function stopMovingElf() {
    if (moveId) clearInterval(moveId);
    moveId = null;
    removeElf();
  }

  function startTimer() {
    timeLeft = GAME_TIME_S;
    timeEl.textContent = timeLeft;
    intervalId = setInterval(() => {
      timeLeft--;
      timeEl.textContent = timeLeft + 's';
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  function stopTimer() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
  }

  function startGame() {
    if (playing) return;
    playing = true;
    score = 0;
    scoreEl.textContent = score;
    startBtn.disabled = true;
    startTimer();
    startMovingElf();
  }

  function endGame() {
    playing = false;
    startBtn.disabled = false;
    stopTimer();
    stopMovingElf();
    alert('Fin del juego. Puntos: ' + score);
  }

  // Compartir (si navigator.share está disponible)
  function shareScore() {
    const url = location.href;
    const text = `Mi puntuación en Atrapa al Elfo: ${score} puntos`;
    if (navigator.share) {
      navigator.share({ title: 'Atrapa al Elfo', text, url }).catch(()=>{});
    } else {
      // copia al portapapeles
      navigator.clipboard?.writeText(text + ' ' + url).then(()=> {
        alert('Texto copiado al portapapeles.');
      }).catch(()=> {
        alert('Comparte manualmente: ' + text + ' ' + url);
      });
    }
  }

  // Inicialización
  function init() {
    if (!board || !startBtn || !scoreEl || !timeEl) {
      console.error('Faltan elementos en el DOM. Revisa los IDs en index.html');
      return;
    }
    createBoard();
    startBtn.addEventListener('click', startGame);
    shareBtn?.addEventListener('click', shareScore);

    // muestra valores iniciales
    scoreEl.textContent = '0';
    timeEl.textContent = GAME_TIME_S + 's';

    // Si hay service worker anterior, sugiere recargar en privado
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations()
        .then(regs => {
          if (regs.length > 0) {
            console.log('Service worker registrado. Si ves contenido viejo, prueba en pestaña privada para evitar caché.');
          }
        }).catch(()=>{});
    }
  }

  // Ejecutar init al cargar DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

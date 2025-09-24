// ============================
// Referencias a elementos HTML
// ============================
const startBtn = document.getElementById("startBtn");
const title = document.getElementById("title");
const gifCard = document.getElementById("gifCard");
const mainGif = document.getElementById("mainGif");
const gifText = document.getElementById("gifText");
const flowerBtn = document.getElementById("flowerBtn");
const background = document.getElementById("background");

const gifSequence = ["assets/gif1.gif", "assets/gif2.gif", "assets/gif3.gif"];
let gifIndex = 0;

// ============================
// Listeners para botones
// ============================
startBtn.addEventListener("click", startHandler);
startBtn.addEventListener("touchstart", startHandler);
flowerBtn.addEventListener("click", createFlowerBurst);
flowerBtn.addEventListener("touchstart", createFlowerBurst);

// ============================
// Configuración de flores
// ============================
const flowerSize = 40;
const flowersContainer = document.createElement("div");
flowersContainer.style.position = "absolute";
flowersContainer.style.top = 0;
flowersContainer.style.left = 0;
flowersContainer.style.width = "100%";
flowersContainer.style.height = "100%";
flowersContainer.style.pointerEvents = "none";
flowersContainer.style.zIndex = 5; // debajo de la card y botones
document.getElementById("container").appendChild(flowersContainer);

// ============================
// Handler unificado de inicio
// ============================
let bgAudio = null; // variable global para audio dinámico

function startHandler() {
  startAnimation();
  playAudioFadeDynamic();
}

// ============================
// Animación principal del GIF
// ============================
function startAnimation() {
  startBtn.classList.add("hidden");
  title.classList.add("hidden");
  gifCard.classList.remove("hidden");

  mainGif.src = "assets/initial.gif";
  mainGif.style.transform = "scale(0.05)";

  let scale = 0.05;
  let flip = false;
  const steps = 150;
  const intervalTime = 6000 / steps;
  let step = 0;

  const interval = setInterval(() => {
    step++;
    scale += (1 - 0.05) / steps;
    if (step % 3 === 0) flip = !flip;
    mainGif.style.transform = `scale(${scale}) scaleX(${flip ? -1 : 1})`;

    background.style.opacity = Math.min(
      parseFloat(background.style.opacity || 0) + 1 / steps,
      1
    );

    if (step >= steps) {
      clearInterval(interval);
      showGifSequence();
    }
  }, intervalTime);
}

// ============================
// Reproducción de audio con fade-in dinámico
// ============================
function playAudioFadeDynamic() {
  if (bgAudio) {
    // Detener cualquier audio previo
    bgAudio.pause();
    bgAudio = null;
  }

  bgAudio = new Audio("assets/music.mp3");
  bgAudio.volume = 0;
  bgAudio.muted = false;
  bgAudio.loop = true;
  bgAudio.play().then(() => {
    // Fade-in hasta 0.6 en 6 segundos
    const duration = 6000;
    const steps = 60;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      bgAudio.volume = Math.min((step / steps) * 0.6, 0.6);
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
  }).catch(err => {
    console.warn("Audio bloqueado hasta interacción:", err);
  });
}

// ============================
// Secuencia de GIFs
// ============================
function showGifSequence() {
  mainGif.src = gifSequence[gifIndex];
  mainGif.style.transform = "scale(1)";

  const sequenceInterval = setInterval(() => {
    gifIndex++;
    if (gifIndex < gifSequence.length) {
      mainGif.src = gifSequence[gifIndex];
      mainGif.style.transform = "scale(1)";
      if (gifIndex === 1) {
        gifText.classList.remove("hidden");
        gifText.classList.add("show");
        flowerBtn.classList.remove("hidden");
      }
    } else {
      clearInterval(sequenceInterval);
    }
  }, 1500);
}

// ============================
// Funciones de flores
// ============================
function createFlower() {
  const flower = document.createElement("img");
  flower.src = "assets/flower.png";
  flower.style.width = flowerSize + "px";
  flower.style.height = flowerSize + "px";
  flower.style.position = "absolute";

  // Posición aleatoria
  const x = Math.random() * (window.innerWidth - flowerSize);
  const y = Math.random() * (window.innerHeight - flowerSize);
  flower.style.left = x + "px";
  flower.style.top = y + "px";

  flower.style.opacity = 1;
  flower.style.transition = "opacity 1s ease-out";

  flowersContainer.appendChild(flower);

  setTimeout(() => {
    flower.style.opacity = 0;
    setTimeout(() => flower.remove(), 1000);
  }, 3000);
}

function createFlowerBurst() {
  for (let i = 0; i < 10; i++) createFlower();
}

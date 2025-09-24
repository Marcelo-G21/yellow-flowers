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
const bgAudio = document.getElementById("bgAudio");

const gifSequence = ["assets/gif1.gif", "assets/gif2.gif", "assets/gif3.gif"];
let gifIndex = 0;

// ============================
// Listeners para botones
// ============================
startBtn.addEventListener("click", startAnimation);
startBtn.addEventListener("touchstart", startAnimation);
flowerBtn.addEventListener("click", createFlowerBurst);
flowerBtn.addEventListener("touchstart", createFlowerBurst);

// ============================
// Configuración de las flores
// ============================
let flowers = [];
const flowerSize = 40;

// Contenedor de flores debajo de la card
const flowersContainer = document.createElement("div");
flowersContainer.style.position = "absolute";
flowersContainer.style.top = 0;
flowersContainer.style.left = 0;
flowersContainer.style.width = "100%";
flowersContainer.style.height = "100%";
flowersContainer.style.pointerEvents = "none";
flowersContainer.style.zIndex = 5; // debajo de la card y botón
document.getElementById("container").appendChild(flowersContainer);

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

  // 🔊 Reproducir audio inmediatamente en el click
  bgAudio.currentTime = 0;
  bgAudio.volume = 0;
  const playPromise = bgAudio.play();
  if (playPromise !== undefined) {
    playPromise.catch(err => {
      console.warn("No se pudo reproducir audio: ", err);
    });
  }

  // Fade-in a 0.6 en 6 segundos
  const fadeSteps = 60;
  let fadeStep = 0;
  const fadeInterval = setInterval(() => {
    fadeStep++;
    bgAudio.volume = Math.min((fadeStep / fadeSteps) * 0.6, 0.6);
    if (fadeStep >= fadeSteps) clearInterval(fadeInterval);
  }, 100); // 100ms × 60 ≈ 6s

  // Animación de escala y flip
  const interval = setInterval(() => {
    step++;
    scale += (1 - 0.05) / steps;

    if (step % 3 === 0) flip = !flip;
    mainGif.style.transform = `scale(${scale}) scaleX(${flip ? -1 : 1})`;

    // Fade-in del fondo
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

  // Posición aleatoria en pantalla
  const x = Math.random() * (window.innerWidth - flowerSize);
  const y = Math.random() * (window.innerHeight - flowerSize);
  flower.style.left = x + "px";
  flower.style.top = y + "px";

  // Opacidad inicial
  flower.style.opacity = 1;
  flower.style.transition = "opacity 1s ease-out";

  flowersContainer.appendChild(flower);

  // Mantener visible 3 segundos y desaparecer
  setTimeout(() => {
    flower.style.opacity = 0;
    setTimeout(() => flower.remove(), 1000);
  }, 3000);
}

function createFlowerBurst() {
  for (let i = 0; i < 10; i++) {
    createFlower();
  }
}

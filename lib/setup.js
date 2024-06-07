let audioPlayer = null;

function now() {
  return Date.now() / 1000;
}

let startTime = now();
let demoTime = 0;
let paused = true;

function getTime() {
  if (paused) {
    return demoTime;
  } else {
    return now() - startTime;
  }
}

function endDemo() {
  paused = true;
  demoTime = 0;
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }

  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  }
}

window.addEventListener("keydown", (event) => {
  // F = Toggle fullscreen
  if (event.key === "f") {
    let canvas = document.querySelector("canvas");
    if (!document.fullscreenElement) {
      canvas.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  // Space = Pause/unpause
  if (event.key === " ") {
    if (paused) {
      paused = false;
      if (audioPlayer) {
        audioPlayer.play();
      }
      startTime = now() - demoTime;
      loop();
    } else {
      paused = true;
      if (audioPlayer) {
        audioPlayer.pause();
      }
      demoTime = now() - startTime;
      noLoop();
    }
  }

  // 0 = Reset time
  if (event.key === "0") {
    startTime = now();
    demoTime = 0;
    if (audioPlayer) {
      audioPlayer.currentTime = 0;
    }
    if (paused) {
      redraw();
    }
  }
});

document.fonts.ready.then(() => {
  redraw();
});

function setup() {
  const app = createCanvas(1920, 1080);
  app.canvas.style = ""; // Remove default scaling
  app.parent(document.body);

  background(0);
  noLoop();
}

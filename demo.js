audioPlayer = document.querySelector("#song");

// COLORS
// #808836
// #FFBF00
// #FF9A00
// #D10363
const GREEN = "#808836";
const YELLOW = "#FFBF00";
const ORANGE = "#FF9A00";
const MAROON = "#D10363";

function draw() {
  const bpm = 132;
  const demoTime = (getTime() * bpm) / 60;

  textFont("Londrina Solid");
  colorMode(HSL); // Hue (0..360), Saturation (0..100), Lightness (0..100)

  if (demoTime == 0) {
    paused = false;
    if (audioPlayer) {
      audioPlayer.play();
    }
    startTime = now() - demoTime;
    loop();
  }

  if (demoTime === 0) {
    instructionsScene(demoTime);
  } else if (demoTime < 12) {
    myScene(demoTime);
  } else if (demoTime < 64) {
    myFlowerScene(demoTime - 12);
  } else {
    endDemo();
  }
  fill(0); // black
  noStroke();
  text(demoTime.toFixed(2), 0, 0);
}

function instructionsScene(sceneTime) {
  background(35, 100, 50); // orange
  textAlign(CENTER, CENTER);
  textSize(64);
  fill(0, 0, 0); // black
  noStroke();
  text("Press F to go fullscreen and space to start", width / 2, height / 2);
}
function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Modified map function that uses ease-in-out easing
function mapEase(value, start1, stop1, start2, stop2, withinBounds) {
  let t = (value - start1) / (stop1 - start1); // normalize to 0-1
  if (withinBounds) {
    t = constrain(t, 0, 1); // ensure within 0-1 range
  }
  t = easeInOut(t); // apply easing
  return start2 + t * (stop2 - start2); // map to target range
}

function myFlowerScene(sceneTime) {
  strokeWeight(2);
  background(YELLOW); // background color

  translate(width / 2, height / 2);

  let rotationSpeed = 0.02;
  rotate(sceneTime * rotationSpeed);

  stroke(MAROON);
  fill(MAROON);

  // Draw flowers in a grid
  for (let x = -width / 2; x <= width / 2; x += 100) {
    for (let y = (-height * 2) / 2; y <= (height * 2) / 2; y += 100) {
      push();
      translate(x, y);

      // Rotate each flower over time
      rotate(sceneTime * rotationSpeed);

      // Flower parameters
      let petalLength = 40;
      let petalWidth = 20;
      let petalCount = 6; // Number of petals

      // Calculate petal reveal progress
      let noiseNumber = noise(x * 0.01, y * 0.01);
      let revealTimer = map(sceneTime, 0, 10, 0.15, 0.6, true);
      //let revealProgress = (sceneTime % 5) / 5; // normalize to [0, 1]
      let revealProgress = map(sceneTime, 0, 10, 0, 1);
      if (noiseNumber > revealTimer) {
        revealProgress = 0;
      }

      // Draw petals
      for (let i = 0; i < petalCount; i++) {
        let angle = (TWO_PI / petalCount) * i;

        // Only draw petals up to the current reveal progress
        if (i / petalCount < revealProgress) {
          push();
          rotate(angle);

          // Draw a petal using bezier curves
          beginShape();
          vertex(0, 0);
          bezierVertex(
            petalWidth * 0.5,
            -petalLength * 0.5,
            petalWidth * 0.5,
            -petalLength,
            0,
            -petalLength
          );
          bezierVertex(
            -petalWidth * 0.5,
            -petalLength,
            -petalWidth * 0.5,
            -petalLength * 0.5,
            0,
            0
          );
          endShape(CLOSE);

          pop();
        }
      }

      // Draw flower center
      fill(YELLOW);
      noStroke();
      ellipse(0, 0, 20, 20);

      pop();
    }
  }
}

function myScene(sceneTime) {
  background(GREEN); // background color

  translate(width / 2, height / 2);

  let sunSize = mapEase(sceneTime, 0, 5, 200, 600, true);

  // Drawing the sun
  let sunY = 0;

  // Draw sun rays
  noFill();
  stroke(YELLOW);
  for (let i = 0; i < 20; i++) {
    let raySize = map(sceneTime, 0, 5, 0.0, 1.0, true);
    let angle = map(i, 0, 20, 0, TWO_PI);
    angle += sceneTime * 0.1;
    let x1 = cos(angle) * sunSize * 0.5;
    let y1 = sin(angle) * sunSize * 0.5 + sunY;

    // Animate the control points for the Bezier curves
    let controlOffset = sin(sceneTime + i) * 50; // animate control points
    let controlX1 = cos(angle + 0.2) * (sunSize * 0.6 + controlOffset);
    let controlY1 = sin(angle + 0.2) * (sunSize * 0.6 + controlOffset) + sunY;
    let controlX2 = cos(angle - 0.2) * (sunSize * 0.7 + controlOffset);
    let controlY2 = sin(angle - 0.2) * (sunSize * 0.7 + controlOffset) + sunY;

    let x2 = cos(angle) * sunSize * raySize * 0.75;
    let y2 = sin(angle) * sunSize * raySize * 0.75 + sunY;

    // Adjust stroke weight based on distance from the sun
    let d1 = dist(0, sunY, x1, y1); // distance for start point of the ray
    let d2 = dist(0, sunY, x2, y2); // distance for end point of the ray

    // Map distance to stroke weight (thicker closer to the sun, thinner farther away)
    let weight1 = map(d1, 0, sunSize * 0.75, 100, 1);
    let weight2 = map(d2, 0, sunSize * 0.75, 100, 1);

    // Increase stroke weight & sunSize until it fill the whole screen with yellow
    // animated
    if (sceneTime > 9) {
      sunSize = map(sceneTime, 9, 13, sunSize, sunSize * 2, true);
    }

    for (let j = 0; j < 1; j += 0.02) {
      // Interpolated points along the ray
      let x = bezierPoint(x1, controlX1, controlX2, x2, j);
      let y = bezierPoint(y1, controlY1, controlY2, y2, j);

      // Calculate the interpolated distance
      let d = dist(0, sunY, x, y);

      // Map the interpolated distance to stroke weight
      let weight = map(d, 0, sunSize * 0.75, sunSize * 0.5, 1);

      strokeWeight(weight);
      point(x, y);
    }
  }

  // Draw sun body
  fill(YELLOW);
  noStroke();
  ellipse(0, sunY, sunSize, sunSize);
}

/* TRASH */
function ballScene(sceneTime) {
  background(210, 100, 50); // blue

  translate(width / 2, height / 2);

  fill(0, 0, 100); // white
  noStroke();

  text(sceneTime.toFixed(2), 0, 0);

  rotate(sceneTime);

  const bump = sceneTime - Math.floor(sceneTime);
  // https://p5js.org/reference/#/p5/map
  const radius = map(bump, 0, 1, 0, 100);
  ellipse(0, 200, radius, radius);
}

function squareScene(sceneTime) {
  background(340, 100, 50); // purple

  translate(width / 2, height / 2);

  stroke(0, 0, 100); // white
  strokeWeight(10);
  noFill();

  // https://p5js.org/reference/#/p5/rectMode
  rectMode(CENTER);
  for (let i = 0; i < 10; i++) {
    rotate(sceneTime * 0.1);
    // https://p5js.org/reference/#/p5/scale
    scale(0.9);
    rect(0, 0, 500, 500);
  }
}

function noiseScene(sceneTime) {
  background(130, 50, 50); // green

  fill(255);
  noStroke();

  // https://p5js.org/reference/#/p5/beginShape
  beginShape();
  for (let i = 0; i < 100; i++) {
    const x = map(i, 0, 99, 0, width);
    // https://p5js.org/reference/#/p5/noise
    const y = noise(i * 0.1, sceneTime / 16) * height;
    vertex(x, y);
  }
  vertex(width, 800);
  vertex(0, 800);
  endShape(CLOSE);
}

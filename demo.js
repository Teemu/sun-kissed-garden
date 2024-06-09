audioPlayer = document.querySelector("#song");

const SKIP_START = false;
const GREEN = "#808836";
const YELLOW = "#FFBF00";
const ORANGE = "#FF9A00";
const MAROON = "#D10363";
const SCENES = [
  [growingSunScene, 18],
  [myFlowerScene, 69],
  [myGardenScene, 45],
  [myRainbowFlowerScene, 75],
];

function sceneSwitcher(demoTime) {
  let elapsedTime = 0;

  for (let i = 0; i < SCENES.length; i++) {
    let [sceneFunction, duration] = SCENES[i];
    if (demoTime >= elapsedTime && demoTime < elapsedTime + duration) {
      const sceneTime = demoTime - elapsedTime;
      sceneFunction(sceneTime);

      translate(0, 0);
      rotate(0);
      textAlign(LEFT, CENTER);
      textSize(64);
      fill(0, 0, 0);
      noStroke();
      text(sceneTime.toFixed(2), -width / 2 + 30, -height / 2 + 50);

      return;
    }
    elapsedTime += duration;
  }

  // Default case, if all scenes have been shown
  endDemo();
}

function draw() {
  const bpm = 135;
  const demoTime = (getTime() * bpm) / 60;
  const realTime = ((now() - startTime) * bpm) / 60;

  textFont("Londrina Solid");
  colorMode(HSL); // Hue (0..360), Saturation (0..100), Lightness (0..100)

  if (demoTime == 0 && SKIP_START) {
    paused = false;
    if (audioPlayer) {
      audioPlayer.play();
    }
    startTime = now() - demoTime;
    loop();
  }

  if (demoTime <= 1) {
    instructionsScene2(demoTime, realTime);
  } else {
    sceneSwitcher(demoTime);
  }
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
let metaballs = [];
let numMetaballs = 10;
let gridSize = 80; // Adjust for performance
function instructionsScene2(sceneTime, realTime) {
  background(GREEN); // background color

  if (metaballs.length === 0) {
    // Initialize the metaballs with random positions and velocities
    for (let i = 0; i < numMetaballs; i++) {
      let metaball = new Metaball(
        random(width),
        random(height),
        random(50, 200) // Adjusted radius range
      );
      metaballs.push(metaball);
    }
  }

  let d = pixelDensity();
  let pixelsW = width * d;
  let pixelsH = height * d;

  noStroke(); // Ensure no stroke for ellipses
  fill(YELLOW); // Fill color for the ellipses

  // Reduce the number of calculations by using a grid
  for (let x = 0; x < pixelsW + gridSize; x += gridSize) {
    for (let y = 0; y < pixelsH + gridSize; y += gridSize) {
      let sum = 0;
      for (let i = 0; i < metaballs.length; i++) {
        let mb = metaballs[i];
        let dx = x / d - mb.x;
        let dy = y / d - mb.y;
        let distSquared = dx * dx + dy * dy;
        sum += (mb.radius * mb.radius) / distSquared;
      }

      if (sum > 1) {
        gridMultiplier = map(sum, 1, 2, 0.1, 0.3, true);

        // Is the x and y near the text?
        let textX = width;
        let textY = height;
        let distanceToText = dist(x, y, textX, textY);
        if (
          x > textX - 1100 &&
          x < textX + 1100 &&
          y > textY - 100 &&
          y < textY + 100
        ) {
          gridMultiplier = 0;
        }

        if (sceneTime > 0) {
          // hide balls by easing gridMultiplier to 0
          gridMultiplier = mapEase(sceneTime, 0, 1, gridMultiplier, 0, true);
        }

        ellipse(
          x / d,
          y / d,
          gridSize * gridMultiplier,
          gridSize * gridMultiplier
        );
        ellipse(
          x / d,
          y / d,
          gridSize * gridMultiplier,
          gridSize * gridMultiplier
        ); // Draw small ellipses
      }
    }
  }

  // Update and draw the metaballs after drawing
  for (let i = 0; i < metaballs.length; i++) {
    metaballs[i].update();
    metaballs[i].display();
  }

  textAlign(CENTER, CENTER);
  textSize(64);
  noStroke();

  fill(YELLOW);
  // set fill color opacity to 0 when demoTime is greater than 0, easing
  let fillOpacity = mapEase(sceneTime, 0, 0.5, 1, 0, true);
  // using rgb(255, 191, 0)
  fill(255, 191, 0, fillOpacity * 255);

  // is fullscreen?
  if (!window.screenTop && !window.screenY) {
    text("Press space to start", width / 2, height / 2);
  } else {
    text("Press F to go fullscreen and space to start", width / 2, height / 2);
  }
}

// Metaball class
class Metaball {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vx = random(-2, 2) * 2;
    this.vy = random(-2, 2) * 2;
  }

  // Update the position of the metaball
  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  // Display the metaball (just as a circle for debugging)
  display() {
    //fill(MAROON); // Use MAROON color for metaballs
    //ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }
}

function myFlowerScene(sceneTime) {
  strokeWeight(2);
  background(YELLOW); // background color

  // Calculate the zoom factor and pan offsets based on sceneTime
  let zoom = map(sceneTime, 0, 60, 1, 1.4, true); // Zoom over time
  let panX = 0; //map(sceneTime, 20, 60, 0, width, true); // Pan horizontally over time
  let panY = 0; //map(sceneTime, 10, 60, 0, height, true); // Pan vertically over time

  // Apply zoom and pan
  translate(-panX, -panY);
  scale(zoom);
  translate(width / 2, height / 2);

  push();

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
      if (sceneTime < 15) {
        rotate(sceneTime * rotationSpeed);
      } else {
        rotate(
          sceneTime * rotationSpeed * mapEase(sceneTime, 15, 24, 1, 18, true)
        );
      }

      // Flower parameters
      let petalLength = 40;
      let petalWidth = 20;
      let petalCount = 6; // Number of petals

      // Calculate petal reveal progress
      let noiseNumber = noise(x * 0.01, y * 0.01);
      let revealTimer = map(sceneTime, -10, 20, 0.15, 0.5, true);
      let revealTimer2;
      if (sceneTime < 15) {
        revealTimer2 = 0;
      } else {
        revealTimer2 = map(sceneTime, 15, 30, 0, 1, true);
      }
      //let revealProgress = (sceneTime % 5) / 5; // normalize to [0, 1]
      let revealProgress = map(sceneTime, 2, 10, 0, 1);
      revealProgress = 0;
      if (sceneTime > 2) {
        // first petal
        revealProgress = 1 / petalCount;
      }
      if (sceneTime > 6) {
        // start showing petals
        revealProgress = mapEase(sceneTime, 6, 20, 0, 1, true);
      }
      if (revealProgress < 0.8) {
        petalWidth += 5 * (sceneTime % 1);
      }

      // how close the flower is to the center? as [0, 1]
      let distanceToCenter = dist(x, y, 0, 0) / (width / 2);
      // show flowers that are closer to the center first
      if (distanceToCenter > map(sceneTime, 0, 10, 0, 1, true)) {
        revealProgress = 0;
      }

      let color = 0;
      stroke(MAROON);
      fill(MAROON);
      if (noiseNumber > revealTimer) {
        if (noiseNumber > revealTimer2) {
          revealProgress = 0;
        } else {
          color = 1;
          stroke(ORANGE);
          fill(ORANGE);

          // rotate these flowers at sceneTime 45 forwards
          if (sceneTime > 30) {
            rotate(mapEase(sceneTime, 30, 60, -0, -20, true));
          }
        }
      }
      if (color == 0 && sceneTime > 30) {
        // make smaller flowers and ease them
        petalWidth = mapEase(
          sceneTime,
          30,
          60,
          petalWidth,
          petalWidth * 0.6,
          true
        );
      }
      if (color == 0 && sceneTime > 50) {
        // bigger petalLength
        petalLength = mapEase(
          sceneTime,
          50,
          60,
          petalLength,
          petalLength * 1.5,
          true
        );
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

  // After 24 seconds, start filling the screen with MAROON color
  const endFillTime = 60;
  if (sceneTime > endFillTime) {
    let fillProgress = mapEase(
      sceneTime,
      endFillTime,
      endFillTime + 10,
      0,
      1,
      true
    );
    fill(MAROON);
    noStroke();
    rect(-width, -height, width * 2, height * fillProgress);
  }
  if (sceneTime > endFillTime) {
    let fillProgress = mapEase(
      sceneTime,
      endFillTime,
      endFillTime + 10,
      0,
      1,
      true
    );
    fill(MAROON);
    noStroke();
    rect(-width, height, width * 2, -height * fillProgress);
  }

  pop();
}

function myRainbowFlowerScene(sceneTime) {
  strokeWeight(2);
  background(YELLOW); // Change background color to light blue

  // Calculate the zoom factor and pan offsets based on sceneTime
  let zoom = map(sceneTime, 0, 60, 1, 4, true); // Increase zoom effect
  let panX = 0;
  let panY = map(sceneTime, 10, 60, -height / 4, height / 4, true); // Pan vertically over time

  // Apply zoom and pan
  translate(width / 2, height / 2 - panY);
  scale(zoom);

  push();

  let rotationSpeed = 0.03; // Faster rotation speed
  rotate(sceneTime * rotationSpeed);

  stroke(ORANGE); // Change stroke color to dark blue
  fill(ORANGE);

  // Draw flowers in a grid
  for (let x = -width / 2; x <= width / 2; x += 100) {
    for (let y = (-height * 2) / 2; y <= (height * 2) / 2; y += 100) {
      push();
      translate(x, y);

      // Flower parameters
      let petalLength = 50; // Increase petal length
      let petalWidth = 25; // Increase petal width
      let petalCount = 8; // Increase number of petals

      // Calculate petal reveal progress
      let noiseNumber = noise(x * 0.01, y * 0.01);
      let revealTimer = map(sceneTime, -5, 20, 0.2, 0.6, true);
      let revealTimer2;
      if (sceneTime < 15) {
        revealTimer2 = 0;
      } else {
        revealTimer2 = map(sceneTime, 15, 30, 0, 1, true);
      }
      let revealProgress = 0;
      if (sceneTime > 2) {
        revealProgress = 1 / petalCount;
      }
      if (sceneTime > 6) {
        revealProgress = mapEase(sceneTime, 6, 20, 0, 1, true);
      }
      if (revealProgress < 0.8) {
        petalWidth += 8 * (sceneTime % 1); // Enhance pulsing effect
      }

      // Distance to center for coordinated reveal
      let distanceToCenter = dist(x, y, 0, 0) / (width / 2);
      if (distanceToCenter > map(sceneTime, 0, 10, 0, 1, true)) {
        revealProgress = 0;
      }

      let color = 0;
      stroke(GREEN);
      fill(GREEN);
      if (noiseNumber > revealTimer) {
        if (noiseNumber > revealTimer2) {
          revealProgress = 0;
        } else {
          color = 1;
          stroke(GREEN); // Change color scheme
          fill(GREEN);
        }
      }
      if (color == 0 && sceneTime > 30) {
        petalWidth = mapEase(
          sceneTime,
          30,
          60,
          petalWidth,
          petalWidth * 0.8,
          true
        );
      }
      if (color == 0 && sceneTime > 50) {
        petalLength = mapEase(
          sceneTime,
          50,
          60,
          petalLength,
          petalLength * 1.8,
          true
        );
      }

      // Draw petals
      for (let i = 0; i < petalCount; i++) {
        let angle = (TWO_PI / petalCount) * i;

        // Only draw petals up to the current reveal progress
        if (i / petalCount < 1 && revealProgress != 0) {
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
      let flowerCenter = mapEase(sceneTime, 0, 5, 0, 20, true); // Increase center size
      fill(GREEN); // Change center to white
      noStroke();
      ellipse(0, 0, flowerCenter, flowerCenter); // Increase size

      pop();
    }
  }

  // After 24 seconds, start filling the screen with DARKBLUE color
  const endFillTime = 60;
  if (sceneTime > endFillTime) {
    let fillProgress = mapEase(
      sceneTime,
      endFillTime,
      endFillTime + 10,
      0,
      1,
      true
    );
    fill(GREEN); // Change end fill color
    noStroke();
    rect(-width, -height, width * 2, height * fillProgress);
  }
  if (sceneTime > endFillTime) {
    let fillProgress = mapEase(
      sceneTime,
      endFillTime,
      endFillTime + 10,
      0,
      1,
      true
    );
    fill(GREEN);
    noStroke();
    rect(-width, height, width * 2, -height * fillProgress);
  }

  pop();
}

function drawSun(sunX, sunY, sunSize, sceneTime, sunIndex) {
  // Draw sun rays
  noFill();
  stroke(YELLOW);
  for (let i = 0; i < 20; i++) {
    let raySize = map(sceneTime, 0, 5, 0.0, 1.0, true);
    let angle = map(i, 0, 20, 0, TWO_PI);
    angle += sceneTime * 0.1;
    let x1 = cos(angle) * sunSize * 0.5 + sunX;
    let y1 = sin(angle) * sunSize * 0.5 + sunY;

    // Increase stroke weight & sunSize until it fill the whole screen with yellow
    // animated
    let extraWeight = 1;
    if (sceneTime > 9) {
      if (sunIndex == 2) {
        extraWeight = mapEase(sceneTime, 9, 11, 1, 2, true);
        if (sceneTime > 11) {
          extraWeight = mapEase(sceneTime, 11, 13, 2, 1, true);
        }
      } else {
        // make smaller raySizes easing
        //raySize *= mapEase(sceneTime, 9, 11, 1, 0.5, true);
        //sunSize *= mapEase(sceneTime, 9, 11, 1, 0.5, true);
      }
    }

    // Animate the control points for the Bezier curves
    let controlOffset = sin(sceneTime + i) * 50; // animate control points
    let controlX1 = cos(angle + 0.2) * (sunSize * 0.6 + controlOffset) + sunX;
    let controlY1 = sin(angle + 0.2) * (sunSize * 0.6 + controlOffset) + sunY;
    let controlX2 = cos(angle - 0.2) * (sunSize * 0.7 + controlOffset) + sunX;
    let controlY2 = sin(angle - 0.2) * (sunSize * 0.7 + controlOffset) + sunY;

    let x2 = cos(angle) * sunSize * raySize * 0.75 + sunX;
    let y2 = sin(angle) * sunSize * raySize * 0.75 + sunY;

    // Adjust stroke weight based on distance from the sun
    let d1 = dist(sunX, sunY, x1, y1); // distance for start point of the ray
    let d2 = dist(sunX, sunY, x2, y2); // distance for end point of the ray

    // Map distance to stroke weight (thicker closer to the sun, thinner farther away)
    let weight1 = map(d1, 0, sunSize * 0.75, 100, 1);
    let weight2 = map(d2, 0, sunSize * 0.75, 100, 1);

    for (let j = 0; j < 1; j += 0.02) {
      x = bezierPoint(x1, controlX1, controlX2, x2, j);
      let y = bezierPoint(y1, controlY1, controlY2, y2, j);

      // Calculate the interpolated distance
      let d = dist(sunX, sunY, x, y);

      // Map the interpolated distance to stroke weight
      let weight = map(
        d,
        0,
        sunSize * 0.75 * extraWeight,
        sunSize * 0.5 * extraWeight,
        1
      );

      strokeWeight(weight);
      point(x, y);
    }
  }

  // Draw sun body
  fill(YELLOW);
  noStroke();
  ellipse(sunX, sunY, sunSize, sunSize);
}

function growingSunScene(sceneTime) {
  background(GREEN); // background color
  translate(width / 2, height / 2);

  let sunSize = mapEase(sceneTime, 0, 5, 200, 600, true);

  // Sun y-position handling
  let sunPrimaryY = mapEase(sceneTime, 0, 3, -height, 0, true);

  // comes a bit later
  let sunSecondaryY = mapEase(sceneTime, 11, 14, -height, 0, true);
  // goes inside after 14 seconds
  let insideFactor = mapEase(sceneTime, 14, 16, 1, 0, true);

  // Draw three suns with different x-positions
  drawSun(
    (-width / 2.8) * insideFactor,
    sunSecondaryY,
    sunSize * 0.4,
    sceneTime,
    1
  );
  drawSun(0, sunPrimaryY, sunSize, sceneTime, 2);
  drawSun(
    (width / 2.8) * insideFactor,
    sunSecondaryY,
    sunSize * 0.4,
    sceneTime,
    3
  );

  // draw a circle that overtakes the scren after 16 seconds
  let fillProgress = mapEase(sceneTime, 12.5, 20, 0, 1, true);
  fill(YELLOW);
  noStroke();
  ellipse(0, 0, width * 2 * fillProgress, width * 2 * fillProgress);
}
function mod(n, m) {
  return ((n % m) + m) % m;
}

// Function to generate Poisson Disk samples
function poissonDiskSampling(width, height, radius, maxAttempts) {
  let k = maxAttempts || 30; // Maximum number of attempts before giving up
  let radius2 = radius * radius;
  let cellSize = radius / Math.sqrt(2);

  let gridWidth = Math.ceil(width / cellSize);
  let gridHeight = Math.ceil(height / cellSize);

  let grid = new Array(gridWidth * gridHeight);
  let active = [];
  let samples = [];

  function addSample(x, y) {
    let sample = [x, y];
    samples.push(sample);
    active.push(sample);
    let gridX = Math.floor(x / cellSize);
    let gridY = Math.floor(y / cellSize);
    grid[gridY * gridWidth + gridX] = sample;
    return sample;
  }

  // Initial sample
  let initialSample = addSample(random(width), random(height));

  while (active.length) {
    let idx = floor(random(active.length));
    let sample = active[idx];

    let found = false;
    for (let i = 0; i < k; i++) {
      let angle = random(TWO_PI);
      let r = radius * (Math.random() * 0.5 + 1);
      let x = sample[0] + r * cos(angle);
      let y = sample[1] + r * sin(angle);

      if (x >= 0 && x < width && y >= 0 && y < height) {
        let gridX = Math.floor(x / cellSize);
        let gridY = Math.floor(y / cellSize);

        let tooClose = false;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            let neighbor = grid[(gridY + i) * gridWidth + (gridX + j)];
            if (neighbor) {
              let dx = neighbor[0] - x;
              let dy = neighbor[1] - y;
              if (dx * dx + dy * dy < radius2) {
                tooClose = true;
              }
            }
          }
        }

        if (!tooClose) {
          found = true;
          addSample(x, y);
          break;
        }
      }
    }

    if (!found) {
      active.splice(idx, 1);
    }
  }

  return samples;
}

let samples = [];

function myGardenScene(sceneTime) {
  if (samples.length === 0) {
    samples = poissonDiskSampling(width, height, 200);
    samples = samples.sort(() => Math.random() - 0.5);
    // pick the sample that's closest to the center and put it first
    let closest = samples.reduce(
      (acc, cur) => {
        let d = dist(width / 2, height / 2, cur[0], cur[1]);
        return d < acc[1] ? [cur, d] : acc;
      },
      [null, Infinity]
    )[0];
    samples = samples.filter((s) => s != closest);
    samples.unshift(closest);
  }
  // randomise samples

  let numFlowers = samples.length;

  background(MAROON); // background color

  push();

  let zoom = map(sceneTime, 0, 60, 1, 1.6, true); // Zoom over time
  let panX = map(sceneTime, 0, 60, 0, 40, true); // Pan horizontally over time
  let panY = map(sceneTime, 0, 60, 0, 40, true); // Pan vertically over time

  // Apply zoom and pan
  translate(-panX, -panY);
  scale(zoom);

  let flowersToShow = floor(map(sceneTime, 1, 30, 0, numFlowers, true));
  for (let i = 0; i < flowersToShow; i++) {
    let [x, y] = samples[i];
    let flowerTime = map(i, 0, numFlowers, 0, 30); // When this flower should start appearing
    let fadeFactor = constrain(
      map(sceneTime, flowerTime, flowerTime + 1, 0, 1, sceneTime),
      0,
      1
    );

    drawFlower(x, y, fadeFactor, sceneTime);
  }

  pop();
}

// Function to draw a flower at a specific position with scale and fade-in effect
function drawFlower(x, y, fadeFactor, sceneTime) {
  push();
  translate(x, y);
  scale(fadeFactor); // Scale in-place
  tint(255, fadeFactor * 255); // Fade-in effect

  // Draw petals
  fill(YELLOW);
  noStroke();
  let petalSize = 30;

  // animate size based on sceneTime
  if (sceneTime > 0) {
    //petalSize += 5 * (sceneTime % 1);
    petalSize += 10 * sin(sceneTime + 100 * noise(x, y));
  }

  // after 40, increase petalSize until it fills the screen
  let centerSize = 1;
  let endTime = 30 + noise(x, y) * 10;
  if (sceneTime > endTime) {
    petalSize += map(sceneTime, endTime, endTime + 20, 0, 300, true);
    centerSize = map(sceneTime, endTime, endTime + 6, 1, 0, true);
  }

  // rotate
  rotate(sceneTime * noise(x, y));

  for (let i = 0; i < 6; i++) {
    let angle = (PI / 3) * i;
    ellipse(
      cos(angle) * petalSize,
      sin(angle) * petalSize,
      petalSize * 2,
      petalSize * 2
    );
  }

  // Draw center
  fill(ORANGE);
  ellipse(0, 0, petalSize * centerSize * 2, petalSize * centerSize * 2);

  pop();
}
// Function to draw leaves
function drawLeaves(x, y, level) {
  if (level == 1) {
    fill(ORANGE);
    noStroke();
    ellipse(x, y, 10, 10);
  }
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

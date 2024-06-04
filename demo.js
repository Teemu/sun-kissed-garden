function draw() {
    const bpm = 128
    const demoTime = getTime() * bpm / 60

    textFont('Londrina Solid')

    if (demoTime === 0) {
        instructionsScene(demoTime)

    } else if (demoTime < 2) {
        stickScene(demoTime)

    } else if (demoTime < 4) {
        ballScene(demoTime)

    } else if (demoTime < 6) {
        stickScene(demoTime - 4)

    } else if (demoTime < 8) {
        ballScene(demoTime)

    } else if (demoTime < 12) {
        stickScene(demoTime - 8)

    } else if (demoTime < 16) {
        ballScene(demoTime)

    } else if (demoTime < 20) {
        stickScene(demoTime - 16)

    } else {
        endDemo()

    }
}

function instructionsScene(sceneTime) {
    background('hsl(35, 100%, 50%)') // orange
    textAlign(CENTER, CENTER)
    textSize(64)
    text('Press F to go fullscreen and space to start', width/2, height/2)
}

function stickScene(sceneTime) {
    background('hsl(35, 100%, 50%)') // orange

    stroke(255)
    strokeWeight(10)
    translate(width/2, height/2)

    text(sceneTime.toFixed(2), 0, 0)

    rotate(sceneTime)
    line(0, 100, 0, 300)
}

function ballScene(sceneTime) {
    background('hsl(210, 100%, 50%)') // sky blue

    stroke(255)
    strokeWeight(10)
    translate(width/2, height/2)

    text(sceneTime.toFixed(2), 0, 0)

    rotate(sceneTime)

    const bump = sceneTime - Math.floor(sceneTime)
    const radius = map(bump, 0, 1, 0, 100)
    ellipse(0, 200, radius, radius)
}
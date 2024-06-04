function draw() {
    const demoTime = getTime()

    textFont('Londrina Solid')

    if (demoTime === 0) {
        instructionsScene(demoTime)

    } else if (demoTime < 1) {
        stickScene(demoTime)

    } else if (demoTime < 2) {
        ballScene(demoTime)

    } else if (demoTime < 3) {
        stickScene(demoTime - 2)

    } else if (demoTime < 4) {
        ballScene(demoTime)

    } else if (demoTime < 6) {
        stickScene(demoTime - 4)

    } else if (demoTime < 8) {
        ballScene(demoTime)

    } else if (demoTime < 10) {
        stickScene(demoTime - 8)

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
    ellipse(0, 200, 50, 50)
}
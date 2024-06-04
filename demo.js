function draw() {
    const time = now() - startTime

    background(255, 128, 0)
    fill(255)
    noStroke()
    const x = 200 + 100 * Math.cos(time)
    const y = 200 + 100 * Math.sin(time)
    ellipse(x, y, 50, 50)
}
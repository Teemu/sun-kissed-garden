function now() {
    return Date.now() / 1000
}

let startTime = now()
let demoTime = 0
let paused = true

window.addEventListener('keydown', (event) => {
    // F = toggle fullscreen
    if (event.key === 'f') {
        let canvas = document.querySelector('canvas')
        if (!document.fullscreenElement) {
            canvas.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }

    // Space = pause/unpause
    if (event.key === ' ') {
        if (paused) {
            paused = false
            startTime = now() - demoTime
            loop()
        } else {
            paused = true
            demoTime = now() - startTime
            noLoop()
        }
    }

    // 0 = Reset time
    if (event.key === '0') {
        startTime = now()
        demoTime = 0
        if (paused) {
            redraw()
        }
    }
})

function setup() {
    const app = createCanvas(1920, 1080)
    app.canvas.style = '' // Remove default scaling
    app.parent(document.body)

    background(0)
    noLoop()
}
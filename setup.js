function now () {
    return Date.now() / 1000
}

let startTime = now()

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

    // Space = start drawing
    if (event.key === ' ') {
        loop()
        startTime = now()
    }
})

function setup() {
    const app = createCanvas(1920, 1080)
    app.canvas.style = '' // Remove default scaling
    app.parent(document.body)

    background(0)
    noLoop()
}
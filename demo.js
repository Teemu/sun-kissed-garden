window.addEventListener('keydown', (event) => {
    if (event.key === 'f') {
        let canvas = document.querySelector('canvas')
        // Toggle fullscreen
        if (!document.fullscreenElement) {
            canvas.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }
})

function setup() {
    const app = createCanvas(1920, 1080)
    app.canvas.style = '' // Remove default scaling
    app.parent(document.body)
}

function draw() {
    background(128)
    fill(255)
    ellipse(200, 200, 50, 50)
}
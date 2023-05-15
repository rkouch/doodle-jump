document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let doodlerLeftSpace = 50
    let startPoint = 150 
    let doodlerBottomSpace = startPoint
    let isGameOver = false
    let platformCount = 5;
    let platforms = []
    let upTimerId
    let downTimerId
    let isJumping = true;

    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')

            const visual = this.visual 
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    function createPlatforms() {
        for (let i=0; i<platformCount; i++) {
            let platformGap = 600 / platformCount
            let newPlatBottom = 100 + i * platformGap
            let newPlatform = new Platform(newPlatBottom) 
            platforms.push(newPlatform)
            console.log(platforms)
        }
    }

    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function () {
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace > startPoint + 200) {
                fall()
            }
        }, 30)
    }

    function fall() {
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(function () {
            doodlerBottomSpace -= 10
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0) {
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    (doodlerLeftSpace >= platform.left - 60) &&
                    (doodlerLeftSpace <= platform.left + 85) && 
                    !isJumping
                ) {
                    console.log('landed')
                    startPoint = doodlerBottomSpace
                    jump()
                }
            })
        }, 30)
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 7
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if (platform.bottom < 10) {
                    let firstPlat = platforms[0].visual
                    firstPlat.classList.remove('platform')
                    platforms.shift()
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    function moveLeft() {
        // isGoingLeft = true
        // leftTimerId = setInterval(function() {
        //     doodlerLeftSpace -= 5
        //     doodler.style.left = doodlerLeftSpace + 'px'
        // }, 30)
        if (doodlerLeftSpace > 0) {
            doodlerLeftSpace -= 10
            doodler.style.left = doodlerLeftSpace + 'px'
        }
    }

    function moveRight() {
        if (doodlerLeftSpace < 340) {
            doodlerLeftSpace += 10
            doodler.style.left = doodlerLeftSpace + 'px'
        }
    }

    function gameOver() {
        console.log('game over')
        isGameOver = true
        while(grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = "GAME OVER"
        clearInterval(upTimerId)
        clearInterval(downTimerId)
    }

    // function control(e) {
    //     if (e.key === "ArrowLeft") {
    //         moveLeft()
    //         console.log(e.key) 
    //     } else if (e.key === "ArrowRight") {
    //         //move right
    //         moveRight()
    //     } else if (e.key === "ArrowUp") {

    //     } else {

    //     }
    // }

    function keyController(keys, repeat) {
        let timers = {}
        document.onkeydown = function(event) {
            let key = event.key
            if (!(key in keys)) {
                return true
            }
            if ('ArrowLeft' in timers && 'ArrowRight' in timers) {
                if (timers['ArrowLeft'] !== null) {
                    clearInterval(timers['ArrowLeft'])
                }
                if (timers['ArrowRight'] !== null) {
                    clearInterval(timers['ArrowRight'])
                }
            }
            if (!(key in timers)) {
                timers[key] = null
                console.log(key)
                keys[key]()
                if (repeat !== 0) {
                    timers[key] = setInterval(keys[key], repeat)
                }
            }
        }

        document.onkeyup = function(event) {
            let key = event.key
            if (key in timers) {
                if (timers[key] !== null) {
                    clearInterval(timers[key])
                }
                delete timers[key]
            }
        }
    }

    function start() {
        if (!isGameOver) {
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms, 30)
            jump()
            keyController({
                "ArrowLeft": function() {moveLeft()},
                "ArrowRight" : function() {moveRight()}
            }, 20)
        }
    }

    start()
})
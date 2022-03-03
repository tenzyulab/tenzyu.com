window.addEventListener('DOMContentLoaded', () => {
  const isTouch   = ('ontouchstart' in document)
      , downEvent = isTouch ? 'touchstart' : 'pointerdown'
      , moveEvent = isTouch ? 'touchmove'  : 'pointermove'
      , upEvent   = isTouch ? 'touchend'   : 'pointerup'

  const stage  = document.getElementById("stage")
      , guide  = document.getElementById("guide")
      , images = document.getElementsByClassName("image")

  let dx = 0, dy = 0, stageX = 0, stageY = 0
  let startX, startY, lastMove, pointerDown

  document.addEventListener('dragstart', event => event.preventDefault())

  document.addEventListener('wheel', event => {
    event.preventDefault()
    if (guide.style.opacity !== "1") guide.style.opacity = "1"
  }, { passive: false })

  document.addEventListener(downEvent, event => {
    pointerDown = true
    updateStartXY(event)
    dx = dy = 0
  })

  document.addEventListener(moveEvent, event => {
    event.preventDefault()
    if (!pointerDown) return

    if (guide.style.opacity !== '0') guide.style.opacity = '0'
    if (stage.style.pointerEvents !== 'none') stage.style.pointerEvents = 'none'
    if (stage.style.filter !== 'grayscale(0%)') stage.style.filter = 'grayscale(0%)'

    if (isTouch) {
      dx = (event.changedTouches[0].pageX - startX) * 0.25 + dx * 0.5
      dy = (event.changedTouches[0].pageY - startY) * 0.25 + dy * 0.5
    } else {
      dx = (event.pageX - startX) * 0.25 + dx * 0.5
      dy = (event.pageY - startY) * 0.25 + dy * 0.5
    }

    updateStartXY(event)
    stageX += dx
    stageY += dy
    draw()

    lastMove = Date.now()
  }, { passive: false })

  document.addEventListener(upEvent, () => {
    pointerDown = false
    if (Date.now() - lastMove < 30) window.requestAnimationFrame(inertia)
    if (stage.style.pointerEvents !== 'auto') stage.style.pointerEvents = 'auto'
  })

  function updateStartXY(event) {
    if (isTouch) {
      startX = event.changedTouches[0].pageX
      startY = event.changedTouches[0].pageY
    } else {
      startX = event.pageX
      startY = event.pageY
    }
  }

  function inertia() {
    if (0.1 >= Math.abs(dx) && 0.1 >= Math.abs(dy)) return 
    stageX += dx *= 0.975
    stageY += dy *= 0.975
    draw()
    window.requestAnimationFrame(inertia)
  }

  function draw() {
    const x = Math.round(stageX)
        , y = Math.round(stageY)
    stage.style.transform = `translate(${x}px, ${y}px)`
    for (const image of images) {
      image.style.backgroundPosition = `${-x}px ${-y}px`
    }
  }
})

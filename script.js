window.addEventListener('DOMContentLoaded', () => {
  const isTouch = ('ontouchstart' in document)
  const downEvent = isTouch ? 'touchstart' : 'pointerdown'
  const moveEvent = isTouch ? 'touchmove' : 'pointermove'
  const upEvent = isTouch ? 'touchend' : 'pointerup'
  
  const stage = document.getElementById("stage")
  const guide = document.getElementById("guide")
  const images = document.getElementsByClassName("image")

  let dx = 0, dy = 0
  let stageX = 0, stageY = 0
  let startX, startY, lastMove, pointerDown

  document.addEventListener('dragstart', (event) => {
    event.preventDefault()
  })

  document.addEventListener('wheel', (event) => {
    if (guide.style.opacity !== "1") guide.style.opacity = "1"
    event.preventDefault()
  }, {
    passive: false
  })
  
  document.addEventListener(downEvent, (event) => {
    pointerDown = true
    updateStartXY(event)
    dx = dy = 0
  })

  document.addEventListener(moveEvent, (event) => {
    if (!pointerDown) return

    if (stage.style.pointerEvents !== 'none') stage.style.pointerEvents = 'none'
    if (stage.style.filter !== 'grayscale(0%)') stage.style.filter = 'grayscale(0%)'
    if (guide.style.opacity !== '0') guide.style.opacity = '0'

    const calcX = isTouch ? event.changedTouches[0].pageX - startX: event.pageX - startX
    const calcY = isTouch ? event.changedTouches[0].pageY - startY: event.pageY - startY

    dx = calcX * 0.25 + dx * 0.5
    dy = calcY * 0.25 + dy * 0.5
    stageX += dx
    stageY += dy
    updateStartXY(event)
 
    onUpdate()
    lastMove = Date.now()
    event.preventDefault()
  }, {
    passive: false
  })

  document.addEventListener(upEvent, () => {
    pointerDown = false
    if (Date.now() - lastMove < 30) inertia()
    if (stage.style.pointerEvents !== 'auto') stage.style.pointerEvents = 'auto'
  })

  function updateStartXY(event) {
    startX = isTouch ? event.changedTouches[0].pageX : event.pageX
    startY = isTouch ? event.changedTouches[0].pageY : event.pageY
  }

  function inertia() {
    if (0.1 >= Math.abs(dx) && 0.1 >= Math.abs(dy)) return 
    stageX += dx *= 0.975
    stageY += dy *= 0.975
    onUpdate()
    window.requestAnimationFrame(inertia)
  }

  function onUpdate() {
    const x = Math.round(stageX)
    const y = Math.round(stageY)
    stage.style.transform = `translate(${x}px, ${y}px)`
    for (const image of images) {
      image.style.backgroundPosition = `${-x}px ${-y}px`
    }
  }
})

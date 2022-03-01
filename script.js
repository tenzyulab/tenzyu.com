window.addEventListener('DOMContentLoaded', () => {
  const isTouch = ('ontouchstart' in document);
  const downEvent = isTouch ? 'touchstart' : 'pointerdown';
  const moveEvent = isTouch ? 'touchmove' : 'pointermove';
  const upEvent = isTouch ? 'touchend' : 'pointerup';

  let stageX = 0;
  let stageY = 0;
  let dx = 0;
  let dy = 0;
  let startX, startY, lastMove, pointerDown;

  const stage = document.getElementById("stage");
  const images = document.getElementsByClassName("image");
  const guide = document.getElementById("guide");

  onUpdate();

  document.addEventListener('dragstart', (event) => {
    event.preventDefault();
  });

  document.addEventListener('wheel', (event) => {
    guide.style.opacity = "1";
    event.preventDefault();
  }, {
    passive: false
  });


  document.addEventListener(downEvent, (event) => {
    pointerDown = true;
    startX = isTouch ? event.changedTouches[0].pageX : event.pageX;
    startY = isTouch ? event.changedTouches[0].pageY : event.pageY;
    dx = dy = 0;
  });


  document.addEventListener(moveEvent, (event) => {
    if (!pointerDown) return;

    stage.style.pointerEvents = "none";
    guide.style.opacity = "0";

    const calcX = isTouch ? event.changedTouches[0].pageX - startX: event.pageX - startX;
    const calcY = isTouch ? event.changedTouches[0].pageY - startY: event.pageY - startY;

    dx = calcX * 0.25 + dx * 0.5;
    dy = calcY * 0.25 + dy * 0.5;
    stageX += dx;
    stageY += dy;
    startX = isTouch ? event.changedTouches[0].pageX : event.pageX;
    startY = isTouch ? event.changedTouches[0].pageY : event.pageY;
 
    onUpdate();
    lastMove = Date.now();
    event.preventDefault();
  }, {
    passive: false
  });


  document.addEventListener(upEvent, () => {
    pointerDown = false;
    if (Date.now() - lastMove < 30) {
      inertia();
    }
    if (stage.style.pointerEvents === "none") {
      stage.style.pointerEvents = "auto";
    }
  });

  function inertia() {
    if (0.1 <= Math.abs(dx) || 0.1 <= Math.abs(dy)) {
      dx *= 0.975;
      dy *= 0.975;
      stageX += dx;
      stageY += dy;
      onUpdate();
      window.requestAnimationFrame(inertia);
    }
  }

  function onUpdate() {
    stage.style.transform = "translate(" + Math.round(stageX) + "px, " + Math.round(stageY) + "px)"; // 原点＝消失点
    for (let i = 0; i < images.length; i++) {
      images[i].style.backgroundPosition = `${-Math.round(stageX)}px ${-Math.round(stageY)}px`;
    }
  }
});

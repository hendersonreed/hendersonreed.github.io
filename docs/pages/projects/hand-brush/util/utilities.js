let bannerElement; // we want to have a banner to present an intro message to the viewer
let myCanvas;
let started = false;
let backgroundColor = 250;

// element positioning utilities
function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  myCanvas.position(x, y);
}

function positionBanner() {
  bannerElement.position((windowWidth - bannerElement.width) / 2, (windowHeight - bannerElement.height) / 2);
}

// a useful setup function for 99% of the work we want to do with this template.
function standardSetup(helpHTML) {
  noLoop();
  background(backgroundColor);

  myCanvas = createCanvas(640, 480); // 640x480 is hardcoded as our video resolution also
  myCanvas.id('myCanvas');
  centerCanvas();

  bannerElement = createElement('div', helpHTML);
  bannerElement.id('banner');
  positionBanner();

  // space triggers the sketch actually starting,
  // and hiding/showing the banner
  document.addEventListener('keypress', (event) => {
    if (event.key == ' ') {
      if (!started) {
        started = true;
        camera.start(); // camera is defined/setup in detections.js
        loop();
      }
      if (bannerElement.style('display') === 'flex') {
        bannerElement.style('display', 'none');
      }
      else {
        bannerElement.style('display', 'flex');
      }
    }
  });

  // ? brings back the banner/help page.
  document.addEventListener('keypress', (event) => {
    if (event.key == '?') {
    }
  });
}

function windowResized() {
  centerCanvas();
  positionBanner();
}

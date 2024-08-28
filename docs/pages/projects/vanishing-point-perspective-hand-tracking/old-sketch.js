let bannerElement;
let myCanvas;
let started = false;

function setup() {
  noLoop(); // saves us a bunch of error messages from running too fast before the video is done loading.
  background(220);

  myCanvas = createCanvas(640, 480);
  myCanvas.id('myCanvas');
  centerCanvas();

  bannerElement = createElement('div', 'Click to start. Click anywhere on the canvas (as many times as you like) and then wave your hands around. Refresh the page to clear your anchor points.');
  bannerElement.id('banner');
  positionBanner();
}

function windowResized() {
  centerCanvas();
  positionBanner();
}

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  myCanvas.position(x, y);
}

function positionBanner() {
  let bannerWidth = windowWidth * 0.4;
  let bannerHeight = windowHeight * 0.2;
  bannerElement.size(bannerWidth, bannerHeight);
  bannerElement.position((windowWidth - bannerWidth) / 2, (windowHeight - bannerHeight) / 2);
}

document.addEventListener('click', () => {
  if (!started) {
    started = true;
    bannerElement.remove();
    loop();
  }
});

/////////////////////////////////////////////////////////
//                   end of template                   //
// below this line is where the fun/weird stuff begins //
/////////////////////////////////////////////////////////

let horizonPoints = []

function mouseClicked() {
  if (started) {
    horizonPoints.push({ x: mouseX, y: mouseY });
  }
}

class Point {
  constructor(x, y) {
    Object.defineProperties(this, {
      creationFrame: {
        value: frameCount,
        writable: false,
        enumerable: true
      },
      x: {
        value: x,
        writable: false,
        enumerable: true
      },
      y: {
        value: y,
        writable: false,
        enumerable: true
      },
      hue: {
        value: random(150, 250),
        writable: false,
        enumerable: true
      }
    });
  }
}

function drawLines(point, opacity) {
  horizonPoints.forEach((each) => {
    push();
    colorMode(HSB);
    strokeWeight(2.5);
    stroke(point.hue, 50, 100, opacity);
    //stroke(random(0, 360), 100, 100, opacity);
    line(each.x, each.y, width - point.x, point.y);
    pop();
  });
}


const MAX_AGE = 60;
let pastPoints = []

/*
function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}
*/

function updateAndDrawPoints(points) {
  // Use filter to remove old points and create a new array
  points = points.filter(point => {
    const age = frameCount - point.creationFrame;
    return age < MAX_AGE;
  });

  // Draw remaining points with mapped opacity
  points.forEach(point => {
    const age = frameCount - point.creationFrame;
    const normalized_age = 1 - age / MAX_AGE; // Normalize age to 0-1 range
    //const eased = easeOutQuad(t); // Apply easing function
    const opacity = map(normalized_age, 0, 1, 0, 100); // Map to 0-100 range for HSB
    drawLines(point, opacity);
  });

  return points; // Return the updated array
}

function draw() {
  background(220);
  if (detections != undefined && detections.multiHandLandmarks != undefined && detections.multiHandLandmarks.length != 0) {
    detections.multiHandLandmarks.forEach((each) => {
      pastPoints.push(new Point(each[4].x * width, each[4].y * height));
    });
  }
  updateAndDrawPoints(pastPoints);
}

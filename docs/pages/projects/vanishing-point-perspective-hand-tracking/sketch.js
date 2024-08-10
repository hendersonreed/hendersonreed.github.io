let bannerElement;
let myCanvas;
let started = false;

function setup() {
  noLoop(); // saves us a bunch of error messages from running too fast before the video is done loading.
  background(220);

  myCanvas = createCanvas(640, 480);
  myCanvas.id('myCanvas');
  centerCanvas();

  bannerElement = createElement('div', 'Hit space to start. Click anywhere on the canvas (as many times as you like) and then wave your hands around. Hitting space again clears all points.');
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

document.addEventListener('keypress', (event) => {
  if (event.key == ' ') {
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
document.addEventListener('keypress', (event) => {
  if (event.key == ' ') {
    horizonPoints = [];
  }
});

function mouseClicked() {
  if (started) {
    horizonPoints.push({ x: mouseX, y: mouseY });
  }
}

/*
function drawTealCircle(x, y) {
  push();
  fill(66, 245, 242);  // Teal color
  noStroke();
  circle(x, y, 10);
  pop();
}
*/

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
      }
    });
  }
}

function drawTealLines(point, opacity) {
  horizonPoints.forEach((each) => {
    push();
    //fill(66, 245, 242, opacity);  // Teal color
    //noStroke();
    stroke(66, 245, 245, opacity);
    line(each.x, each.y, width - point.x, point.y);
    pop();
  });
}

const MAX_AGE = 120; // Assuming 120 frames as the threshold, adjust as needed
let pastPoints = []

function updateAndDrawPoints(points) {
  // Use filter to remove old points and create a new array
  points = points.filter(point => {
    const age = frameCount - point.creationFrame;
    return age < MAX_AGE;
  });

  // Draw remaining points with mapped opacity
  points.forEach(point => {
    const age = frameCount - point.creationFrame;
    const opacity = map(age, 0, MAX_AGE, 255, 0);
    drawTealLines(point, opacity);
  });

  return points; // Return the updated array
}

function draw() {
  background(220);
  if (detections != undefined && detections.multiHandLandmarks != undefined && detections.multiHandLandmarks.length != 0) {
    detections.multiHandLandmarks.forEach((each) => {
      pastPoints.push(new Point(each[4].x * width, each[4].y * height));
      /*
      pastPoints.push(new Point(each[8].x * width, each[8].y * height));
      pastPoints.push(new Point(each[16].x * width, each[16].y * height));
      pastPoints.push(new Point(each[20].x * width, each[20].y * height));
      */
    });
  }
  updateAndDrawPoints(pastPoints);
}

backgroundColor = 0;

function setup() {
  helpMsg = `
<p>welcome.
  <ul>
    <li>click to start.</li>
    <li>clicking further will add more horizon points.</li>
  </ul>
</p>
`
  keylessSetup(helpMsg);
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

let pastPoints = []
let horizonPoints = []
function mouseClicked() {
  if (started) {
    horizonPoints.push({ x: width - mouseX, y: mouseY });
  }
}


function draw() {
  background(backgroundColor);
  if (detections != undefined && detections.multiHandLandmarks != undefined && detections.multiHandLandmarks.length != 0) {
    detections.multiHandLandmarks.forEach((each) => {
      pastPoints.push(new Point(each[4].x * width, each[4].y * height));
    });
  }
  updateAndDrawPoints(pastPoints);
}

const MAX_AGE = 60;

function updateAndDrawPoints(points) {
  // Use filter to remove old points and create a new array
  points = points.filter(point => {
    const age = frameCount - point.creationFrame;
    return age < MAX_AGE;
  });

  // Draw remaining points with opacity mapped to age
  points.forEach(point => {
    const age = frameCount - point.creationFrame;
    const normalized_age = 1 - age / MAX_AGE; // Normalize age to 0-1 range
    //const opacity = map(normalized_age, 0, 1, 0, 100);
    //console.log(opacity)
    //drawLines(point, opacity);
    drawLines(point, normalized_age);
  });

  return points; // Return the updated array
}

function drawLines(point, opacity) {
  horizonPoints.forEach((each) => {
    push();
    colorMode(HSB);
    strokeWeight(2.5);
    stroke(point.hue, 50, 100, opacity);
    line(each.x, each.y, point.x, point.y);
    pop();
  });
}


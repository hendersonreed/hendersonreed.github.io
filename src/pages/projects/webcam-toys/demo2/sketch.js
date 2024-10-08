let mode = "transparent";
let color = "teal";

function setup() {
  colorMode(HSB);
  helpMsg = `
<p>welcome.
  <ul>
    <li>click to start</li>
  </ul>
</p>
`
  keylessSetup(helpMsg);
}

/* The `detections.multiHandLandmarks` array looks like this:
 * [ [ {x: 0.923, y:0.457, z: 0.103}, {x: 0.323, y:0.127, z: 0.012}, {x: 0.183, y:0.877, z: 0.003} ] ]
 * where each inner array represents a single recognized hand (each hand being an array of objects that
 * represent the landmarks outlined here:
 * https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker#models
 */
function draw() {
  if (mode == "transparent") {
    clear();
  }
  else {
    background(backgroundColor);
  }

  if (detections != undefined && detections.multiHandLandmarks != undefined && detections.multiHandLandmarks.length != 0) {
    detections.multiHandLandmarks.forEach((each) => {
      let thumb = each[4];
      let forefinger = each[8];
      each.forEach((point) => {

        let thumbLocation = { x: thumb.x * width, y: thumb.y * height }
        let fingerLocation = { x: forefinger.x * width, y: forefinger.y * height }
        let midPoint = getMidpoint(thumbLocation, fingerLocation);
        let distance = dist(thumbLocation.x, thumbLocation.y, fingerLocation.x, fingerLocation.y);

        drawCircle(midPoint.x, midPoint.y, distance);
        drawTextMirrored(`${int(distance)}`, midPoint.x, midPoint.y);
      });
    });
  }
}

document.addEventListener('keypress', (event) => {
  if (event.key == 't') {
    toggleTransparency();
  }
  if (event.key == 'c') {
    toggleColor();
  }
});

function toggleTransparency() {
  if (mode == "transparent") {
    mode = "opaque";
  }
  else {
    mode = "transparent";
  }
}

function toggleColor() {
  if (color == "teal") {
    color = "full";
  }
  else {
    color = "teal";
  }
}

function drawTextMirrored(content, x, y) {
  push();
  scale(-1, 1); // Flip horizontally
  text(content, -x - textWidth(content), y); // Adjust x by subtracting text width
  pop();
}

function getMidpoint(point1, point2) {
  let midpointX = (point1.x + point2.x) / 2;
  let midpointY = (point1.y + point2.y) / 2;

  return { x: midpointX, y: midpointY };
}

function drawCircle(x, y, r) {
  push();
  noStroke();
  if (color == "teal") {
    fill(200, 100, 100);  // Teal color
  }
  else {
    fill(map(r, 0, 200, 0, 360), 100, 100);
  }
  circle(x, y, r);
  pop();
}

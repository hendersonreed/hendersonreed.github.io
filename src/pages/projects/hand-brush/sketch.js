let circleColor = 66;

function setup() {
  helpMsg = `
<p>welcome.
  <ul>
    <li>hit space to start and toggle this help page.</li>
    <li>hit c to pick a random color.</li>
    <li>hit r to clear the canvas.</li>
  </ul>
</p>
`
  standardSetup(helpMsg);
  colorMode(HSB);
  background(backgroundColor);
}

/* The `detections.multiHandLandmarks` array looks like this:
 * [ [ {x: 0.923, y:0.457, z: 0.103}, {x: 0.323, y:0.127, z: 0.012}, {x: 0.183, y:0.877, z: 0.003} ] ]
 * where each inner array represents a single recognized hand (each hand being an array of objects that
 * represent the landmarks outlined here:
 * https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker#models
 */
function draw() {
  //background(backgroundColor);
  if (detections != undefined && detections.multiHandLandmarks != undefined && detections.multiHandLandmarks.length != 0) {
    detections.multiHandLandmarks.forEach((each) => {
      each.forEach((point) => {
        drawCircle(point.x * width, point.y * height);
      });
    });
  }
}

function drawCircle(x, y) {
  push();
  fill(circleColor, 245, 242);  // Teal color
  noStroke();
  circle(x, y, 10);
  pop();
}

document.addEventListener('keypress', (event) => {
  if (event.key == 'c') {
    circleColor = random(0, 255);
  }
});

document.addEventListener('keypress', (event) => {
  if (event.key == 'r') {
    background(backgroundColor);
  }
});

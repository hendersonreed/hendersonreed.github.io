let img;
let sound;

function preload() {
  img = loadImage('scene.webp');
  sound = loadSound("bubbling.mp3");
  sound.setLoop(true);
}

const TRANSPARENCY = 150; // You can adjust this value (0-255)
function setup() {
  createCanvas(img.width, img.height);
  img.loadPixels();

  for (let i = 3; i < img.pixels.length; i += 4) {
    img.pixels[i] = TRANSPARENCY;
  }

  img.updatePixels();
  myCanvas = createCanvas(640, 480); // 640x480 is hardcoded as our video resolution also
  myCanvas.id('myCanvas');
  centerCanvas();

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

let bubbles = [];
let bubbleChance = 0.63;

function draw() {
  clear();
  if (detections != undefined && detections.multiFaceLandmarks != undefined && detections.multiFaceLandmarks.length != 0) {
    // faces are detected
    detections.multiFaceLandmarks.forEach((face) => {
      // looping through all the faces detected:

      let lowLip = face[14];
      let upLip = face[13];

      if (upLip != undefined && lowLip != undefined && dist(upLip.x, upLip.y, lowLip.x, lowLip.y) > 0.01) {
        // time to draw some bubbles

        if (!sound.isPlaying()) {
          sound.loop();
          console.log("would be playing");
        }

        let newPoints = [
          face[14],
          face[87],
          face[317]
        ];

        newPoints.forEach((point) => {
          if (point != undefined) {
            if (random() < bubbleChance) {
              bubbles.push(createBubble(point.x * width, point.y * height));
            }
          }
        });
      }
      else {
        sound.stop();
      }
    });
  }

  image(img, 0, 0);
  drawBubbles();
}

let buoyancy = -10; // Negative value for upward movement
let waveAmplitude = 0.5; // Amplitude of the side-to-side motion
let waveFrequency = 0.5; // Frequency of the side-to-side motion

function drawBubbles() {
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let bub = bubbles[i];

    // Calculate side-to-side movement using sine wave
    let sideMotion = sin((frameCount * waveFrequency) + (bub.offset)) * waveAmplitude;
    bub.x += sideMotion;

    push();
    noStroke();
    fill(66, 245, 242, 80);  // Teal color
    circle(bub.x + sideMotion, bub.y, bub.bubble_size);
    pop();

    // Update bubble position
    bub.y += bub.bubble_size / 4 * -1

    if (bub.y < 0) { // Check if bubble has moved off the top of the canvas
      bubbles.splice(i, 1);
    }
  }
}

// Function to create a new bubble
function createBubble(x, y) {
  return {
    x: x,
    y: y,
    offset: random(TWO_PI), // Random offset for varied starting positions in the sine wave
    bubble_size: random(10, 30),
  };
}

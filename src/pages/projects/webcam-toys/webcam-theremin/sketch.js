function setup() {
  helpMsg = `
<p>welcome.
  <ul>
    <li>click to start</li>
  </ul>
</p>
`
  keylessSetup(helpMsg);
}

document.addEventListener('click', () => {
  Tone.start()
  // Create a lowpass filter with a cutoff frequency of 1000 Hz
  let lowpassFilter = new Tone.Filter({
    type: 'lowpass',
    frequency: 1000, // Adjust this value to set the cutoff frequency
  });

  // Connect your audio source to the lowpass filter
  synth = new Tone.AMSynth();
  synth.connect(lowpassFilter).toDestination();

  synth.volume.value = -999;
  synth.triggerAttack("C4");
});

/* The `detections.multiHandLandmarks` array looks like this:
 * [ [ {x: 0.923, y:0.457, z: 0.103}, {x: 0.323, y:0.127, z: 0.012}, {x: 0.183, y:0.877, z: 0.003} ] ]
 * where each inner array represents a single recognized hand (each hand being an array of objects that
 * represent the landmarks outlined here:
 * https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker#models
 */
function draw() {
  if (detections != undefined && detections.multiHandLandmarks != undefined && detections.multiHandLandmarks.length != 0) {
    let left = [];
    let right = [];
    console.trace(detections.multiHandLandmarks);

    detections.multiHandedness.forEach((hand) => {
      // Check if the hand is labeled as "Left"
      if (hand.label === "Left") {
        // Find the corresponding landmarks for the left hand using its index
        left = detections.multiHandLandmarks[hand.index];
      }
      // Check if the hand is labeled as "Right"
      else if (hand.label === "Right") {
        // Find the corresponding landmarks for the right hand using its index
        right = detections.multiHandLandmarks[hand.index];
      }
    });

    // after this, left and right *may* be undefined, but they will at least (mostly) be correct.
    if (left != undefined) {
      let thumb = left[4];
      let forefinger = left[8];
      if (thumb != undefined && forefinger != undefined) {
        drawCircleAtMark(thumb);
        drawCircleAtMark(forefinger);
        drawLine(thumb, forefinger);
        let volumeDistance = calculateEuclideanDistance(thumb, forefinger);
        synth.volume.value = (volumeDistance * 100) > 3 ? map(volumeDistance, 0.01, 0.50, -20, 40) : -999;
      }
    }

    if (right != undefined) {
      let thumb = right[4];
      let forefinger = right[8];
      if (thumb != undefined && forefinger != undefined) {
        drawCircleAtMark(thumb);
        drawCircleAtMark(forefinger);
        drawLine(thumb, forefinger);
        let pitchDistance = calculateEuclideanDistance(thumb, forefinger);
        synth.frequency.value = map(pitchDistance, 0.01, 0.51, 110, 440);
      }
    }


    // mute synth if either or both hand is missing from the detections array.
    if (detections.multiHandLandmarks.length < 2) {
      synth.volume.value = -999;
    }
  }
}

function calculateEuclideanDistance(one, two) {
  return dist(one.x, one.y, two.x, two.y); // two dimensions is enough after all.
}

function drawCircleAtMark(mark) {
  push();
  fill(66, 245, 242);  // Teal color
  noStroke();
  circle(mark.x * width, mark.y * height, 10);
  pop();
}

function drawLine(mark1, mark2) {
  push();
  // Style the line.
  stroke('magenta');
  strokeWeight(2);

  line(mark1.x * width, mark1.y * height, mark2.x * width, mark2.y * height);
  pop();
}

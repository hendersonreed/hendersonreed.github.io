let synth;

function setup() {
}

function mouseClicked() {
  let modal = document.getElementById('modal');
  if (modal != undefined) {
    modal.style.display = "none";
  }
  synth = new Tone.AMSynth().toDestination();
  synth.volume.value = -100;
  const now = Tone.now()
  synth.triggerAttack("C4", now)
}

function draw() {
  if (detections != undefined && synth != undefined) {
    if (detections.multiHandLandmarks != [] && detections.multiHandedness) {
      let left = [];
      let right = [];

      // Iterate through multiHandedness array to identify left and right hands
      detections.multiHandedness.forEach(hand => {
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
        let volumeDistance = calculateEuclideanDistance(thumb, forefinger);
        synth.volume.value = map(volumeDistance, 0.01, 0.50, -40, 20);
      }
      else { synth.volume.value = -100; }

      if (right != undefined) {
        let thumb = right[4];
        let forefinger = right[8];
        let pitchDistance = calculateEuclideanDistance(thumb, forefinger);
        synth.frequency.value = map(pitchDistance, 0.01, 0.51, 440, 880);
      }
      else { synth.volume.value = -100; }
    }
  }
}

function calculateEuclideanDistance(one, two) {
  if (one != undefined && two != undefined) {
    //return dist(one.x, one.y, one.z, two.x, two.y, two.z);
    return dist(one.x, one.y, two.x, two.y);
  }
  return 0;
}

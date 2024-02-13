let synth;

function setup() {
}

// set everything up on mouseclick
function mouseClicked() {
  let modal = document.getElementById('modal');
  if (modal != undefined) {
    modal.style.display = "none";
  }

  // Create a lowpass filter with a cutoff frequency of 1000 Hz
  let lowpassFilter = new Tone.Filter({
    type: 'lowpass',
    frequency: 1000, // Adjust this value to set the cutoff frequency
  });

  // Connect your audio source to the lowpass filter
  synth = new Tone.AMSynth();
  synth.connect(lowpassFilter);

  // Connect the lowpass filter to your destination (e.g., speakers)
  lowpassFilter.toDestination();

  synth.volume.value = -999;
  const now = Tone.now()
  synth.triggerAttack("C4", now)
}

// update synth frequency and volume every tick
function draw() {
  if (detections != undefined && synth != undefined && detections.multiHandedness != undefined) {
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

      // this doesn't seem to be working currently, but can't quite work out *why*.
    });

    // after this, left and right *may* be undefined, but they will at least (mostly) be correct.
    if (left != undefined) {
      let thumb = left[4];
      let forefinger = left[8];
      let volumeDistance = calculateEuclideanDistance(thumb, forefinger);
      synth.volume.value = map(volumeDistance, 0.01, 0.50, 0, 40);
    }

    if (right != undefined) {
      let thumb = right[4];
      let forefinger = right[8];
      let pitchDistance = calculateEuclideanDistance(thumb, forefinger);
      synth.frequency.value = map(pitchDistance, 0.01, 0.51, 110, 440);
    }

    // mute synth if either or both hand is missing from the detections array.
    if (detections.multiHandLandmarks.length < 2) {
      synth.volume.value = -999;
    }
  }
}

function calculateEuclideanDistance(one, two) {
  if (one != undefined && two != undefined) {
    //return dist(one.x, one.y, one.z, two.x, two.y, two.z);
    return dist(one.x, one.y, two.x, two.y); // two dimensions is enough after all.
  }
  return 0;
}

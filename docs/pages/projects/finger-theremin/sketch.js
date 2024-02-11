let synth;
let bannerElement;

function setup() {
  //canvas = createCanvas(640, 480);
  bannerElement = createElement('div', 'Click to begin finger theremin!');
  bannerElement.id('banner');
  bannerElement.style('background-color', '#333');
  bannerElement.style('color', 'white');
  bannerElement.style('padding', '20px');
  bannerElement.style('text-align', 'center');
  bannerElement.position(0, windowHeight / 2);
  bannerElement.size(windowWidth, 100);
  document.body.appendChild(bannerElement.elt)
}

function mouseClicked() {
  document.body.removeChild(bannerElement.elt);
  synth = new Tone.Synth().toDestination();
  synth.volume.value = -100;
  const now = Tone.now()
  synth.triggerAttack("C4", now)
}

function draw() {
  if (detections != undefined && synth != undefined) {
    if (detections.multiHandLandmarks != undefined) {
      if (detections.multiHandLandmarks[0] != undefined) {
        let thumb = detections.multiHandLandmarks[0][4];
        let forefinger = detections.multiHandLandmarks[0][8];
        let volumeDistance = calculateEuclideanDistance(thumb, forefinger);
        synth.volume.value = map(volumeDistance, 0.0, 0.5, -10, 10);
        console.log(synth.volume.value);
      }
      if (detections.multiHandLandmarks[1] != undefined) {
        let thumb = detections.multiHandLandmarks[0][4];
        let forefinger = detections.multiHandLandmarks[0][8];
        let pitchDistance = calculateEuclideanDistance(thumb, forefinger);
        synth.frequency.value = map(pitchDistance, 0.0, 0.5, 440, 880);
        console.log(synth.frequency.value);
      }
    }
  }
}

function calculateEuclideanDistance(one, two) {
  if (one != undefined && two != undefined) {
    return dist(one.x, one.y, one.z, two.x, two.y, two.z);
  }
  return 0;
}

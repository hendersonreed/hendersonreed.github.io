let state;

let aNaturalMinorScale = ['A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'];
let aDorianScale = ['A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5', 'A5', 'B5', 'C6'];
let aAeolianScale = ['A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'];
let aPhrygianScale = ['A4', 'Bb4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'Bb5', 'C6'];
let aMelodicMinorScale = ['A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G#5', 'A5', 'B5', 'C6'];
let aPentatonicMinorScale = ['A4', 'C5', 'D5', 'E5', 'G5', 'A5', 'C6', 'D6', 'E6', 'G6'];
// 10 notes each (to work with qwertyuiop for selection)

const reverb = new Tone.Reverb();
const filter = new Tone.Filter(1500, "lowpass", -12);

function newInstrument(key) {
	switch (key) {
		case 1: return new Tone.MembraneSynth().connect(reverb).connect(filter).toDestination();
		case 2: return new Tone.PluckSynth().connect(reverb).connect(filter).toDestination();
		case 3: return new Tone.AMSynth().connect(reverb).connect(filter).toDestination();
		case 4: return new Tone.DuoSynth().connect(reverb).connect(filter).toDestination();
		case 5: return new Tone.MetalSynth().connect(reverb).connect(filter).toDestination();
		default: return new Tone.Synth().connect(reverb).connect(filter).toDestination();
	}
}

function preload() {
	state = {
		// config items:
		threshold: 45, // lower means more notes
		maxThreshold: 75,
		noteLengths: ["8n"],
		pointSize: 10,
		colors: [
			[23, 230, 226],
			[68, 207, 238],
			[201, 235, 30],
			[255, 39, 10],
			[22, 216, 223],
			[23, 230, 226],
			[68, 207, 238],
			[201, 235, 30],
			[255, 39, 10],
			[22, 216, 223],
		],
		// don't mess below here if you dare.
		canvas: undefined,
		media: undefined,
		scaleSelect: undefined,
		thresholdSlider: undefined,
		points: [],
		audioRunning: false,
		instruments: [new Tone.Synth().toDestination()],
		selectedInstrument: 0,
		selectedNote: 0,
	}

	state.media = createCapture(VIDEO, () => {
		state.canvas = createCanvas(state.media.width, state.media.height);
	});
	state.media.hide();

	state.thresholdSlider = createSlider(0, 255, state.threshold, 0);

	state.scaleSelect = createSelect();
	state.scaleSelect.option('aNaturalMinorScale', aNaturalMinorScale);
	state.scaleSelect.option('aPentatonicMinorScale', aPentatonicMinorScale);
	state.scaleSelect.option('aDorianScale', aDorianScale);
	state.scaleSelect.option('aAeolianScale', aAeolianScale);
	state.scaleSelect.option('aPhrygianScale', aPhrygianScale);
	state.scaleSelect.option('aMelodicMinorScale', aMelodicMinorScale);
}

let initialized = false;
document.addEventListener("click", () => {
	if (!initialized) {
		toggleHelpPage();
		initialized = true;
		state.audioRunning = true;
		Tone.start();
	}
});


document.addEventListener("keypress", (event) => {
	if (event.key === "?") {
		toggleHelpPage();
	}
	if (event.key === "x") { // clear all the points
		state.points = []
	}
	if (event.key === "d") {
		deleteNote();
	}

	changeInstrumentIfNeeded(event.key);
	addPointIfNeeded(event.key);
});

function toggleHelpPage() {
	let modal = document.getElementById("modal");
	if (modal.style.display === "none") {
		modal.style.display = "block";
	} else {
		modal.style.display = "none";
	}
}

function addPointIfNeeded(key) {
	function addPoint() {
		let newPoint = {
			instrument: newInstrument(),
			pointColor: state.colors[state.selectedInstrument],
			x: mouseX,
			y: mouseY,
			note: state.scaleSelect.value().split(",")[state.selectedNote],
			pastColors: [],
			colors: [],
		}
		state.points.push(newPoint);
	}

	// this function changes the note based on the key that's hit
	// and adds the point
	switch (key) {
		case 'q':
			state.selectedNote = 0;
			addPoint();
			break;
		case 'w':
			state.selectedNote = 1;
			addPoint();
			break;
		case 'e':
			state.selectedNote = 2;
			addPoint();
			break;
		case 'r':
			state.selectedNote = 3;
			addPoint();
			break;
		case 't':
			state.selectedNote = 4;
			addPoint();
			break;
		case 'y':
			state.selectedNote = 5;
			addPoint();
			break;
		case 'u':
			state.selectedNote = 6;
			addPoint();
			break;
		case 'i':
			state.selectedNote = 7;
			addPoint();
			break;
		case 'o':
			state.selectedNote = 8;
			addPoint();
			break;
		case 'p':
			state.selectedNote = 9;
			addPoint();
			break;
	}
}

function changeInstrumentIfNeeded(key) {
	const newInstrument = new RegExp("[0-9]");
	if (newInstrument.test(key)) {
		state.selectedInstrument = Number(key);
	}
}

function deleteNote() {
	/* locate the point nearest to the current mouse
	 * if it's within state.pointSize distance, then we should remove
	 * from state.points.
	 */
	function euclideanDistance2D(x1, y1, x2, y2) {
		return Math.sqrt(
			Math.pow(x1 - x2, 2) +
			Math.pow(y1 - y2, 2)
		);
	}

	state.points.forEach((item, index, array) => {
		if (euclideanDistance2D(mouseX, mouseY, item.x, item.y) < state.pointSize) {
			array.splice(index, 1);
		}
	});
}




// this is the only real p5.js code, and it handles the event loop and drawing on the canvas,
// checking colors, and triggering tone.js notes if needed.
function draw() {
	function drawAndCheckPoints() {
		function drawPoint(point) {
			let fillColor = color([...point.pointColor, 100]);
			let strokeColor = color([...point.pointColor, 255]);
			fill(fillColor);
			stroke(strokeColor);
			strokeWeight(2);
			ellipse(point.x, point.y, state.pointSize, state.pointSize);
		}

		state.points.forEach((point) => {
			point.pastColors = point.colors;
			point.colors = get(point.x, point.y);
			drawPoint(point);
			checkDistanceAndTriggerNote(point);
		});
	}

	background(255);
	image(state.media, 0, 0);
	drawAndCheckPoints();
}


function checkDistanceAndTriggerNote(point) {
	function euclideanDistance(colors, pastColors) {
		let r1 = colors[0]
		let g1 = colors[1]
		let b1 = colors[2]
		let a1 = colors[3]

		let r2 = pastColors[0]
		let g2 = pastColors[1]
		let b2 = pastColors[2]
		let a2 = pastColors[3]

		return Math.sqrt(
			Math.pow(r2 - r1, 2) +
			Math.pow(g2 - g1, 2) +
			Math.pow(b2 - b1, 2) +
			Math.pow(a2 - a1, 2)
		);
	}

	state.threshold = state.thresholdSlider.value();
	state.scale = state.scaleSelect.value();
	let dist = euclideanDistance(point.colors, point.pastColors);
	if (dist > state.threshold && state.audioRunning) {
		point.instrument.triggerAttackRelease(point.note, state.noteLengths[0], Tone.now());
		// TODO: we may/need/want/crave? variable note length. how to select, scroll wheel????
	}
}

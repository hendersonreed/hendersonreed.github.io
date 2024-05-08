const numSynths = 24;
let stashedSynths = [];
let synths = [];
let started = false;
let currentPart;

/* some utility functions that are used in a few different places 
 * They have no real awareness of the general structure of the code and
 * just operate on arrays.
 */
function randFromArray(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function randBetweenTwoFloats(min, max) { return (Math.random() * (max - min)) + min }
function createRandomBag(array) {
	let bag = array.slice(); // Create a copy of the original array
	let isEmpty = false;

	function getRandomElement() {
		if (isEmpty) {
			bag = array.slice(); // Refill the bag with original elements
			isEmpty = false;
		}

		if (bag.length === 0) {
			isEmpty = true;
			return null; // Bag is empty
		}

		const randomIndex = Math.floor(Math.random() * bag.length);
		const randomElement = bag.splice(randomIndex, 1)[0]; // Remove and return random element
		return randomElement;
	}

	return getRandomElement;
}

/* Called when the `evolve` button is clicked and performs all the genetic algorithm work
 * to create a new batch of synths.
 */
function recombinateSynths() {
	let newSynths = [];
	const randomBagOfSynths = createRandomBag(stashedSynths);
	while (newSynths.length < numSynths) {
		const synthA = randomBagOfSynths(stashedSynths);
		const synthB = randomBagOfSynths(stashedSynths);
		newSynths.push(childSynth(synthA, synthB));
	}
	synths = newSynths;
	stashedSynths = [];
}

/* "mates" two synths together, with potential random additions */
function childSynth(synthA, synthB) {
	let mutationChance = 0.3;
	let newSynth = randomSynth();

	// If either synthA or synthB is not provided, return a random synth
	if (!synthA || !synthB) {
		return newSynth;
	}

	// Define the parameters to iterate over
	const parametersToIterate = ['volume', 'detune', 'portamento', 'envelope', 'oscillator'];

	// Iterate over the parameters
	parametersToIterate.forEach(param => {
		if (param === 'envelope' || param === 'oscillator') {
			newSynth[param] = {};
			for (let subKey in newSynth[param]) {
				if (Math.random() > mutationChance) {
					newSynth[param][subKey] = Math.random() < 0.5 ? synthA[param][subKey] : synthB[param][subKey];
				}
			}
		} else {
			if (Math.random() > mutationChance) {
				newSynth[param] = Math.random() < 0.5 ? synthA[param] : synthB[param];
			}
		}
	});

	return newSynth;
}

function randomSynth() {
	let randSynth = new Tone.Synth({
		volume: 0,
		detune: randBetweenTwoFloats(0, 25),
		portamento: randBetweenTwoFloats(0, 25),
		envelope: {
			attack: randBetweenTwoFloats(0, 1.0),
			decay: randBetweenTwoFloats(0, 1.0),
			sustain: randBetweenTwoFloats(0, 1.0),
			release: randBetweenTwoFloats(0, 1.0),
			attackCurve: "exponential",
			decayCurve: "exponential",
			releaseCurve: "exponential",
		},
		oscillator: {
			partialCount: 0,
			partials: [],
			phase: 0,
			type: randFromArray([
				"sine",
				"square",
				"triangle",
				"sawtooth",
				"amsine",
				"amsquare",
				"amtriangle",
				"amsawtooth",
				"fmsine",
				"fmsquare",
				"fmtriangle",
				"fmsawtooth",
				"fatsine",
				"fatsquare",
				"fattriangle",
				"fatsawtooth",
				"pwm",
				"pulse"]),
			harmonicity: 0.5,
			modulationType: randFromArray([
				"sine",
				"square",
				"triangle",
				"sawtooth",])
		}
	}).toDestination();
	return randSynth;
}

document.addEventListener("click", function() {
	// global event listener, starts the transport if it hasn't started.
	if (!started) {
		Tone.Transport.start();
		started = true;
	}
});


document.addEventListener("DOMContentLoaded", function() {
	const synthBoxes = document.getElementById("synth-boxes");

	// Create grid columns 
	for (let i = 0; i < numSynths; i++) {
		const gridItem = document.createElement("div");
		gridItem.classList.add("grid-item");
		gridItem.id = i.toString();
		synthBoxes.appendChild(gridItem);
		synths.push(randomSynth());
	}

	const gridItems = document.querySelectorAll("#synth-boxes .grid-item");
	gridItems.forEach(function(item, gridItemIndex) {
		item.addEventListener("click", function() {
			this.style.backgroundColor = "lightblue";
			let currentSynth = synths[gridItemIndex];
			stashedSynths.push(currentSynth);
		});
		item.addEventListener("mouseover", function() {
			let currentSynth = synths[gridItemIndex];
			currentPart = new Tone.Part(((time, note) => {
				// the notes given as the second element in the array
				// will be passed in as the second argument
			}), [[0, "C2"], ["0:2", "C3"], ["0:3:2", "G2"]]).start(Tone.now());
			//Tone.Transport.start();
			currentPart = new Tone.Sequence((time, note) => {
				currentSynth.triggerAttackRelease(note, 0.1, time);
			}, ["C3", "Eb3", "F4", "Bb4"], "4n").start(Tone.now());
		});
		item.addEventListener("mouseout", function() {
			currentPart.stop();
			//Tone.Transport.stop();
		});
	});
});

document.addEventListener("click", () => {
	const modal = document.getElementById("modal");
	modal.style.display = "none";
});

const evolveButton = document.getElementById("evolve-button");
evolveButton.addEventListener("click", () => {
	const gridItems = document.querySelectorAll("#synth-boxes .grid-item");
	gridItems.forEach((item) => {
		item.style.backgroundColor = "white";
	});

	recombinateSynths();
});

const printButton = document.getElementById("print-button");
printButton.addEventListener("click", () => {
	stashedSynths.forEach((item) => {
		console.log(item);
	});
});

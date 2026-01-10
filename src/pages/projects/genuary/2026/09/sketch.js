let smileBigness;
let grid;
let cols;
let rows;
let resolution = 10;

function setup() {
  helpMsg = `
<p>welcome.
  <ul>
    <li>click to start.</li>
  </ul>
the crazier (wider) your smile, the better these automata survive.
</p>
`
  keylessSetup(helpMsg);

  cols = width / resolution;
  rows = height / resolution;
  grid = make2DArray(cols, rows);

  // Randomly seed the grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(2));
    }
  }
}

/* The `detections.multiHandLandmarks` array looks like this:
 * [ [ {x: 0.923, y:0.457, z: 0.103}, {x: 0.323, y:0.127, z: 0.012}, {x: 0.183, y:0.877, z: 0.003} ] ]
 * where each inner array represents a single recognized hand (each hand being an array of objects that
 * represent the landmarks outlined here:
 * https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker#models
 */
function draw() {
  background(backgroundColor);
  if (detections != undefined && detections.multiFaceLandmarks != undefined && detections.multiFaceLandmarks.length != 0) {
    detections.multiFaceLandmarks.forEach((each) => {
      // here we have an entire face.
      // if your smile is wide, things are more likely to survive.
      if (each !== undefined) {
        smileBigness = dist(each[57].x, each[57].y, each[287].x, each[287].y)
        // this ranges between 0.11 and 0.15 at a distance of ~18 inches.
        // now we do conways game of life, with random placement of stuff
        // BUT there's a statistical likelihood that a cell that would die MIGHT survive
        // and that likelihood is higher the crazier your smile.
      }
    });
  }
  // 1. Draw the current grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * resolution;
      let y = j * resolution;
      if (grid[i][j] == 1) {
        fill(0);
        stroke(200);
        rect(x, y, resolution - 1, resolution - 1);
      }
    }
  }

  let next = make2DArray(cols, rows);

  // 2. Compute next generation based on rules
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let state = grid[i][j];
      let neighbors = countNeighbors(grid, i, j);

      if (state == 0 && neighbors == 3) {
        next[i][j] = 1;
      } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
        let mappedBigness = map(smileBigness, 0.1, 0.2, 0, 0.3);
        if (random() < mappedBigness) {
          next[i][j] = 1;
        }
        else {
          next[i][j] = 0;
        }
      } else {
        next[i][j] = state;
      }
    }
  }
  grid = next;
}

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

// Helper: Count live neighbors around a cell
function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      // Use modulo to wrap around the edges of the screen
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y]; // Subtract the cell's own state
  return sum;
}

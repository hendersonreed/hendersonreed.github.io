// Co-created by hannahilea (https://hannahilea.github.io/)
// and hendersonreed (https://hendersonreed.github.io/)
// as a creative coding project while at the 
// Recurse Center (www.recurse.com/)

let mic;
let livingParticles = [];

function setup() {
  createCanvas(800, 800);
  colorMode(HSL, 1.0);

  // Create an Audio input
  mic = new p5.AudioIn();

  // start the Audio Input.
  // By default, it does not .connect() (to the computer speakers)
  mic.start();
}

function spawnParticles(volume) {
  let numParticles = volume * 100;
  for (let i = 0; i < numParticles; i++) {

    // Different particle modes:
    // Square:
    // let particle = {x: mouseX, y: mouseY, energy: volume, dX: random(-1.0,1.0), dY: random(-1.0,1.0), life: 1.0};

    // Funky 1d diagonal lines
    // let d = random(-1.0,1.0);
    // let particle = {x: mouseX, y: mouseY, energy: volume, dX: d, dY: d, life: 1.0};

    // Funky x's
    // let d = random(-1.0,1.0);
    // let particle = {x: mouseX, y: mouseY, energy: volume, dX: random([-1,1]) * d, dY: random([-1,1]) * d, life: 1.0};

    // Circular rings! Like water drops
    let d = random(0, 2 * PI);
    let particle = { x: mouseX, y: mouseY, energy: volume, dX: random([-1, 1]) * cos(d), dY: random([-1, 1]) * sin(d), life: volume * 8 };

    // let d = random(0, 2*PI);
    // let particle = {x: mouseX, y: mouseY, energy: volume, dX: random(0,1) * cos(d), dY: random(0,1) * sin(d), life: volume * 8};

    livingParticles.push(particle);
  }
}

function mouseOnCanvas() {
  return (0 < mouseX) && (mouseX < width) && (0 < mouseY) && (mouseY < height);
}

function draw() {
  background("darkblue");

  // Get the overall volume (between 0 and 1.0)
  let vol = mic.getLevel();
  //   fill(vol * 255);
  //   stroke(0);

  //   // Draw an ellipse with height based on volume
  //   let h = map(vol, 0, 1, height, 0);
  //   ellipse(width / 2, h - 25, 50, 50);

  if (vol > 0.02 && mouseOnCanvas()) {
    spawnParticles(vol);
  }

  livingParticles = livingParticles.filter((particle) => {
    return particle.life > 0;
  });

  livingParticles.forEach((particle) => {
    fill(particle.energy, 0.75, 0.5);
    noStroke();
    ellipse(particle.x + particle.dX, particle.y + particle.dY, particle.life * 5, particle.life * 5);
    particle.x += particle.dX;
    particle.y += particle.dY;
    particle.life -= .005;
  });
}


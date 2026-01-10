let threshold = 0.02;

function setup() {
  helpMsg = `
<p>welcome.
  <ul>
    <li>click to start.</li>
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
function draw() {
  background(backgroundColor);
  if (detections != undefined && detections.multiFaceLandmarks != undefined && detections.multiFaceLandmarks.length != 0) {
    detections.multiFaceLandmarks.forEach((each) => {
      // here we have an entire face.
      // if we detect that the eyelids are closed, then we set `isRunning` to true (closed, aka just a very small number.)
      // if (dist(145, 159) < 20) { isRunning = true; }
      // if isRunning is true, we draw a polygon based on a few key facial landmarks: 54, 284, 172, 379
      //console.log("each: 145", each[145]);
      //console.log("each 159:", each[159]);
      //console.log(dist(each[145].x, each[145].y, each[159].x, each[159].y));

      if (each !== undefined) {
        let rightEyeDist = dist(each[145].x, each[145].y, each[159].x, each[159].y)
        let leftEyeDist = dist(each[145].x, each[145].y, each[159].x, each[159].y)
        //face
        beginShape();
        vertex(each[54].x * width, each[54].y * height);
        vertex(each[284].x * width, each[284].y * height);
        vertex(each[379].x * width, each[379].y * height);
        vertex(each[172].x * width, each[172].y * height);
        vertex(each[54].x * width, each[54].y * height);
        endShape();

        //right eye (223,222,22,24)
        beginShape();
        vertex(each[223].x * width, each[223].y * height + 1000 * rightEyeDist);
        vertex(each[222].x * width, each[222].y * height + 1000 * rightEyeDist);

        vertex(each[22].x * width, each[22].y * height - 1000 * rightEyeDist);
        vertex(each[24].x * width, each[24].y * height - 1000 * rightEyeDist);

        vertex(each[223].x * width, each[223].y * height + 1000 * rightEyeDist);
        endShape();

        //left eye
        push()
        beginShape();
        vertex(each[258].x * width, each[258].y * height + 1000 * leftEyeDist);
        vertex(each[257].x * width, each[257].y * height + 1000 * leftEyeDist);

        vertex(each[254].x * width, each[254].y * height - 1000 * leftEyeDist);
        vertex(each[252].x * width, each[252].y * height - 1000 * leftEyeDist);

        vertex(each[258].x * width, each[258].y * height + 1000 * leftEyeDist);
        endShape();
        pop();
      }
    });
  }
}

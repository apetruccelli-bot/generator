function setup() {
  createCanvas(200, 200);


background(0);
noStroke();

let centreX = width / 2;
let centreY = height / 2;

for (let x = 0; x < width; x++) {
 for (let y = 0; y < height; y++) {

  console.log(x, y);


  //calculate the distance from the center of the canvas
let distanceFromCentre = dist( centreX, centreY, x, y);
let normDistanceFomCenter = distanceFromCentre /(width /2);

let altitude = 1 - normDistanceFomCenter;

fill(255 * altitude);
rect(x, y, 1, 1);




 }
}
}

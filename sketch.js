let PERLIN_SCALE = 50;


function setup() {
  createCanvas(200, 200);


background(0);
noStroke();

let centreX = width / 2;
let centreY = height / 2;

for (let x = 0; x < width; x++) {
 for (let y = 0; y < height; y++) {

  //console.log(x, y);



  //calculate the distance from the center of the canvas
let distanceFromCentre = dist( centreX, centreY, x, y);
let normDistanceFomCenter = distanceFromCentre /(width /2);


//calcolo altitudine
let altitude = 1 - normDistanceFomCenter;

//perlin
noiseDetail(6);
let perlin = noise(x / PERLIN_SCALE, y / PERLIN_SCALE);
altitude *= perlin

// assegnamo colore
let sealevel = 0.2;
let beachlevel = 0.25;
if (altitude < sealevel) {
  fill(0, 0, 255 );
    } else if (altitude < beachlevel) {
    fill(255, 255, 0);
    }
    
    else {
    fill(0, 255, 0);
    }
    rect(x, y, 1, 1);




 
}
}
}

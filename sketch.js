let PERLIN_SCALE = 200;
let TILE_SIZE = 5;

let grassimage;
let sandimage;
let waterimage;


function preload() {
  grassimage = loadImage('tiles/Leaves.png');
  waterimage = loadImage('tiles/Water.png');
  sandimage = loadImage('tiles/Wood.png');

}

function setup() {
  createCanvas(windowWidth, windowHeight);


background(0);
noStroke();

let centreX = width / 2;
let centreY = height / 2;

for (let x = 0; x < width; x += TILE_SIZE) {
 for (let y = 0; y < height; y=y +TILE_SIZE) {

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
altitude += perlin;
altitude -=0.5;

// assegnamo colore
let sealevel = 0.2;
let beachlevel = 0.28;

let img;
if (altitude < sealevel) {
  img = waterimage;
} else if (altitude < beachlevel) {
  img = sandimage;
} else {
  img = grassimage;
}
image(img, x, y, TILE_SIZE, TILE_SIZE);
   
    }
    
   


 
}
}


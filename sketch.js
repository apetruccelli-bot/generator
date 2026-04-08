let PERLIN_SCALE = 200;
let TILE_SIZE = 5;
let SPRITE_SIZE = 20;

let grassimage;
let sandimage;
let waterimage;

let flowerimage;
let potionimage;

function preload() {
  grassimage = loadImage('assets/tiles/Leaves.png');
  waterimage = loadImage('assets/tiles/Water.png');
  sandimage = loadImage('assets/tiles/Wood.png');

  flowerimage = loadImage('assets/sprite/Flower.png');
  potionimage = loadImage('assets/sprite/Potion.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  noStroke();
  noiseDetail(6);

  let centreX = width / 2;
  let centreY = height / 2;
  let islandRadius = min(width, height) / 2;

  let sealevel = 0.2;
  let beachlevel = 0.28;

  // FIRST LOOP: draw tiles only
  for (let x = 0; x < width; x += TILE_SIZE) {
    for (let y = 0; y < height; y += TILE_SIZE) {
      let distanceFromCentre = dist(centreX, centreY, x, y);
      let normDistanceFromCenter = distanceFromCentre / islandRadius;

      let altitude = 1 - normDistanceFromCenter;

      let perlin = noise(x / PERLIN_SCALE, y / PERLIN_SCALE);
      altitude *= perlin;
      altitude += perlin;
      altitude -= 0.5;

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

  // SECOND LOOP: draw flowers and potions on top
  for (let x = 0; x < width; x += TILE_SIZE) {
    for (let y = 0; y < height; y += TILE_SIZE) {
      let distanceFromCentre = dist(centreX, centreY, x, y);
      let normDistanceFromCenter = distanceFromCentre / islandRadius;

      let altitude = 1 - normDistanceFromCenter;

      let perlin = noise(x / PERLIN_SCALE, y / PERLIN_SCALE);
      altitude *= perlin;
      altitude += perlin;
      altitude -= 0.5;

      if (altitude > beachlevel && random() < 0.02) {
        image(
          flowerimage,
          x - SPRITE_SIZE / 2,
          y - SPRITE_SIZE / 2,
          SPRITE_SIZE,
          SPRITE_SIZE
        );
      }
      // Draw potion with similar logic but lower probability
      if (altitude > beachlevel && random() < 0.01) {
        image(
          potionimage,
          x - SPRITE_SIZE / 2,
          y - SPRITE_SIZE / 2,
          SPRITE_SIZE,
          SPRITE_SIZE
        );
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
let PERLIN_SCALE = 200;
let TILE_SIZE = 5;
let SPRITE_SIZE = 20;

let grassimage;
let sandimage;
let waterimage;


let flowerimage;
let potionimage;
let diamondimage;

function preload() {
  function logError(imgName) {
    return () => console.error('Failed to load', imgName);
  }
  grassimage = loadImage('assets/tiles/Leaves.png', undefined, logError('Leaves.png'));
  waterimage = loadImage('assets/tiles/Water.png', undefined, logError('Water.png'));
  sandimage = loadImage('assets/tiles/Wood.png', undefined, logError('Wood.png'));

  flowerimage = loadImage('assets/sprite/Flower.png', undefined, logError('Flower.png'));
  potionimage = loadImage('assets/sprite/Potion.png', undefined, logError('Potion.png'));
  diamondimage = loadImage('assets/sprite/Diamond.png', undefined, logError('Diamond.png'));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // DEBUG: Set a visible background color to check if canvas appears
  background('red');
  noStroke();
  noiseDetail(6);

  let centreX = width / 2;
  let centreY = height / 2;
  let islandRadius = min(width, height) / 2;

  let sealevel = 0.2;
  let beachlevel = 0.28;

  // --- PATH GENERATION ---
  // Create a grid to store tile types and altitude
  let gridCols = Math.floor(width / TILE_SIZE);
  let gridRows = Math.floor(height / TILE_SIZE);
  let grid = [];
  let altitudeGrid = [];
  for (let i = 0; i < gridCols; i++) {
    grid[i] = [];
    altitudeGrid[i] = [];
    for (let j = 0; j < gridRows; j++) {
      // Calculate altitude for this grid cell
      let x = i * TILE_SIZE;
      let y = j * TILE_SIZE;
      let distanceFromCentre = dist(centreX, centreY, x, y);
      let normDistanceFromCenter = distanceFromCentre / islandRadius;
      let altitude = 1 - normDistanceFromCenter;
      let perlin = noise(x / PERLIN_SCALE, y / PERLIN_SCALE);
      altitude *= perlin;
      altitude += perlin;
      altitude -= 0.5;
      altitudeGrid[i][j] = altitude;
      grid[i][j] = 'none';
    }
  }

  // Helper to convert canvas to grid
  function toGrid(x, y) {
    let i = Math.floor(x / TILE_SIZE);
    let j = Math.floor(y / TILE_SIZE);
    // Clamp to grid bounds
    i = Math.max(0, Math.min(i, gridCols - 1));
    j = Math.max(0, Math.min(j, gridRows - 1));
    return [i, j];
  }
  function toCanvas(i, j) {
    return [i * TILE_SIZE, j * TILE_SIZE];
  }

  // Pick a random edge point for path start
  let edgeOptions = [];
  for (let i = 0; i < gridCols; i++) {
    edgeOptions.push([i, 0]);
    edgeOptions.push([i, gridRows - 1]);
  }
  for (let j = 1; j < gridRows - 1; j++) {
    edgeOptions.push([0, j]);
    edgeOptions.push([gridCols - 1, j]);
  }
  let [startI, startJ] = random(edgeOptions);

  // Pick a random treasure location near the center, but only inside the green area
  let treasureRadius = Math.floor(min(gridCols, gridRows) * 0.2);
  let possibleTreasure = [];
  for (let i = Math.floor(gridCols / 2 - treasureRadius); i <= Math.floor(gridCols / 2 + treasureRadius); i++) {
    for (let j = Math.floor(gridRows / 2 - treasureRadius); j <= Math.floor(gridRows / 2 + treasureRadius); j++) {
      if (
        i >= 0 && i < gridCols &&
        j >= 0 && j < gridRows &&
        altitudeGrid[i][j] > beachlevel
      ) {
        possibleTreasure.push([i, j]);
      }
    }
  }
  let [treasureI, treasureJ] = random(possibleTreasure);

  // Pathfinding: create a single, thin, continuous path from edge to diamond, only inside island
  function carveDirectPath(i0, j0, i1, j1) {
    let path = [];
    let i = i0, j = j0;
    path.push([i, j]);
    let maxTries = gridCols * gridRows * 2;
    let tries = 0;
    while ((i !== i1 || j !== j1) && tries < maxTries) {
      let options = [];
      // Always prefer the direction that brings us closer to the target
      if (i !== i1 && j !== j1) {
        // Diagonal step if possible
        let di = i1 > i ? 1 : -1;
        let dj = j1 > j ? 1 : -1;
        if (
          i + di >= 0 && i + di < gridCols &&
          j + dj >= 0 && j + dj < gridRows &&
          altitudeGrid[i + di][j + dj] > beachlevel
        ) {
          options.push([i + di, j + dj]);
        }
      }
      // Horizontal step
      if (i !== i1) {
        let di = i1 > i ? 1 : -1;
        if (
          i + di >= 0 && i + di < gridCols &&
          altitudeGrid[i + di][j] > beachlevel
        ) {
          options.push([i + di, j]);
        }
      }
      // Vertical step
      if (j !== j1) {
        let dj = j1 > j ? 1 : -1;
        if (
          j + dj >= 0 && j + dj < gridRows &&
          altitudeGrid[i][j + dj] > beachlevel
        ) {
          options.push([i, j + dj]);
        }
      }
      // If stuck, break
      if (options.length === 0) break;
      // Pick the first valid option (deterministic, thin path)
      let [ni, nj] = options[0];
      i = ni; j = nj;
      path.push([i, j]);
      tries++;
    }
    return path;
  }

  let mainPath = carveDirectPath(startI, startJ, treasureI, treasureJ);
  for (let [i, j] of mainPath) {
    grid[i][j] = 'path';
  }

  // --- DRAW TILES ---
  for (let x = 0; x < width; x += TILE_SIZE) {
    for (let y = 0; y < height; y += TILE_SIZE) {
      let [i, j] = toGrid(x, y);
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
      // Draw walkable paths, but only if indices are valid
      if (i >= 0 && i < gridCols && j >= 0 && j < gridRows) {
        if (grid[i][j] === 'path' || grid[i][j] === 'branch') {
          img = sandimage;
        }
      }
      image(img, x, y, TILE_SIZE, TILE_SIZE);
    }
  }

  // Draw the diamond at the treasure location
  let [treasureX, treasureY] = toCanvas(treasureI, treasureJ);
  image(
    diamondimage,
    treasureX - SPRITE_SIZE / 2,
    treasureY - SPRITE_SIZE / 2,
    SPRITE_SIZE,
    SPRITE_SIZE
  );

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
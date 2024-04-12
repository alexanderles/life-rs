import { Universe, Cell } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";

const CELL_SIZE = 10;
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";
const MAX_FRAMES_PER_TICK = 50;
const MIN_FRAMES_PER_TICK = 1;

// Construct the universe, and get its width and height
const universe = Universe.new();
const width = universe.width();
const height = universe.height();

// Give the canvas room for all of our cells and a 1px border
// around each of them
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

// Identifier for the next queued animation frame
let animationId = null;

// Number of animation frames per universe tick
let framesPerTick = 50;
let frameCount = 0;

// Creates a CanvasRenderingContext2D
const ctx = canvas.getContext("2d");

// Renders the updated canvas on each tick
const renderLoop = () => {
  drawGrid();
  drawCells();

  if (frameCount > framesPerTick) {
    universe.tick();
    frameCount = 0;
  } else {
    frameCount++;
  }

  animationId = requestAnimationFrame(renderLoop);
};

// Draws the grid
const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // Vertical lines
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // Horizontal lines
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const getIndex = (row, column) => {
  return row * width + column;
};

// Draws the cells
const drawCells = () => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, (width * height) / 8);

  ctx.beginPath;

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      ctx.fillStyle = bitIsSet(idx, cells) ? ALIVE_COLOR : DEAD_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

const bitIsSet = (n, arr) => {
  const byte = Math.floor(n / 8);
  const mask = 1 << n % 8;
  return (arr[byte] & mask) === mask;
};

// Pause and Play the animation
const playPauseButton = document.getElementById("play-pause");

const play = () => {
  playPauseButton.textContent = "⏸︎";
  renderLoop();
};

const pause = () => {
  playPauseButton.textContent = "▶";
  cancelAnimationFrame(animationId);
  animationId = null;
  drawGrid();
  drawCells();
};

const isPaused = () => {
  return animationId === null;
};

playPauseButton.addEventListener("click", (event) => {
  if (isPaused()) {
    play();
  } else {
    pause();
  }
});

// Reset the universe to all dead cells
const clearButton = document.getElementById("clear");

clearButton.textContent = "🗑";

clearButton.addEventListener("click", (event) => {
  universe.clear();
  drawGrid();
  drawCells();
  pause();
});

// Resets the universe to a random state
const randomizeButton = document.getElementById("randomize");

randomizeButton.textContent = "⚄";

randomizeButton.addEventListener("click", (event) => {
  universe.randomize();
  drawGrid();
  drawCells();
})

// Control ticks per animation frame
const frameRateSlider = document.getElementById("frame-rate");

frameRateSlider.value = (MAX_FRAMES_PER_TICK - MIN_FRAMES_PER_TICK) / 2
frameRateSlider.max = MAX_FRAMES_PER_TICK;
frameRateSlider.min = MIN_FRAMES_PER_TICK;

frameRateSlider.addEventListener("input", (event) => {
  framesPerTick = (MAX_FRAMES_PER_TICK + 1) - event.target.value;
})


// Click interactions with cells
canvas.addEventListener("click", event => {
  const boundingRect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
  const canvasTop = (event.clientY - boundingRect.top) * scaleY;

  const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
  const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

  if (event.ctrlKey) {
    universe.draw_glider(row, col);
  } else if (event.shiftKey) {
    universe.draw_pulsar(row, col)
  } else {
    universe.toggle_cell(row, col);
  }

  drawGrid();
  drawCells();
});

// Run the animation
drawGrid();
drawCells();
play();

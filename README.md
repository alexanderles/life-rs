# Conway's Game of Life

## About

This is an interactive implementation of Conway's Game of Life using Rust and WebAssembly,
based on the [Rust Wasm Book](https://rustwasm.github.io/docs/book/) and using the [wasm-pack template](https://github.com/rustwasm/wasm-pack-template).

## Local Development

### Prerequisites

- **Rust & Cargo**: Install from [https://rustup.rs/](https://rustup.rs/)
- **Node.js & npm**: Install from [https://nodejs.org/](https://nodejs.org/)
- **wasm-pack**: Install with `cargo install wasm-pack`

### Setup & Run

1. **Build the WASM module**:
   ```bash
   wasm-pack build
   ```

2. **Install dependencies and start dev server**:
   ```bash
   cd www
   npm install
   npm start
   ```

3. **Open in browser**: Navigate to `http://localhost:8080`

### Controls

**Basic Controls:**
- **Play/Pause** (⏸︎/▶): Start or stop the simulation
- **Clear** (🗑): Clear all cells
- **Randomize** (⚄): Randomize all cells
- **Frame Rate Slider**: Adjust simulation speed

**Pattern Creation (Click on grid while holding modifier keys):**
- **Click**: Toggle individual cell
- **Alt + Click**: Create horizontal blinker pattern
- **Ctrl + Click**: Create glider pattern
- **Shift + Click**: Create pulsar pattern





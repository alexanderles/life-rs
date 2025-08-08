# Conway's Game of Life

An implementation of Conway's Game of Life written in Rust with WebAssembly support.

## Conway's Game of Life Rules

The simulation follows these rules:

1. **Underpopulation**: Any live cell with fewer than two live neighbors dies
2. **Survival**: Any live cell with two or three live neighbors lives
3. **Overpopulation**: Any live cell with more than three live neighbors dies
4. **Reproduction**: Any dead cell with exactly three live neighbors becomes alive

## Installation

### As a Rust Dependency

Add to your `Cargo.toml`:

```toml
[dependencies]
life-rs = { git = "https://github.com/alexanderles/life-rs" }
```

Or for local development:

```toml
[dependencies]
life-rs = { path = "../life-rs" }
```

### For WebAssembly Usage

1. **Install wasm-pack** (if not already installed):
   ```bash
   cargo install wasm-pack
   ```

2. **Build the WASM package**:
   ```bash
   wasm-pack build --target web
   ```

3. **Use in your web project**:
   ```bash
   # Copy the generated files to your web project
   cp pkg/* /path/to/your/web/project/
   ```

## Usage

### Rust Library Usage

```rust
use life_rs::Universe;

fn main() {
    // Create a new empty universe with default 64x64 dimensions
    let mut universe = Universe::new();
    
    // Or create empty universe with custom dimensions
    let mut universe = Universe::new_empty(100, 100);
    
    // Create universe with random cells
    let mut universe = Universe::new_random(100, 100);
    
    // Create with a specific pattern
    let alive_cells = vec![(1, 1), (1, 2), (1, 3)]; // Blinker pattern
    let mut universe = Universe::new_with_pattern(10, 10, alive_cells);
    
    // Run simulation
    for _ in 0..10 {
        universe.tick();
        println!("{}", universe.render());
    }
    
    // Manipulate cells
    universe.toggle_cell(5, 5);
    universe.set_cell(6, 6, true);
    
    // Draw patterns
    universe.draw_blinker(10, 10, true);  // Horizontal blinker
    universe.draw_glider(20, 20);         // Glider pattern
    universe.draw_pulsar(30, 30);         // Pulsar pattern
}
```

### WebAssembly Usage

```javascript
import init, { Universe } from './life_rs.js';

async function main() {
    // Initialize the WASM module
    await init();
    
    // Create a new empty universe
    const universe = Universe.new();
    
    // Or create empty universe with custom dimensions
    const universe = Universe.new_empty(100, 100);
    
    // Create universe with random cells
    const universe = Universe.new_random(100, 100);
    
    // Run simulation
    for (let i = 0; i < 10; i++) {
        universe.tick();
        console.log(universe.render());
    }
    
    // Manipulate cells
    universe.toggle_cell(5, 5);
    
    // Draw patterns
    universe.draw_blinker(10, 10, true);
    universe.draw_glider(20, 20);
    universe.draw_pulsar(30, 30);
}

main();
```

## Building

### For Rust Library

```bash
cargo build
cargo test
```

### For WebAssembly

```bash
# Build for web
wasm-pack build --target web

# Build for Node.js
wasm-pack build --target nodejs

# Build for bundlers (webpack, etc.)
wasm-pack build --target bundler
```

### Development

```bash
# Run tests
cargo test

# Run WASM tests
wasm-pack test --headless --firefox
wasm-pack test --headless --chrome

# Check documentation
cargo doc --open
```

## Features

The crate supports different features:

- `wasm` (default) - Enables WebAssembly support
- `console_error_panic_hook` - Better error messages in WASM

To disable WASM features for pure Rust usage:

```toml
[dependencies]
life-rs = { git = "https://github.com/yourusername/life-rs", default-features = false }
```

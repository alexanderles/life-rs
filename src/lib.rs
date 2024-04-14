use fixedbitset::FixedBitSet;
use std::fmt;
use wasm_bindgen::prelude::wasm_bindgen;
mod utils;
extern crate web_sys;

/// The universe
#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: FixedBitSet,
}

impl Universe {
    /// Returns an index in the cells vector for a coordinate in the universe
    ///
    /// # Arguments
    ///
    /// * 'row' - A u32 representing the cell's row in the universe
    /// * 'column' - A u32 representing the cell's column in the universe
    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    /// Returns the number of live neighbors for a coordinate in the universe
    ///
    /// # Arguments
    ///
    /// * 'row' - A u32 representing the cell's row in the universe
    /// * 'column' - A u32 representing the cell's column in the universe
    fn live_neighbor_count(&self, row: u32, column: u32) -> u8 {
        let mut count = 0;
        for delta_row in [self.height - 1, 0, 1].iter().cloned() {
            for delta_col in [self.width - 1, 0, 1].iter().cloned() {
                if delta_row == 0 && delta_col == 0 {
                    continue;
                }

                let neighbor_row = (row + delta_row) % self.height;
                let neighbor_col = (column + delta_col) % self.width;
                let idx = self.get_index(neighbor_row, neighbor_col);

                count += self.cells[idx] as u8;
            }
        }
        count
    }

    /// Draws a square pattern centered around a provided origin.
    ///
    /// # Panics
    ///
    /// The size parameter must be less than or equal to both dimensions
    /// of the universe, and must be an odd value in order for the square
    /// to have a valid origin.
    /// This function will error if either of these conditions are not met.
    fn draw_square_pattern(
        &mut self,
        origin_row: u32,
        origin_column: u32,
        size: u32,
        alive_cells: &[(u32, u32)],
    ) {
        log!(
            "Drawing square pattern at origin {}, {}",
            origin_row,
            origin_column
        );
        if size % 2 == 0 || size > self.width || size > self.width {
            panic!("Size must be an odd value and smaller than the universe")
        }

        let delta = size / 2;
        let lower_delta_row_range: Vec<u32> = (self.height - delta..self.height).collect();
        let lower_delta_col_range: Vec<u32> = (self.width - delta..self.width).collect();
        let higher_delta_range: Vec<u32> = (0..delta + 1).collect();
        for delta_row in lower_delta_row_range
            .iter()
            .chain(higher_delta_range.iter())
        {
            for delta_col in lower_delta_col_range
                .iter()
                .chain(higher_delta_range.iter())
            {
                log!("delta_row: {}", delta_row);
                log!("delta_col: {}", delta_col);
                let cell_row = (origin_row + delta_row) % self.height;
                let cell_col = (origin_column + delta_col) % self.width;
                let idx = self.get_index(cell_row, cell_col);

                log!("Looking at cell {}, {}", cell_row, cell_col);
                if alive_cells.contains(&(cell_row, cell_col)) {
                    log!("alive!");
                    self.cells.set(idx, true);
                } else {
                    log!("dead!");
                    self.cells.set(idx, false);
                }
            }
        }
    }
}

/// Public methods, exported to JavaScript
#[wasm_bindgen]
impl Universe {
    /// Creates a new random Universe where each cell has a 50% chance of being alive or dead
    pub fn new() -> Universe {
        utils::set_panic_hook();

        let width = 64;
        let height = 64;

        let size = (width * height) as usize;
        let mut cells = FixedBitSet::with_capacity(size);

        for i in 0..size {
            cells.set(i, js_sys::Math::random() > 0.5);
        }

        Universe {
            width,
            height,
            cells,
        }
    }

    /// Updates the universe's cells for a single tick
    ///
    /// Implements rules based on Conway's Game of Life
    pub fn tick(&mut self) {
        let mut next = self.cells.clone();

        for row in 0..self.height {
            for col in 0..self.width {
                let idx = self.get_index(row, col);
                let cell = self.cells[idx];
                let live_neighbors = self.live_neighbor_count(row, col);

                let next_cell = match (cell, live_neighbors) {
                    // Rule 1: Any live cell with fewer than two live neighbors
                    // dies, as if caused by underpopulation
                    (true, x) if x < 2 => false,

                    // Rule 2: Any live cell with two or three live neighbors
                    // lives to the next generation
                    (true, 2) | (true, 3) => true,

                    // Rule 3: Any live cell with more than three live neighbors
                    // dies, as if by overpopulation
                    (true, x) if x > 3 => false,

                    // Rule 4: Any dead cell with exactly three live neighbors
                    // becomes a live cell, as if by reproduction
                    (false, 3) => true,

                    // All other cells remain in the same state
                    (otherwise, _) => otherwise,
                };

                // status = if next_cell { "alive" } else { "dead" };
                // log!("          it becomes {}", status);

                next.set(idx, next_cell);
            }
        }

        self.cells = next;
    }

    /// Sets every cell in the universe to be dead
    pub fn clear(&mut self) {
        let mut cells = FixedBitSet::with_capacity(self.cells.len());
        for i in 0..self.cells.len() {
            cells.set(i, false);
        }
        self.cells = cells;
    }

    /// Sets every cell's value randomly with a 50% chance of being alive or dead
    pub fn randomize(&mut self) {
        let mut cells = FixedBitSet::with_capacity(self.cells.len());
        for i in 0..self.cells.len() {
            cells.set(i, js_sys::Math::random() > 0.5);
        }
        self.cells = cells;
    }

    /// Renders the state of the universe as a string
    pub fn render(&self) -> String {
        self.to_string()
    }

    /// Toggles the state of a single cell
    pub fn toggle_cell(&mut self, row: u32, column: u32) {
        let idx = self.get_index(row, column);
        self.cells.set(idx, !self.cells[idx]);
    }

    /// Draws a blinker centerd on the specified cell
    /// beginning in the horizontal position if flag is set true:
    ///
    ///     ☐☐☐
    ///
    /// or in the vertical postion if flag is set false:
    ///
    ///       ☐
    ///       ☐
    ///       ☐
    ///  
    pub fn draw_blinker(&mut self, row: u32, column: u32, horizontal: bool) {
        // Draw center cell
        let center_idx = self.get_index(row, column);
        self.cells.set(center_idx, true);

        if horizontal {
            // Draw cells on either side
            let left_idx = self.get_index(row, (column + self.width - 1) % self.width);
            self.cells.set(left_idx, true);

            let right_idx = self.get_index(row, (column + 1) % self.width);
            self.cells.set(right_idx, true);
        } else {
            // Draw cells above and below
            let top_idx = self.get_index((row + self.height - 1) % self.height, column);
            self.cells.set(top_idx, true);

            let bottom_idx = self.get_index((row + 1) % self.height, column);
            self.cells.set(bottom_idx, true);
        }
    }

    /// Draws a glider centered on the specified cell
    /// with a trjectory up and to the right, beginning in the state:
    ///
    ///     ☐
    ///     ☐ ☐
    ///   ☐   ☐
    ///
    pub fn draw_glider(&mut self, row: u32, column: u32) {
        let top = ((row + self.height - 1) % self.height, column);
        let center = (row, column);
        let right = (row, (column + 1) % self.width);
        let bot_left = (
            (row + 1) % self.height,
            (column + self.width - 1) % self.width,
        );
        let bot_right = ((row + 1) % self.height, (column + 1) % self.width);

        let alive_cells = vec![top, center, right, bot_left, bot_right];

        self.draw_square_pattern(row, column, 3, &alive_cells);
    }

    /// Draws a pulsar centered on the specified cell
    /// beginning in the state:
    ///
    ///          ☐☐☐     ☐☐☐
    ///       ☐      ☐  ☐      ☐
    ///       ☐      ☐  ☐      ☐
    ///       ☐      ☐  ☐      ☐
    ///          ☐☐☐     ☐☐☐
    ///          ☐☐☐     ☐☐☐
    ///       ☐      ☐  ☐      ☐
    ///       ☐      ☐  ☐      ☐
    ///       ☐      ☐  ☐      ☐
    ///          ☐☐☐     ☐☐☐
    ///
    pub fn draw_pulsar(&mut self, row: u32, column: u32) {
        // Horizontal blinkers
        for center_col_offset in vec![self.width - 3, 3].iter() {
            let center_col = (column + center_col_offset) % self.width;

            // Top
            let mut center_row = (row + self.height - 6) % self.height;
            self.draw_blinker(center_row, center_col, true);

            // Middle top
            center_row = (row + self.height - 1) % self.height;
            self.draw_blinker(center_row, center_col, true);

            // Middle bottom
            center_row = (row + 1) % self.height;
            self.draw_blinker(center_row, center_col, true);

            // Bottom
            center_row = (row + 6) % self.height;
            self.draw_blinker(center_row, center_col, true);
        }

        // Vertical blinkers
        for center_col_offset in vec![self.width - 6, self.width - 1, 1, 6].iter() {
            let center_col = (column + center_col_offset) % self.width;

            // Top
            let mut center_row = (row + self.height - 3) % self.height;
            self.draw_blinker(center_row, center_col, false);

            // Bottom
            center_row = (row + 3) % self.height;
            self.draw_blinker(center_row, center_col, false);
        }
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn set_width(&mut self, width: u32) {
        self.width = width;
        let size = (width * self.height) as usize;
        self.cells = FixedBitSet::with_capacity(size);
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn set_height(&mut self, height: u32) {
        self.height = height;
        let size = (self.width * height) as usize;
        self.cells = FixedBitSet::with_capacity(size);
    }

    pub fn cells(&self) -> *const u32 {
        self.cells.as_slice().as_ptr() as *const u32
    }
}

impl fmt::Display for Universe {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        for line in self.cells.as_slice().chunks(self.width as usize) {
            for &cell in line {
                let symbol = if cell == false as usize { '◻' } else { '◼' };
                write!(f, "{}", symbol)?;
            }
            write!(f, "\n")?;
        }

        Ok(())
    }
}

impl Universe {
    /// Get the dead and alive values of the entire universe.
    pub fn get_cells(&self) -> &FixedBitSet {
        &self.cells
    }

    /// Set cells to be alive in a universe by passing the row and column
    /// of each cell in an array
    pub fn set_cells(&mut self, cells: &[(u32, u32)]) {
        for (row, col) in cells.iter().cloned() {
            let idx = self.get_index(row, col);
            self.cells.set(idx, true);
        }
    }
}

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
#[macro_export]
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

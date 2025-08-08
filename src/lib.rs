use fixedbitset::FixedBitSet;
use rand::Rng;
use std::fmt;

#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::wasm_bindgen;

#[cfg(feature = "wasm")]
extern crate web_sys;

mod utils;

/// The universe for Conway's Game of Life
///
/// This struct represents a 2D grid of cells that can be alive or dead.
/// It implements the rules of Conway's Game of Life for simulation.
#[cfg_attr(feature = "wasm", wasm_bindgen)]
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
    /// * `row` - A u32 representing the cell's row in the universe
    /// * `column` - A u32 representing the cell's column in the universe
    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    /// Returns the number of live neighbors for a coordinate in the universe
    ///
    /// # Arguments
    ///
    /// * `row` - A u32 representing the cell's row in the universe
    /// * `column` - A u32 representing the cell's column in the universe
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
    /// # Arguments
    ///
    /// * `origin_row` - The row coordinate of the pattern center
    /// * `origin_column` - The column coordinate of the pattern center
    /// * `size` - The size of the square pattern (must be odd)
    /// * `alive_cells` - Vector of (row, col) coordinates for cells that should be alive
    ///
    /// # Panics
    ///
    /// The size parameter must be less than or equal to both dimensions
    /// of the universe, and must be an odd value in order for the square
    /// to have a valid origin.
    /// This function will panic if either of these conditions are not met.
    fn draw_square_pattern(
        &mut self,
        origin_row: u32,
        origin_column: u32,
        size: u32,
        alive_cells: &[(u32, u32)],
    ) {
        #[cfg(feature = "wasm")]
        log!(
            "Drawing square pattern at origin {}, {}",
            origin_row,
            origin_column
        );

        if size % 2 == 0 || size > self.width || size > self.height {
            panic!("Size must be an odd value and smaller than the universe dimensions")
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
                #[cfg(feature = "wasm")]
                {
                    log!("delta_row: {}", delta_row);
                    log!("delta_col: {}", delta_col);
                }

                let cell_row = (origin_row + delta_row) % self.height;
                let cell_col = (origin_column + delta_col) % self.width;
                let idx = self.get_index(cell_row, cell_col);

                #[cfg(feature = "wasm")]
                log!("Looking at cell {}, {}", cell_row, cell_col);

                if alive_cells.contains(&(cell_row, cell_col)) {
                    #[cfg(feature = "wasm")]
                    log!("alive!");
                    self.cells.set(idx, true);
                } else {
                    #[cfg(feature = "wasm")]
                    log!("dead!");
                    self.cells.set(idx, false);
                }
            }
        }
    }
}

/// Public methods, exported to JavaScript when WASM feature is enabled
#[cfg_attr(feature = "wasm", wasm_bindgen)]
impl Universe {
    /// Creates a new empty Universe with default 64x64 dimensions
    pub fn new() -> Universe {
        Self::new_empty(64, 64)
    }

    /// Creates a new empty Universe with specified dimensions
    ///
    /// # Arguments
    ///
    /// * `width` - The width of the universe
    /// * `height` - The height of the universe
    pub fn new_empty(width: u32, height: u32) -> Universe {
        #[cfg(feature = "wasm")]
        utils::set_panic_hook();

        let size = (width * height) as usize;
        let cells = FixedBitSet::with_capacity(size);

        Universe {
            width,
            height,
            cells,
        }
    }

    /// Creates a new Universe with random cells and specified dimensions
    ///
    /// # Arguments
    ///
    /// * `width` - The width of the universe
    /// * `height` - The height of the universe
    pub fn new_random(width: u32, height: u32) -> Universe {
        let mut universe = Self::new_empty(width, height);
        universe.randomize();
        universe
    }

    /// Creates a new Universe with specified dimensions and initial pattern
    ///
    /// # Arguments
    ///
    /// * `width` - The width of the universe
    /// * `height` - The height of the universe
    /// * `alive_cells` - Vector of (row, col) coordinates for initially alive cells
    pub fn new_with_pattern(width: u32, height: u32, alive_cells: Vec<(u32, u32)>) -> Universe {
        let mut universe = Self::new_empty(width, height);
        universe.set_cells(&alive_cells);
        universe
    }

    /// Updates the universe's cells for a single tick
    ///
    /// Implements rules based on Conway's Game of Life:
    /// - Any live cell with fewer than two live neighbors dies (underpopulation)
    /// - Any live cell with two or three live neighbors lives to the next generation
    /// - Any live cell with more than three live neighbors dies (overpopulation)
    /// - Any dead cell with exactly three live neighbors becomes a live cell (reproduction)
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

        let mut rng = rand::thread_rng();
        for i in 0..self.cells.len() {
            cells.set(i, rng.gen_bool(0.5));
        }

        self.cells = cells;
    }

    /// Renders the state of the universe as a string
    pub fn render(&self) -> String {
        self.to_string()
    }

    /// Toggles the state of a single cell
    ///
    /// # Arguments
    ///
    /// * `row` - The row coordinate of the cell to toggle
    /// * `column` - The column coordinate of the cell to toggle
    pub fn toggle_cell(&mut self, row: u32, column: u32) {
        let idx = self.get_index(row, column);
        self.cells.set(idx, !self.cells[idx]);
    }

    /// Draws a blinker pattern centered on the specified cell
    /// A blinker is a simple oscillator that alternates between horizontal and vertical states.
    ///
    /// # Arguments
    ///
    /// * `row` - The row coordinate of the pattern center
    /// * `column` - The column coordinate of the pattern center
    /// * `horizontal` - If true, creates horizontal blinker, otherwise vertical
    ///
    /// Horizontal blinker:
    /// ```
    /// ☐☐☐
    /// ```
    ///
    /// Vertical blinker:
    /// ```
    /// ☐
    /// ☐
    /// ☐
    /// ```
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

    /// Draws a glider pattern centered on the specified cell
    ///
    /// A glider is a pattern that moves diagonally across the universe.
    ///
    /// # Arguments
    ///
    /// * `row` - The row coordinate of the pattern center
    /// * `column` - The column coordinate of the pattern center
    ///
    /// Initial state:
    /// ```
    ///   ☐
    ///     ☐ ☐
    ///   ☐   ☐
    /// ```
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

    /// Draws a pulsar pattern centered on the specified cell
    ///
    /// A pulsar is a period-3 oscillator that creates a complex pattern.
    ///
    /// # Arguments
    ///
    /// * `row` - The row coordinate of the pattern center
    /// * `column` - The column coordinate of the pattern center
    ///
    /// Initial state:
    /// ```
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
    /// ```
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

    /// Returns the width of the universe
    pub fn width(&self) -> u32 {
        self.width
    }

    /// Sets the width of the universe and resets all cells
    ///
    /// # Arguments
    ///
    /// * `width` - The new width of the universe
    pub fn set_width(&mut self, width: u32) {
        self.width = width;
        let size = (width * self.height) as usize;
        self.cells = FixedBitSet::with_capacity(size);
    }

    /// Returns the height of the universe
    pub fn height(&self) -> u32 {
        self.height
    }

    /// Sets the height of the universe and resets all cells
    ///
    /// # Arguments
    ///
    /// * `height` - The new height of the universe
    pub fn set_height(&mut self, height: u32) {
        self.height = height;
        let size = (self.width * height) as usize;
        self.cells = FixedBitSet::with_capacity(size);
    }

    /// Returns a pointer to the cells data for WASM interop
    #[cfg(feature = "wasm")]
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
    ///
    /// # Arguments
    ///
    /// * `cells` - Vector of (row, col) coordinates for cells to set alive
    pub fn set_cells(&mut self, cells: &[(u32, u32)]) {
        for (row, col) in cells.iter().cloned() {
            let idx = self.get_index(row, col);
            self.cells.set(idx, true);
        }
    }

    /// Check if a cell is alive at the given coordinates
    ///
    /// # Arguments
    ///
    /// * `row` - The row coordinate
    /// * `column` - The column coordinate
    ///
    /// # Returns
    ///
    /// `true` if the cell is alive, `false` otherwise
    pub fn is_cell_alive(&self, row: u32, column: u32) -> bool {
        let idx = self.get_index(row, column);
        self.cells[idx]
    }

    /// Set a cell to be alive or dead at the given coordinates
    ///
    /// # Arguments
    ///
    /// * `row` - The row coordinate
    /// * `column` - The column coordinate
    /// * `alive` - Whether the cell should be alive or dead
    pub fn set_cell(&mut self, row: u32, column: u32, alive: bool) {
        let idx = self.get_index(row, column);
        self.cells.set(idx, alive);
    }
}

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
#[cfg(feature = "wasm")]
#[macro_export]
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_universe_creation() {
        let universe = Universe::new();
        assert_eq!(universe.width(), 64);
        assert_eq!(universe.height(), 64);
    }

    #[test]
    fn test_universe_with_dimensions() {
        let universe = Universe::new_empty(100, 50);
        assert_eq!(universe.width(), 100);
        assert_eq!(universe.height(), 50);
    }

    #[test]
    fn test_cell_manipulation() {
        let mut universe = Universe::new_empty(10, 10);

        // Test cell setting
        universe.set_cell(5, 5, true);
        assert!(universe.is_cell_alive(5, 5));

        // Test cell toggling
        universe.toggle_cell(3, 3);
        assert!(universe.is_cell_alive(3, 3));
        universe.toggle_cell(3, 3);
        assert!(!universe.is_cell_alive(3, 3));
    }

    #[test]
    fn test_blinker_pattern() {
        let mut universe = Universe::new_empty(10, 10);
        universe.draw_blinker(5, 5, true); // Horizontal blinker

        // Check that the blinker pattern is drawn correctly
        assert!(universe.is_cell_alive(5, 4)); // Left cell
        assert!(universe.is_cell_alive(5, 5)); // Center cell
        assert!(universe.is_cell_alive(5, 6)); // Right cell
    }
}

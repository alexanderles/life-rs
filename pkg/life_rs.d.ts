/* tslint:disable */
/* eslint-disable */
/**
 * The universe for Conway's Game of Life
 *
 * This struct represents a 2D grid of cells that can be alive or dead.
 * It implements the rules of Conway's Game of Life for simulation.
 */
export class Universe {
  private constructor();
  free(): void;
  /**
   * Creates a new empty Universe with default 64x64 dimensions
   */
  static new(): Universe;
  /**
   * Creates a new empty Universe with specified dimensions
   *
   * # Arguments
   *
   * * `width` - The width of the universe
   * * `height` - The height of the universe
   */
  static new_empty(width: number, height: number): Universe;
  /**
   * Creates a new Universe with random cells and specified dimensions
   *
   * # Arguments
   *
   * * `width` - The width of the universe
   * * `height` - The height of the universe
   */
  static new_random(width: number, height: number): Universe;
  /**
   * Updates the universe's cells for a single tick
   *
   * Implements rules based on Conway's Game of Life:
   * - Any live cell with fewer than two live neighbors dies (underpopulation)
   * - Any live cell with two or three live neighbors lives to the next generation
   * - Any live cell with more than three live neighbors dies (overpopulation)
   * - Any dead cell with exactly three live neighbors becomes a live cell (reproduction)
   */
  tick(): void;
  /**
   * Sets every cell in the universe to be dead
   */
  clear(): void;
  /**
   * Sets every cell's value randomly with a 50% chance of being alive or dead
   */
  randomize(): void;
  /**
   * Renders the state of the universe as a string
   */
  render(): string;
  /**
   * Returns the width of the universe
   */
  width(): number;
  /**
   * Sets the width of the universe and resets all cells
   *
   * # Arguments
   *
   * * `width` - The new width of the universe
   */
  set_width(width: number): void;
  /**
   * Returns the height of the universe
   */
  height(): number;
  /**
   * Sets the height of the universe and resets all cells
   *
   * # Arguments
   *
   * * `height` - The new height of the universe
   */
  set_height(height: number): void;
  /**
   * Returns a pointer to the cells data for WASM interop
   */
  cells(): number;
  /**
   * Set a cell to be alive or dead at the given coordinates
   *
   * # Arguments
   *
   * * `row` - The row coordinate
   * * `column` - The column coordinate
   * * `alive` - Whether the cell should be alive or dead
   */
  set_cell(row: number, column: number, alive: boolean): void;
  /**
   * Check if a cell is alive at the given coordinates
   *
   * # Arguments
   *
   * * `row` - The row coordinate
   * * `column` - The column coordinate
   *
   * # Returns
   *
   * `true` if the cell is alive, `false` otherwise
   */
  is_cell_alive(row: number, column: number): boolean;
  static new_with_pattern_wasm(width: number, height: number, alive_cells: Array<any>): Universe;
  set_cells_wasm(alive_cells: Array<any>): void;
  get_cells_wasm(): Uint32Array;
}

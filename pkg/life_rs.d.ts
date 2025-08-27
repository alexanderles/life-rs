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
  /**
   * Toggles the state of a single cell
   *
   * # Arguments
   *
   * * `row` - The row coordinate of the cell to toggle
   * * `column` - The column coordinate of the cell to toggle
   */
  toggle_cell(row: number, column: number): void;
  /**
   * Draws a blinker pattern centered on the specified cell
   * A blinker is a simple oscillator that alternates between horizontal and vertical states.
   *
   * # Arguments
   *
   * * `row` - The row coordinate of the pattern center
   * * `column` - The column coordinate of the pattern center
   * * `horizontal` - If true, creates horizontal blinker, otherwise vertical
   *
   * Horizontal blinker:
   * ```
   * ☐☐☐
   * ```
   *
   * Vertical blinker:
   * ```
   * ☐
   * ☐
   * ☐
   * ```
   */
  draw_blinker(row: number, column: number, horizontal: boolean): void;
  /**
   * Draws a glider pattern centered on the specified cell
   *
   * A glider is a pattern that moves diagonally across the universe.
   *
   * # Arguments
   *
   * * `row` - The row coordinate of the pattern center
   * * `column` - The column coordinate of the pattern center
   *
   * Initial state:
   * ```
   *   ☐
   *     ☐ ☐
   *   ☐   ☐
   * ```
   */
  draw_glider(row: number, column: number): void;
  /**
   * Draws a pulsar pattern centered on the specified cell
   *
   * A pulsar is a period-3 oscillator that creates a complex pattern.
   *
   * # Arguments
   *
   * * `row` - The row coordinate of the pattern center
   * * `column` - The column coordinate of the pattern center
   *
   * Initial state:
   * ```
   *          ☐☐☐     ☐☐☐
   *       ☐      ☐  ☐      ☐
   *       ☐      ☐  ☐      ☐
   *       ☐      ☐  ☐      ☐
   *          ☐☐☐     ☐☐☐
   *          ☐☐☐     ☐☐☐
   *       ☐      ☐  ☐      ☐
   *       ☐      ☐  ☐      ☐
   *       ☐      ☐  ☐      ☐
   *          ☐☐☐     ☐☐☐
   * ```
   */
  draw_pulsar(row: number, column: number): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_universe_free: (a: number, b: number) => void;
  readonly universe_new: () => number;
  readonly universe_new_empty: (a: number, b: number) => number;
  readonly universe_new_random: (a: number, b: number) => number;
  readonly universe_tick: (a: number) => void;
  readonly universe_clear: (a: number) => void;
  readonly universe_randomize: (a: number) => void;
  readonly universe_render: (a: number) => [number, number];
  readonly universe_width: (a: number) => number;
  readonly universe_set_width: (a: number, b: number) => void;
  readonly universe_height: (a: number) => number;
  readonly universe_set_height: (a: number, b: number) => void;
  readonly universe_cells: (a: number) => number;
  readonly universe_set_cell: (a: number, b: number, c: number, d: number) => void;
  readonly universe_is_cell_alive: (a: number, b: number, c: number) => number;
  readonly universe_new_with_pattern_wasm: (a: number, b: number, c: any) => number;
  readonly universe_set_cells_wasm: (a: number, b: any) => void;
  readonly universe_get_cells_wasm: (a: number) => [number, number];
  readonly universe_toggle_cell: (a: number, b: number, c: number) => void;
  readonly universe_draw_blinker: (a: number, b: number, c: number, d: number) => void;
  readonly universe_draw_glider: (a: number, b: number, c: number) => void;
  readonly universe_draw_pulsar: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;

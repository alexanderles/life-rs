//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use wasm_bindgen_test::*;

extern crate life_rs;
use life_rs::Universe;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn pass() {
    assert_eq!(1 + 1, 2);
}

#[cfg(test)]
pub fn input_spaceship() -> Universe {
    let mut universe = Universe::new_empty(6, 6);
    universe.set_cells(&[(1, 2), (2, 3), (3, 1), (3, 2), (3, 3)]);
    universe
}

#[cfg(test)]
pub fn expected_spaceship() -> Universe {
    let mut universe = Universe::new_empty(6, 6);
    universe.set_cells(&[(2, 1), (2, 3), (3, 2), (3, 3), (4, 2)]);
    universe
}

#[wasm_bindgen_test]
pub fn test_tick() {
    // Let's create a smaller Universe with a small spaceship to test!
    let mut input_universe = input_spaceship();

    // This is what our spaceship should look like
    // after one tick in our universe.
    let expected_universe = expected_spaceship();

    // Call `tick` and then see if the cells in the `Universe`s are the same.
    input_universe.tick();
    assert_eq!(&input_universe.get_cells(), &expected_universe.get_cells());
}

#[wasm_bindgen_test]
pub fn test_universe_creation() {
    let universe = Universe::new();
    assert_eq!(universe.width(), 64);
    assert_eq!(universe.height(), 64);
}

#[wasm_bindgen_test]
pub fn test_cell_manipulation() {
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

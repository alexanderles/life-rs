
let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { TextDecoder, TextEncoder } = require(`util`);

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedUint32ArrayMemory0 = null;

function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

const UniverseFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_universe_free(ptr >>> 0, 1));
/**
 * The universe for Conway's Game of Life
 *
 * This struct represents a 2D grid of cells that can be alive or dead.
 * It implements the rules of Conway's Game of Life for simulation.
 */
class Universe {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Universe.prototype);
        obj.__wbg_ptr = ptr;
        UniverseFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UniverseFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_universe_free(ptr, 0);
    }
    /**
     * Creates a new empty Universe with default 64x64 dimensions
     * @returns {Universe}
     */
    static new() {
        const ret = wasm.universe_new();
        return Universe.__wrap(ret);
    }
    /**
     * Creates a new empty Universe with specified dimensions
     *
     * # Arguments
     *
     * * `width` - The width of the universe
     * * `height` - The height of the universe
     * @param {number} width
     * @param {number} height
     * @returns {Universe}
     */
    static new_empty(width, height) {
        const ret = wasm.universe_new_empty(width, height);
        return Universe.__wrap(ret);
    }
    /**
     * Creates a new Universe with random cells and specified dimensions
     *
     * # Arguments
     *
     * * `width` - The width of the universe
     * * `height` - The height of the universe
     * @param {number} width
     * @param {number} height
     * @returns {Universe}
     */
    static new_random(width, height) {
        const ret = wasm.universe_new_random(width, height);
        return Universe.__wrap(ret);
    }
    /**
     * Updates the universe's cells for a single tick
     *
     * Implements rules based on Conway's Game of Life:
     * - Any live cell with fewer than two live neighbors dies (underpopulation)
     * - Any live cell with two or three live neighbors lives to the next generation
     * - Any live cell with more than three live neighbors dies (overpopulation)
     * - Any dead cell with exactly three live neighbors becomes a live cell (reproduction)
     */
    tick() {
        wasm.universe_tick(this.__wbg_ptr);
    }
    /**
     * Sets every cell in the universe to be dead
     */
    clear() {
        wasm.universe_clear(this.__wbg_ptr);
    }
    /**
     * Sets every cell's value randomly with a 50% chance of being alive or dead
     */
    randomize() {
        wasm.universe_randomize(this.__wbg_ptr);
    }
    /**
     * Renders the state of the universe as a string
     * @returns {string}
     */
    render() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.universe_render(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Returns the width of the universe
     * @returns {number}
     */
    width() {
        const ret = wasm.universe_width(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Sets the width of the universe and resets all cells
     *
     * # Arguments
     *
     * * `width` - The new width of the universe
     * @param {number} width
     */
    set_width(width) {
        wasm.universe_set_width(this.__wbg_ptr, width);
    }
    /**
     * Returns the height of the universe
     * @returns {number}
     */
    height() {
        const ret = wasm.universe_height(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Sets the height of the universe and resets all cells
     *
     * # Arguments
     *
     * * `height` - The new height of the universe
     * @param {number} height
     */
    set_height(height) {
        wasm.universe_set_height(this.__wbg_ptr, height);
    }
    /**
     * Returns a pointer to the cells data for WASM interop
     * @returns {number}
     */
    cells() {
        const ret = wasm.universe_cells(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Set a cell to be alive or dead at the given coordinates
     *
     * # Arguments
     *
     * * `row` - The row coordinate
     * * `column` - The column coordinate
     * * `alive` - Whether the cell should be alive or dead
     * @param {number} row
     * @param {number} column
     * @param {boolean} alive
     */
    set_cell(row, column, alive) {
        wasm.universe_set_cell(this.__wbg_ptr, row, column, alive);
    }
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
     * @param {number} row
     * @param {number} column
     * @returns {boolean}
     */
    is_cell_alive(row, column) {
        const ret = wasm.universe_is_cell_alive(this.__wbg_ptr, row, column);
        return ret !== 0;
    }
    /**
     * @param {number} width
     * @param {number} height
     * @param {Array<any>} alive_cells
     * @returns {Universe}
     */
    static new_with_pattern_wasm(width, height, alive_cells) {
        const ret = wasm.universe_new_with_pattern_wasm(width, height, alive_cells);
        return Universe.__wrap(ret);
    }
    /**
     * @param {Array<any>} alive_cells
     */
    set_cells_wasm(alive_cells) {
        wasm.universe_set_cells_wasm(this.__wbg_ptr, alive_cells);
    }
    /**
     * @returns {Uint32Array}
     */
    get_cells_wasm() {
        const ret = wasm.universe_get_cells_wasm(this.__wbg_ptr);
        var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Toggles the state of a single cell
     *
     * # Arguments
     *
     * * `row` - The row coordinate of the cell to toggle
     * * `column` - The column coordinate of the cell to toggle
     * @param {number} row
     * @param {number} column
     */
    toggle_cell(row, column) {
        wasm.universe_toggle_cell(this.__wbg_ptr, row, column);
    }
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
     * @param {number} row
     * @param {number} column
     * @param {boolean} horizontal
     */
    draw_blinker(row, column, horizontal) {
        wasm.universe_draw_blinker(this.__wbg_ptr, row, column, horizontal);
    }
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
     * @param {number} row
     * @param {number} column
     */
    draw_glider(row, column) {
        wasm.universe_draw_glider(this.__wbg_ptr, row, column);
    }
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
     * @param {number} row
     * @param {number} column
     */
    draw_pulsar(row, column) {
        wasm.universe_draw_pulsar(this.__wbg_ptr, row, column);
    }
}
module.exports.Universe = Universe;

module.exports.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
    const ret = arg0.buffer;
    return ret;
};

module.exports.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments) };

module.exports.__wbg_call_7cccdd69e0791ae2 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.call(arg1, arg2);
    return ret;
}, arguments) };

module.exports.__wbg_crypto_574e78ad8b13b65f = function(arg0) {
    const ret = arg0.crypto;
    return ret;
};

module.exports.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
};

module.exports.__wbg_getRandomValues_b8f5dbd5f3995a9e = function() { return handleError(function (arg0, arg1) {
    arg0.getRandomValues(arg1);
}, arguments) };

module.exports.__wbg_get_b9b93047fe3cf45b = function(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return ret;
};

module.exports.__wbg_isArray_a1eab7e0d067391b = function(arg0) {
    const ret = Array.isArray(arg0);
    return ret;
};

module.exports.__wbg_length_e2d2a49132c1b256 = function(arg0) {
    const ret = arg0.length;
    return ret;
};

module.exports.__wbg_msCrypto_a61aeb35a24c1329 = function(arg0) {
    const ret = arg0.msCrypto;
    return ret;
};

module.exports.__wbg_new_8a6f238a6ece86ea = function() {
    const ret = new Error();
    return ret;
};

module.exports.__wbg_new_a12002a7f91c75be = function(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
};

module.exports.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
};

module.exports.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
    const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
};

module.exports.__wbg_newwithlength_a381634e90c276d4 = function(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return ret;
};

module.exports.__wbg_node_905d3e251edff8a2 = function(arg0) {
    const ret = arg0.node;
    return ret;
};

module.exports.__wbg_process_dc0fbacc7c1c06f7 = function(arg0) {
    const ret = arg0.process;
    return ret;
};

module.exports.__wbg_randomFillSync_ac0988aba3254290 = function() { return handleError(function (arg0, arg1) {
    arg0.randomFillSync(arg1);
}, arguments) };

module.exports.__wbg_require_60cc747a6bc5215a = function() { return handleError(function () {
    const ret = module.require;
    return ret;
}, arguments) };

module.exports.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
};

module.exports.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

module.exports.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

module.exports.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

module.exports.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

module.exports.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

module.exports.__wbg_subarray_aa9065fa9dc5df96 = function(arg0, arg1, arg2) {
    const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
    return ret;
};

module.exports.__wbg_versions_c01dfd4722a88165 = function(arg0) {
    const ret = arg0.versions;
    return ret;
};

module.exports.__wbindgen_init_externref_table = function() {
    const table = wasm.__wbindgen_export_2;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

module.exports.__wbindgen_is_function = function(arg0) {
    const ret = typeof(arg0) === 'function';
    return ret;
};

module.exports.__wbindgen_is_object = function(arg0) {
    const val = arg0;
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

module.exports.__wbindgen_is_string = function(arg0) {
    const ret = typeof(arg0) === 'string';
    return ret;
};

module.exports.__wbindgen_is_undefined = function(arg0) {
    const ret = arg0 === undefined;
    return ret;
};

module.exports.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return ret;
};

module.exports.__wbindgen_number_get = function(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

module.exports.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

const path = require('path').join(__dirname, 'life_rs_bg.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;

wasm.__wbindgen_start();


Meave Map Generator
==========================

`mapgen` is a CLI tool and library for Rust and WebAssembly.
It provides functionality to generate a random world map for games like a retro tactical simulation game.
A generated map consists of cells. Each cell has its altitude and kind (sea, town, plain, forest, mountain, ...).

Try it on browser by visiting [project page][proj].

Screenshot:

### Example of generated 120x120 map in 3D

![screenshot of 3D map](https://github.com/meaveio/mapgen/raw/ss/1.png)

### Example of generated map in 2D

![screenshot of 2D map](https://github.com/meaveio/mapgen/raw/ss/2.png)

I leaned the algorithm to generate world maps from [this small book](https://www.amazon.com/dp/B07MXZTTCW)
and implemented it (with small improvements).

## Installation

### Try random map generation at project page

[gh-page of this project][proj] is a demo page for showing how this package works. The demo site
is constructed with TypeScript, WebAssembly (thanks to [wasm-pack][], [wasm-bindgen][]) and webpack.
The source code of the page is in [`www/`](./www) directory.

### As Rust library

This library is shipped as [a crate][crate]. It can be installed with [cargo][]
package manager.

Please add a dependency in your project's `Cargo.toml` and run `cargo build`.

```toml
mapgen = "0.1"
```

Rust compiler supporting Rust 2018 edition is necessary.

### As WebAssembly library

This library built as WebAssembly is shipped as [npm package][npm].

```
npm install --save mapgen
```

The package contains optimized `.wasm` binary, `.js` JS file to glue between Wasm and JS, and `.d.ts`
type definition file to use this package with TypeScript.

### As command line tool

Using [cargo][], please build CLI tool from source.

```
cargo install mapgen
```

It builds `~/.cargo/bin/mapgen`.



## Usage

### Rust library

Rust library provides some modules to handle a world map as one board filled up with cells.

- `land`: `land::Land` struct represents each cell in a board
- `board`: `board::Board` struct represents one world map. The struct is JSON serializable with
  `serde_json`
- `draw`: Helper to draw a board to terminal or as JSON
- `gen`: A random world map generator to build `board::Board` struct. It provides algorithms for
  3 kinds of resolutions; low, middle, high
- `error`: Error type which may be returned from a map generator

Please read [the documentation][doc] for more details. And [CLI code](./src/main.rs) is a good
live example to know the usage.

```rust
extern mapgen;

use mapgen::RandomBoardGen;

// Create generator instance with default random number generator
let mut generator = RandomBoardGen::default();

// Generate 40x40 random world map. Map resolution (low, middle, high) is automatically
// determined by its width and height here.
//   - Low: width and height are less than 15
//   - Middle: width and height are less than 120
//   - High: Otherwise
let board = generator.gen_auto(40, 40);

// Iterate each cells per row
for (i, row) in board.rows().enumerate() {
    println!("Row: {}", i);
    for cell in row {
        // cell is a mapgen::land::Land instance

        // Lands are categorized with kind (e.g. Sea, Plain, Forest, Mountain, ...)
        println!("Kind: {:?}", cell.kind);

        // Each cell as its altitude. For example, sea's altitude is lower and mountain's is
        // higher
        println!("Altitude: {}", cell.altitude);
    }
}
```

### WebAssembly library

[www/](./www) directory is a good live example to show how to use this package in TypeScript and
WebAssembly. It is hosted at [gh-pages][proj].

[The npm package][npm] contains `mapgen.wasm` and `mapgen.js`. The `mapgen.js`
is an entry point. Bundler which support WebAssembly like [webpack](https://github.com/webpack/webpack)
handles the `.wasm` file properly when your code imports `mapgen` package.

```javascript
import { Generator, LandKind } from 'mapgen';

// Generate a new random map generator
const gen = Generator.new();

// Generate random 200x200 map
const board = gen.gen(200, 200);

for (let x = 0; x < board.width(); x++) {
    for (let y = 0; y < board.height(); y++) {
        // Get cell of specific position
        const cell = board.at(x, y);

        // Get land kind like Sea, Forest, Mountain, ...
        console.log('Kind:', cell.kind, 'at', x, y);

        // Check the cell is town
        console.log('  town?:', cell.kind === LandKind.Town);

        // Get altitude of the cell
        console.log('  Altitude:', cell.altitude);

        // Get color code of the cell as #rrggbb format
        console.log('  Color:', cell.color_code());

        // Get land legend
        console.log(' Legend:', cell.legend());
    }
}

// Get JSON representation of board
console.log(JSON.parse(board.as_json()))
```

Let's say this code is put as a file `index.js`.

As the entry point of your application, please ensure to use [dynamic import](https://github.com/tc39/proposal-dynamic-import/#import).
It is necessary because all `.wasm` code must be imported asynchronously.

```javascript
import("./index")
  .catch(e => console.error("Error importing `index.js`:", e));
```

`mapgen` package also contains `mapgen.d.ts` for working with TypeScript. You don't
need to write type definitions of APIs. TypeScript compiler automatically detects the `.d.ts` file.

Please ensure to use `esNext` for module resolution of TypeScript compiler. It translates
TypeScript's import statements into ES Modules and webpack will handle them later.

```
{
  "compilerOptions": {
    "module": "esNext",
    // ...
  },
  // ...
}
```

### CLI tool

Please read `mapgen --help` output to know the interface.

Each cell is represented with ??????. And ANSI 256 colors are used for cell colors. Some terminal
may not work properly. I'm testing this CLI tool on iTerm2.

By default, it gets terminal's width and height and uses entire terminal screen to show map.
You may need to make font size smaller temporarily to show larger maps. Map's resolution is
automatically determined from width and height by default. And you can specify them by command line
options. And `--json` outputs a randomly generated map as JSON.

```
USAGE:
    mapgen [FLAGS] [OPTIONS]

FLAGS:
    -a, --altitude    Show altitude instead of squre as cell mainly for debug
        --help        Prints help information
    -j, --json        Output JSON-serialized result to stdout
    -V, --version     Prints version information

OPTIONS:
    -h, --height <INTEGER>       Board height in number of cells
    -r, --resolution <STRING>    Resolution of world map [possible values: low, middle, high]
    -s, --seed <INTEGER>         Seed for random number generator
    -w, --width <INTEGER>        Board width in number of cells
```



## Development

[Makefile](./Makefile) provides useful scripts to develop this repository.

For debugging Wasm package from browser, please build this package with [wasm-pack][] and
`--features wasm_debug`.



## License

Distributed under [the MIT License](LICENSE.txt).


[proj]: https://meaveio.github.io/mapgen
[npm]: https://www.npmjs.com/package/mapgen
[doc-badge]: https://docs.rs/mapgen/badge.svg
[doc]: https://docs.rs/mapgen
[wasm-pack]: https://github.com/rustwasm/wasm-pack
[wasm-bindgen]: https://github.com/rustwasm/wasm-bindgen
[cargo]: https://github.com/rust-lang/cargo
[appveyor-badge]: https://ci.appveyor.com/api/projects/status/aitu2ritu4rcsykb?svg=true
[appveyor]: https://ci.appveyor.com/project/raphtlw/mapgen/branch/master
[travis-ci-badge]: https://travis-ci.org/raphtlw/mapgen.svg?branch=master
[travis-ci]: https://travis-ci.org/raphtlw/mapgen

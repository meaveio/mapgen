dev:
  cargo watch -w "./src" -s "wasm-pack build --target web --dev" -c

build:
  wasm-pack build
  cd www && npm run build

sloc:
  @echo "`wc -l src/* **/src/*` lines of code"

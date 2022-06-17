pub mod board;
pub mod draw;
pub mod error;
pub mod gen;
pub mod land;

#[cfg(target_arch = "wasm32")]
pub mod wasm;

mod color;
mod large_gen;
mod middle_gen;
mod slope;

use cfg_if::cfg_if;

cfg_if! {
    // When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
    // allocator.
    if #[cfg(feature = "wee_alloc")] {
        extern crate wee_alloc;
        #[global_allocator]
        static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
    }
}
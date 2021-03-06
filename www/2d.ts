import { Board } from "mapgen";
import { Renderer, Rendered, Legend } from "./renderer";

export default class Renderer2D implements Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d")!;
  }

  public render(board: Board): Rendered {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    // Clear at first
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.beginPath();

    const width = board.width();
    const height = board.height();
    const cellWidth = this.canvas.width / width;
    const cellHeight = this.canvas.height / height;
    const cellSize = cellWidth > cellHeight ? cellHeight : cellWidth;

    const colors = new Map<number, string>();
    const legends = new Map<number, Legend>();
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const cell = board.at(x, y);
        const kind = cell.kind;
        let color = colors.get(kind);
        if (color === undefined) {
          color = cell.color_code();
          if (color !== undefined) {
            colors.set(kind, color);
          }
        }
        this.ctx.fillStyle = color!;
        this.ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        if (!legends.has(kind)) {
          const text = cell.legend();
          legends.set(kind, { text, color });
        }
      }
    }

    this.ctx.stroke();

    return { legends };
  }
}

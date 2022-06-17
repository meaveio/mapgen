import { Board } from "mapgen";

export interface Legend {
  text: string;
  color: string | undefined;
}
export interface Rendered {
  legends: Map<number, Legend>;
}
export interface Renderer {
  render(board: Board): Rendered;
}

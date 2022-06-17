import React, { useEffect, useRef, useState } from "react";
import { Board, Generator } from "mapgen";

interface Legend {
  text: string;
  color: string | undefined;
}

interface Rendered {
  legends: Map<number, Legend>;
}

const Map = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  // Width of board in cells
  const [width, setWidth] = useState(200);
  // Height of board in cells
  const [height, setHeight] = useState(200);

  const generator = new Generator();

  const getSize = (): [number, number] => {
    if (!isNaN(width) && !isNaN(height)) {
      return [width, height];
    }

    const rect = rootRef.current?.getBoundingClientRect()!;

    if (!isNaN(width)) {
      // Note: height is NaN
      const cellPix = rect.width / width;
      return [width, Math.floor(rect.height / cellPix)];
    } else if (!isNaN(height)) {
      // Note: width is NaN
      const cellPix = rect.height / height;
      return [Math.floor(rect.width / cellPix), height];
    } else {
      const max = rect.height > rect.width ? rect.height : rect.width;
      const cellPix = max / 200;
      return [
        Math.floor(rect.width / cellPix),
        Math.floor(rect.height / cellPix),
      ];
    }
  };

  // const render = (board: Board): Rendered => {
  //   if (canvasRef.current) {
  //     const dpr = window.devicePixelRatio || 1;
  //     const rect = canvasRef.current.getBoundingClientRect();
  //     canvasRef.current.width = rect.width * dpr;
  //     canvasRef.current.height = rect.height * dpr;
  //   }
  // }

  useEffect(() => {
    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext("2d");

      if (renderCtx) {
        setContext(renderCtx);
      }
    }

    if (context) {
      context.fillStyle = "#000";
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);

      const [width, height] = getSize();
      const board = generator.gen_auto(width, height);
    }
  }, [context]);

  return (
    <div className='flex' ref={rootRef}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Map;

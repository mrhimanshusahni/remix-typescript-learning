import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  const handleZoomIn = () => {
    setScale((prevScale) => Number((prevScale + 0.1).toFixed(1)));
  };

  const handleReset = () => {
    setScale(1);
  };

  const handleRotate = () => {
    setRotate((prevRotate) => prevRotate + 90);
  };

  // console.log("scale :>> ", scale);
  // console.log("rotate :>> ", rotate);

  return (
    <div className="p-4 font-sans">
      <h1 className="text-3xl">React Scale Demo</h1>

      <div className="flex items-center gap-x-2">
        <button
          type="button"
          onClick={handleZoomIn}
          className="rounded border border-gray-400 bg-gray-300 p-1.5"
        >
          Zoom In
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="rounded border border-gray-400 bg-gray-300 p-1.5"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={handleRotate}
          className="rounded border border-gray-400 bg-gray-300 p-1.5"
        >
          Rotate
        </button>
      </div>
      <div
        className="mx-auto max-w-3xl bg-yellow-300 p-4"
        style={{ overflow: "scroll" }}
      >
        <img
          src="/images/remix-ui.png"
          className="transform transition-transform duration-300"
          style={{
            transform: `scale(${scale}) rotate(${rotate}deg)`,
          }}
          alt="remix-ui"
        />
      </div>
    </div>
  );
}

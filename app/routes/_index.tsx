import type { MetaFunction } from "@remix-run/node";
import { useRef } from "react";
import { Counter, CounterRef } from "~/components/counter";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const counterRef = useRef<CounterRef>(null);

  return (
    <div className="p-4 font-sans">
      <h1 className="text-3xl">React useImperativeHandle Hook</h1>

      <Counter ref={counterRef} />

      <button type="button" onClick={() => counterRef.current?.reset()}>
        Reset From Parent
      </button>
    </div>
  );
}

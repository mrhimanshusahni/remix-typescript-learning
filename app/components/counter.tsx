import {
  useImperativeHandle,
  useState,
  forwardRef,
  Ref,
  useEffect,
} from "react";

interface CounterProps {}

export type CounterRef = {
  reset: () => void;
};

const Counter = forwardRef((props: CounterProps, ref: Ref<CounterRef>) => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  const reset = () => {
    setCount(0);
  };

  useImperativeHandle(ref, () => ({
    reset,
  }));

  function Bookmarks({ category }) {
    const [data, setData] = useState([]);
    const [error, setError] = useState();

    useEffect(() => {
      const fetchCategory = (async = () => {
        try {
          const initResponse = await fetch(`${endpoint}/${category}`);
          const response = await initResponse.json();

          setData(response);
        } catch (error) {
          setError(error);
        }
      });
    }, [category]);

    // Return JSX based on data and error states
  }

  return (
    <div>
      <h1 className="text-2xl">Count: {count}</h1>
      <button onClick={decrement} type="button">
        Decrement
      </button>
      <button onClick={increment} type="button">
        Increment
      </button>
    </div>
  );
});

Counter.displayName = "Counter";

export { Counter };

import { useEffect, useState } from 'react';
import { useRef, useCallback } from 'react';

export const useDebounceFn = (fn, delay) => {
  const timer = useRef(null);

  const debouncedFn = useCallback((...args) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      fn(...args);
    }, delay);
  }, [fn, delay]);

  return debouncedFn;
};


export const useDebounceVal = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};


// const deBounce = (fn, delay) => {
//     let timer;
//     return (...args) => {
//       clearTimeout(timer);
//       timer = setTimeout(() => {
//         fn(...args);
//       }, delay);
//     };
//   };
// const deBounceHandler = useCallback(debounce(fn,delay),[])
// OR
// const deBounceHandler = useCallback(()=>debounce(fn,delay),[]) - this will not work
// const deBounceHandler = useMemo(()=> debounce(fn,delay),[]) - this will work but should not used


import { useRef, useCallback } from 'react';

const useThrottle = (fn, delay) => {
  const timerRef = useRef(null);

  const throttledFn = useCallback((...args) => {
    if (timerRef.current === null) {
      fn(...args);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
      }, delay);
    }
  }, [fn, delay]);

  return throttledFn;
};

export default useThrottle;


// const throttle = (fn, delay) => {
//   let timer;
//   return (...args) => {
//     if (!timer) {
//       fn(...args);
//       timer = setTimeout(() => {
//         timer = null;
//       }, delay);
//     }
//   };
// };
// const throtlleHandler = useCallback(throttle(fn,delay),[])
// OR
// const throtlleHandler = useCallback(()=>throttle(fn,delay),[]) - this will not work
// const throtlleHandler = useMemo(()=> throttle(fn,delay),[]) - this will work but should not used

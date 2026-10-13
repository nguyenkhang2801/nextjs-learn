'use client';

import debounce from 'lodash/debounce';
import { useEffect, useMemo, useRef } from 'react';

const useDebounce = <T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number,
) => {
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const debounced = useMemo(
    () => debounce((...args: T) => fnRef.current(...args), delay),
    [delay],
  );

  useEffect(() => {
    return () => debounced.cancel();
  }, [debounced]);

  return debounced;
};

export default useDebounce;

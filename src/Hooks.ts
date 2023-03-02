import {useEffect, useRef} from 'react';

export const usePrevious = (value: any) => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export const usePreviousPath = (path: string) => {
  // The actual previous value
  const previousPath = useRef(path);
  // This one is used only for detecting the moment it changes
  const oldPath = usePrevious(path);

  useEffect(() => {
    if (path !== oldPath) {
      previousPath.current = oldPath;
    }
  }, [path, oldPath]);

  return previousPath.current;
};

export default {usePrevious, usePreviousPath};

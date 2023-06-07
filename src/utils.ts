import { useEffect, useRef } from 'react';
import { GRASS, MOUNTAIN, TERRAIN_TYPE, TREE, WATER, CITY } from '@constants';

import mountainImg from 'assets/mountain.svg';
import grassImg from 'assets/grass.svg';
import treeImg from 'assets/tree.svg';
import waterImg from 'assets/water.svg';
import cityImg from 'assets/city.svg';

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const bgMap: {
  [key: string]: string;
} = {
  [MOUNTAIN]: mountainImg,
  [GRASS]: grassImg,
  [TREE]: treeImg,
  [WATER]: waterImg,
  [CITY]: cityImg,
};

export function getTerrainBackground(terrain: TERRAIN_TYPE) {
  return bgMap[terrain] || '';
}

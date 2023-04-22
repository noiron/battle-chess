export const CELL_SIZE = 36;

// 定义不同的地形
export const PLAIN = 0;
export const MOUNTAIN = 1;
export const GRASS = 2;
export const TREE = 3;
export const WATER = 4;

export type TERRAIN_TYPE =
  | typeof PLAIN
  | typeof MOUNTAIN
  | typeof GRASS
  | typeof TREE
  | typeof WATER;

export const TERRAIN_TEXT: {
  [key in TERRAIN_TYPE]: string;
} = {
  [PLAIN]: '平原',
  [MOUNTAIN]: '山地',
  [GRASS]: '草地',
  [TREE]: '树林',
  [WATER]: '河流',
};

/** 兵种类型 */
export type TROOP_TYPE = 'infantry' | 'cavalry' | 'archer' | 'navy';

export const TROOP_MAP: {
  [key in TROOP_TYPE]: string;
} = {
  infantry: '步兵',
  cavalry: '骑兵',
  archer: '弓兵',
  navy: '水军',
};

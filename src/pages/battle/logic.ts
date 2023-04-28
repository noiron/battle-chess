import lodash from 'lodash';
import { Pos } from 'src/types';
import { COLS, FigureType, ROWS } from '.';
import {
  GRASS,
  MOUNTAIN,
  PLAIN,
  TREE,
  TROOP_TYPE,
  WATER,
  TERRAIN_TYPE,
} from '@constants';
import { terrain } from './data';

export const getTerrain = ({ x, y }: Pos) => {
  // 以下两行仅做测试
  // x = x % terrain[0].length;
  // y = y % terrain.length;

  const type = terrain[y][x];
  return type || 0;
};

/**
 * 根据棋子信息获取可移动范围
 */
export function getMovementRange(figure: FigureType) {
  const { type: figureType, x, y } = figure;

  const movePointMap: { [type in TROOP_TYPE]: number } = {
    cavalry: 3,
    infantry: 2,
    archer: 2,
    navy: 1.5,
  };

  return getMoveRangeDFS({ x, y }, figureType, movePointMap[figureType]);
}

function getMoveRangeDFS(
  start: Pos,
  troopType: TROOP_TYPE,
  movePoint: number,
  visitedSet: Set<string> = new Set()
) {
  const moveRange: Pos[] = [];
  const { x, y } = start;
  const posStr = `${x},${y}`;

  if (visitedSet.has(posStr)) {
    return [];
  }
  visitedSet.add(posStr);

  // 终止条件
  if (movePoint < 0 || x < 0 || y < 0 || x >= COLS || y >= ROWS) {
    return moveRange;
  }

  moveRange.push(start);

  // 递归搜索上下左右四个方向
  const directions = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ];

  for (const direction of directions) {
    const nextX = start.x + direction.x;
    const nextY = start.y + direction.y;
    if (nextX < 0 || nextY < 0 || nextX >= COLS || nextY >= ROWS) {
      continue;
    }

    const terrainType = getTerrain({ x: nextX, y: nextY });
    const cost = getCost(terrainType, troopType);
    const nextMovePoint = movePoint - cost;

    // 递归搜索下一个位置
    const nextMoveRange = getMoveRangeDFS(
      { x: nextX, y: nextY },
      troopType,
      nextMovePoint,
      new Set(visitedSet)
    );

    // 将搜索到的位置合并到移动范围中
    moveRange.push(...nextMoveRange);
  }
  return moveRange;
}

/**
 * 根据兵种和地形获取移动消耗
 */
function getCost(terrainType: TERRAIN_TYPE, troopType: TROOP_TYPE) {
  const terrainCost = {
    [PLAIN]: 1,
    [MOUNTAIN]: 1.5,
    [GRASS]: 1,
    [TREE]: 1.2,
    [WATER]: 2,
  };
  let cost = terrainCost[terrainType];
  // 水军在水中移动消耗减少
  if (terrainType === WATER && troopType === 'navy') {
    cost /= 4;
  }
  return cost;
}

export function checkInAttackRange(figure: FigureType, { x, y }: Pos) {
  const { type: figureType } = figure;
  const xDist = Math.abs(x - figure.x);
  const yDist = Math.abs(y - figure.y);

  // return true;

  switch (figureType) {
    case 'cavalry':
      // 骑兵只能攻击直线
      return (xDist === 1 && yDist === 0) || (yDist === 1 && xDist === 0);

    case 'archer':
      // 弓箭手不能攻击身边位置
      if (xDist + yDist <= 1) return false;
      if (xDist + yDist <= 2) return true;
      return false;

    default:
      return (
        Math.abs(x - figure.x) <= 1 &&
        Math.abs(y - figure.y) <= 1 &&
        (x !== figure.x || y !== figure.y)
      );
  }
}

export function chooseMovePosition(
  allFigures: FigureType[],
  enemyFigure: FigureType
) {
  const availablePos = getMovementRange(enemyFigure).filter((pos) => {
    // 不能移动到已有棋子的位置
    const figure = getFigureByPos(allFigures, pos);
    return !figure;
  });

  // 没有可选位置时，返回原位置
  if (availablePos.length === 0) {
    return { x: enemyFigure.x, y: enemyFigure.y };
  }

  const opponents = allFigures.filter((f) => f.side !== enemyFigure.side);
  const opponentsCenterPos = calculateCenterPos(opponents);

  // 优先移动到对手中心位置
  availablePos.sort((a, b) => {
    const aDist =
      Math.abs(a.x - opponentsCenterPos.x) +
      Math.abs(a.y - opponentsCenterPos.y);
    const bDist =
      Math.abs(b.x - opponentsCenterPos.x) +
      Math.abs(b.y - opponentsCenterPos.y);
    return aDist - bDist;
  });
  return availablePos[0];
}

function getFigureByPos(allFigures: FigureType[], pos: Pos) {
  return allFigures.find((f) => f.x === pos.x && f.y === pos.y);
}

export function calculateCenterPos(figures: FigureType[]) {
  const x = lodash.meanBy(figures, (f) => f.x);
  const y = lodash.meanBy(figures, (f) => f.y);
  return { x, y };
}

export function calculateInjury(source: FigureType, target: FigureType) {
  // 可以简单地假设：攻击力 = 武力，防御力 = 智力
  // <del>或者考虑智力属性低的武将的防御力会过低，可以使用两者之和</del>
  const attack = calculateAttack(source);
  const defense = calculateDefense(target);
  const injury = Math.floor((attack / defense) * source.life * 0.3) + 1;
  return Math.min(injury, target.life);
}

export function calculateAttack(figure: FigureType) {
  const troopRatio = attackRatios[figure.type];
  return figure.power * troopRatio;
}

export function calculateDefense(figure: FigureType) {
  const terrain = getTerrain(figure);
  // 根据地形和兵种决定防御加成
  const troopRatio = defenseRatios[figure.type];
  const terrainRatio = terrainDefense[figure.type][terrain];
  // FIXME:
  return figure.intelligence * troopRatio * terrainRatio;
}

type TerrainEffect = {
  [type in TROOP_TYPE]: {
    0: number;
    [MOUNTAIN]: number;
    [GRASS]: number;
    [TREE]: number;
    [WATER]: number;
  };
};

export const terrainDesc: {[type in TERRAIN_TYPE]: string} = {
  [PLAIN]: '适合各兵种作战',
  [MOUNTAIN]: '适合步兵和弓兵作战，增加20%防御力。骑兵防御力降低20%。',
  [GRASS]: '适合各兵种作战',
  [TREE]: '适合步兵和弓兵作战，增加20%防御力。骑兵防御力降低20%。',
  [WATER]: '适合水军作战，其余各兵种降低防御力。'
}

const terrainDefense: TerrainEffect = {
  // 步兵在森林和山地地形增加防御力
  infantry: {
    [PLAIN]: 1,
    [MOUNTAIN]: 1.2,
    [GRASS]: 1,
    [TREE]: 1.2,
    [WATER]: 0.7,
  },
  // 弓兵在森林和山地地形增加防御力
  archer: {
    [PLAIN]: 1,
    [MOUNTAIN]: 1.2,
    [GRASS]: 1,
    [TREE]: 1.2,
    [WATER]: 0.7,
  },
  // 骑兵在森林和山地的防御力下降
  cavalry: {
    [PLAIN]: 1,
    [MOUNTAIN]: 0.8,
    [GRASS]: 1,
    [TREE]: 0.8,
    [WATER]: 0.7,
  },
  navy: {
    [PLAIN]: 1,
    [MOUNTAIN]: 1,
    [GRASS]: 1,
    [TREE]: 1,
    [WATER]: 1,
  },
};

/** 不同兵种的攻击加成 */
const attackRatios = {
  cavalry: 1,
  infantry: 0.8,
  archer: 0.9,
  navy: 0.8,
};

/** 不同兵种的防御加成 */
const defenseRatios = {
  cavalry: 0.7,
  infantry: 1.2,
  archer: 1.0,
  navy: 1.0,
};

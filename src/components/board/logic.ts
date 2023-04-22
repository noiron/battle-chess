import lodash from 'lodash';
import { Pos } from 'src/types';
import { FigureType } from '.';
import { GRASS, MOUNTAIN, PLAIN, TREE, TROOP_TYPE, WATER } from '@constants';
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
  const ranges: Pos[] = [];
  const MAX = 2;

  switch (figureType) {
    case 'cavalry':
      for (let i = x - MAX; i <= x + MAX; i++) {
        for (let j = y - MAX; j <= y + MAX; j++) {
          if (i === x && j === y) continue;
          if (Math.abs(i - x) + Math.abs(j - y) <= MAX) {
            ranges.push({ x: i, y: j });
          }
        }
      }
      break;

    default:
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          if (i === x && j === y) continue;
          ranges.push({ x: i, y: j });
        }
      }
  }
  return ranges;
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

function calculateCenterPos(figures: FigureType[]) {
  const x = lodash.meanBy(figures, (f) => f.x);
  const y = lodash.meanBy(figures, (f) => f.y);
  return { x, y };
}

export function calculateInjury(source: FigureType, target: FigureType) {
  // 可以简单地假设：攻击力 = 武力，防御力 = 智力
  // <del>或者考虑智力属性低的武将的防御力会过低，可以使用两者之和</del>
  const attack = calculateAttack(source);
  const defense = calculateDefense(target);
  const injury = Math.floor((attack / defense) * source.life * 0.2) + 1;
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

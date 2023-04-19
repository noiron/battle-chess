import lodash from 'lodash';
import { Pos } from 'src/types';
import { FigureType } from '.';

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
      return Math.abs(x - figure.x) <= 1 && Math.abs(y - figure.y) <= 1;
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
    return {x: enemyFigure.x, y: enemyFigure.y };
  }

  const opponents = allFigures.filter((f) => f.side !== enemyFigure.side);
  const opponentsCenterPos = calculateCenterPos(opponents);

  // 优先移动到对手中心位置
  availablePos.sort((a, b) => {
    const aDist = Math.abs(a.x - opponentsCenterPos.x) + Math.abs(a.y - opponentsCenterPos.y);
    const bDist = Math.abs(b.x - opponentsCenterPos.x) + Math.abs(b.y - opponentsCenterPos.y);
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
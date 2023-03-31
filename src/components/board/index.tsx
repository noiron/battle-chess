import { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import lodash from 'lodash';
import styled from 'styled-components';
import { Pos } from '../../types';
import Cell from './cell';
import Figure from './figure';
import { TERRAIN_TYPE } from '../../constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { delay } from '../../utils';

const ROWS = 10;
const COLS = 16;

const StyledBoard = styled.div`
  padding: 10px;
  background: #fff;
  border-radius: 10px;
  position: relative;
  padding-bottom: 60px;

  .inner {
    position: relative;
  }

  .info {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 50px;
    width: 100%;
    border-top: 1px solid #000;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
`;

type FigureType = {
  id: number;
  x: number;
  y: number;
  type: string;
  /** 是否可执行操作 */
  actionable: boolean;
};

const figures: FigureType[] = [
  {
    id: 1,
    x: 2,
    y: 2,
    type: 'knight',
    actionable: true,
  },
  {
    id: 2,
    x: 3,
    y: 3,
    type: 'king',
    actionable: true,
  },
  {
    id: 3,
    x: 5,
    y: 6,
    type: 'archer',
    actionable: true,
  },
  {
    id: 4,
    x: 7,
    y: 6,
    type: 'cavalry',
    actionable: true,
  },
];

const StyledRow = styled.div`
  display: flex;
`;

const terrain: TERRAIN_TYPE[][] = [
  [1, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 2, 2, 2, 2, 2],
  [0, 0, 0, 2, 0, 0, 3, 3, 3, 3, 0, 0, 2, 2, 0, 0],
  [2, 2, 2, 2, 0, 0, 3, 1, 3, 3, 0, 0, 2, 2, 0, 0],
  [4, 4, 4, 4, 4, 1, 1, 1, 0, 3, 0, 0, 0, 2, 2, 2],
  [4, 4, 4, 4, 4, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0],
  [3, 3, 3, 3, 4, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0],
  [3, 0, 0, 3, 4, 3, 3, 3, 0, 0, 0, 3, 3, 3, 3, 3],
  [0, 0, 3, 3, 4, 2, 2, 2, 2, 0, 0, 0, 0, 3, 3, 3],
  [0, 0, 3, 3, 4, 2, 2, 2, 2, 0, 0, 0, 0, 3, 3, 3],
];

const getTerrain = (x: number, y: number) => {
  // 以下两行仅做测试
  // x = x % terrain[0].length;
  // y = y % terrain.length;

  const type = terrain[y][x];
  return type || 0;
};

// 棋子分为以下的几种状态：
// 1. 未选中状态 [normal]
// 2. 选中状态，展示可移动的位置 [move]
// 3. 执行了移动操作，展示可选择操作菜单 [action]
// 4.1 选择了攻击操作，展示可攻击的位置 [attack]
// 5.1 取消了攻击，则回到状态2
// 5.2 执行了攻击，则回到状态1
type FigureStatus = 'normal' | 'move' | 'action' | 'attack';

interface BoardProps {}

const Board = (props: BoardProps) => {
  const [allFigures, setAllFigures] = useState([...figures]);
  const [selectedFigure, setSelectedFigure] = useState<FigureType | null>(null);
  const [availablePos, setAvailablePos] = useState<Pos[]>([]);
  const [figureStatus, setFigureStatus] = useState<FigureStatus>('normal');
  const [showFigureMenu, setShowFigureMenu] = useState(false);
  const [days, setDays] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();

  const [shakeId, setShakeId] = useState(-1);

  useEffect(() => {
    if (selectedFigure) {
      const { x, y, type } = selectedFigure;

      // TODO: 如何通用判断可移动位置
      if (type === 'knight') {
        setAvailablePos([
          { x: x, y: y - 1 },
          { x: x, y: y - 2 },
          { x: x, y: y + 1 },
          { x: x, y: y + 2 },
          { x: x - 1, y: y },
          { x: x - 2, y: y },
          { x: x + 1, y: y },
          { x: x + 2, y: y },
        ]);
      } else {
        setAvailablePos([
          { x: x - 1, y: y - 1 },
          { x: x, y: y - 1 },
          { x: x + 1, y: y - 1 },
          { x: x - 1, y: y },
          { x: x + 1, y: y },
          { x: x - 1, y: y + 1 },
          { x: x, y: y + 1 },
          { x: x + 1, y: y + 1 },
        ]);
      }
    } else {
      setAvailablePos([]);
    }
  }, [selectedFigure]);

  const moveFigure = (id: number, newPos: Pos, moveBack = false) => {
    const index = allFigures.findIndex((f) => f.id === id);
    const oldFigure = allFigures[index];
    const { x: oldX, y: oldY } = oldFigure;
    const newFigure = Object.assign({}, oldFigure, {
      x: newPos.x,
      y: newPos.y,
    });
    allFigures.splice(index, 1, newFigure);
    const newFigures = [...allFigures];

    // 移动之后进入操作选择状态
    setAllFigures(newFigures);
    setFigureStatus('action');
    setSelectedFigure(newFigure);

    // 这里延迟是为了在棋子移动到位后再显示菜单
    setTimeout(() => {
      setShowFigureMenu(true);
    }, 500);

    const timer = setTimeout(() => {
      if (moveBack) {
        moveFigure(oldFigure.id, { x: oldX, y: oldY }, false);
      }
      clearTimeout(timer);
    }, 1000);
  };

  /** 点击操作菜单的攻击选项 */
  const attackAction = () => {
    setFigureStatus('attack');
    setShowFigureMenu(false);
  };

  /** 点击操作菜单的待机选项 */
  const waitForNextTurn = () => {
    const index = allFigures.findIndex((f) => f.id === selectedFigure?.id);
    const oldFigure = allFigures[index];
    const newFigure = Object.assign({}, oldFigure, {
      actionable: false,
    });
    allFigures.splice(index, 1, newFigure);
    const newFigures = [...allFigures];

    setAllFigures(newFigures);
    setFigureStatus('normal');
    setSelectedFigure(null);
    setShowFigureMenu(false);
  };


  return (
    <StyledBoard>
      <div className="inner">
        {lodash.range(ROWS).map((_, y) => {
          return (
            <StyledRow key={y}>
              {lodash.range(COLS).map((_, x) => {
                // 这个位置是否可作为目标位置
                const isAvailable = availablePos.some(
                  (a) => a.x === x && a.y === y
                );
                const isSelected =
                  x === selectedFigure?.x && y === selectedFigure?.y;

                const isInAttackRange = selectedFigure
                  ? checkInAttackRange(x, y, selectedFigure)
                  : false;

                return (
                  <Cell
                    key={x}
                    isSelected={isSelected}
                    onClick={() => {
                      // 移动选中的棋子至这个位置
                      if (
                        selectedFigure &&
                        isAvailable &&
                        figureStatus === 'move'
                      ) {
                        moveFigure(selectedFigure.id, { x, y }, false);
                        return;
                      }
                      // 攻击
                      if (
                        selectedFigure &&
                        isInAttackRange &&
                        figureStatus === 'attack'
                      ) {
                        message.info('无效的攻击目标');
                        // 重置棋子状态
                        setFigureStatus('normal');
                        setSelectedFigure(null);
                        return;
                      }
                    }}
                    isAvailable={isAvailable}
                    terrain={getTerrain(x, y)}
                    isInAttackRange={isInAttackRange}
                    figureStatus={figureStatus}
                  />
                );
              })}
            </StyledRow>
          );
        })}

        {allFigures.map((figure) => {
          const isSelected = selectedFigure?.id === figure.id;

          return (
            <Figure
              key={figure.id}
              {...figure}
              isSelected={isSelected}
              attackAction={attackAction}
              waitForNextTurn={waitForNextTurn}
              showMenu={isSelected && showFigureMenu}
              onClick={() => {
                // 如果当前棋子不可操作，则不做任何处理
                if (!figure.actionable) {
                  return;
                }

                // 如果当前没有选中的棋子，则选中当前棋子
                if (!selectedFigure) {
                  setFigureStatus('move');
                  setSelectedFigure(figure);
                  return;
                }

                // 如果选中的棋子是当前棋子，且棋子已处于待移动状态，则进入操作选择状态
                if (
                  selectedFigure.id === figure.id &&
                  figureStatus === 'move'
                ) {
                  setFigureStatus('action');
                  return;
                }

                if (
                  figureStatus === 'attack' &&
                  selectedFigure.id !== figure.id &&
                  checkInAttackRange(figure.x, figure.y, selectedFigure)
                ) {
                  message.info('执行攻击，对方生命值减少');
                  // 重置选中棋子状态
                  setFigureStatus('normal');
                  setSelectedFigure(null);
                  return;
                }
              }}
              className={shakeId === figure.id ? 'shake' : ''}
            />
          );
        })}
      </div>

      <div className="info">
        <span>第 {days} 天</span>
        <Button
          onClick={() => {
            // TODO: 敌方策略

            const newFigures = allFigures.map((figure) => {
              return Object.assign({}, figure, {
                actionable: true,
              });
            });
            setAllFigures(newFigures);

            setDays(days + 1);

            // 状态重置
            setFigureStatus('normal');
            setSelectedFigure(null);
            setShowFigureMenu(false);
          }}
        >
          结束策略
        </Button>
        <Button
          onClick={async () => {
            const {
              state: { war },
            } = location;
            if (war) {
              message.info(`终止进攻 ${war.target}，返回 ${war.source}`);
              await delay(2000);
            }
            navigate('/country');
          }}
        >
          结束战斗
        </Button>
      </div>
    </StyledBoard>
  );
};

function checkInAttackRange(x: number, y: number, figure: FigureType) {
  return Math.abs(x - figure.x) <= 1 && Math.abs(y - figure.y) <= 1;
}

export default Board;

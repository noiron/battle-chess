import { useEffect, useState, useReducer } from 'react';
import { Button, message, Modal } from 'antd';
import lodash from 'lodash';
import styled from 'styled-components';
import { Pos } from '../../types';
import Cell from './cell';
import Figure from './figure';
import { TERRAIN_TEXT, TERRAIN_TYPE, TROOP_MAP, TROOP_TYPE } from '@constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { delay } from '../../utils';
import { checkInAttackRange, getMovementRange } from './utils';
import { figures } from './data';
import BottomInfo from './bottom-info';

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

export type FigureType = {
  id: number;
  x: number;
  y: number;
  type: TROOP_TYPE;
  /** 是否可执行操作 */
  actionable: boolean;
  /** 区分敌我 */
  side: 'enemy' | 'ally';
  name: string;
  life: number;
};

export type ClickEntity =
  | {
      entityType: 'terrain';
      pos: Pos;
      terrain: TERRAIN_TYPE;
    }
  | ({
      entityType: 'figure';
    } & FigureType);

const StyledRow = styled.div`
  display: flex;
`;

const terrain: TERRAIN_TYPE[][] = [
  [1, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 2, 2, 2, 2, 2],
  [0, 0, 0, 2, 0, 0, 3, 3, 3, 3, 0, 0, 2, 2, 0, 0],
  [2, 2, 2, 2, 0, 0, 3, 1, 3, 3, 0, 0, 2, 2, 0, 0],
  [4, 4, 4, 4, 4, 4, 1, 1, 1, 0, 3, 0, 0, 0, 2, 2],
  [4, 4, 4, 4, 4, 4, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 4, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0],
  [3, 3, 3, 0, 4, 4, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2],
  [3, 3, 3, 0, 4, 4, 3, 3, 3, 0, 0, 0, 3, 3, 3, 3],
  [0, 3, 0, 0, 4, 4, 2, 2, 2, 2, 0, 0, 0, 0, 3, 3],
  [0, 3, 0, 0, 4, 4, 2, 2, 2, 2, 0, 0, 0, 0, 3, 3],
];

const getTerrain = ({ x, y }: Pos) => {
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

interface FigureState {
  status: FigureStatus;
  showMenu: boolean;
  selectedFigure: FigureType | null;
}

type Actions =
  | {
      type: 'normal' | 'attack' | 'showMenu';
    }
  | {
      type: 'move';
      figure: FigureType;
    }
  | {
      type: 'action';
      figure?: FigureType | null;
      showMenu: boolean;
    };

function reducer(state: FigureState, action: Actions): FigureState {
  switch (action.type) {
    case 'normal': {
      return {
        status: 'normal',
        showMenu: false,
        selectedFigure: null,
      };
    }

    // 选中棋子
    case 'move': {
      return {
        selectedFigure: action.figure,
        status: 'move',
        showMenu: false,
      };
    }

    // 移动后，展示操作菜单；如果位置未改变，则保持支持选中的棋子信息
    case 'action': {
      return {
        selectedFigure: action.figure || state.selectedFigure,
        status: 'action',
        showMenu: action.showMenu,
      };
    }

    case 'showMenu': {
      return {
        ...state,
        showMenu: true,
      };
    }

    case 'attack': {
      return {
        selectedFigure: state.selectedFigure,
        status: 'attack',
        showMenu: false,
      };
    }
  }
}

const Board = (props: BoardProps) => {
  const [allFigures, setAllFigures] = useState([...figures]);
  const [availablePos, setAvailablePos] = useState<Pos[]>([]);
  const [days, setDays] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [figureState, dispatch] = useReducer<
    (state: FigureState, actions: Actions) => FigureState
  >(reducer, {
    status: 'normal',
    showMenu: false,
    selectedFigure: null,
  });

  const [clickEntity, setClickEntity] = useState<ClickEntity | null>(null);

  useEffect(() => {
    if (figureState.selectedFigure) {
      setAvailablePos(getMovementRange(figureState.selectedFigure));
    } else {
      setAvailablePos([]);
    }
  }, [figureState.selectedFigure]);

  /** 根据 ID 更新棋子的部分属性 */
  const updateFigure = (id: number, newFigureProps: Partial<FigureType>) => {
    let newFigure = null;
    setAllFigures((allFigures) => {
      const index = allFigures.findIndex((f) => f.id === id);
      if (index === -1) return allFigures;

      const oldFigure = allFigures[index];
      newFigure = Object.assign({}, oldFigure, newFigureProps);
      allFigures.splice(index, 1, newFigure);
      return [...allFigures];
    });
    return newFigure;
  };

  const moveFigure = (id: number, newPos: Pos, isAuto = false) => {
    const newFigure = updateFigure(id, {
      x: newPos.x,
      y: newPos.y,
    });

    // 移动之后进入操作选择状态
    dispatch({ type: 'action', figure: newFigure, showMenu: false });

    // 这里延迟是为了在棋子移动到位后再显示菜单
    setTimeout(() => {
      if (!isAuto) dispatch({ type: 'showMenu' });
    }, 500);
  };

  /** 点击操作菜单的攻击选项 */
  const attackAction = () => {
    dispatch({ type: 'attack' });
  };

  /** 点击操作菜单的待机选项 */
  const waitForNextTurn = () => {
    if (!figureState.selectedFigure) return;

    updateFigure(figureState.selectedFigure.id, {
      actionable: false,
    });
    dispatch({ type: 'normal' });
  };

  /**
   * 敌方行动
   * 依次选中所有的敌方棋子，执行移动及攻击
   */
  const enemyAction = async () => {
    const enemyFigures = allFigures.filter((f) => f.side === 'enemy');

    for (let i = 0; i < enemyFigures.length; i++) {
      const enemyFigure = enemyFigures[i];
      dispatch({ type: 'move', figure: enemyFigure });

      await delay(1500);
      // TODO: 暂时保持原地
      moveFigure(enemyFigure.id, { x: enemyFigure.x, y: enemyFigure.y }, true);

      // 检查是否有我方棋子在攻击范围内，如果有，则攻击
      const inRangeFigures = allFigures.filter((f) => {
        return (
          f.side === 'ally' &&
          checkInAttackRange(enemyFigure, { x: f.x, y: f.y })
        );
      });
      dispatch({ type: 'attack' });

      await delay(1500);
      if (inRangeFigures.length > 0) {
        attack(enemyFigure, inRangeFigures[0]);
        dispatch({ type: 'normal' });
      }
    }
  };

  const attack = async (source: FigureType, target: FigureType) => {
    const injure = 50;
    message.info(
      `${source.name} 攻击了 ${target.name}，造成了 ${injure} 点伤害`
    );
    await delay(1000);
    const remainLife = target.life - injure;
    updateFigure(target.id, { life: remainLife });
    updateFigure(source.id, { actionable: false });

    if (remainLife <= 0) {
      message.info(`${target.name} 被击败了`);
      setAllFigures((allFigures) => [
        ...allFigures.filter((f) => f.id !== target.id),
      ]);
    }
  };

  // fixme: 棋子仅移动而没有攻击时，也会修改 allFigures，导致重新调用
  useEffect(() => {
    if (isGameOver) return;

    checkResult();
  }, [allFigures]);

  /** 胜利结算 */
  const checkResult = () => {
    const isAlive = (f: FigureType) => f.life > 0;

    const aliveAllies = allFigures
      .filter((f) => f.side === 'ally')
      .filter(isAlive);
    const lose = aliveAllies.length === 0;

    const aliveEnemies = allFigures
      .filter((f) => f.side === 'enemy')
      .filter(isAlive);
    const win = aliveEnemies.length === 0;

    if (!win && !lose) return;

    setIsGameOver(true);

    setTimeout(() => {
      message.destroy();
      Modal.info({
        title: win ? '🎉 我方胜利 🎉' : '💀 我方战败 💀',
        content: null,
        onOk() {},
        okText: '阅',
      });
    }, 2000);
  };

  /** 结束当前回合 */
  const endThisTurn = async () => {
    await enemyAction();
    setAllFigures((allFigures) => {
      const newFigures = allFigures.map((figure) => {
        return Object.assign({}, figure, {
          actionable: true,
        });
      });
      return newFigures;
    });

    setDays(days + 1);

    // 状态重置
    dispatch({ type: 'normal' });
  };

  const endBattle = async () => {
    const {
      state: { war },
    } = location;
    if (war) {
      message.info(`终止进攻 ${war.target}，返回 ${war.source}`);
      await delay(2000);
    }
    navigate('/country');
  };

  const clickCell = ({
    pos,
    isAvailable,
    isInAttackRange,
  }: {
    pos: Pos;
    isAvailable: boolean;
    isInAttackRange: boolean;
  }) => {
    const selectedFigure = figureState.selectedFigure;

    // 移动选中的棋子至这个位置
    if (selectedFigure && isAvailable && figureState.status === 'move') {
      moveFigure(selectedFigure.id, pos);
      return;
    }
    // 攻击
    if (selectedFigure && isInAttackRange && figureState.status === 'attack') {
      message.info('无效的攻击目标');
      // 重置棋子状态至操作选择状态
      dispatch({ type: 'action', showMenu: true });
      return;
    }

    setClickEntity({
      entityType: 'terrain',
      pos,
      terrain: getTerrain(pos),
    });
  };

  const clickFigure = (figure: FigureType) => {
    const selectedFigure = figureState.selectedFigure;

    setClickEntity({ entityType: 'figure', ...figure });
    // 当前没有选中的棋子
    if (!selectedFigure) {
      // 如果这个棋子不可操作，则不做任何处理
      if (!figure.actionable || figure.side !== 'ally') {
        return;
      }
      // 选中当前棋子
      dispatch({ type: 'move', figure });
      return;
    }

    // 如果选中的棋子是当前棋子，且棋子已处于待移动状态，则进入操作选择状态
    if (selectedFigure.id === figure.id && figureState.status === 'move') {
      dispatch({ type: 'action', showMenu: true });
      return;
    }

    // 点击了非选中状态的棋子
    if (
      selectedFigure.id !== figure.id &&
      figureState.status === 'attack' &&
      checkInAttackRange(selectedFigure, {
        x: figure.x,
        y: figure.y,
      }) &&
      figure.side !== 'ally'
    ) {
      attack(selectedFigure, figure);
      // 重置选中棋子状态
      dispatch({ type: 'normal' });
      return;
    }

    // 点击了另一个我方可移动棋子
    if (
      selectedFigure.id !== figure.id &&
      figureState.status === 'move' &&
      figure.side === 'ally' &&
      figure.actionable === true
    ) {
      dispatch({ type: 'move', figure });
    }
  };

  return (
    <StyledBoard>
      <div className="inner">
        {lodash.range(ROWS).map((_, y) => {
          return (
            <StyledRow key={y}>
              {lodash.range(COLS).map((_, x) => {
                const selectedFigure = figureState.selectedFigure;

                // 这个位置是否可作为目标位置
                const isAvailable = availablePos.some(
                  (a) => a.x === x && a.y === y
                );
                const isSelected =
                  x === selectedFigure?.x && y === selectedFigure?.y;

                const isInAttackRange = selectedFigure
                  ? checkInAttackRange(selectedFigure, { x, y })
                  : false;

                return (
                  <Cell
                    key={x}
                    isSelected={isSelected}
                    onClick={() =>
                      clickCell({ pos: { x, y }, isAvailable, isInAttackRange })
                    }
                    isAvailable={isAvailable}
                    terrain={getTerrain({ x, y })}
                    isInAttackRange={isInAttackRange}
                    figureStatus={figureState.status}
                  />
                );
              })}
            </StyledRow>
          );
        })}

        {allFigures.map((figure) => {
          const selectedFigure = figureState.selectedFigure;
          const isSelected = selectedFigure?.id === figure.id;

          return (
            <Figure
              key={figure.id}
              {...figure}
              isSelected={isSelected}
              attackAction={attackAction}
              waitForNextTurn={waitForNextTurn}
              showMenu={isSelected && figureState.showMenu}
              onClick={() => clickFigure(figure)}
            />
          );
        })}
      </div>

      <div className="info">
        <span>第 {days} 天</span>
        <BottomInfo clickEntity={clickEntity} />
        <Button onClick={endThisTurn}>结束回合</Button>
        <Button onClick={endBattle}>结束战斗</Button>
      </div>
    </StyledBoard>
  );
};

export default Board;

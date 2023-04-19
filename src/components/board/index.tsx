import { useEffect, useState, useRef } from 'react';
import { Button, message, Modal } from 'antd';
import lodash from 'lodash';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pos } from '../../types';
import { TERRAIN_TYPE, TROOP_TYPE } from '@constants';
import { delay } from '../../utils';
import Cell from './cell';
import Figure from './figure';
import {
  checkInAttackRange,
  chooseMovePosition,
  getMovementRange,
} from './logic';
import BottomInfo from './bottom-info';
import { useBattleStore } from './store';
import { terrain } from './data';

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

const getTerrain = ({ x, y }: Pos) => {
  // 以下两行仅做测试
  // x = x % terrain[0].length;
  // y = y % terrain.length;

  const type = terrain[y][x];
  return type || 0;
};

const Board = () => {
  const { allFigures, updateFigure, removeFigureById, enableAllFigures } =
    useBattleStore((state) => {
      const { allFigures, updateFigure, removeFigureById, enableAllFigures } =
        state;
      return {
        allFigures,
        updateFigure,
        removeFigureById,
        enableAllFigures,
      };
    });

  // 部分逻辑（如对面行动时）需要获得即时数据，使用 ref 来保存
  const allFiguresRef = useRef(allFigures);
  useEffect(() => {
    allFiguresRef.current = allFigures;
  }, [allFigures]);

  const [isGameOver, setIsGameOver] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [
    figureState,
    setFigureNormal,
    setFigureMove,
    setFigureAction,
    setFigureAttack,
    setFigureShowMenu,
  ] = useBattleStore((state) => [
    state.figureState,
    state.setFigureNormal,
    state.setFigureMove,
    state.setFigureAction,
    state.setFigureAttack,
    state.setFigureShowMenu,
  ]);

  const [clickEntity, setClickEntity] = useState<ClickEntity | null>(null);

  const [days, addADay] = useBattleStore((state) => [
    state.days,
    state.addADay,
  ]);

  const [availablePos, setAvailablePos] = useState<Pos[]>([]);
  useEffect(() => {
    if (figureState.selectedFigure) {
      setAvailablePos(getMovementRange(figureState.selectedFigure));
    } else {
      setAvailablePos([]);
    }
  }, [figureState.selectedFigure]);

  const moveFigure = (id: number, newPos: Pos, isAuto = false) => {
    const newFigure = updateFigure(id, {
      x: newPos.x,
      y: newPos.y,
    });

    // 移动之后进入操作选择状态
    setFigureAction(newFigure, false);

    // 这里延迟是为了在棋子移动到位后再显示菜单
    setTimeout(() => {
      if (!isAuto) setFigureShowMenu();
    }, 500);

    return newFigure;
  };

  /** 点击操作菜单的攻击选项 */
  const attackAction = () => {
    setFigureAttack();
  };

  /** 点击操作菜单的待机选项 */
  const waitForNextTurn = () => {
    if (!figureState.selectedFigure) return;

    updateFigure(figureState.selectedFigure.id, {
      actionable: false,
    });
    setFigureNormal();
  };

  /**
   * 敌方行动
   * 依次选中所有的敌方棋子，执行移动及攻击
   */
  const enemyAction = async () => {
    const enemyFigures = allFigures.filter((f) => f.side === 'enemy');

    for (let i = 0; i < enemyFigures.length; i++) {
      const enemyFigure = enemyFigures[i];
      setFigureMove(enemyFigure);

      await delay(500);
      const nextPos = chooseMovePosition(allFiguresRef.current, enemyFigure);
      const updatedEnemy = moveFigure(enemyFigure.id, nextPos, true);

      // 检查是否有我方棋子在攻击范围内，如果有，则攻击
      const inRangeFigures = allFiguresRef.current.filter((f) => {
        return (
          f.side === 'ally' &&
          checkInAttackRange(updatedEnemy || enemyFigure, { x: f.x, y: f.y })
        );
      });
      await delay(500);
      setFigureAttack();
      await delay(500);
      if (inRangeFigures.length > 0) {
        // 随机选择一个目标
        attack(enemyFigure, inRangeFigures[lodash.random(0, inRangeFigures.length - 1)]);
        setFigureNormal();
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
      removeFigureById(target.id);
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
      Modal.destroyAll();
      Modal.info({
        title: win ? '🎉 我方胜利 🎉' : '💀 我方战败 💀',
        content: null,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onOk() {},
        okText: '阅',
      });
    }, 2000);
  };

  /** 结束当前回合 */
  const endThisTurn = async () => {
    await enemyAction();
    enableAllFigures();
    addADay();

    // 状态重置
    setFigureNormal();
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
      setFigureAction(null, true);
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
      setFigureMove(figure);
      return;
    }

    // 如果选中的棋子是当前棋子，且棋子已处于待移动状态，则进入操作选择状态
    if (selectedFigure.id === figure.id && figureState.status === 'move') {
      setFigureAction(null, true);
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
      setFigureNormal();
      return;
    }

    // 点击了另一个我方可移动棋子
    if (
      selectedFigure.id !== figure.id &&
      figureState.status === 'move' &&
      figure.side === 'ally' &&
      figure.actionable === true
    ) {
      setFigureMove(figure);
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

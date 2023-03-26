import { useEffect, useState } from 'react';
import lodash from 'lodash';
import styled from 'styled-components';
import { Pos } from '../../types';
import Cell from '../cell';
import Figure from '../figure';

const ROWS = 8;
const COLS = 10;

const StyledBoard = styled.div`
  padding: 10px;
  background: #454545;
  border-radius: 10px;
  .inner {
    position: relative;
  }
`;

type FigureType = {
  id: number;
  x: number;
  y: number;
  type: string;
};

const figures: FigureType[] = [
  {
    id: 1,
    x: 2,
    y: 2,
    type: 'knight',
  },
  {
    id: 2,
    x: 3,
    y: 3,
    type: 'king',
  },
];

const StyledRow = styled.div`
  display: flex;
`;

interface BoardProps {}

const Board = (props: BoardProps) => {
  const [allFigures, setAllFigures] = useState([...figures]);
  const [selectedFigure, setSelectedFigure] = useState<FigureType | null>(null);
  const [availablePos, setAvailablePos] = useState<Pos[]>([]);

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
      } else if (type === 'king') {
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
    setSelectedFigure(null);
    setAllFigures(newFigures);

    // setShakeId(oldFigure.id);
    // setTimeout(() => {
    //   setShakeId(-1);
    // }, 1000);

    const timer = setTimeout(() => {
      if (moveBack) {
        moveFigure(oldFigure.id, { x: oldX, y: oldY }, false);
      }
      clearTimeout(timer);
    }, 1000);
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

                return (
                  <Cell
                    key={x}
                    isSelected={isSelected}
                    onClick={() => {
                      // 移动选中的棋子至这个位置
                      if (isAvailable && selectedFigure) {
                        moveFigure(selectedFigure.id, { x, y }, false);
                      }
                    }}
                    isAvailable={isAvailable}
                  />
                );
              })}
            </StyledRow>
          );
        })}

        {allFigures.map((figure) => {
          return (
            <Figure
              key={figure.id}
              {...figure}
              isSelected={selectedFigure?.id === figure.id}
              onClick={() => {
                // 如果当前没有选中的棋子，则选中当前棋子
                if (!selectedFigure) {
                  setSelectedFigure(figure);
                  return;
                }

                // 当前已有选中的棋子，则将选中的棋子移动到当前位置之后退回原位置
                if (
                  availablePos.some((a) => a.x === figure.x && a.y === figure.y)
                ) {
                  moveFigure(
                    selectedFigure.id,
                    { x: figure.x, y: figure.y },
                    true
                  );
                }
              }}
              className={shakeId === figure.id ? 'shake' : ''}
            />
          );
        })}
      </div>
    </StyledBoard>
  );
};

export default Board;

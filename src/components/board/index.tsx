import { useEffect, useState } from 'react';
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
    x: 5,
    y: 6,
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

  useEffect(() => {
    if (selectedFigure) {
      const { x, y } = selectedFigure;

      // TODO: 如何通用判断可移动位置
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
      setAvailablePos([]);
    }
  }, [selectedFigure]);

  return (
    <StyledBoard>
      <div className="inner">
        {new Array(ROWS).fill(0).map((_, y) => {
          return (
            <StyledRow key={y}>
              {new Array(COLS).fill(0).map((_, x) => {
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
                      // 移动棋子
                      if (isAvailable && selectedFigure) {
                        const newFigure = Object.assign({}, selectedFigure, {
                          x,
                          y,
                        });
                        const index = allFigures.findIndex(
                          (figure) => figure.id === selectedFigure.id
                        );
                        allFigures.splice(index, 1, newFigure);
                        const newFigures = [...allFigures];
                        setSelectedFigure(null);
                        setAllFigures(newFigures);
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
              {...figure}
              onClick={() => {
                setSelectedFigure(figure);
              }}
            />
          );
        })}
      </div>
    </StyledBoard>
  );
};

export default Board;

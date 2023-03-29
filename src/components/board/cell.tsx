import styled from 'styled-components';
import { GRASS, MOUNTAIN, TERRAIN_TYPE, TREE, WATER } from '../../constants';
import mountainImg from '../../assets/mountain.png';
import grassImg from '../../assets/grass.png';
import treeImg from '../../assets/tree.png';
import waterImg from '../../assets/water.png';
import cursorImg from '../../assets/cursor.png';

export const CELL_SIZE = 32;

const StyledCell = styled.div<{ isSelected: boolean; bg: string | null }>`
  width: ${CELL_SIZE}px;
  height: ${CELL_SIZE}px;
  box-sizing: border-box;
  /* border: 1px solid #ccc; */
  background: ${(props) => (props.isSelected ? '#FFA500' : '#eaeaea')};
  position: relative;

  .dot {
    display: inline-block;
    width: 80%;
    height: 80%;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url(${cursorImg}) no-repeat center center / 80%;
  }

  &:before {
    content: ' ';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.4;
    background-image: url(${(props) => props.bg});
    background-repeat: no-repeat;
    background-position: 50% 0;
    background-size: 100%;
    background-color: #fff;
  }
`;

interface CellProps {
  onClick: () => void;
  isSelected: boolean;
  isAvailable: boolean;
  /* 背景类型 */
  terrain: TERRAIN_TYPE;
}

const bgMap: {
  [key: string]: string;
} = {
  [MOUNTAIN]: mountainImg,
  [GRASS]: grassImg,
  [TREE]: treeImg,
  [WATER]: waterImg,
};

const Cell = (props: CellProps) => {
  return (
    <StyledCell
      onClick={() => {
        props.onClick();
      }}
      isSelected={props.isSelected}
      bg={bgMap[props.terrain] || ''}
    >
      {props.isAvailable && <span className="dot"></span>}
    </StyledCell>
  );
};

export default Cell;

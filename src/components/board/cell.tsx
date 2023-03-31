import styled from 'styled-components';
import { GRASS, MOUNTAIN, TERRAIN_TYPE, TREE, WATER } from '@constants';
import mountainImg from 'assets/mountain.svg';
import grassImg from 'assets/grass.svg';
import treeImg from 'assets/tree.svg';
import waterImg from 'assets/water.svg';
import cursorImg from 'assets/cursor.png';
import swordImg from 'assets/sword.png';

export const CELL_SIZE = 32;

const StyledCell = styled.div<{ isSelected: boolean; bg: string | null }>`
  width: ${CELL_SIZE}px;
  height: ${CELL_SIZE}px;
  box-sizing: border-box;
  /* border: 1px solid #ccc; */
  /* background: ${(props) => (props.isSelected ? '#FFA500' : '#eaeaea')}; */
  position: relative;

  .indicator {
    display: inline-block;
    width: 80%;
    height: 80%;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    &.move {
      background: url(${cursorImg}) no-repeat center center / 80%;
    }

    &.attack {
      background: url(${swordImg}) no-repeat center center / 80%;
    }
  }

  &:before {
    content: ' ';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.35;
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
  /** 是否可移动至该位置 */
  isAvailable: boolean;
  /** 背景类型 */
  terrain: TERRAIN_TYPE;
  /** 是否在攻击范围内 */
  isInAttackRange: boolean;
  /** 需要知道棋子所在的状态，以此决定是否展示移动图标或攻击图标 */
  figureStatus: string;
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
  const { figureStatus } = props;

  return (
    <StyledCell
      onClick={() => {
        props.onClick();
      }}
      isSelected={props.isSelected}
      bg={bgMap[props.terrain] || ''}
    >
      {props.isAvailable && figureStatus === 'move' && (
        <span className="indicator move"></span>
      )}
      {props.isInAttackRange && figureStatus === 'attack' && (
        <span className="indicator attack"></span>
      )}
    </StyledCell>
  );
};

export default Cell;

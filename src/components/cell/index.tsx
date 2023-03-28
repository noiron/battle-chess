import styled from 'styled-components';

import mountainImg from '../../assets/mountain.png';
import grassImg from '../../assets/grass.png';
import treeImg from '../../assets/tree.png';
import waterImg from '../../assets/water.png';

const StyledCell = styled.div<{ isSelected: boolean; bg: string | null }>`
  width: 50px;
  height: 50px;
  box-sizing: border-box;
  /* border: 1px solid #ccc; */
  background: ${(props) => (props.isSelected ? '#FFA500' : '#eaeaea')};
  position: relative;

  .dot {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: lightgreen;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:before {
    content: ' ';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
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
  terrain: string;
}

const bgMap: {
  // TODO: 定义地形的类型
  [key: string]: string;
} = {
  mountain: mountainImg,
  grass: grassImg,
  tree: treeImg,
  water: waterImg,
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

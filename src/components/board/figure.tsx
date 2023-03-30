import styled from 'styled-components';
import { useState } from 'react';
import { CELL_SIZE } from './cell';
import { useInterval } from '../../utils';
import knightLogo from '../../assets/knight-black.svg';
import kingLogo from '../../assets/king-white.svg';
import archerLogo1 from 'assets/archer1.png';
import archerLogo2 from 'assets/archer2.png';

const StyledFigure = styled.img<{
  top: number;
  left: number;
  isSelected: boolean;
}>`
  width: ${CELL_SIZE - 2}px;
  height: ${CELL_SIZE - 2}px;
  padding: 4px 2px 0;
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  transition: all 0.5s;
  z-index: ${(props) => (props.isSelected ? 99 : 1)};

  &:hover {
    transform: scale(1.05);
  }

  &.shake {
    animation: shake-lr 0.7s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
  }

  @keyframes shake-lr {
    0%,
    100% {
      transform: rotate(0deg);
      transform-origin: 50% 50%;
    }
    10% {
      transform: rotate(8deg);
    }
    20%,
    40%,
    60% {
      transform: rotate(-10deg);
    }
    30%,
    50%,
    70% {
      transform: rotate(10deg);
    }
    80% {
      transform: rotate(-8deg);
    }
    90% {
      transform: rotate(8deg);
    }
  }
`;

interface FigureProps {
  id: number;
  type: string;
  x: number;
  y: number;
  onClick: () => void;
  className: string;
  isSelected: boolean;
}

const logos: {
  [index: string]: string | string[];
} = {
  king: kingLogo,
  knight: knightLogo,
  archer: [archerLogo1, archerLogo2],
};

const Figure = ({
  x,
  y,
  type,
  id,
  onClick,
  className,
  isSelected,
}: FigureProps) => {
  const xPixel = x * CELL_SIZE;
  const yPixel = y * CELL_SIZE;
  const [counter, setCounter] = useState(0);

  const thisLogo = logos[type];
  const [logo, setLogo] = useState(
    typeof thisLogo === 'string' ? thisLogo : thisLogo[0]
  );

  useInterval(() => {
    // 判断兵种图标是否需要切换
    if (typeof thisLogo === 'string') {
      return;
    }

    // TODO: 只有单位在当前回合可操作的时候才展示动画

    setCounter((counter) => counter + 1);
    setLogo(thisLogo[counter % thisLogo.length]);
  }, 500);

  return (
    <StyledFigure
      id={`figure-${id}`}
      src={logo}
      top={yPixel}
      left={xPixel}
      onClick={() => {
        onClick();
      }}
      className={className}
      isSelected={isSelected}
    />
  );
};

export default Figure;

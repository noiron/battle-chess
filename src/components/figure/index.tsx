import styled from 'styled-components';
import knightLogo from '../../assets/knight-black.svg';
import kingLogo from '../../assets/king-white.svg';

const StyledFigure = styled.img<{
  top: number;
  left: number;
  isSelected: boolean;
}>`
  width: 48px;
  height: 48px;
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
  [index: string]: string;
} = {
  king: kingLogo,
  knight: knightLogo,
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
  const xPixel = x * 54;
  const yPixel = y * 54;

  return (
    <StyledFigure
      id={`figure-${id}`}
      src={logos[type]}
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

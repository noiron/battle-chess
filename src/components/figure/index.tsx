import styled from 'styled-components';
import knightLogo from '../../assets/knight-black.svg';
import kingLogo from '../../assets/king-white.svg';

const StyledFigure = styled.img<{
  top: number;
  left: number;
}>`
  width: 48px;
  height: 48px;
  padding: 4px 2px 0;
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  transition: all 0.5s;

  &:hover {
    transform: scale(1.05);
  }
`;

interface FigureProps {
  type: string;
  x: number;
  y: number;
  onClick: () => void;
}

const logos: {
  [index: string]: string;
} = {
  king: kingLogo,
  knight: knightLogo,
}

const Figure = ({ x, y, type, onClick }: FigureProps) => {
  const xPixel = x * 54;
  const yPixel = y * 54;

  return (
    <StyledFigure
      src={logos[type]}
      top={yPixel}
      left={xPixel}
      onClick={() => {
        onClick();
      }}
    />
  );
};

export default Figure;

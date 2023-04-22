import styled, { css } from 'styled-components';
import { useEffect, useState } from 'react';
import { FigureType } from '.';
import { CELL_SIZE, TERRAIN_TYPE, WATER } from '@constants';
import { useInterval } from '../../utils';
import knightLogo from '../../assets/knight-black.svg';
import kingLogo from '../../assets/king-white.svg';
import archerIcon1 from 'assets/archer1.png';
import archerIcon2 from 'assets/archer2.png';
import cavalryIcon1 from 'assets/cavalry1.png';
import cavalryIcon2 from 'assets/cavalry2.png';
import infantryIcon1 from 'assets/infantry1.png';
import infantryIcon2 from 'assets/infantry2.png';
import navyIcon1 from 'assets/navy1.png';
import navyIcon2 from 'assets/navy2.png';
import inWaterIcon1 from 'assets/in-water1.png';
import inWaterIcon2 from 'assets/in-water2.png';

const StyledMenu = styled.div`
  position: absolute;
  top: 10px;
  right: -40px;
  border: 1px solid #333;
  background: #fff;
  box-shadow: 2px 2px 1px #999;
  font-size: 14px;
  border-radius: 2px;

  p {
    margin: 0px;
    padding: 0px 6px;
    line-height: 2;
    cursor: pointer;

    &:hover {
      background: #eee;
    }
  }
`;

const StyledFigure = styled.div<{
  top: number;
  left: number;
  isSelected: boolean;
  isAlly: boolean;
}>`
  width: ${CELL_SIZE - 8}px;
  height: ${CELL_SIZE - 8}px;
  padding: 4px 4px 0;
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  transition: all 0.5s;
  z-index: ${(props) => (props.isSelected ? 99 : 1)};

  img {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
  }
  img.left {
    transform: rotateY(180deg);
  }

  /* ${(props) =>
    props.isAlly &&
    css`
      &::after {
        content: ' ';
        width: 2px;
        height: 2px;
        position: absolute;
        bottom: -4px;
        left: calc(50% - 7px);
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 3px solid #666;
      }
    `} */
`;

interface FigureProps {
  figure: FigureType;
  isSelected: boolean;
  showMenu: boolean;
  terrain: TERRAIN_TYPE;
  direction: 'left' | 'right';
  onClick: () => void;
  attackAction: () => void;
  waitForNextTurn: () => void;
  cancelMove: () => void;
  viewAction: () => void;
}

const logos: {
  [index: string]: string | string[];
} = {
  king: kingLogo,
  knight: knightLogo,
  archer: [archerIcon1, archerIcon2],
  cavalry: [cavalryIcon1, cavalryIcon2],
  infantry: [infantryIcon1, infantryIcon2],
  navy: [navyIcon1, navyIcon2],
  inWater: [inWaterIcon1, inWaterIcon2],
};

const LifeBar = styled.div<{ percent: number; isAlly: boolean }>`
  position: absolute;
  top: 0;
  left: 10%;
  width: 70%;
  height: 1px;
  border: 1px solid #000;
  border-radius: 2px;

  .inner {
    width: ${(props) => props.percent}%;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: ${(props) => (props.isAlly ? '#0f0' : '#f00')};
  }
`;

const Figure = ({
  figure,
  onClick,
  isSelected,
  attackAction,
  waitForNextTurn,
  showMenu,
  cancelMove,
  viewAction,
  terrain,
  direction,
}: FigureProps) => {
  const { x, y, type, side, life, id, actionable } = figure;
  const xPixel = x * CELL_SIZE;
  const yPixel = y * CELL_SIZE;
  const [counter, setCounter] = useState(0);

  let thisLogo = logos[type];
  if (terrain === WATER) {
    thisLogo = logos.inWater;
  }
  const [logo, setLogo] = useState(
    typeof thisLogo === 'string' ? thisLogo : thisLogo[0]
  );

  useInterval(() => {
    // 只有单位在当前回合可操作的时候才展示动画
    if (!actionable) {
      return;
    }

    // 判断兵种图标是否需要切换
    if (typeof thisLogo === 'string') {
      return;
    }

    setCounter((counter) => counter + 1);
    setLogo(thisLogo[counter % thisLogo.length]);
  }, 500);

  const [maxLife, setMaxLife] = useState(0);
  useEffect(() => {
    setMaxLife(life);
  }, []);

  const percent = Math.floor((life / maxLife) * 100);

  return (
    <StyledFigure
      top={yPixel}
      left={xPixel}
      isSelected={isSelected}
      isAlly={side === 'ally'}
    >
      <LifeBar percent={percent} isAlly={side === 'ally'}>
        <div className="inner"></div>
      </LifeBar>
      <img
        id={`figure-${id}`}
        src={logo}
        onClick={() => {
          onClick();
        }}
        className={direction}
      />
      {showMenu && (
        <StyledMenu>
          <p
            onClick={() => {
              attackAction();
            }}
          >
            攻击
          </p>
          <p
            onClick={() => {
              waitForNextTurn();
            }}
          >
            待机
          </p>
          <p
            onClick={() => {
              viewAction();
            }}
          >
            查看
          </p>
          <p
            onClick={() => {
              cancelMove();
            }}
          >
            取消
          </p>
        </StyledMenu>
      )}
    </StyledFigure>
  );
};

export default Figure;

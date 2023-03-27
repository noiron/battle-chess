import { useState } from 'react';
import styled from 'styled-components';
import Menu from '../menu';

const StyledCity = styled.div<{ x: number; y: number }>`
  width: 50px;
  height: 50px;
  position: absolute;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  border: 2px solid #000;
  border-radius: 10px;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
`;

interface CityProps {
  x: number;
  y: number;
  name: string;
  isActive: boolean;
  setActiveCity: (city: string) => void;
  setMessage: (message: string) => void;
}

let timer: any = null;

const City = (props: CityProps) => {
  const { x, y, name, isActive, setMessage } = props;

  const hideMessage = () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      setMessage('');
      clearTimeout(timer);
    }, 3000);
  };

  const showMessage = (message: string) => {
    setMessage(message);
    hideMessage();
  };

  const 治理 = () => {
    showMessage(`${name} 经过了治理`);
  };

  const 收税 = () => {
    showMessage(`${name} 经过了收税`);
  };

  const 开垦 = () => {
    showMessage(`${name} 经过了开垦`);
  };

  const 征兵 = () => {
    showMessage(`${name} 经过了征兵`);
  };

  const 出征 = () => {
    showMessage(`出征`);
  };

  return (
    <StyledCity
      x={x}
      y={y}
      id={`city-${name}`}
      onClick={(e) => {
        e.stopPropagation();
        props.setActiveCity(name);
      }}
    >
      {name}
      {isActive && (
        <Menu 治理={治理} 收税={收税} 开垦={开垦} 征兵={征兵} 出征={出征} />
      )}
    </StyledCity>
  );
};

export default City;

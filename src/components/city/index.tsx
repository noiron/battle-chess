import { Button, message, Modal } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
import game, { CityInfo } from '../../games/game';
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
  info: CityInfo;
  isActive: boolean;
  setActiveCity: (city: string) => void;
  setMessage: (message: string) => void;
}

let timer: any = null;

const City = (props: CityProps) => {
  const { x, y, name, isActive, setMessage, info } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const 状况 = () => {
    setIsModalVisible(true);
  };

  return (
    <StyledCity
      x={x}
      y={y}
      id={`city-${name}`}
      onClick={(e) => {
        e.stopPropagation();

        // 判断是否为我方城市
        const playerData = game.factions[game.playerFaction];
        const playerCities = playerData.cities;
        if (!playerCities.includes(name)) {
          message.info('敌方城市');
          return;
        }

        props.setActiveCity(name);
      }}
    >
      {name}
      {isActive && (
        <Menu
          治理={治理}
          收税={收税}
          开垦={开垦}
          征兵={征兵}
          出征={出征}
          状况={状况}
        />
      )}

      {
        <Modal
          title={null}
          open={isModalVisible}
          footer={
            <Button
              type="primary"
              onClick={() => {
                setIsModalVisible(false);
              }}
            >
              确认
            </Button>
          }
        >
          <h3>{info.name}</h3>
          <p>人口：{info.population}</p>
          <p>金钱：{info.money}</p>
        </Modal>
      }
    </StyledCity>
  );
};

export default City;

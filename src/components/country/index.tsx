import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import City from '../city';
import Message from './message';
import game from '../../games/game';
import { useNavigate } from 'react-router-dom';
import Dashboard from './dashborad';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type MapMode = 'normal' | 'select';

const StyledCountry = styled.div<{ disabled: boolean }>`
  width: 600px;
  height: 600px;
  background-color: #fff;
  border-radius: 10px;
  position: relative;
  user-select: none;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};

  .cancel-button {
    position: absolute;
    left: 0;
    bottom: 0;
  }
`;

type CityType = {
  x: number;
  y: number;
  name: string;
};

const cities: CityType[] = [
  {
    x: 200,
    y: 100,
    name: '洛阳',
  },
  {
    x: 100,
    y: 350,
    name: '成都',
  },
  {
    x: 350,
    y: 250,
    name: '建邺',
  },
];

const Country = () => {
  const [activeCity, setActiveCity] = useState('');
  const [messageText, setMessage] = useState('');
  // 执行对方策略时，禁用所有操作
  const [disabled, setDisabled] = useState(false);
  // 普通模式下，无法选择敌方城市；选择模式下，可以选择敌方城市
  const [mode, setMode] = useState<MapMode>('normal');
  const [targetCity, setTargetCity] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // 如果没有玩家势力，说明游戏没有正确开始，跳转到开始页面
    if (!game.playerFaction) {
      navigate('/');
    }
  }, []);

  const nextTurn = async () => {
    const enemies = Object.keys(game.factions).filter(
      (faction) => faction !== game.playerFaction
    );

    setDisabled(true);
    for (let i = 0; i < enemies.length; i++) {
      // TODO: 执行真正的策略逻辑
      setMessage(`${enemies[i]} 策略中`);
      await delay(3000);
    }
    setMessage('');
    game.nextTurn();
    setDisabled(false);
  };

  /* 执行出征前，需要将地图转为选择模式 */
  const 出征 = () => {
    setMode('select');
    message.info('请选择目标城市');
  };

  const selectTargetCity = (cityName: string) => {
    setTargetCity(cityName);
    setMode('normal');
    setMessage(`下一回合，会从 ${activeCity} 进攻 ${cityName}`);
    setActiveCity('');
  };

  return (
    <StyledCountry
      onClick={(e) => {
        const id = (e.target as HTMLElement).id;

        // 处于选择模式下，点击非城市部分，不会改变当前选中城市
        if (mode === 'select') {
          return;
        }

        if (!id.startsWith('city-')) {
          setActiveCity('');
        }
      }}
      disabled={disabled}
    >
      {cities.map((city) => {
        return (
          <City
            x={city.x}
            y={city.y}
            name={city.name}
            mode={mode}
            info={game.cities[city.name]}
            isActive={activeCity === city.name}
            key={city.name}
            setActiveCity={setActiveCity}
            setMessage={(message: string) => {
              setMessage(message);
            }}
            出征={出征}
            selectTargetCity={selectTargetCity}
          />
        );
      })}

      <Dashboard
        faction={game.playerFaction}
        cityNum={game.factions[game.playerFaction]?.cities.length}
        characterNum={game.factions[game.playerFaction]?.characters.length}
        year={game.year}
        month={game.month}
        nextTurn={nextTurn}
        activeCity={activeCity}
      />

      {messageText && <Message message={messageText} />}

      {/* 出征选择模式下，应该能够取消出征指令 */}
      {mode === 'select' && (
        <div className="cancel-button">
          <Button
            onClick={() => {
              setMode('normal');
              message.info('出征已取消');
            }}
          >
            取消
          </Button>
        </div>
      )}
    </StyledCountry>
  );
};

export default Country;

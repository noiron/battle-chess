import styled from 'styled-components';
import { useEffect, useState } from 'react';
import City from '../city';
import Message from './message';
import game from '../../games/game';
import { useNavigate } from 'react-router-dom';
import Dashboard from './dashborad';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const StyledCountry = styled.div<{ disabled: boolean }>`
  width: 600px;
  height: 600px;
  background-color: #fff;
  border-radius: 10px;
  position: relative;
  user-select: none;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
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
  const [message, setMessage] = useState('');
  // 执行对方策略时，禁用所有操作
  const [disabled, setDisabled] = useState(false);

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
    for (let i = 0; i < enemies.length; i++) {
      // TODO: 执行真正的策略逻辑
      setMessage(`${enemies[i]} 策略中`);
      await delay(3000);
    }
    setMessage('');
    game.nextTurn();
  };

  return (
    <StyledCountry
      onClick={(e) => {
        const id = (e.target as HTMLElement).id;
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
            info={game.cities[city.name]}
            isActive={activeCity === city.name}
            key={city.name}
            setActiveCity={setActiveCity}
            setMessage={(message: string) => {
              setMessage(message);
            }}
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

      {message && <Message message={message} />}
    </StyledCountry>
  );
};

export default Country;

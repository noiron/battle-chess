import styled from 'styled-components';
import { useEffect, useState } from 'react';
import City from '../city';
import Message from './message';
import game from '../../games/game';
import { useNavigate } from 'react-router-dom';

const StyledCountry = styled.div`
  width: 600px;
  height: 600px;
  background-color: #fff;
  border-radius: 10px;
  position: relative;
  user-select: none;
`;

type CityType = {
  x: number;
  y: number;
  name: string;
};

const cities: CityType[] = [
  {
    x: 250,
    y: 100,
    name: '洛阳',
  },
  {
    x: 100,
    y: 350,
    name: '成都',
  },
  {
    x: 450,
    y: 300,
    name: '建邺',
  },
];

const Country = () => {
  const [activeCity, setActiveCity] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // 如果没有玩家势力，说明游戏没有正确开始，跳转到开始页面
    if (!game.playerFaction) {
      navigate('/');
    }
  }, []);

  return (
    <StyledCountry
      onClick={(e) => {
        console.log((e.target as HTMLElement).id);
        const id = (e.target as HTMLElement).id;
        if (!id.startsWith('city-')) {
          setActiveCity('');
        }
      }}
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

      {message && <Message message={message} />}
    </StyledCountry>
  );
};

export default Country;

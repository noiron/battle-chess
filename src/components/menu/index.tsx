import { useState } from 'react';
import styled from 'styled-components';
import Submenu from '../submenu';

const StyledMenu = styled.div`
  width: 60px;
  border: 2px solid #000;
  position: absolute;
  top: -10px;
  left: 120%;
`;

interface MenuProps {
  治理: () => void;
  收税: () => void;
  开垦: () => void;
  征兵: () => void;
  出征: () => void;
}

const Menu = (props: MenuProps) => {
  const [isActive, setIsActive] = useState(false);
  const [activeMenu, setActiveMenu] = useState(''); // ['内政', '军事']
  const { 治理, 收税, 开垦, 征兵, 出征 } = props;

  return (
    <StyledMenu
      onClick={(e) => {
        setIsActive(true);
      }}
    >
      <div
        onClick={() => {
          setActiveMenu('内政');
        }}
      >
        内政
      </div>
      <div
        onClick={() => {
          setActiveMenu('军事');
        }}
      >
        军事
      </div>

      {isActive && (
        <Submenu
          type={activeMenu}
          治理={治理}
          收税={收税}
          开垦={开垦}
          征兵={征兵}
          出征={出征}
        />
      )}
    </StyledMenu>
  );
};

export default Menu;

import styled from 'styled-components';
import { Pos } from 'src/types';
import { CELL_SIZE } from '@constants';

const StyledDamage = styled.div<{
  top: number;
  left: number;
}>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  z-index: 110;
  background: #fff;
  color: #000;
  font-size: 14px;
  line-height: 1.2;
  padding: 0 4px;
  font-weight: bold;
`;

interface DamageProps {
  damage: number;
  pos: Pos;
}

const Damage = (props: DamageProps) => {
  const {
    damage,
    pos: { x, y },
  } = props;
  const xPixel = (x + 0.2) * CELL_SIZE;
  const yPixel = (y + 0.2) * CELL_SIZE;

  return (
    <StyledDamage top={yPixel} left={xPixel}>
      - {damage}
    </StyledDamage>
  );
};

export default Damage;

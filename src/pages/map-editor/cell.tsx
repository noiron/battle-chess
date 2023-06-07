import { TERRAIN_TYPE } from '@constants';
import { getTerrainBackground } from '../../utils';
import styled from 'styled-components';

const StyledCell = styled.div<{ bg: string }>`
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  margin: 0 -1px -1px 0;
  position: relative;
  background-image: url(${(props) => props.bg});
  background-size: 100%;
`;

interface CellProps {
  terrain: TERRAIN_TYPE;
  children?: React.ReactNode;
}

const Cell = (props: CellProps) => {
  return (
    <StyledCell bg={getTerrainBackground(props.terrain)}>
      {props.children}
    </StyledCell>
  );
};

export default Cell;

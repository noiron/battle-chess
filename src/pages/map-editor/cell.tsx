import styled from 'styled-components';

const StyledCell = styled.div`
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  margin: 0 -1px -1px 0;
`;

interface CellProps {
  children?: React.ReactNode;
}

const Cell = (props: CellProps) => {
  return <StyledCell>{props.children}</StyledCell>;
};

export default Cell;

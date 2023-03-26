import styled from 'styled-components';

const StyledCell = styled.div<{ isSelected: boolean }>`
  width: 50px;
  height: 50px;
  background: ${(props) => (props.isSelected ? '#FFA500' : '#eaeaea')};
  margin: 2px;
  position: relative;

  .dot {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: lightgreen;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

interface CellProps {
  onClick: () => void;
  isSelected: boolean;
  isAvailable: boolean;
}

const Cell = (props: CellProps) => {
  return (
    <StyledCell
      onClick={() => {
        props.onClick();
      }}
      isSelected={props.isSelected}
    >
      {props.isAvailable &&
        <span className='dot'></span>
      }
    </StyledCell>
  );
};

export default Cell;

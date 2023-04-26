import styled from 'styled-components';

const StyledDaysBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 100px;
  background-color: #fff;
  border: 1px solid #000;
  box-shadow: 0 0 0 1px #fff, 0 0 0 3px #000, 0 0 0 4px #fff;
  z-index: 110;

  p {
    font-size: 36px;
    line-height: 100px;
    margin: 0;
    font-family: 'silver';
  }
`;

const DaysBox = ({ days }: { days: number }) => {
  return (
    <StyledDaysBox>
      <p>第 {days} 天</p>
    </StyledDaysBox>
  );
};

export default DaysBox;

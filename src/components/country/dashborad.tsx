import styled from 'styled-components';
import { Button, Modal } from 'antd';
import { useState } from 'react';

const StyledDashboard = styled.div`
  width: 100px;
  height: 100%;
  border-left: 2px solid #000;
  position: absolute;
  top: 0;
  right: 0;

  .faction {
    font-size: 40px;
    cursor: pointer;
  }

  .bottom {
    position: absolute;
    top: 480px;
    width: 100%;
    font-size: 20px;
  }
`;

interface DashboardProps {
  faction: string;
  cityNum: number;
  characterNum: number;
  year: number;
  month: number;
  nextTurn: () => void;
  activeCity: string;
}

const Dashboard = (props: DashboardProps) => {
  const { faction, cityNum, characterNum, year, month, nextTurn, activeCity } =
    props;
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <StyledDashboard>
      <p
        className="faction"
        onClick={() => {
          setIsModalVisible(true);
        }}
      >
        {faction}
      </p>

      <p>🏛️ x {cityNum}</p>
      <p>🫡 x {characterNum}</p>

      <div className="bottom">
        <p>
          {year}年{month}月
        </p>
        <p>{activeCity}</p>
      </div>

      <Modal
        open={isModalVisible}
        footer={
          <Button
            onClick={() => {
              setIsModalVisible(false);
            }}
          >
            取消
          </Button>
        }
      >
        <Button
          onClick={() => {
            nextTurn();
            setIsModalVisible(false);
          }}
        >
          策略结束
        </Button>
      </Modal>
    </StyledDashboard>
  );
};

export default Dashboard;

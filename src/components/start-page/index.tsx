import { Button, Modal, Radio } from 'antd';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import game from '../../games/game';

const StyledBox = styled.div`
  width: 600px;
  height: 600px;
  border: 1px solid #000;
  border-radius: 10px;
  text-align: center;
  background: #fff;

  .title {
    font-size: 48px;
    margin-top: 150px;
    margin-bottom: 50px;
    color: '#000';
  }

  .start-button {
    margin-right: 50px;
  }
`;

const StartPage = () => {
  const [faction, setFaction] = useState('魏');
  let navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    game.initFaction(faction);
    navigate('/country');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <StyledBox>
      <div className="title">三国</div>
      <Button
        className="start-button"
        onClick={() => {
          showModal();
        }}
      >
        开始游戏
      </Button>
      <Button
        onClick={() => {
          navigate('/battle');
        }}
      >
        快速战斗
      </Button>

      {isModalOpen && (
        <Modal
          title="选择你的势力"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Radio.Group
            onChange={(e) => {
              setFaction(e.target.value);
            }}
            value={faction}
          >
            <Radio.Button value="魏">魏</Radio.Button>
            <Radio.Button value="蜀">蜀</Radio.Button>
            <Radio.Button value="吴">吴</Radio.Button>
          </Radio.Group>
        </Modal>
      )}
    </StyledBox>
  );
};

export default StartPage;

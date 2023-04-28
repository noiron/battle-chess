/**
 * 展示鼠标点击之处的信息，包括地形和武将信息
 */
import { TERRAIN_TEXT, TROOP_TEXT } from '@constants';
import styled from 'styled-components';
import { ClickEntity } from '.';
import { QuestionCircleOutlined } from '@ant-design/icons';

const StyledBottomInfo = styled.div`
  width: 150px;
  cursor: pointer;

  .icon {
    font-size: 14px;
    margin-left: 4px;
  }
`;

interface BottomInfoProps {
  /** 当前点击在何处：武将 or 地形 */
  clickEntity: ClickEntity | null;
  showInfoView: () => void;
}

const BottomInfo = (props: BottomInfoProps) => {
  const { clickEntity, showInfoView } = props;

  // 保持样式一致
  if (!clickEntity) return <StyledBottomInfo />;

  let text = '';
  if (clickEntity.entityType === 'terrain') {
    text = TERRAIN_TEXT[clickEntity.terrain];
  } else if (clickEntity.entityType === 'figure') {
    text = clickEntity.name + '(' + TROOP_TEXT[clickEntity.type] + ')';
  }

  return (
    <StyledBottomInfo onClick={showInfoView}>
      {text}

      <QuestionCircleOutlined className="icon" />
    </StyledBottomInfo>
  );
};

export default BottomInfo;

/**
 * 展示鼠标点击之处的信息，包括地形和武将信息
 */
import { TERRAIN_TEXT, TROOP_MAP } from '@constants';
import styled from 'styled-components';
import { ClickEntity } from '.';
import { QuestionOutlined } from '@ant-design/icons';

const StyledBottomInfo = styled.div`
  width: 150px;

  .icon {
    font-size: 14px;
    cursor: pointer;
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

  return (
    <StyledBottomInfo>
      {clickEntity?.entityType === 'terrain'
        ? TERRAIN_TEXT[clickEntity.terrain]
        : clickEntity?.entityType === 'figure'
        ? clickEntity.name + '(' + TROOP_MAP[clickEntity.type] + ')'
        : ''}

      {!(
        clickEntity?.entityType === 'terrain' && clickEntity.terrain === 0
      ) && <QuestionOutlined className="icon" onClick={showInfoView} />}
    </StyledBottomInfo>
  );
};

export default BottomInfo;

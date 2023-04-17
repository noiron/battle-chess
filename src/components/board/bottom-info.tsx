/**
 * 展示鼠标点击之处的信息，包括地形和武将信息
 */
import { TERRAIN_TEXT, TROOP_MAP } from '@constants';
import { ClickEntity } from '.';

interface BottomInfoProps {
  clickEntity: ClickEntity | null;
}

const BottomInfo = (props: BottomInfoProps) => {
  const { clickEntity } = props;

  return (
    <span
      style={{
        width: 150,
      }}
    >
      {clickEntity?.entityType === 'terrain'
        ? TERRAIN_TEXT[clickEntity.terrain]
        : clickEntity?.entityType === 'figure'
        ? clickEntity.name + '(' + TROOP_MAP[clickEntity.type] + ')'
        : ''}
    </span>
  );
};

export default BottomInfo;

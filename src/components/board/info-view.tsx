import { TERRAIN_TEXT } from '@constants';
import { ClickEntity } from '.';

interface InfoViewProps {
  entity: ClickEntity;
}

const InfoView = (props: InfoViewProps) => {
  const { entity } = props;

  if (entity.entityType === 'terrain') {
    return <p>{TERRAIN_TEXT[entity.terrain]}</p>;
    // todo: 地形的加成信息
  }

  return (
    <>
      <p>{entity.name}</p>
      <p>武力：{entity.power}</p>
      <p>智力：{entity.intelligence}</p>
      <p>生命值：{entity.life}</p>
    </>
  );
};

export default InfoView;

import { TERRAIN_TEXT, TROOP_TEXT } from '@constants';
import { ClickEntity } from '.';
import { calculateDefense, getTerrain, terrainDesc } from './logic';

interface InfoViewProps {
  entity: ClickEntity;
}

const InfoView = (props: InfoViewProps) => {
  const { entity } = props;

  if (entity.entityType === 'terrain') {
    return (
      <p>
        {TERRAIN_TEXT[entity.terrain]}：{terrainDesc[entity.terrain]}
      </p>
    );
  }

  const terrain = getTerrain(entity);
  const defense = calculateDefense(entity);

  return (
    <>
      <p>{entity.name}</p>
      <p>兵种：{TROOP_TEXT[entity.type]}</p>
      <p>武力：{entity.power}</p>
      <p>智力：{entity.intelligence}</p>
      <p>生命值：{entity.life}</p>
      <p>防御力：{defense}</p>
      <p>地形：{TERRAIN_TEXT[terrain]}</p>
    </>
  );
};

export default InfoView;

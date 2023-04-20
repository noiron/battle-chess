import { FigureType } from ".";

interface InfoViewProps {
  entity: FigureType;
}

const InfoView = (props: InfoViewProps) => {
  const { entity } = props;

  return (
    <>
      <p>{entity.name}</p>
      <p>武力：{entity.power}</p>
      <p>智力：{entity.intelligence}</p>
      <p>生命值：{entity.life}</p>
    </>
  );
}

export default InfoView;

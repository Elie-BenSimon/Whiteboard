import React from "react";
import WikiCard from "../ui/wikiCard";

type CharacterCardProps = {
  containerWidth: number;
};

const CharacterCard: React.FC<CharacterCardProps> = ({ containerWidth }) => {
  return (
    <WikiCard
      title={"Personnage"}
      cols={2}
      containerWidth={containerWidth}
    ></WikiCard>
  );
};

export default CharacterCard;

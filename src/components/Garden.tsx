import { observer } from "mobx-react-lite";

import { TILES } from "../constants";
import { useStores } from "../stores";

import GardenTile from "./GardenTile";
import { useEffect } from "react";

const Garden = observer(function Garden() {
  const { ganjaFarmStore } = useStores();
  const garden = ganjaFarmStore.garden;

  return (
    <>
      {TILES.map((position, index) => (
        <GardenTile
          key={index}
          position={position}
          num={index}
          state={garden ? garden.inner[index] : undefined}
        />
      ))}
    </>
  );
});

export default Garden;

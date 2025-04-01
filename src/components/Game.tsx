import { cssObj } from "@fuel-ui/css";
import { Box } from "@fuel-ui/react";
import type { KeyboardControlsEntry } from "@react-three/drei";
import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { observer } from "mobx-react-lite";
import { Suspense, useMemo, useState } from "react";

import type { Modals } from "../constants";
import { Controls } from "../constants";

import { useStores } from "../stores";
import Background from "./Background";
import Camera from "./Camera";
import Garden from "./Garden";
import Loading from "./Loading";
import MobileControlButtons from "./MobileControls";
import Player from "./Player";
import HarvestModal from "./modals/HarvestModal";
import MarketModal from "./modals/MarketModal";
import PlantModal from "./modals/PlantModal";
import PortalModal from "./modals/PortalModal";
import Info from "./show/Info";

interface GameProps {
  isMobile: boolean;
  farmCoinAssetID: string;
}

export type Position =
  | "left-top"
  | "center-top"
  | "right-top"
  | "left-bottom"
  | "center-bottom"
  | "right-bottom";
export type MobileControls = "none" | "up" | "down" | "left" | "right";

//todo move game logic to gamestore
const Game = observer(function Game({ isMobile, farmCoinAssetID }: GameProps) {
  const { ganjaFarmStore } = useStores();
  const { player, seeds, items, garden } = ganjaFarmStore;
  const [modal, setModal] = useState<Modals>("none");

  const [tileArray, setTileArray] = useState<number[]>([]);
  const [updateNum, setUpdateNum] = useState<number>(0);
  const [canMove, setCanMove] = useState<boolean>(true);
  const [playerPosition, setPlayerPosition] = useState<Position>("left-top");
  const [mobileControlState, setMobileControlState] =
    useState<MobileControls>("none");

  const updatePageNum = () => {
    setTimeout(() => {
      setUpdateNum(updateNum + 1);
    }, 3000);
  };
  const handlePlantSuccess = (position: number) => {
    ganjaFarmStore.setSeeds(seeds - 1);

    if (!garden) return garden;
    const currentTime = Math.floor(Date.now()); // Unix time in seconds
    const newInner = [...garden.inner];
    newInner[position] = {
      name: "OgCush",
      timePlanted: currentTime,
    } as any;
    const newGarden = { inner: newInner };

    ganjaFarmStore.setGarden(newGarden.inner);
  };
  const onHarvestSuccess = (position: number) => {
    ganjaFarmStore.setItems(items + 1);
    if (!garden) return garden;

    const newInner = [...garden.inner];
    newInner[position] = null;

    const newGarden = {
      inner: newInner,
    };
    ganjaFarmStore.setGarden(newGarden.inner);
  };
  const controlsMap = useMemo<KeyboardControlsEntry[]>(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "w", "W"] },
      { name: Controls.back, keys: ["ArrowDown", "s", "S"] },
      { name: Controls.left, keys: ["ArrowLeft", "a", "A"] },
      { name: Controls.right, keys: ["ArrowRight", "d", "D"] },
    ],
    []
  );

  return (
    <Box css={styles.canvasContainer}>
      <>
        <Canvas orthographic>
          <Camera playerPosition={playerPosition} isMobile={isMobile} />
          <Suspense fallback={null}>
            <Background />
            {/* GARDEN */}
            <Garden />

            {/* PLAYER */}
            {player !== null && (
              <KeyboardControls map={controlsMap}>
                <Player
                  tileStates={garden!}
                  modal={modal}
                  setModal={setModal}
                  setTileArray={setTileArray}
                  setPlayerPosition={setPlayerPosition}
                  playerPosition={playerPosition}
                  canMove={canMove}
                  mobileControlState={mobileControlState}
                />
              </KeyboardControls>
            )}
          </Suspense>
        </Canvas>

        {isMobile && (
          <MobileControlButtons setMobileControlState={setMobileControlState} />
        )}

        {/* INFO CONTAINERS */}
        <Info />

        {player !== null && (
          <>
            {/* GAME MODALS */}
            {modal === "plant" && (
              <PlantModal
                updatePageNum={updatePageNum}
                tileArray={tileArray}
                seeds={seeds}
                setCanMove={setCanMove}
                setModal={setModal}
                onPlantSuccess={handlePlantSuccess}
              />
            )}
            {modal === "harvest" && (
              <HarvestModal
                tileArray={tileArray}
                updatePageNum={updatePageNum}
                setCanMove={setCanMove}
                setModal={setModal}
                onHarvestSuccess={onHarvestSuccess}
              />
            )}

            {modal === "market" && (
              <MarketModal
                updatePageNum={updatePageNum}
                items={items}
                setCanMove={setCanMove}
                farmCoinAssetID={farmCoinAssetID}
              />
            )}
            {modal === "portal" && <PortalModal />}
          </>
        )}
      </>
    </Box>
  );
});

export default Game;

const styles = {
  canvasContainer: cssObj({
    borderTop: "4px solid #754a1e",
    // borderRadius: "8px",
    height: " calc(100vh - 4px)",
    // height: "100vh",
    width: "1000px",
    margin: "auto",
    "@sm": {
      maxHeight: "740px",
    },
  }),
};

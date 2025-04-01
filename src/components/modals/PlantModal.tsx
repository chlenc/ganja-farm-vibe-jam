import { Button } from "@fuel-ui/react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import { buttonStyle } from "../../constants";
import type { Modals } from "../../constants";
import Loading from "../Loading";
import { useStores } from "../../stores";
import { PlantType } from "../../stores/GanjaFarmStore";

interface PlantModalProps {
  updatePageNum: () => void;
  tileArray: number[];
  seeds: number;
  setCanMove: Dispatch<SetStateAction<boolean>>;
  onPlantSuccess: (position: number) => void;
  setModal: Dispatch<SetStateAction<Modals>>;
}

export default function PlantModal({
  updatePageNum,
  tileArray,
  seeds,
  setCanMove,
  onPlantSuccess,
  setModal,
}: PlantModalProps) {
  const [status, setStatus] = useState<"error" | "none" | "loading">("none");
  const { ganjaFarmStore } = useStores();

  async function handlePlant() {
    try {
      setStatus("loading");
      setCanMove(false);
      const seedType: PlantType = PlantType.OgCush;

      ganjaFarmStore.plantSeedAtIndex(seedType, tileArray[0]);

      onPlantSuccess(tileArray[0]);
      setModal("none");
      updatePageNum();
    } catch (err) {
      console.error("Error in PlantModal", err);
      setStatus("error");
    }
    setCanMove(true);
  }

  return (
    <div className="plant-modal">
      {status === "error" && (
        <div>
          <p>Something went wrong!</p>
          <Button
            css={buttonStyle}
            onPress={() => {
              setStatus("none");
              updatePageNum();
            }}
          >
            Try Again
          </Button>
        </div>
      )}
      {status === "none" && (
        <>
          {seeds > 0 ? (
            <>
              <div style={styles.seeds}>Plant a seed here?</div>
              <Button css={buttonStyle} onPress={handlePlant}>
                Plant
              </Button>
            </>
          ) : (
            <div>You don&apos;t have any seeds to plant.</div>
          )}
        </>
      )}
      {status === "loading" && <Loading />}
    </div>
  );
}

const styles = {
  seeds: {
    marginBottom: "20px",
  },
};

import { Spinner, Button, BoxCentered } from "@fuel-ui/react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import { buttonStyle } from "../../constants";
import type { Modals } from "../../constants";
import { useStores } from "../../stores";
interface HarvestProps {
  tileArray: number[];
  updatePageNum: () => void;
  setCanMove: Dispatch<SetStateAction<boolean>>;
  setModal: Dispatch<SetStateAction<Modals>>;
  onHarvestSuccess: (position: number) => void;
}

export default function HarvestModal({
  tileArray,
  updatePageNum,
  setCanMove,
  setModal,
  onHarvestSuccess,
}: HarvestProps) {
  const [status, setStatus] = useState<"error" | "none" | "loading">("none");
  const { ganjaFarmStore } = useStores();

  async function harvestItem() {
    try {
      setStatus("loading");
      setCanMove(false);
      await ganjaFarmStore.harvest([tileArray[0]]);
      onHarvestSuccess(tileArray[0]); // Update tile state
      setModal("plant"); // Close modal
      updatePageNum(); // Update other state
    } catch (err) {
      console.error("Error in HarvestModal:", err);
      setStatus("error");
    }
    setCanMove(true);
  }

  // Assume we have a function to check if the item is ready to harvest
  const isReadyToHarvest = (tileIndex: number) => {
    // Implement the logic to check if the item is ready to harvest
    // This could involve checking a timestamp or a status from the contract
    return true; // Placeholder, replace with actual logic
  };

  return (
    <div className="harvest-modal">
      {status === "loading" && (
        <BoxCentered>
          <Spinner color="#754a1e" />
        </BoxCentered>
      )}
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
      {status === "none" && isReadyToHarvest(tileArray[0]) && (
        <>
          <div style={styles.items}>Harvest this item?</div>
          <Button css={buttonStyle} onPress={harvestItem}>
            Harvest
          </Button>
        </>
      )}
    </div>
  );
}

const styles = {
  items: {
    marginBottom: "20px",
  },
};

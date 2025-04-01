import { BoxCentered, Button, Spinner } from "@fuel-ui/react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import { buttonStyle } from "../../constants";
import { useStores } from "../../stores";
import { PlantType } from "../../stores/GanjaFarmStore";
interface BuySeedsProps {
  updatePageNum: () => void;
  setCanMove: Dispatch<SetStateAction<boolean>>;
}

export default function BuySeeds({ updatePageNum, setCanMove }: BuySeedsProps) {
  const { userStore, ganjaFarmStore } = useStores();
  const [status, setStatus] = useState<"error" | "none" | `loading`>("none");

  async function buySeeds() {
    try {
      setStatus("loading");
      setCanMove(false);
      await ganjaFarmStore.buySeeds(PlantType.OgCush, 10);
      setStatus("none");
      updatePageNum();
    } catch (err) {
      console.error("Error in BuySeeds:", err);
      setStatus("error");
    }
    setCanMove(true);
  }

  return (
    <>
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
      {status === "none" && (
        <>
          <div className="market-header">Buy Seeds</div>
          <Button css={buttonStyle} variant="outlined" onPress={buySeeds}>
            Buy 10 seeds
          </Button>
        </>
      )}
    </>
  );
}

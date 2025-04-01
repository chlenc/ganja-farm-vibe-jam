import { Button } from "@fuel-ui/react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import { buttonStyle } from "../../constants";
import Loading from "../Loading";
import { useStores } from "../../stores";
import { PlantType } from "../../stores/GanjaFarmStore";

interface SellItemProps {
  updatePageNum: () => void;
  items: number;
  setCanMove: Dispatch<SetStateAction<boolean>>;
}

export default function SellItem({
  updatePageNum,
  items,
  setCanMove,
}: SellItemProps) {
  const { ganjaFarmStore } = useStores();
  const [status, setStatus] = useState<"error" | "none" | "loading">("none");

  async function sellItems() {
    try {
      setStatus("loading");
      setCanMove(false);
      setStatus("none");
      await ganjaFarmStore.sellItem(PlantType.OgCush, items);
      updatePageNum();
    } catch (err) {
      console.error("Error in SellItem:", err);
      setStatus("error");
    }
    setCanMove(true);
  }

  return (
    <>
      <div className="market-header sell">Sell Items</div>
      {status === "loading" && <Loading />}
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
        <Button css={buttonStyle} variant="outlined" onPress={sellItems}>
          Sell All Items
        </Button>
      )}
    </>
  );
}

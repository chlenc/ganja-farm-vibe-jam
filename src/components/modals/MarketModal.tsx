import type { BytesLike } from "fuels";
import type { Dispatch, SetStateAction } from "react";

import BuySeeds from "./BuySeeds";
import SellItem from "./SellItem";

interface MarketModalProps {
  updatePageNum: () => void;
  items: number;
  setCanMove: Dispatch<SetStateAction<boolean>>;
  farmCoinAssetID: BytesLike;
}

export default function MarketModal({
  updatePageNum,
  items,
  setCanMove,
  farmCoinAssetID,
}: MarketModalProps) {
  return (
    <div className="market-modal">
      <BuySeeds
        updatePageNum={updatePageNum}
        setCanMove={setCanMove}
      />
      {items > 0 && (
        <SellItem
          updatePageNum={updatePageNum}
          items={items}
          setCanMove={setCanMove}
        />
      )}
    </div>
  );
}

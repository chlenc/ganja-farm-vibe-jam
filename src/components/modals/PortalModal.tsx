import { Button } from "@fuel-ui/react";

import { buttonStyle } from "../../constants";

export default function PortalModal({ onPress, type }: { onPress: () => void, type: "Exit" | "Enter" }) {
  return (
    <div className="market-modal">
      <div style={styles.items}>Jump To Vibeverse {type} Portal?</div>
      <Button
        css={buttonStyle}
        onPress={onPress}
      >
        Jump!
      </Button>
    </div>
  );
}

const styles = {
  items: {
    marginBottom: "20px",
  },
};

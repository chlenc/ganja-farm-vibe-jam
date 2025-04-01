import { Button } from "@fuel-ui/react";

import { buttonStyle } from "../../constants";

export default function PortalModal() {
  return (
    <div className="market-modal">
      <div style={styles.items}>Jump to portal?</div>
      <Button
        css={buttonStyle}
        onPress={() => window.open("http://portal.pieter.com")}
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

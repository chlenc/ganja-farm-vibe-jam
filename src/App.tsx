import styled from "@emotion/styled";
import { Box, BoxCentered, Heading } from "@fuel-ui/react";

import WebApp from "@twa-dev/sdk";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import "./App.css";
import Game from "./components/Game.tsx";

function App() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobile = /(iphone|android|windows phone)/.test(userAgent);
    setIsMobile(mobile);
    if (WebApp) {
      WebApp.ready();
      WebApp.expand();
      WebApp.disableClosingConfirmation();
      WebApp.disableVerticalSwipes();
      WebApp.setHeaderColor("#ac7339"); // любой HEX
      console.error(
        "WebApp is ready",
        "WebApp init:",
        WebApp.initDataUnsafe?.user?.id
      );
    }
  }, []);

  return (
    <StyledBox>
      <Game isMobile={isMobile} farmCoinAssetID={"$SMOKEN"} />
    </StyledBox>
  );
}

export default observer(App);

const StyledBox = styled(Box)`
  text-align: center;
  height: 100vh;
  width: 100vw;
  @media (max-width: 600px) {
    display: grid;
    place-items: center;
  }
`;

const StyledBoxCentered = styled(BoxCentered)`
  margin-top: 10%;
`;

const StyledInnerBoxCentered = styled(BoxCentered)`
  display: block;
`;

const StyledHeading = styled(Heading)`
  font-family: pressStart2P;
  font-size: var(--font-size-5xl);
  margin-bottom: 40px;
  line-height: 3.5rem;
  color: #008000;
  @media (max-width: 600px) {
    font-size: var(--font-size-7xl);
    line-height: 2.5rem;
  }
`;

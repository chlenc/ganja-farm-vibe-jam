import styled from "@emotion/styled";

import Inventory from "./Inventory";
import Missions from "./Missions";

interface InfoProps {
  seeds: number;
  items: number;
}

const Container = styled.div`
  width: 100%;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: fixed;
  top: 8px;
  left: 8px;
  width: fit-content;
  z-index: 10;
  max-width: calc(100% - 16px);
`;

export default function Info() {
  return (
    <Container>
      <InfoWrapper>
        <Missions />
        <Inventory />
      </InfoWrapper>
    </Container>
  );
}

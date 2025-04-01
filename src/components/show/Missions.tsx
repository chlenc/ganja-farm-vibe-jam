import styled from "@emotion/styled";
import { observer } from "mobx-react-lite";
import { useStores } from "../../stores";

interface InventoryProps {
  seeds: number;
  items: number;
}

const Container = styled.div`
  display: flex;
  border: 3px solid #754a1e;
  border-radius: 8px;
  /* height: 40px; */
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  background: #ac7339;
  justify-content: center;
  padding: 4px 10px;
  text-align: left;
  white-space: pre-wrap;
  flex-direction: column;
`;

const Missions = observer(() => {
  const { missionStore } = useStores();
  return (
    <Container>
      <b>Missions:</b>
      {missionStore.missions.join("\n")}
    </Container>
  );
});

export default Missions;

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
  height: 80px;
  box-sizing: border-box;
  align-items: center;
  background: #ac7339;
  justify-content: center;
  padding: 0 10px;
  width: fit-content;
`;

const ItemBox = styled.div`
  width: 60px;
  position: relative;
  margin: 0 5px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 640px) {
    width: 80px;
  }
`;

const ItemImage = styled.img`
  image-rendering: pixelated;
  height: 50px;

  @media (min-width: 640px) {
    height: 70px;
  }
`;

const CounterWrapper = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const Counter = styled.div`
  font-size: 10px;
  font-family: pressStart2P;
  min-width: 25px;
  height: 25px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  display: grid;
  place-items: center;

  @media (min-width: 640px) {
    width: 35px;
    height: 35px;
  }
`;

const Inventory = observer(() => {
  const { ganjaFarmStore } = useStores();
  const { seeds, items, balance } = ganjaFarmStore;
  console.log({ seeds, items, balance });
  return (
    <Container>
      <ItemBox>
        <ItemImage src="images/tomato_seed_bag.png" alt="Seeds" />
        <CounterWrapper>
          <Counter>
            {seeds != null && seeds > 99 ? "99+" : (seeds ?? "-")}
          </Counter>
        </CounterWrapper>
      </ItemBox>

      <ItemBox>
        <ItemImage src="images/tomato.png" alt="Tomatoes" />
        <CounterWrapper>
          <Counter>{items > 99 ? "99+" : items}</Counter>
        </CounterWrapper>
      </ItemBox>

      <ItemBox>
        <ItemImage src="images/coin.png" alt="Tomatoes" />
        <CounterWrapper>
          <Counter>
            {balance >= 1000
              ? balance >= 1000000
                ? `${(balance / 1000000).toFixed(1)}M`
                : `${(balance / 1000).toFixed(1)}k`
              : balance % 1 !== 0 && balance >= 10
                ? `~${Math.round(balance)}`
                : balance % 1 === 0
                  ? balance.toFixed(0)
                  : balance.toFixed(2)}
          </Counter>
        </CounterWrapper>
      </ItemBox>
    </Container>
  );
});

export default Inventory;

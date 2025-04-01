import { makeAutoObservable } from "mobx";
import RootStore from "./RootStore";

export default class MissionStore {
  rootStore?: RootStore;

  private constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  get missions() {
    const missions = [];

    if (this.rootStore?.ganjaFarmStore.seeds === 0) {
      missions.push("Buy seeds");
    }

    if (
      this.rootStore?.ganjaFarmStore.garden &&
      this.rootStore?.ganjaFarmStore.garden.inner.some((item) => item == null)
    ) {
      missions.push("Plant ganja");
    }

    if (this.rootStore?.ganjaFarmStore.garden?.inner.some((item) => item?.timePlanted && Date.now() - item.timePlanted >= 60 * 1000)) {
      missions.push("Harvest ganja");
    }

    if ((this.rootStore?.ganjaFarmStore.items ?? 0) > 0) {
      missions.push("Sell ganja");
    }

    return missions;
  }

  static create = (rootStore: RootStore) => {
    return new MissionStore(rootStore);
  };
}

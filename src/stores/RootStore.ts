import { autorun, makeAutoObservable } from "mobx";
import UserStore, { ISerializedUserStore } from "./UserStore";
import MissionStore from "./MissionStore";
import { saveState } from "../utils/localStorage";
import { GanjaFarmStore, ISerializedGanjaFarmStore } from "./GanjaFarmStore";

export interface ISerializedRootStore {
  userStore?: ISerializedUserStore;
  ganjaFarmStore?: ISerializedGanjaFarmStore;
}
export default class RootStore {
  static instance?: RootStore;
  userStore: UserStore;
  missionStore: MissionStore;
  ganjaFarmStore: GanjaFarmStore;

  private constructor(initState?: ISerializedRootStore) {
    makeAutoObservable(this);
    this.userStore = UserStore.create(this, initState?.userStore);
    this.missionStore = MissionStore.create(this);
    this.ganjaFarmStore = GanjaFarmStore.create(
      this,
      initState?.ganjaFarmStore
    );
    autorun(() => saveState(this.serialize()), { delay: 1000 });
  }

  static create = (initState?: ISerializedRootStore) => {
    if (!RootStore.instance) {
      RootStore.instance = new RootStore(initState);
    }

    return RootStore.instance;
  };

  serialize = (): ISerializedRootStore => {
    return {
      userStore: this.userStore.serialize(),
      ganjaFarmStore: this.ganjaFarmStore.serialize(),
    };
  };
}

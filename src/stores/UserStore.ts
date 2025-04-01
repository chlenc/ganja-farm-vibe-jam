import { makeAutoObservable } from "mobx";
import RootStore from "./RootStore";

export interface ISerializedUserStore {}

export default class UserStore {
  rootStore?: RootStore;

  initialized: boolean = false;
  wallet: string = "420";
  private constructor(rootStore: RootStore, initState?: ISerializedUserStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  static create = (rootStore: RootStore, initState?: ISerializedUserStore) => {
    return new UserStore(rootStore);
  };

  serialize = (): ISerializedUserStore => {
    return {};
  };
}

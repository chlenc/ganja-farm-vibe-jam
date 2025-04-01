import { ISerializedRootStore } from "../stores/RootStore";

export const loadState = (): ISerializedRootStore | undefined => {
  try {
    const raw =
      localStorage.getItem("ganjafarm-store") ??
      localStorage.getItem("ganjafarm-store");
    const state = JSON.parse(raw as string);
    return state || undefined;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
export const saveState = (state: ISerializedRootStore): void => {
  localStorage.setItem("ganjafarm-store", JSON.stringify(state));
};

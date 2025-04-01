import React from "react";
import RootStore from "./RootStore";

const storesContext = React.createContext<RootStore | null>(null);

const useStores = () => {
  const rootStore = React.useContext(storesContext);
  if (rootStore === null) {
    throw new Error("No RootStore found i context");
  }
  return rootStore;
};

export {
    RootStore,
    storesContext,
    useStores,
}
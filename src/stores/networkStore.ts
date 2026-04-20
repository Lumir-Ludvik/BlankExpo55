import * as Network from "expo-network";
import { create } from "zustand";

type NetworkStore = {
  isOffline: boolean;
  connectionType: Network.NetworkStateType;
  init: () => () => void;
};

export const useNetworkStore = create<NetworkStore>(set => ({
  isOffline: false,
  connectionType: Network.NetworkStateType.UNKNOWN,
  init: () => {
    Network.getNetworkStateAsync().then(state => {
      set({
        isOffline: !state.isConnected,
        connectionType: state.type ?? Network.NetworkStateType.UNKNOWN,
      });
    });

    const subscription = Network.addNetworkStateListener(state => {
      set({
        isOffline: !state.isConnected,
        connectionType: state.type ?? Network.NetworkStateType.UNKNOWN,
      });
    });

    return () => subscription.remove();
  },
}));

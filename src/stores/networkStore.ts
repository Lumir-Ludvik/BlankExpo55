import NetInfo, { NetInfoStateType } from "@react-native-community/netinfo";
import { create } from "zustand";

type NetworkStore = {
  isOffline: boolean;
  connectionType: NetInfoStateType;
  init: () => () => void;
};

export const useNetworkStore = create<NetworkStore>(set => ({
  isOffline: false,
  connectionType: NetInfoStateType.unknown,
  init: () =>
    NetInfo.addEventListener(state => {
      set({
        isOffline: !state.isConnected,
        connectionType: state.type,
      });
    }),
}));

import * as Network from "expo-network";

import { useNetworkStore } from "@/stores/networkStore";

const mockRemove = jest.fn();
const mockAddNetworkStateListener = jest
  .fn()
  .mockReturnValue({ remove: mockRemove });
const mockGetNetworkStateAsync = jest.fn();

jest.mock("expo-network", () => ({
  NetworkStateType: {
    UNKNOWN: "UNKNOWN",
    NONE: "NONE",
    WIFI: "WIFI",
    CELLULAR: "CELLULAR",
  },
  getNetworkStateAsync: () => mockGetNetworkStateAsync(),
  addNetworkStateListener: (cb: (state: Network.NetworkState) => void) =>
    mockAddNetworkStateListener(cb),
}));

function getState() {
  return useNetworkStore.getState();
}

describe("networkStore", () => {
  beforeEach(() => {
    useNetworkStore.setState({
      isOffline: false,
      connectionType: Network.NetworkStateType.UNKNOWN,
    });
    jest.clearAllMocks();
  });

  it("has correct initial state", () => {
    // Assert
    expect(getState().isOffline).toBe(false);
    expect(getState().connectionType).toBe(Network.NetworkStateType.UNKNOWN);
  });

  it("sets state from initial fetch on init", async () => {
    // Arrange
    mockGetNetworkStateAsync.mockResolvedValue({
      isConnected: true,
      type: Network.NetworkStateType.WIFI,
    });

    // Act
    getState().init();
    await Promise.resolve();

    // Assert
    expect(getState().isOffline).toBe(false);
    expect(getState().connectionType).toBe(Network.NetworkStateType.WIFI);
  });

  it("marks offline when not connected on init", async () => {
    // Arrange
    mockGetNetworkStateAsync.mockResolvedValue({
      isConnected: false,
      type: Network.NetworkStateType.NONE,
    });

    // Act
    getState().init();
    await Promise.resolve();

    // Assert
    expect(getState().isOffline).toBe(true);
    expect(getState().connectionType).toBe(Network.NetworkStateType.NONE);
  });

  it("updates state when listener fires", () => {
    // Arrange
    mockGetNetworkStateAsync.mockResolvedValue({
      isConnected: true,
      type: Network.NetworkStateType.WIFI,
    });
    getState().init();
    const listener = mockAddNetworkStateListener.mock.calls[0][0];

    // Act
    listener({ isConnected: false, type: Network.NetworkStateType.NONE });

    // Assert
    expect(getState().isOffline).toBe(true);
    expect(getState().connectionType).toBe(Network.NetworkStateType.NONE);
  });

  it("falls back to UNKNOWN when type is undefined", async () => {
    // Arrange
    mockGetNetworkStateAsync.mockResolvedValue({
      isConnected: true,
      type: undefined,
    });

    // Act
    getState().init();
    await Promise.resolve();

    // Assert
    expect(getState().connectionType).toBe(Network.NetworkStateType.UNKNOWN);
  });

  it("sets state correctly on cellular connection", async () => {
    // Arrange
    mockGetNetworkStateAsync.mockResolvedValue({
      isConnected: true,
      type: Network.NetworkStateType.CELLULAR,
    });

    // Act
    getState().init();
    await Promise.resolve();

    // Assert
    expect(getState().isOffline).toBe(false);
    expect(getState().connectionType).toBe(Network.NetworkStateType.CELLULAR);
  });

  it("removes the listener on cleanup", () => {
    // Arrange
    mockGetNetworkStateAsync.mockResolvedValue({
      isConnected: true,
      type: Network.NetworkStateType.WIFI,
    });
    const cleanup = getState().init();

    // Act
    cleanup();

    // Assert
    expect(mockRemove).toHaveBeenCalledTimes(1);
  });
});

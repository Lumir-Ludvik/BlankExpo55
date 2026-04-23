import { useAuthStore } from "./authStore";

const mockAuthenticateAsync = jest.fn();

jest.mock("expo-local-authentication", () => ({
  authenticateAsync: (options: unknown) => mockAuthenticateAsync(options),
}));

jest.mock("@/i18n", () => ({
  __esModule: true,
  default: { t: (key: string) => key },
}));

function getState() {
  return useAuthStore.getState();
}

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false });
    jest.clearAllMocks();
  });

  it("has correct initial state", () => {
    // Assert
    expect(getState().isAuthenticated).toBe(false);
  });

  it("sets isAuthenticated to true on successful authentication", async () => {
    // Arrange
    mockAuthenticateAsync.mockResolvedValue({ success: true });

    // Act
    await getState().authenticate();

    // Assert
    expect(getState().isAuthenticated).toBe(true);
  });

  it("keeps isAuthenticated false when authentication fails", async () => {
    // Arrange
    mockAuthenticateAsync.mockResolvedValue({ success: false });

    // Act
    await getState().authenticate();

    // Assert
    expect(getState().isAuthenticated).toBe(false);
  });

  it("keeps isAuthenticated false when user cancels", async () => {
    // Arrange
    mockAuthenticateAsync.mockResolvedValue({
      success: false,
      error: "user_cancel",
    });

    // Act
    await getState().authenticate();

    // Assert
    expect(getState().isAuthenticated).toBe(false);
  });

  it("passes biometric prompt message to authenticateAsync", async () => {
    // Arrange
    mockAuthenticateAsync.mockResolvedValue({ success: true });

    // Act
    await getState().authenticate();

    // Assert
    expect(mockAuthenticateAsync).toHaveBeenCalledWith({
      promptMessage: "auth.biometricPrompt",
      disableDeviceFallback: false,
    });
  });

  it("locks by setting isAuthenticated to false", () => {
    // Arrange
    useAuthStore.setState({ isAuthenticated: true });

    // Act
    getState().lock();

    // Assert
    expect(getState().isAuthenticated).toBe(false);
  });
});

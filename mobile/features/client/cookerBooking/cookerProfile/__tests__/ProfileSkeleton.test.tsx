import { Animated } from "react-native";
import { render, screen } from "@testing-library/react-native";
import { ProfileSkeleton } from "../components/ProfileSkeleton";

describe("ProfileSkeleton", () => {
  beforeEach(() => {
    jest.spyOn(Animated, "loop").mockReturnValue({
      start: jest.fn(),
      stop: jest.fn(),
      reset: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("est rendu avec le testID profile-skeleton", () => {
    render(<ProfileSkeleton />);
    expect(screen.getByTestId("profile-skeleton")).toBeTruthy();
  });
});

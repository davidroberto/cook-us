import { render, screen } from "@testing-library/react-native";
import { ProfileSkeleton } from "../components/ProfileSkeleton";

describe("ProfileSkeleton", () => {
  it("est rendu avec le testID profile-skeleton", () => {
    render(<ProfileSkeleton />);
    expect(screen.getByTestId("profile-skeleton")).toBeTruthy();
  });
});

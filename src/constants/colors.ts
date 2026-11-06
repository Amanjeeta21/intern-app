export interface AppColors {
  background: string;
  card: string;
  secondary: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  success: string;
  warning: string;
}

export const ThemeColors: Record<"light" | "dark", AppColors> = {
  dark: {
    background: "#101010",
    card: "#1C1C1C",
    secondary: "#292929",
    text: "#FFFFFF",
    muted: "#A1A1AA",
    border: "#333333",
    accent: "#9B6DFF",
    success: "#16A34A",
    warning: "#FBBF24",
  },

  light: {
    background: "#F8F8FC",
    card: "#FFFFFF",
    secondary: "#EEEEF5",
    text: "#18181B",
    muted: "#71717A",
    border: "#E4E4E7",
    accent: "#8052D6",
    success: "#15803D",
    warning: "#B45309",
  },
};

// Keep the existing dark palette as the default for older imports.
export const Colors = ThemeColors.dark;

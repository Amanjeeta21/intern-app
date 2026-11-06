import { View, type ViewProps } from "react-native";

import { ThemeColor } from "@/constants/theme";
import { useAppTheme } from "@/context/ThemeContext";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  type,
  ...otherProps
}: ThemedViewProps) {
  const { colors } = useAppTheme();

  const themeColors: Record<ThemeColor, string> = {
    text: colors.text,
    background: colors.background,
    backgroundElement: colors.card,
    backgroundSelected: colors.secondary,
    textSecondary: colors.muted,
  };

  const backgroundColor =
    colors === undefined
      ? themeColors[type ?? "background"]
      : themeColors[type ?? "background"];

  return (
    <View
      style={[{ backgroundColor: backgroundColor }, style]}
      {...otherProps}
    />
  );
}

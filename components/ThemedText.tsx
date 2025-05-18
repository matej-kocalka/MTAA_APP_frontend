import { StyleProp, TextProps, TextStyle, useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";

import { Text } from "react-native";

/**
 * Props for the ThemedText component.
 */
export type ThemedTextProps = TextProps & {
  /**
   * Optional custom styles to apply to the text.
   */
};

/**
 * A custom Text component that applies the app's current theme text color.
 *
 * @param {ThemedTextProps} props - ThemedText props including optional style and children
 * @returns {JSX.Element} A styled Text element with theme-based color
 */
const ThemedText = ({ style, children, ...props }: ThemedTextProps) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme ? Colors[colorScheme] : Colors.light;
  return (
    <Text style={[{ color: theme.textColor }, style]} {...props}>{children}</Text>
  )
}

export default ThemedText;
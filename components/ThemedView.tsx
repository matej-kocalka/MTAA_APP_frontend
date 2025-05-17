import { StyleProp, useColorScheme, ViewStyle } from "react-native";
import { Colors } from "@/constants/colors";

import { View } from "react-native";


/**
 * Props for the ThemedView component.
 */
export type ThemedViewProps = {
  /**
   * Optional style object for custom view styling.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * React child components to render within the view.
   */
  children?: React.ReactNode;
};

/**
 * 
 * A custom view component.
 * Automatically adapts its background color to the current color scheme.
 *
 * @param {ThemedViewProps} props - Props including optional styles and children.
 * @returns {JSX.Element} A themed `View` component.
 */
const ThemedView = ({ style, children, ...props }: ThemedViewProps) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme ? Colors[colorScheme] : Colors.light;
  return (
    <View style={[{ backgroundColor: theme.backgroundColor }, style]} {...props} >{children}</View>
  )
}

export default ThemedView;
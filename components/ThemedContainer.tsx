import { StyleSheet, StyleProp, useColorScheme, ViewStyle } from "react-native";
import { Colors } from "@/constants/colors";

import { View } from "react-native";

/**
 * Props for the ThemedContainer component.
 */
export type ThemedContainerProps = {
  /**
  * Optional custom styles to apply to the container.
  */
  style?: StyleProp<ViewStyle>;
  testID?: string;
  children?: React.ReactNode;
};

/**
 * A custom container component.
 * Automatically adapts its background color to the current color scheme.
 *
 * @param {ThemedContainerProps} props - Props for customization and content
 * @returns {JSX.Element} A themed container wrapping children
 */
const ThemedContainer = ({ style, children, ...props }: ThemedContainerProps) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme ? Colors[colorScheme] : Colors.light;

  const styles = StyleSheet.create({
    Container: {
      backgroundColor: theme.containerColor,
      marginInline: 15,
      marginTop: 15,
      padding: 10,
      borderRadius: 5,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.3,
      shadowRadius: 1,
      elevation: 2,
    },
  });

  return (
    <View style={[styles.Container, style]} testID={props.testID} {...props}>{children}</View>
  )
}

export default ThemedContainer;
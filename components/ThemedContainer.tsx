import { StyleSheet, StyleProp, useColorScheme, ViewStyle } from "react-native";
import { Colors } from "@/constants/colors";

import { View } from "react-native";

type ThemedContainerProps = {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

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
    <View style={[styles.Container, style]} {...props}>{children}</View>
  )
}

export default ThemedContainer;
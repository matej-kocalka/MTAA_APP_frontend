import { StyleProp, useColorScheme, ViewStyle } from "react-native";
import { Colors } from "@/constants/colors";

import { View } from "react-native";

type ThemedContainerProps = {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

const ThemedContainer = ({ style, children, ...props }: ThemedContainerProps) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme ? Colors[colorScheme] : Colors.light;
  return (
    <View style={[{ backgroundColor: theme.containerColor }, style]} {...props}>{children}</View>
  )
}

export default ThemedContainer;
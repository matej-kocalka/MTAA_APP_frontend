import { StyleProp, useColorScheme, ViewStyle } from "react-native";
import { Colors } from "@/constants/colors";

import { View } from "react-native";

type ThemedViewProps = {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

const ThemedView = ({ style, children, ...props }: ThemedViewProps) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme ? Colors[colorScheme] : Colors.light;
  return (
    <View style={[{ backgroundColor: theme.backgroundColor }, style]} {...props} >{children}</View>
  )
}

export default ThemedView;
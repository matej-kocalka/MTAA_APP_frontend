import { StyleProp, useColorScheme, ViewStyle } from "react-native";
import { Colors } from "@/constants/colors";

import { TouchableOpacity } from "react-native";

type ThemedTouchableProps = {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

const ThemedThouchable = ({ style, children, ...props }: ThemedTouchableProps) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme ? Colors[colorScheme] : Colors.light;
  return (
    <TouchableOpacity style={[{ backgroundColor: theme.containerColor }, style]} {...props}>{children}</TouchableOpacity>
  )
}

export default ThemedThouchable;
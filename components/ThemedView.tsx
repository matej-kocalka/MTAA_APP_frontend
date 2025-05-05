import { useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";

import { View } from "react-native";

const ThemedView = ({style, ...props}) => {
  const colorScheme = useColorScheme();
  const theme =  colorScheme ? Colors[colorScheme] : Colors.light;
    return (
        <View style={[{backgroundColor: theme.backgroundColor}, style]} {...props} />
    )
}

export default ThemedView;
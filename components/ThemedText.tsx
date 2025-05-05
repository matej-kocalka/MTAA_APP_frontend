import { useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";

import { Text } from "react-native";

const ThemedText = ({style, ...props}) => {
  const colorScheme = useColorScheme();
  const theme =  colorScheme ? Colors[colorScheme] : Colors.light;
    return (
        <Text style={[{color: theme.textColor}, style]} {...props} />
    )
}

export default ThemedText;
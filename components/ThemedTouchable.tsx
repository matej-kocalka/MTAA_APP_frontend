import { useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";

import { TouchableOpacity } from "react-native";

const ThemedThouchable = ({style, ...props}) => {
  const colorScheme = useColorScheme();
  const theme =  colorScheme ? Colors[colorScheme] : Colors.light;
    return (
        <TouchableOpacity style={[{backgroundColor: theme.containerColor}, style]} {...props} />
    )
}

export default ThemedThouchable;
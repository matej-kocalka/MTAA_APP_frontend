import { StyleProp, TextProps, TextStyle, useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";

import { Text } from "react-native";

type ThemedTextProps = TextProps & {
  style?: StyleProp<TextStyle>;
};

const ThemedText = ({ style, children, ...props }: ThemedTextProps) => {
  const colorScheme = useColorScheme();
  const theme =  colorScheme ? Colors[colorScheme] : Colors.light;
    return (
        <Text style={[{color: theme.textColor}, style]} {...props}>{children}</Text>
    )
}

export default ThemedText;
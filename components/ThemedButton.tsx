import { StyleSheet, StyleProp, useColorScheme, ViewStyle, TouchableOpacity, Text } from "react-native";
import { Colors } from "@/constants/colors";

/**
 * Props for the ThemedButtonProps component.
 */
export type ThemedButtonProps = {
    /**
     * Optional custom styles to apply to the button container.
     */
    style?: StyleProp<ViewStyle>;

    children?: React.ReactNode;

    /**
     * Function to call when the button is pressed.
     */
    onPress?: () => void;
};

/**
 * A custom button that adapts to the current theme (light/dark).
 *
 * @param {ThemedButtonProps} props - Props for customizing the button appearance and behavior
 * @returns {JSX.Element} A themed button component
 */
const ThemedButton = ({ style, children, ...props }: ThemedButtonProps) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;

    const styles = StyleSheet.create({
        ButtonText: {
            color: theme.buttonTextColor,
            fontWeight: 'bold',
            textAlign: "center",
            flexGrow: 1,
            alignContent: "center"
        },
        Button: {
            backgroundColor: theme.secondaryAccent,
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 5,
            margin: 15,
            marginBottom: 0,
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
        <TouchableOpacity style={[styles.Button, style]} onPress={props.onPress} {...props}>
            <Text style={styles.ButtonText}>{children}</Text>
        </TouchableOpacity>
    )
}

export default ThemedButton;
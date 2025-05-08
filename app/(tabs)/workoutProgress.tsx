import ThemedButton from "@/components/ThemedButton";
import ThemedContainer from "@/components/ThemedContainer";
import { WorkoutContainer, WorkoutInfoBox } from "@/components/workout";
import { Colors } from "@/constants/colors";
import { useNavigation } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView, Pressable, TextInput, Button, useColorScheme } from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type Workout = {
    id: number;
    name: string;
    date: Date;
    distance: Float;
};

export default function currentWorkout() {
    const currentWorkout: Workout =
    {
        id: 1,
        name: "Morning Run",
        date: new Date('2025-04-20T07:00:00'),
        distance: 5.0,
    };

    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={styles.topBarButton} onPress={() => alert('To be completed')}
                ><Text style={{
                    color: theme.buttonTextColor,
                    fontWeight: 'bold',
                }}>Finish Workout</Text></TouchableOpacity>
            ),
        });
    }, [navigation]);

    const [visible, setVisible] = useState(false);
    const [name, setName] = useState('');
    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;

    const styles = StyleSheet.create({
        map: {
            height: 350,
        },

        modalView: {
            margin: 20,
            padding: 20,
            width: "auto",
            height: "auto",
            borderRadius: 10,
            alignItems: "center",
            elevation: 5
        },
        modalBackground: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        modalContainer: {
            margin: 20,
            backgroundColor: theme.backgroundColor,
            borderRadius: 10,
            padding: 20
        },
        title: {
            fontSize: 20,
            marginBottom: 10,
            fontWeight: 'bold',
            color: theme.textColor,
        },
        input: {
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
            color: theme.textColor,
            backgroundColor: theme.tabsBackground,
        },
        buttonRow: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        modalButton: {
            backgroundColor: theme.secondaryAccent,
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 5,
            marginTop: 10
        },
        buttonText: {
            color: theme.buttonTextColor,
            fontWeight: 'bold',
            textAlign: "center",
            flexGrow: 1
        },

        topBarButton: {
            backgroundColor: theme.secondaryAccent,
            padding: 5,
            borderRadius: 5,
            marginRight: 15,
        }
    })

    return (

        <ScrollView style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}>
            <ThemedContainer style={styles.map}>
                <Text>Map placeholder</Text>
            </ThemedContainer>
            <WorkoutInfoBox data={currentWorkout} />
            <ThemedButton onPress={() => setVisible(true)}>Add friend</ThemedButton>

            <Modal
                visible={visible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.title}>Add friend to Workout</Text>

                        <TextInput
                            placeholder=""
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                        />
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: 'gray' }]}
                                onPress={() => setVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton}>
                                <Text style={styles.buttonText}>Send request</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    )

}



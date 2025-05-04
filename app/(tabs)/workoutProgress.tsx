import { WorkoutInfoBox } from "@/components/workout";
import { useNavigation } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView, Pressable, TextInput, Button } from "react-native";
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
                ><Text>Finish Workout</Text></TouchableOpacity>
            ),
        });
    }, [navigation]);

    const [visible, setVisible] = useState(false);
    const [name, setName] = useState('');

    return (

        <ScrollView style={styles.scrollView}>
            <View style={styles.map}>
                <Text>Map placeholder</Text>
            </View>
            <WorkoutInfoBox data={currentWorkout} />
            <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
                <Text style={styles.buttonText}>Add friend</Text>
            </TouchableOpacity>

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

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
    },

    map: {
        height: 350,
        marginInline: 15,
        marginTop: 15,
        padding: 10,
        borderRadius: 5,
        backgroundColor: "lightgray",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 4,
    },

    modalView: {
        margin: 20,
        padding: 20,
        width: "auto",
        height: "auto",
        backgroundColor: "red",
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
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modalButton: {
        backgroundColor: 'rgb(156, 172, 182)',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginTop: 10
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: "center",
        flexGrow: 1
    },
    button: {
        backgroundColor: 'rgb(156, 172, 182)',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        margin: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 4,
    },

    topBarButton:{
        backgroundColor: 'lightgray',
        padding: 5,
        borderRadius: 5,
        marginRight: 15,
    }
})

import RNFS from 'react-native-fs';
import React, { useCallback, useContext, useEffect, useState, useLayoutEffect } from "react";
import { Image, View, StyleSheet, useColorScheme, ScrollView, TouchableOpacity, Modal, TextInput, RefreshControl, Button, Text } from "react-native";
import { AuthContext } from "@/context/AuthContext";
import ThemedContainer from "@/components/ThemedContainer";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton"
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { downloadProfilePicture, deleteUserProfile, changePhoto } from "@/services/UserManagmentService";
import NetInfo from '@react-native-community/netinfo';
import useAuth from '@/hooks/useAuth';
import AuthService from '@/services/AuthService';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { useNavigation, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import DateTimePicker from '@react-native-community/datetimepicker';

export default function RootLayout(dateTime) {
    const router = useRouter();
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions(
            {
                title: 'Schedule workout reminder', headerBackTitle: 'Back',
            }
        );
    }, [navigation]);

    const scheduleNotification = async (dateTime) => {
        if (dateTime < new Date()) {
            alert("No time traveling please.");
            return;
        }
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "It's time to workout!",
                body: "You have set a reminder, and here it is.",
            },
            trigger:
            {
                type: 'date',
                date: dateTime,
            },
        });
        alert("Reminder set");
        router.back();
    };

    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;

    const styles = StyleSheet.create({
        buttonDisabled: {
            opacity: 0.5
        },

        image: {
            backgroundColor: theme.tabsBackground,
            borderRadius: 75,
            width: 150,
            height: 150,
            marginTop: 20,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.3,
            shadowRadius: 1,
            elevation: 2,
        },

        username: {
            marginTop: 30,
            marginBottom: 5,
            fontSize: 40,
            fontWeight: "normal",
        },

        email: {
            marginBottom: 20,
            fontSize: 15,
            fontWeight: "normal",
        },

        changeButtons: {
            flexDirection: "row",
            alignItems: "center",
            borderBottomColor: theme.backgroundColor,
            borderBottomWidth: 1,
            padding: 15,
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
        modalButton: {
            backgroundColor: theme.secondaryAccent,
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 5,
            marginTop: 10
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
    });

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date'); // 'date' or 'time'
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
            // User picked a date
            setDate(selectedDate);
        }
        setShow(false);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    return (
        <View style={{ backgroundColor: theme.backgroundColor, flex: 1 }}>
            <ThemedContainer>
                <View style={{ alignItems: "center", margin: 30, marginBottom: 10 }}><Ionicons name="alarm-outline" size={150} color={theme.accentColor} /></View>
                <ThemedText style={{ textAlign: "center", fontSize: 25, margin: 10 }}>Set a reminder:</ThemedText>
                <ThemedText style={{ textAlign: "center", fontSize: 15, margin: 0, marginBottom: 20 }}>{date.toLocaleString()}</ThemedText>
                <View style={{ flexDirection: "row" }}>
                    <ThemedButton style={{ marginInline: 0, flexGrow: 1, marginRight: 5 }} onPress={() => showMode('date')}>Date</ThemedButton>
                    <ThemedButton style={{ marginInline: 0, flexGrow: 1, marginLeft: 5 }} onPress={() => showMode('time')}>Time</ThemedButton>
                </View>
                <ThemedButton style={{ marginInline: 0, marginTop: 10, flexGrow: 1 }} onPress={() => scheduleNotification(date)}>Set reminder</ThemedButton>

                {show && (
                    <DateTimePicker
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                        minimumDate={new Date()}
                    />
                )}
            </ThemedContainer>
        </View>
    );
}

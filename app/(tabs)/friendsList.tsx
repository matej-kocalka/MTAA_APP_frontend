import { FriendContainer, FriendRequest } from "@/components/friend";
import ThemedButton from "@/components/ThemedButton";
import ThemedContainer from "@/components/ThemedContainer";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/colors";
import { FriendsContext } from "@/context/FriendsContext";
import useAuth from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useContext, useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, useColorScheme, View, Text, Modal, TextInput, ScrollView, RefreshControl } from "react-native";
import NetInfo from '@react-native-community/netinfo';
import { downloadFriendsProfilePicture } from "@/services/FriendsService";
import ThemedThouchable from "@/components/ThemedTouchable";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Friend = {
    id: number;
    name: string;
    email: string;
    profilePic: any;
    request: boolean;
};


export default function FriendList() {
    const navigation = useNavigation();
    useLayoutEffect(() => {
        if (isOnline) {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity style={{
                        backgroundColor: theme.secondaryAccent,
                        padding: 5,
                        borderRadius: 5,
                        marginRight: 15,
                    }} onPress={() => {
                        onRefresh();
                        setVisible(true);
                    }}>
                        <Text style={{
                            color: theme.buttonTextColor,
                            fontWeight: 'bold',
                        }}> Add friends </Text></TouchableOpacity>
                ),
            });
        }
    }, [navigation]);

    const [isOnline, setOnline] = useState(true);
    const auth = useAuth();
    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;
    const [friendList, setFriendList] = useState<Friend[]>([])
    const friends = useContext(FriendsContext);

    const styles = StyleSheet.create({
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
    const [visible, setVisible] = useState(false);
    const [friendsEmail, setFriendsEmail] = useState("");
    let addFriendModal = (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Add a new friend</Text>
                    <TextInput
                        placeholder="Friend's email"
                        value={friendsEmail}
                        onChangeText={setFriendsEmail}
                        style={styles.input}
                    />
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: 'gray' }]}
                            onPress={() => setVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => { if (friendsEmail.trim() === '') { alert("Email cannot be empty!") } else { friends?.addFriends(auth.user!, friendsEmail.trim()); setVisible(false); } }}>
                            <Text style={styles.buttonText}>Send request</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>)

    const fetchPictures = async (friend_id: number) => {
        return await downloadFriendsProfilePicture(auth.user!.token, friend_id)
    }

    const fetchFriends = async () => {
        const list = async () => {
            const l = await friends?.getFriends(auth.user!);
            if (l) {
                const friends: Friend[] = await Promise.all(
                    l.map(async user => ({
                        id: user.id,
                        name: user.username,
                        email: user.email,
                        profilePic: await fetchPictures(user.id),
                        request: false,
                    }))
                );
                return friends;
            }
        }

        const requestList = async () => {
            const l = await friends?.getRequests(auth.user!);
            if (l) {
                const friends: Friend[] = l?.map(user => ({
                    id: user.id,
                    name: user.username,
                    email: user.email,
                    profilePic: user.token, //both will be empty strings
                    request: true,
                }))
                return friends;
            }
        }

        const combine = async () => {
            const l = await list();
            const r = await requestList();
            if (l && r) {
                const combined = [...l, ...r];
                setFriendList(combined);
            }
        }

        NetInfo.fetch().then(state => {
            const i = state.isConnected && state.isInternetReachable;
            if (i)
                setOnline(true);
            else
                setOnline(false);
        });
        if (isOnline) combine();
    };

    const [refreshing, setRefreshing] = useState(true);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchFriends();
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            onRefresh();
        }, [])
    )

    

    if (isOnline) {
        if (refreshing) {
            return (
                <View style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}>
                        <ActivityIndicator size="large" color={theme.accentColor} />
                </View>
            );
        } else {
            if (friendList.length === 0) {
                return (
                    <ScrollView style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                        <ThemedContainer>
                            <View style={{ alignItems: "center", margin: 30 }}><Ionicons name="people" size={100} color={theme.accentColor} /></View>
                            <ThemedText style={{ textAlign: "center", fontSize: 20, margin: 10, marginBottom: 20 }}>No friends yet</ThemedText>
                        </ThemedContainer>
                        {addFriendModal}
                    </ScrollView>
                )
            } else {
                return (
                    <View style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}>
                        <FlatList<Friend>
                            contentInsetAdjustmentBehavior="automatic"
                            data={friendList}
                            renderItem={({ item }) => {
                                if (item.request) {
                                    return <FriendRequest data={item} user={auth.user!} friendManager={friends!} />;
                                }
                                return <FriendContainer data={item} user={auth.user!} friendManager={friends!} />;
                            }}
                            keyExtractor={(item) => item.id.toString()}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                        />
                        {addFriendModal}


                    </View>
                )
            }
        }
    }
    else return (
        <View style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}>
            <ThemedContainer>
                <View style={{ alignItems: "center", margin: 30 }}><Ionicons name="cloud-offline" size={100} color={theme.accentColor} /></View>
                <ThemedText style={{ textAlign: "center", fontSize: 20, margin: 10, marginBottom: 20 }}>You are offline</ThemedText>
            </ThemedContainer>
        </View>
    )
}


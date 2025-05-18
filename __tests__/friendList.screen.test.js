import { fireEvent, render, waitFor  } from "@testing-library/react-native";
import FriendList from '@/app/(tabs)/friendsList';
import {useRouter} from 'expo-router';
import {AuthContext} from "@/context/AuthContext";
import {WorkoutContext} from "@/context/WorkoutContext";
import { FriendsContext } from "@/context/FriendsContext";
import { useFocusEffect } from 'expo-router';
import NetInfo from '@react-native-community/netinfo';


// Mocks
const pushMock = jest.fn();
const loginMock = jest.fn(() => Promise.resolve()); // mock login success
const getTokenMock = jest.fn();
const getParticipant = () => {return null}
const checkLoggedInMock = jest.fn(() => Promise.resolve());
const fakeUser = {id: 1, email: "test@mail.com", username: "Test", token: "AuthTestToken"}
const fakeFriends = [{
                        id: 2,
                        username: "Test2",
                        email: "Test2@mail.com",
                        token: "TestAuthToken"
                    },{
                        id: 3,
                        username: "Test3",
                        email: "Test3@mail.com",
                        token: "TestAuthToken"
                    },{
                        id: 4,
                        username: "Test4",
                        email: "Test4@mail.com",
                        token: "TestAuthToken"
                    },
                    ];
const fakeRequests = [{
                        id: 5,
                        username: "Test5",
                        email: "Test5@mail.com",
                        token: "TestAuthToken"
                    },{
                        id: 6,
                        username: "Test6",
                        email: "Test6@mail.com",
                        token: "TestAuthToken"
                    },
                    ];
const mockFriendManager = {
  getFriends: jest.fn(() => Promise.resolve(fakeFriends)),
  getRequests: jest.fn(() => Promise.resolve(fakeRequests)), 
  getFriendsProfilePicture: jest.fn(),
};

jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useFocusEffect: jest.fn(),
}));

beforeEach(() => {
  pushMock.mockClear();
  useRouter.mockReturnValue({ push: pushMock });
  
  NetInfo.fetch.mockResolvedValue({
    isConnected: true,           // Simulate that the device is online
    isInternetReachable: true,  // Simulate that the internet is reachable
  });

  useFocusEffect.mockImplementation((effect) => {
    effect();
  });
});

describe('Friend List Screen', () => {
    it('Show friend list',  async () => {
        const { findAllByTestId, getAllByTestId } = render(
            <AuthContext.Provider value={{ login: loginMock, checkLoggedInUser: checkLoggedInMock, getToken: getTokenMock, user: fakeUser }}>
                <FriendsContext.Provider value={mockFriendManager}>
                    <FriendList />
                </FriendsContext.Provider>
            </AuthContext.Provider>
            );

            const friendItems = await waitFor(() => findAllByTestId("FriendContainer"));
            expect(friendItems.length).toEqual(fakeFriends.length);

            const requestItems = await waitFor(() => findAllByTestId("FriendRequest"));
            expect(requestItems.length).toEqual(fakeRequests.length);
    })
})

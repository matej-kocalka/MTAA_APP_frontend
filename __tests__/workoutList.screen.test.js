import { fireEvent, render, waitFor  } from "@testing-library/react-native";
import WorkoutList from '@/app/(tabs)/WorkoutList';
import {useRouter} from 'expo-router';
import {AuthContext} from "@/context/AuthContext";
import {WorkoutContext} from "@/context/WorkoutContext";
import { FriendsContext } from "@/context/FriendsContext";


// Mocks
const pushMock = jest.fn();
const loginMock = jest.fn(() => Promise.resolve()); // mock login success
const getTokenMock = jest.fn();
const getParticipant = () => {return null}
const checkLoggedInMock = jest.fn(() => Promise.resolve());
const fakeUser = {id: 1, email: "test@mail.com", username: "Test", token: "AuthTestToken"}
const fakeWorkouts = [
                        {w_id: 1, name: "TestWorkout1", start: new Date(Date.now()), 
                                        participants: [{user: fakeUser}], 
                                        getParticipant: getParticipant},
                        {w_id: 2, name: "TestWorkout1", start: new Date(Date.now()), 
                                        participants: [{user: fakeUser}], 
                                        getParticipant: getParticipant},
                        {w_id: 3, name: "TestWorkout3", start: new Date(Date.now()), 
                                        participants: [{user: fakeUser}], 
                                        getParticipant: getParticipant},
                    ];
const mockWorkoutManager = {
  setUser: jest.fn(),
  getWorkouts: jest.fn(() => Promise.resolve(fakeWorkouts)), 
};

beforeEach(() => {
  pushMock.mockClear();
  useRouter.mockReturnValue({ push: pushMock });
});

describe('Workout List Screen', () => {
    it('Show workout List',  async () => {
        const { findAllByTestId, getAllByTestId } = render(
            <AuthContext.Provider value={{ login: loginMock, checkLoggedInUser: checkLoggedInMock, getToken: getTokenMock, user: fakeUser }}>
                <WorkoutContext.Provider value={mockWorkoutManager}>
                  <FriendsContext.Provider value={{}}>
                      <WorkoutList />
                  </FriendsContext.Provider>
                </WorkoutContext.Provider>
            </AuthContext.Provider>
            );
        const workoutItems = await waitFor(() => findAllByTestId("workoutItem"));
        expect(workoutItems.length).toEqual(fakeWorkouts.length);
    })

    it('Open workout detail',  async () => {
        const { findAllByTestId, getAllByTestId } = render(
            <AuthContext.Provider value={{ login: loginMock, checkLoggedInUser: checkLoggedInMock, getToken: getTokenMock, user: fakeUser }}>
                <WorkoutContext.Provider value={mockWorkoutManager}>
                  <FriendsContext.Provider value={{}}>
                      <WorkoutList />
                  </FriendsContext.Provider>
                </WorkoutContext.Provider>
            </AuthContext.Provider>
            );
        const workoutItems = await waitFor(() => findAllByTestId("workoutItem"));
        
        fireEvent.press(workoutItems[0])

        expect(pushMock).toHaveBeenCalledWith({
            pathname: "/workoutDetail",
            params: {
              id: fakeWorkouts[0].w_id,
              userId: fakeWorkouts[0].participants[0].user.id,
            },
        });
    })
})

import { fireEvent, render, waitFor  } from "@testing-library/react-native";
import WorkoutProgressFunction from '@/app/(tabs)/workoutProgress';
import {useRouter} from 'expo-router';
import {AuthContext} from "@/context/AuthContext";



// Mocks
const getTokenMock = jest.fn();
const loginMock = jest.fn(() => Promise.resolve());
const checkLoggedInMock = jest.fn(() => Promise.resolve());



describe('Current Workout Screen', () => {
        it('Show start new workout without map', async () => {
        const { getByTestId, queryAllByTestId } = render(
            <AuthContext.Provider value={{ login: loginMock , checkLoggedInUser: checkLoggedInMock, getToken: getTokenMock}}>
                    <WorkoutProgressFunction />
            </AuthContext.Provider>
        );

        getByTestId("startWorkout")

        expect(queryAllByTestId("workoutProgress").length).toEqual(0);
    });

    it('Show map after clicking on start workout', async () => {
        const { getByTestId, queryAllByTestId, findByTestId } = render(
            <AuthContext.Provider value={{ login: loginMock , checkLoggedInUser: checkLoggedInMock, getToken: getTokenMock}}>
                    <WorkoutProgressFunction />
            </AuthContext.Provider>
        );

        const startWorkout = getByTestId("startWorkout");
        
        fireEvent.press(startWorkout);

        const nameEntry = getByTestId("newWorkoutName");
        fireEvent.changeText(nameEntry, 'New Workout');

        fireEvent.press(getByTestId("createWorkout"));

        await findByTestId("workoutProgress")
        expect(queryAllByTestId("startWorkout").length).toEqual(0);
    });
})
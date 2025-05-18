import { fireEvent, render, waitFor  } from "@testing-library/react-native";
import React from "react";
import Index from '@/app/index';
import AuthService from '@/services/AuthService';
import {AuthContext} from "@/context/AuthContext";
import {useRouter} from 'expo-router';

// Mocks
const pushMock = jest.fn();
const loginMock = jest.fn(() => Promise.resolve()); // mock login success
const checkLoggedInMock = jest.fn(() => Promise.resolve());

beforeEach(() => {
  pushMock.mockClear();
  useRouter.mockReturnValue({ push: pushMock });
});

describe('Login Screen', () => {
    it('Go to workout list on login',  async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ login: loginMock , checkLoggedInUser: checkLoggedInMock}}>
            <Index />
            </AuthContext.Provider>
        );

        // Simulate entering email and password
        fireEvent.changeText(getByTestId('emailEntry'), 'test@example.com');
        fireEvent.changeText(getByTestId('passwordEntry'), 'password123');

        // Simulate login button press
        fireEvent.press(getByTestId('loginButton'));

        // Wait for the async login to resolve
        await waitFor(() => {
            expect(loginMock).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(pushMock).toHaveBeenCalledWith('/(tabs)/workoutList');
        });
    })
})
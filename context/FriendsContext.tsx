import React, { createContext } from 'react';
import WorkoutManager from '@/managers/WorkoutManager';
import FriendManager from '@/managers/FriendManager';

const friendManagerInstance = new FriendManager();
type FriencContextType = FriendManager;

export const FriendsContext = createContext<FriencContextType | null>(null);

export const FriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <FriendsContext.Provider value={friendManagerInstance}>
            {children}
        </FriendsContext.Provider>
    );
};
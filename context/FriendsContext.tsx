import React, { createContext } from 'react';
import FriendManager from '@/managers/FriendManager';

/**
 * Instance of the FriendManager which manages friends data and actions.
 */
export const friendManagerInstance = new FriendManager();

/**
 * Type alias for the FriendsContext, which is an instance of FriendManager or null.
 */
type FriencContextType = FriendManager;

/**
 * React Context providing access to the FriendManager instance.
 * 
 * This context allows components to access friend management functionality
 * such as retrieving friend lists, sending requests, and handling friend data.
 */
export const FriendsContext = createContext<FriencContextType | null>(null);

/**
 * React context provider component that supplies the FriendManager instance
 * to its children via FriendsContext.
 * 
 * @param children - React children nodes that can consume the FriendsContext.
 * @returns A React provider wrapping children with the FriendManager instance.
 */
export const FriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <FriendsContext.Provider value={friendManagerInstance}>
            {children}
        </FriendsContext.Provider>
    );
};
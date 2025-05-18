import React, { createContext, useState, useEffect } from 'react';
import WorkoutManager from '@/managers/WorkoutManager';

/**
 * Instance of the WorkoutManager responsible for managing workout sessions,
 * tracking data, and interacting with workout services.
 */
export const workoutManagerInstance = new WorkoutManager();

/**
 * Type alias for the WorkoutContext, representing an instance of WorkoutManager or null.
 */
type WorkoutContextType = WorkoutManager;

/**
 * React Context that provides access to the WorkoutManager instance.
 * 
 * This context enables child components to access and manipulate workout data,
 * start/stop tracking, upload data, and retrieve workout information.
 */
export const WorkoutContext = createContext<WorkoutContextType | null>(null);

/**
 * React Context provider component that supplies the WorkoutManager instance
 * to its children via WorkoutContext.
 * 
 * @param children - React child nodes that consume the WorkoutContext.
 * @returns A React Provider component wrapping children with WorkoutManager.
 */
export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <WorkoutContext.Provider value={workoutManagerInstance}>
            {children}
        </WorkoutContext.Provider>
    );
};
import React, { createContext, useState, useEffect } from 'react';
import WorkoutManager from '@/managers/WorkoutManager';

const workoutManagerInstance = new WorkoutManager();
type WorkoutContextType = WorkoutManager;

export const WorkoutContext = createContext<WorkoutContextType | null>(null);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <WorkoutContext.Provider value={workoutManagerInstance}>
            {children}
        </WorkoutContext.Provider>
    );
};
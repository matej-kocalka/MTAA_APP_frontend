import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { EventSubscription } from 'expo-modules-core';

/**
 * Custom React hook to access step count data using the device's pedometer.
 *
 * This hook checks for pedometer availability and subscribes to step count updates.
 * It handles subscription setup and cleanup automatically.
 *
 * @returns {{
*   isPedometerAvailable: string,
*   currentStepCount: number
* }} An object containing the availability status of the pedometer and the current step count.
*
* @example
* const { isPedometerAvailable, currentStepCount } = usePedometer();
*/
export function usePedometer() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [currentStepCount, setCurrentStepCount] = useState(0);

  useEffect(() => {
    let subscription: EventSubscription | null = null;

    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        subscription = Pedometer.watchStepCount(result => {
          setCurrentStepCount(result.steps);
        });
      }
    };

    subscribe();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return {
    isPedometerAvailable,
    currentStepCount,
  };
}

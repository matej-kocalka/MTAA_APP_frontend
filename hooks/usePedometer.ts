import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { EventSubscription } from 'expo-modules-core';

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

import { useFocusEffect } from 'expo-router';

jest.mock('@react-native-community/geolocation', () => {
  return {
    getCurrentPosition: jest.fn((success) =>
      success({ coords: { latitude: 37.78825, longitude: -122.4324 } })
    ),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
    setRNConfiguration: jest.fn()  // Mock setRNConfiguration here as well
  };
});


jest.mock('expo-router', () => {
  return {
    useRouter: jest.fn(),
    usePathname: jest.fn(() => '/mock-path'),
    useNavigation: jest.fn().mockReturnValue({
      setOptions: jest.fn(),
    }),
    useFocusEffect: jest.fn(),
  };
});

jest.mock('expo-font', () => ({
  Font: {
    isLoaded: jest.fn().mockReturnValue(true), // Mock it to return true by default
    loadAsync: jest.fn(), // Mock loadAsync to avoid loading fonts in tests
  },
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    Ionicons: (props) => <Text>{props.name}</Text>, // Simplified mock icon
  };
});

jest.mock('react-native-fs', () => {
  return {
    readFile: jest.fn(() => Promise.resolve('mock file content')),
    writeFile: jest.fn(() => Promise.resolve()),
    unlink: jest.fn(() => Promise.resolve()),
    exists: jest.fn(() => Promise.resolve(true)),
    mkdir: jest.fn(() => Promise.resolve()),
  };
})


jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));
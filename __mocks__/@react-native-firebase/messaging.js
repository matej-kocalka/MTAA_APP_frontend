// app/__mocks__/@react-native-firebase/messaging.js

const messagingMock = jest.fn(() => ({
  setBackgroundMessageHandler: jest.fn(),
  onMessage: jest.fn(),
  getToken: jest.fn(),
  requestPermission: jest.fn(),
  subscribeToTopic: jest.fn(),
  unsubscribeFromTopic: jest.fn(),
}));

export default messagingMock;


const geolocationMock = jest.fn (() => ({
    getCurrentPosition: jest.fn((success) =>
        success({ coords: { latitude: 37.78825, longitude: -122.4324 } })
    ),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
    setRNConfiguration: jest.fn(),
}));

export default geolocationMock;



const pedometerMock = jest.fn (() => ({
    isAvailableAsync: jest.fn().mockResolvedValue(true),
    getStepCountAsync: jest.fn().mockResolvedValue({ steps: 100 }),
}));

export default pedometerMock;
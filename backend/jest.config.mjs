// jest.config.mjs
export default {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!(nanoid)/)'],
  testEnvironment: 'node',
};

export default {
  testEnvironment: "node",
  clearMocks: true,
  transform: {},
  verbose: true,
  roots: ["<rootDir>/tests/integration"],
  setupFilesAfterEnv: ["./tests/setup.js"],
}
const bcrypt = require("bcryptjs");
const userService = require("../src/services/userService");
const User = require("../src/models/user");
const jwt = require("jsonwebtoken");

// Mock the dependencies
jest.mock("../src/models/user");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("UserService", () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock JWT functions
    jwt.sign = jest.fn().mockReturnValue("mock-token");

    // Mock bcrypt functions
    bcrypt.hash = jest.fn().mockResolvedValue("hashed-password");
    bcrypt.compare = jest.fn().mockResolvedValue(true);
  });

  describe("signup", () => {
    const mockUserData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    it("should create a new user successfully", async () => {
      // Create a mock user with update method
      const mockUser = {
        id: 1,
        username: mockUserData.username,
        email: mockUserData.email,
        password_hash: "hashed-password",
        update: jest.fn().mockResolvedValue(true),
        toJSON: () => ({
          id: 1,
          username: mockUserData.username,
          email: mockUserData.email,
          password_hash: "hashed-password",
          refresh_token: "mock-token",
        }),
      };

      // Mock User.create to return our mock user
      User.create.mockResolvedValue(mockUser);

      // Test the signup method
      const result = await userService.signup(mockUserData);

      // Assertions
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);
      expect(User.create).toHaveBeenCalledWith({
        username: mockUserData.username,
        email: mockUserData.email,
        password_hash: "hashed-password",
      });
      expect(mockUser.update).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalledTimes(2); // Once for access token, once for refresh
      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
    });

    it("should throw an error if user creation fails", async () => {
      // Mock User.create to throw an error
      User.create.mockRejectedValue(new Error("Database error"));

      // Test error handling
      await expect(userService.signup(mockUserData)).rejects.toThrow(
        "Error creating user: Database error"
      );
    });
  });

  describe("signin", () => {
    const mockCredentials = {
      email: "test@example.com",
      password: "password123",
    };

    it("should sign in user successfully with correct credentials", async () => {
      // Mock found user with update method
      const mockUser = {
        id: 1,
        username: "testuser",
        email: mockCredentials.email,
        password_hash: "hashed-password",
        update: jest.fn().mockResolvedValue(true),
        toJSON: () => ({
          id: 1,
          username: "testuser",
          email: mockCredentials.email,
          password_hash: "hashed-password",
          refresh_token: "mock-token",
        }),
      };

      User.findOne.mockResolvedValue(mockUser);

      // Test signin method
      const result = await userService.signin(
        mockCredentials.email,
        mockCredentials.password
      );

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: mockCredentials.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockCredentials.password,
        mockUser.password_hash
      );
      expect(mockUser.update).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalledTimes(2); // Once for access token, once for refresh
      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
    });

    it("should throw an error if user is not found", async () => {
      // Mock user not found
      User.findOne.mockResolvedValue(null);

      // Test error handling
      await expect(
        userService.signin(mockCredentials.email, mockCredentials.password)
      ).rejects.toThrow("Authentication failed: User not found");
    });

    it("should throw an error if password is incorrect", async () => {
      // Mock found user
      const mockUser = {
        id: 1,
        username: "testuser",
        email: mockCredentials.email,
        password_hash: "hashed-password",
      };
      User.findOne.mockResolvedValue(mockUser);

      // Mock failed password comparison
      bcrypt.compare.mockResolvedValueOnce(false);

      // Test error handling
      await expect(
        userService.signin(mockCredentials.email, mockCredentials.password)
      ).rejects.toThrow("Authentication failed: Invalid password");
    });
  });
});

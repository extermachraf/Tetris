const bcrypt = require("bcryptjs");
const UserService = require("../src/services/userService");
const User = require("../src/models/user");

// Mock the User model
jest.mock("../src/models/user");

describe("UserService", () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signup", () => {
    const mockUserData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    it("should create a new user successfully", async () => {
      // Mock the hashed password
      const hashedPassword = "hashedPassword123";
      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

      // Mock the User.create response
      const mockCreatedUser = {
        id: 1,
        username: mockUserData.username,
        email: mockUserData.email,
        password_hash: hashedPassword,
        toJSON: () => ({
          id: 1,
          username: mockUserData.username,
          email: mockUserData.email,
          password: hashedPassword,
        }),
      };
      User.create.mockResolvedValue(mockCreatedUser);

      // Test the signup method
      const result = await UserService.signup(mockUserData);

      // Assertions
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);
      expect(User.create).toHaveBeenCalledWith({
        username: mockUserData.username,
        email: mockUserData.email,
        password_hash: hashedPassword,
      });
      expect(result).toEqual({
        id: 1,
        username: mockUserData.username,
        email: mockUserData.email,
      });
    });

    it("should throw an error if user creation fails", async () => {
      // Mock bcrypt hash
      bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword123");

      // Mock User.create to throw an error
      User.create.mockRejectedValue(new Error("Database error"));

      // Test error handling
      await expect(UserService.signup(mockUserData)).rejects.toThrow(
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
      // Mock found user
      const mockUser = {
        id: 1,
        username: "testuser",
        email: mockCredentials.email,
        password_hash: "hashedPassword123",
        toJSON: () => ({
          id: 1,
          username: "testuser",
          email: mockCredentials.email,
          password: "hashedPassword123",
        }),
      };
      User.findOne.mockResolvedValue(mockUser);

      // Mock password comparison
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      // Test signin method
      const result = await UserService.signin(
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
      expect(result).toEqual({
        id: 1,
        username: "testuser",
        email: mockCredentials.email,
      });
    });

    it("should throw an error if user is not found", async () => {
      // Mock user not found
      User.findOne.mockResolvedValue(null);

      // Test error handling
      await expect(
        UserService.signin(mockCredentials.email, mockCredentials.password)
      ).rejects.toThrow("Authentication failed: User not found");
    });

    it("should throw an error if password is incorrect", async () => {
      // Mock found user
      const mockUser = {
        password_hash: "hashedPassword123",
        toJSON: () => ({
          password_hash: "hashedPassword123",
        }),
      };
      User.findOne.mockResolvedValue(mockUser);

      // Mock failed password comparison
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      // Test error handling
      await expect(
        UserService.signin(mockCredentials.email, mockCredentials.password)
      ).rejects.toThrow("Authentication failed: Invalid password");
    });
  });
});

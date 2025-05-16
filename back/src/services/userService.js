const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { error } = require("console");
const {
  generateAccessToken,
  generateRefreshToken,
  verifiyAccessToken,
  verifiyRefreshToken,
} = require("../utils/tokens");

class UserService {
  async signup(userData) {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await User.create({
        username: userData.username,
        email: userData.email,
        password_hash: hashedPassword,
      });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      await user.update({ refresh_token: refreshToken });
      // Remove password from response
      const { password_hash, refresh_token, ...userWithoutPassword } =
        user.toJSON();
      return {
        user: userWithoutPassword,
        accessToken,
      };
    } catch (error) {
      console.error("Signup error details:", error);
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new Error("Username or email already exists");
      }
      throw new Error("Error creating user: " + error.message);
    }
  }

  async signin(email, password) {
    try {
      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error("User not found");
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      await user.update({ refresh_token: refreshToken });

      // Remove password from response
      const { password_hash, refresh_token, ...userWithoutPassword } =
        user.toJSON();
      return {
        user: userWithoutPassword,
        accessToken,
      };
    } catch (error) {
      throw new Error("Authentication failed: " + error.message);
    }
  }

  async refreshAccessToken(expiredAccessToken) {
    try {
      // Decode the expired token (without verification)
      const decodedToken = jwt.decode(expiredAccessToken);

      if (!decodedToken || !decodedToken.id) {
        throw new Error("Invalid access token format");
      }

      // Find the user
      const user = await User.findByPk(decodedToken.id);
      if (!user) throw new Error("User not found");

      // Get stored refresh token from database
      const storedRefreshToken = user.refresh_token;
      if (!storedRefreshToken) throw new Error("No refresh token found");

      // Verify the stored refresh token
      try {
        verifiyRefreshToken(storedRefreshToken);
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          throw new Error("Refresh token expired");
        }
        throw new Error("Invalid refresh token");
      }

      // Generate new access token
      const newAccessToken = generateAccessToken(user);

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error("Token refresh failed: " + error.message);
    }
  }

  async logout(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Clear refresh token
      await user.update({ refresh_token: null });

      return { success: true };
    } catch (error) {
      throw new Error("Logout failed: " + error.message);
    }
  }
}

module.exports = new UserService();

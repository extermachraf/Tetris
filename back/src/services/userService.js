const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { error } = require("console");

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

      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      await user.update({ refresh_token: refreshToken });
      // Remove password from response
      const { password_hash, refresh_token, ...userWithoutPassword } =
        user.toJSON();
      return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
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

      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      await user.update({ refresh_token: refreshToken });

      // Remove password from response
      const { password_hash, refresh_token, ...userWithoutPassword } =
        user.toJSON();
      return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new Error("Authentication failed: " + error.message);
    }
  }

  generateRefreshToken(user) {
    return jwt.sign(
      {
        id: user.id,
      },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );
  }

  generateAccessToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
  }
  async refreshAccessToken(expiredAccessToken) {
    try {
      const decodedToken = jwt.decode(expiredAccessToken);

      if (!decodedToken || !decodedToken.id)
        throw new Error("Invalid access token format");

      const user = await User.findByPk(decodedToken.id);
      if (!user) throw new Error("User not found");

      //get stored refresh token
      const storedRefreshToken = user.refresh_token;
      if (!storedRefreshToken) throw new Error("No refresh token found");

      try {
        jwt.verify(storedRefreshToken, process.env.REFRESH_SECRET);
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError)
          throw new Error("Refresh token expired");
        throw new Error("Invalid refresh token");
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken(user);
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

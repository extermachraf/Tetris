const bcrypt = require("bcryptjs");
const User = require("../models/user");

class UserService {
  async signup(userData) {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      console.log("this is the hashed password: ", hashedPassword);

      // Create user
      const user = await User.create({
        username: userData.username,
        email: userData.email,
        password_hash: hashedPassword,
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    } catch (error) {
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

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    } catch (error) {
      throw new Error("Authentication failed: " + error.message);
    }
  }
}

module.exports = new UserService();

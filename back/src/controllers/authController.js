const userService = require("../services/userService");

class AuthController {
  async signup(req, res) {
    try {
      const user = await userService.signup(req.body);
      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async signin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userService.signin(email, password);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();

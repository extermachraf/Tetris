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
  async refreshToken(req, res) {
    try {
      console.log(req.body);
      const { accessToken } = req.body; // Fixed typo: accesToken → accessToken
      if (!accessToken) {
        return res.status(400).json({
          success: false,
          message: "Access token is required",
        });
      }

      const result = await userService.refreshAccessToken(accessToken);
      res.status(200).json({
        success: true, // Fixed typo: succes → success
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  async logout(req, res) {
    try {
      const result = await userService.logout(req.user.id);
      res.status(200).json({
        success: true,
        message: "Logged out succesfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();

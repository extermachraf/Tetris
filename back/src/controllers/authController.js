const userService = require("../services/userService");
const express = require("express");
const router = express.Router();

class AuthController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async signup(req, res) {
    try {
      const result = await userService.signup(req.body);
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      });
      res.status(201).json({
        success: true,
        data: { user: result.user },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async signin(req, res) {
    try {
      const { email, password } = req.body;
      const result = await userService.signin(email, password);
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      });
      res.status(200).json({
        success: true,
        data: { user: result.user },
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
      const { accessToken } = req.body;
      if (!accessToken) {
        return res.status(400).json({
          success: false,
          message: "Access token is required",
        });
      }

      const result = await userService.refreshAccessToken(accessToken);

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      });
      res.status(200).json({
        success: true, // Fixed typo: succes → success
        data: { accessToken: result.accessToken },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async logout(req, res) {
    try {
      const result = await userService.logout(req.user.id);
      res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "lax",
      });
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

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async validateToken(req, res) {
    try {
      // The authenticateToken middleware already verified the token
      // If we reach this point, the token is valid
      res.status(200).json({
        success: true,
        data: {
          userId: req.user.id,
          email: req.user.email,
        },
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

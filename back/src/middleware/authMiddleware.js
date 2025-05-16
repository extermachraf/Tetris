const express = require("express");
const jwt = require("jsonwebtoken");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const authenticateToken = (req, res, next) => {
  const tokenFromCookies = req.cookies.accessToken;

  const authHeader = req.headers["authorization"];
  const tokenFromHeaders = authHeader && authHeader.split(" ")[1]; //Barrer tokrn format

  const token = tokenFromCookies || tokenFromHeaders;

  if (!token) {
    return res.status(401).json({
      succes: false,
      message: "Access token is required",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    if (error && error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        succes: false,
        message: "Token expired",
        expired: true,
      });
    }

    return res.status(403).json({
      succes: false,
      message: "invalide token",
    });
  }
};

module.exports = { authenticateToken };

const jwt = require("jsonwebtoken");

/**
 * Generates a JWT access token for user authentication
 * @param {Object} user - User object from database
 * @param {string} user.id - Unique user identifier
 * @param {string} user.email - User's email address
 * @returns {string} JWT access token
 */

function generateAccessToken(user) {
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

/**
 * Generates a JWT refresh token for token renewal
 * @param {Object} user - User object from database
 * @param {string} user.id - Unique user identifier
 * @returns {string} JWT refresh token
 */

function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

/**
 * Verifies a JWT access token
 * @param {string} token - JWT access token to verify
 * @returns {Object} Decoded token payload
 * @throws {JsonWebTokenError} If token is invalid
 */
function verifiyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

/**
 * Verifies a JWT refresh token
 * @param {string} token - JWT refresh token to verify
 * @returns {Object} Decoded token payload
 * @throws {JsonWebTokenError} If token is invalid
 */
function verifiyRefreshToken(token) {
  return jwt.verify(token, process.env.REFRESH_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifiyAccessToken,
  verifiyRefreshToken,
};

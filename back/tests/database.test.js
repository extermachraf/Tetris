const sequelize = require("../config/database");

describe("Database Connection", () => {
  // Test connection before running tests
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  });

  // Close connection after tests
  afterAll(async () => {
    await sequelize.close();
  });

  test("should connect to database", async () => {
    try {
      await sequelize.authenticate();
      expect(true).toBe(true);
    } catch (error) {
      fail("Database connection failed");
    }
  });

  test("should have correct database name", () => {
    expect(sequelize.config.database).toBe("tetrisdb");
  });

  test("should have correct username", () => {
    expect(sequelize.config.username).toBe("tetrisuser");
  });
});

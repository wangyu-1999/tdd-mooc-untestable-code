import { describe, test, expect, vi, beforeEach } from "vitest";
import { DbConfig, PasswordHasher } from "../src/testable4.mjs";

describe("Testable 4: enterprise application", () => {
  describe("DbConfig", () => {
    test("should use provided configuration", () => {
      const config = new DbConfig({
        user: "testuser",
        host: "testhost",
        database: "testdb",
        password: "testpass",
        port: "5433",
      });

      expect(config.user).toBe("testuser");
      expect(config.host).toBe("testhost");
      expect(config.database).toBe("testdb");
      expect(config.password).toBe("testpass");
      expect(config.port).toBe("5433");
    });
  });

  describe("PasswordHasher", () => {
    let passwordHasher;

    beforeEach(() => {
      passwordHasher = new PasswordHasher();
    });

    test("should verify correct password", () => {
      const originalVerifySync = passwordHasher.verify;
      passwordHasher.verify = vi.fn().mockReturnValue(true);

      const result = passwordHasher.verify("hash", "correct-password");

      expect(result).toBe(true);
      expect(passwordHasher.verify).toHaveBeenCalledWith("hash", "correct-password");

      passwordHasher.verify = originalVerifySync;
    });

    test("should hash password", () => {
      const originalHash = passwordHasher.hash;
      passwordHasher.hash = vi.fn().mockReturnValue("hashed-password");

      const result = passwordHasher.hash("password");

      expect(result).toBe("hashed-password");
      expect(passwordHasher.hash).toHaveBeenCalledWith("password");

      passwordHasher.hash = originalHash;
    });
  });

  describe("UserDao", () => {
    let userDao;
    let mockDb;

    beforeEach(() => {
      mockDb = {
        query: vi.fn(),
        end: vi.fn(),
      };

      userDao = new UserDao();
      userDao.db = mockDb;
    });

    test("should get user by ID", async () => {
      mockDb.query.mockResolvedValue({
        rows: [{ user_id: "user1", password_hash: "hash1" }],
      });

      const user = await userDao.getById("user1");

      expect(user).toEqual({ userId: "user1", passwordHash: "hash1" });
      expect(mockDb.query).toHaveBeenCalledWith(expect.stringMatching(/select.*from users/), ["user1"]);
    });

    test("should return null when user not found", async () => {
      mockDb.query.mockResolvedValue({ rows: [] });

      const user = await userDao.getById("nonexistent");

      expect(user).toBeNull();
    });

    test("should save user", async () => {
      mockDb.query.mockResolvedValue({});

      const user = { userId: "user1", passwordHash: "hash1" };
      await userDao.save(user);

      expect(mockDb.query).toHaveBeenCalledWith(expect.stringMatching(/insert into users/), ["user1", "hash1"]);
    });

    test("should close database connection", () => {
      userDao.close();

      expect(mockDb.end).toHaveBeenCalledTimes(1);
    });
  });
});

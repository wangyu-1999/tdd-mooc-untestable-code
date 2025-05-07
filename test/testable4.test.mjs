import { afterEach, beforeEach, describe, test, vi, expect } from "vitest";
import { DbConfig, PasswordHasher, UserDao, PasswordService, PostgresUserDao } from "../src/testable4.mjs";

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

    test("should fall back to environment variables", () => {
      const originalEnv = { ...process.env };

      process.env.PGUSER = "envuser";
      process.env.PGHOST = "envhost";

      const config = new DbConfig();

      expect(config.user).toBe("envuser");
      expect(config.host).toBe("envhost");

      process.env = originalEnv;
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

  describe("PasswordService", () => {
    let passwordService;
    let mockUserDao;
    let mockPasswordHasher;

    beforeEach(() => {
      mockUserDao = {
        getById: vi.fn(),
        save: vi.fn(),
      };

      mockPasswordHasher = {
        verify: vi.fn(),
        hash: vi.fn(),
      };

      passwordService = new PasswordService(mockUserDao, mockPasswordHasher);
    });

    test("should change password when old password is correct", async () => {
      mockUserDao.getById.mockResolvedValue({
        userId: "user1",
        passwordHash: "old-hash",
      });
      mockPasswordHasher.verify.mockReturnValue(true);
      mockPasswordHasher.hash.mockReturnValue("new-hash");
      mockUserDao.save.mockResolvedValue();

      await passwordService.changePassword("user1", "old-password", "new-password");

      expect(mockUserDao.getById).toHaveBeenCalledWith("user1");
      expect(mockPasswordHasher.verify).toHaveBeenCalledWith("old-hash", "old-password");
      expect(mockPasswordHasher.hash).toHaveBeenCalledWith("new-password");
      expect(mockUserDao.save).toHaveBeenCalledWith({
        userId: "user1",
        passwordHash: "new-hash",
      });
    });

    test("should throw error when user not found", async () => {
      mockUserDao.getById.mockResolvedValue(null);

      try {
        await passwordService.changePassword("nonexistent", "old-password", "new-password");
        throw new Error("Expected error was not thrown");
      } catch (error) {
        expect(error.message).toBe("user not found");
      }

      expect(mockUserDao.getById).toHaveBeenCalledWith("nonexistent");
      expect(mockPasswordHasher.verify).not.toHaveBeenCalled();
      expect(mockUserDao.save).not.toHaveBeenCalled();
    });

    test("should throw error when old password is incorrect", async () => {
      mockUserDao.getById.mockResolvedValue({
        userId: "user1",
        passwordHash: "old-hash",
      });
      mockPasswordHasher.verify.mockReturnValue(false);

      try {
        await passwordService.changePassword("user1", "wrong-password", "new-password");
        throw new Error("Expected error was not thrown");
      } catch (error) {
        expect(error.message).toBe("wrong old password");
      }

      expect(mockUserDao.getById).toHaveBeenCalledWith("user1");
      expect(mockPasswordHasher.verify).toHaveBeenCalledWith("old-hash", "wrong-password");
      expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
      expect(mockUserDao.save).not.toHaveBeenCalled();
    });
  });

  describe("PostgresUserDao", () => {
    afterEach(() => {
      PostgresUserDao.resetInstance();
    });

    test("should create and return singleton instance", () => {
      const config = new DbConfig({ user: "testuser" });

      const instance1 = PostgresUserDao.getInstance(config);
      const instance2 = PostgresUserDao.getInstance();

      expect(instance1).toBeInstanceOf(UserDao);
      expect(instance1).toBe(instance2);
    });
  });
});

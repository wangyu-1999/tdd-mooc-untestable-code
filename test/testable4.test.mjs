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
});

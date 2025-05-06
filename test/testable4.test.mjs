import { describe, test, expect } from "vitest";
import { DbConfig } from "../src/testable4.mjs";

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
});

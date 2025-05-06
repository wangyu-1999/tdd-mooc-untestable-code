import argon2 from "@node-rs/argon2";
import pg from "pg";

export class DbConfig {
  constructor(config = {}) {
    this.user = config.user || process.env.PGUSER;
    this.host = config.host || process.env.PGHOST;
    this.database = config.database || process.env.PGDATABASE;
    this.password = config.password || process.env.PGPASSWORD;
    this.port = config.port || process.env.PGPORT;
  }
}

export class PasswordHasher {
  verify(hash, password) {
    return argon2.verifySync(hash, password);
  }
  
  hash(password) {
    return argon2.hashSync(password);
  }
}

export class UserDao {
  constructor(dbConfig = new DbConfig()) {
    this.db = new pg.Pool(dbConfig);
  }

  close() {
    this.db.end();
  }

  rowToUser(row) {
    return { userId: row.user_id, passwordHash: row.password_hash };
  }

  async getById(userId) {
    const { rows } = await this.db.query(
      `select user_id, password_hash
       from users
       where user_id = $1`,
      [userId]
    );
    return rows.map(row => this.rowToUser(row))[0] || null;
  }

  async save(user) {
    await this.db.query(
      `insert into users (user_id, password_hash)
       values ($1, $2)
       on conflict (user_id) do update
           set password_hash = excluded.password_hash`,
      [user.userId, user.passwordHash]
    );
  }
}

export class PasswordService {
  constructor(userDao = new UserDao(), passwordHasher = new PasswordHasher()) {
    this.users = userDao;
    this.passwordHasher = passwordHasher;
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.users.getById(userId);
    if (!user) {
      throw new Error("user not found");
    }
    if (!this.passwordHasher.verify(user.passwordHash, oldPassword)) {
      throw new Error("wrong old password");
    }
    user.passwordHash = this.passwordHasher.hash(newPassword);
    await this.users.save(user);
  }
}

export class PostgresUserDao {
  static instance;

  static getInstance(config) {
    if (!this.instance) {
      this.instance = new UserDao(config);
    }
    return this.instance;
  }

  static resetInstance() {
    this.instance = null;
  }
}
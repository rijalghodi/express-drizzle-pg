import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

import { JWT_EXPIRATION, JWT_SECRET } from "../config/app.config";
import { db } from "../config/drizzle.client";
import { usersTable } from "../db/schema";

const AuthService = {
  // Function to hash password
  hashPassword: async (password: string): Promise<string> => {
    //console.log(password)
    const salt = await bcrypt.genSalt(10);
    //console.log(salt)
    return bcrypt.hash(password, salt);
  },

  // Function to compare hashed password with plain text password
  comparePassword: async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
  },

  //Function to generate JWT token
  generateToken: (userId: string, email: string): string => {
    return jwt.sign({ userId, email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION as any,
    });
  },

  // Function to register a new user
  registerUser: async (name: string, email: string, password: string) => {
    try {
      const hashedPassword = await AuthService.hashPassword(password);
      console.log("creating user");

      const [user] = await db
        .insert(usersTable)
        .values({
          name,
          email,
          password: hashedPassword,
        })
        .returning();

      console.log(user);
      return user;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  },

  //Function to find user by email
  findUserByEmail: async (email: string) => {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return user;
  },

  //Function to find user by Google ID
  findUserByGoogleId: async (googleId: string) => {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.googleId, googleId));
    return user;
  },

  //Function to create or update Google OAuth user
  createOrUpdateGoogleUser: async (
    googleId: string,
    email: string,
    name: string,
    image: string
  ) => {
    try {
      // Check if user exists with this Google ID
      let user = await AuthService.findUserByGoogleId(googleId);

      if (user) {
        // User exists, update profile data
        const [updatedUser] = await db
          .update(usersTable)
          .set({
            name,
            image,
          })
          .where(eq(usersTable.googleId, googleId))
          .returning();
        return updatedUser;
      }

      // Check if user exists with this email (account linking)
      user = await AuthService.findUserByEmail(email);

      if (user) {
        // Link Google account to existing user
        const [updatedUser] = await db
          .update(usersTable)
          .set({
            googleId,
            name,
            image,
          })
          .where(eq(usersTable.email, email))
          .returning();
        return updatedUser;
      }

      const [newUser] = await db
        .insert(usersTable)
        .values({
          googleId,
          email,
          name,
          image,
          password: null,
        })
        .returning();

      return newUser;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  },
};

export default AuthService;

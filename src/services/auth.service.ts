import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { and, eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

import { db } from "@/config/drizzle.client";
import ENV from "@/config/env";
import { usersTable, verificationTokensTable } from "@/db/schema";
import { emailService } from "@/services/email.service";

// Function to hash password
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Function to compare hashed password with plain text password
const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

//Function to generate JWT token
const generateToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRATION as any,
  });
};

// Function to register a new user
const registerUser = async (name: string, email: string, password: string) => {
  try {
    const hashedPassword = await hashPassword(password);

    const [user] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning();

    return user;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

//Function to find user by email
const findUserByEmail = async (email: string) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  return user;
};

//Function to find user by ID
const findUserById = async (userId: string) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  return user;
};

//Function to find user by Google ID
const findUserByGoogleId = async (googleId: string) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.googleId, googleId));
  return user;
};

//Function to create or update Google OAuth user
const createOrUpdateGoogleUser = async (
  googleId: string,
  email: string,
  name: string,
  image: string
) => {
  try {
    // Check if user exists with this Google ID
    let user = await findUserByGoogleId(googleId);

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
    user = await findUserByEmail(email);

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
};

// Generate verification token (for email verification or password reset)
const generateVerificationToken = async (
  userId: string,
  type: "email_verification" | "password_reset"
): Promise<string | undefined> => {
  try {
    // Generate cryptographically secure random token
    const token = randomBytes(32).toString("hex");

    // Hash the token before storing
    const hashedToken = await hashPassword(token);

    // Set expiration time based on type
    const expiresAt = new Date();
    if (type === "password_reset") {
      expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes
    } else {
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours
    }

    // Delete any existing tokens of the same type for this user
    await db
      .delete(verificationTokensTable)
      .where(
        and(eq(verificationTokensTable.userId, userId), eq(verificationTokensTable.type, type))
      );

    // Store the hashed token in database
    await db.insert(verificationTokensTable).values({
      userId,
      token: hashedToken,
      type,
      expiresAt,
    });

    // Return the unhashed token to send to user
    return token;
  } catch (error) {
    console.error("Error generating verification token:", error);
    return undefined;
  }
};

// Verify token and return user if valid
const verifyToken = async (token: string, type: "email_verification" | "password_reset") => {
  try {
    // Find all tokens of this type that haven't expired
    const tokens = await db
      .select()
      .from(verificationTokensTable)
      .where(eq(verificationTokensTable.type, type));

    // Check each token (since we store hashed versions)
    for (const dbToken of tokens) {
      const isValid = await comparePassword(token, dbToken.token);

      if (isValid) {
        // Check if token is expired
        if (new Date() > dbToken.expiresAt) {
          // Delete expired token
          await db
            .delete(verificationTokensTable)
            .where(eq(verificationTokensTable.id, dbToken.id));
          return undefined;
        }

        // Get user
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, dbToken.userId));

        return { user, tokenId: dbToken.id };
      }
    }

    return undefined;
  } catch (error) {
    console.error("Error verifying token:", error);
    return undefined;
  }
};

// Delete token after use
const deleteToken = async (tokenId: string): Promise<void> => {
  try {
    await db.delete(verificationTokensTable).where(eq(verificationTokensTable.id, tokenId));
  } catch (error) {
    console.error("Error deleting token:", error);
  }
};

// Request password reset (generate token and send email)
const requestPasswordReset = async (email: string): Promise<boolean> => {
  try {
    const user = await findUserByEmail(email);

    // Don't reveal if user exists (security best practice)
    if (!user) {
      return true;
    }

    // Generate reset token
    const token = await generateVerificationToken(user.id, "password_reset");

    if (!token) {
      return false;
    }

    // Send reset email
    await emailService.sendPasswordResetEmail(email, token);

    return true;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return false;
  }
};

// Reset password using token
const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
  try {
    const result = await verifyToken(token, "password_reset");

    if (!result) {
      return false;
    }

    const { user, tokenId } = result;

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await db.update(usersTable).set({ password: hashedPassword }).where(eq(usersTable.id, user.id));

    // Delete used token
    await deleteToken(tokenId);

    return true;
  } catch (error) {
    console.error("Error resetting password:", error);
    return false;
  }
};

// Request email verification
const requestEmailVerification = async (userId: string, email: string): Promise<boolean> => {
  try {
    // Generate verification token
    const token = await generateVerificationToken(userId, "email_verification");

    if (!token) {
      return false;
    }

    // Send verification email
    await emailService.sendVerificationEmail(email, token);

    return true;
  } catch (error) {
    console.error("Error requesting email verification:", error);
    return false;
  }
};

// Verify email using token
const verifyEmail = async (token: string): Promise<boolean> => {
  try {
    const result = await verifyToken(token, "email_verification");

    if (!result) {
      return false;
    }

    const { user, tokenId } = result;

    // Update user verification status
    await db.update(usersTable).set({ isVerified: true }).where(eq(usersTable.id, user.id));

    // Delete used token
    await deleteToken(tokenId);

    return true;
  } catch (error) {
    console.error("Error verifying email:", error);
    return false;
  }
};

export const authService = {
  hashPassword,
  comparePassword,
  generateToken,
  registerUser,
  findUserByEmail,
  findUserById,
  findUserByGoogleId,
  createOrUpdateGoogleUser,
  generateVerificationToken,
  verifyToken,
  deleteToken,
  requestPasswordReset,
  resetPassword,
  requestEmailVerification,
  verifyEmail,
};

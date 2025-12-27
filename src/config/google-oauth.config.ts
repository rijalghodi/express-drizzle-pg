import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { GOOGLE_CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "./app.config";

export const configureGoogleOAuth = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          // Extract user data from Google profile
          const googleUser = {
            googleId: profile.id,
            email: profile.emails?.[0]?.value || "",
            name: profile.displayName || "",
            profilePicture: profile.photos?.[0]?.value || "",
          };

          // Pass the user data to the callback
          // The actual user creation/linking will be handled in the controller
          return done(null, googleUser);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );
};

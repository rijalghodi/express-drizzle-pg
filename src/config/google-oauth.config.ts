import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import ENV from "./env";

export const configureGoogleOAuth = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: ENV.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: ENV.GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: ENV.GOOGLE_OAUTH_CLIENT_CALLBACK_URI,
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

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/user.model.js';
import oauthConfig from '../config/oauth.js';

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: oauthConfig.google.clientID,
  clientSecret: oauthConfig.google.clientSecret,
  callbackURL: oauthConfig.google.callbackURL,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    profile.email = profile.emails?.[0]?.value;
    const user = await handleOAuthUser(profile);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

// GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: oauthConfig.github.clientID,
  clientSecret: oauthConfig.github.clientSecret,
  callbackURL: oauthConfig.github.callbackURL,
  scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    profile.email = profile.emails?.[0]?.value;
    const user = await handleOAuthUser(profile);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

async function handleOAuthUser(profile) {
  let user = await User.findOne({ email: profile.email });
  console.log(profile);
  if (!user) {
    user = new User({
      email: profile.email,
      fullName: profile.displayName || profile.username,
      profilePic: profile.photos?.[0]?.value || '',
      isVerified: true,
      authProvider: profile.provider
    });
    await user.save();
  }

  return user;
}
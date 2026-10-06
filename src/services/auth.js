// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   sendPasswordResetEmail,
//   signOut,
//   GoogleAuthProvider,
//   signInWithCredential,
// } from '@react-native-firebase/auth';

// import {
//   GoogleSignin,
// } from '@react-native-google-signin/google-signin';

// GoogleSignin.configure({
//   webClientId:
//     '140725186872-gell0comk5342p3kk9e215e0eo83fvsm.apps.googleusercontent.com',
// });

// // ==================================================
// // Email / Password Signup
// // ==================================================

// export const registerUser = async (
//   email,
//   password,
// ) => {
//   const auth = getAuth();

//   return createUserWithEmailAndPassword(
//     auth,
//     email,
//     password,
//   );
// };

// // ==================================================
// // Email / Password Login
// // ==================================================

// export const loginUser = async (
//   email,
//   password,
// ) => {
//   const auth = getAuth();

//   return signInWithEmailAndPassword(
//     auth,
//     email,
//     password,
//   );
// };

// // ==================================================
// // Forgot Password
// // ==================================================

// export const resetUserPassword = async (
//   email,
// ) => {
//   const auth = getAuth();

//   return sendPasswordResetEmail(
//     auth,
//     email,
//   );
// };

// // ==================================================
// // Logout
// // ==================================================

// export const logoutUser = async () => {
//   const auth = getAuth();

//   return signOut(auth);
// };

// // ==================================================
// // Google Login
// // ==================================================

// export const loginWithGoogle = async () => {
//   const auth = getAuth();

//   try {
//     console.log('GOOGLE: Checking Play Services...');

//     await GoogleSignin.hasPlayServices({
//       showPlayServicesUpdateDialog: true,
//     });

//     console.log('GOOGLE: Play Services OK');

//     console.log('GOOGLE: Starting sign in...');

//     const result = await GoogleSignin.signIn();

//     console.log('GOOGLE: Sign in result:', result);

//     const idToken = result.data?.idToken;

//     console.log(
//       'GOOGLE: ID token exists:',
//       !!idToken,
//     );

//     if (!idToken) {
//       throw new Error(
//         'Google Sign-In did not return an ID token.',
//       );
//     }

//     console.log(
//       'GOOGLE: Creating Firebase credential...',
//     );

//     const googleCredential =
//       GoogleAuthProvider.credential(
//         idToken,
//       );

//     console.log(
//       'GOOGLE: Signing into Firebase...',
//     );

//     const userCredential =
//       await signInWithCredential(
//         auth,
//         googleCredential,
//       );

//     console.log(
//       'GOOGLE: Firebase login successful:',
//       userCredential.user?.email,
//     );

//     return userCredential;
//   } catch (error) {
//     console.log(
//       '====================================',
//     );

//     console.log(
//       'GOOGLE SIGN-IN FAILED',
//     );

//     console.log(
//       'CODE:',
//       error?.code,
//     );

//     console.log(
//       'MESSAGE:',
//       error?.message,
//     );

//     console.log(
//       'FULL ERROR:',
//       error,
//     );

//     console.log(
//       '====================================',
//     );

//     throw error;
//   }
// };



import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';

import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';

/**
 * Firebase Authentication instance.
 *
 * Keeping a single instance reference in this module avoids repeatedly
 * retrieving the same Firebase Auth instance inside every function.
 */
const auth = getAuth();

/**
 * Google Sign-In configuration.
 *
 * The webClientId must be the OAuth 2.0 client ID of type "Web".
 * It is required when requesting the Google ID token used to create
 * a Firebase Google credential.
 *
 * Prefer configuring this through your environment/configuration layer
 * instead of hard-coding environment-specific values in source code.
 */
GoogleSignin.configure({
  webClientId:
    '140725186872-gell0comk5342p3kk9e215e0eo83fvsm.apps.googleusercontent.com',
});

/**
 * Creates a Firebase user using email/password authentication.
 *
 * Firebase automatically signs the newly created user in after
 * successful account creation.
 *
 * @param {string} email User email address.
 * @param {string} password User password.
 * @returns {Promise<import('@react-native-firebase/auth').UserCredential>}
 */
export const registerUser = async (email, password) => {
  return createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
};

/**
 * Signs an existing Firebase user in using email/password.
 *
 * @param {string} email User email address.
 * @param {string} password User password.
 * @returns {Promise<import('@react-native-firebase/auth').UserCredential>}
 */
export const loginUser = async (email, password) => {
  return signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
};

/**
 * Sends Firebase's password-reset email.
 *
 * Firebase handles generation and delivery of the reset link.
 *
 * @param {string} email User email address.
 * @returns {Promise<void>}
 */
export const resetUserPassword = async email => {
  return sendPasswordResetEmail(
    auth,
    email,
  );
};

/**
 * Signs the current Firebase user out.
 *
 * Google Sign-In state is handled separately by the caller because
 * a Firebase sign-out and Google provider sign-out are different
 * operations.
 *
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  return signOut(auth);
};

/**
 * Signs the user in with Google and then authenticates that user
 * with Firebase Authentication.
 *
 * Authentication flow:
 *
 * Google Sign-In
 *      ↓
 * Google ID token
 *      ↓
 * Firebase Google credential
 *      ↓
 * Firebase Authentication
 *      ↓
 * Firebase auth state changes
 *
 * The AuthProvider listens to that Firebase auth-state change and
 * updates the application's authenticated state.
 *
 * @returns {Promise<import('@react-native-firebase/auth').UserCredential>}
 */
export const loginWithGoogle = async () => {
  try {
    /*
     * Android requires Google Play Services for Google Sign-In.
     *
     * showPlayServicesUpdateDialog allows the native Google SDK
     * to offer the user an update when required.
     */
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    /*
     * Opens Google's native account-selection/sign-in flow.
     */
    const result = await GoogleSignin.signIn();

    /*
     * The Google Sign-In response contains the ID token inside
     * result.data for the current package API.
     */
    const idToken = result.data?.idToken;

    /*
     * Firebase cannot create a Google credential without the
     * Google ID token.
     */
    if (!idToken) {
      const error = new Error(
        'Google Sign-In did not return an ID token.',
      );

      error.code = 'auth/google-id-token-missing';

      throw error;
    }

    /*
     * Convert the Google ID token into a Firebase credential.
     *
     * Firebase uses this credential to establish the authenticated
     * Firebase user session.
     */
    const googleCredential =
      GoogleAuthProvider.credential(
        idToken,
      );

    /*
     * Authenticate the Google user with Firebase.
     *
     * If the Google account is new to the Firebase project,
     * Firebase can create the corresponding Firebase user.
     */
    return signInWithCredential(
      auth,
      googleCredential,
    );
  } catch (error) {
    /*
     * Log only the information needed for debugging.
     *
     * NEVER log:
     * - Google ID tokens
     * - access tokens
     * - passwords
     * - credentials
     * - complete authentication responses
     *
     * Tokens are sensitive authentication material.
     */
    console.error(
      'GOOGLE SIGN-IN FAILED:',
      {
        code: error?.code,
        message: error?.message,
      },
    );

    // Preserve the original error so the UI layer can handle
    // provider-specific error codes.
    throw error;
  }
};

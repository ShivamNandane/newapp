// import React, {useState} from 'react';

// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';

// import {
//   loginUser,
//   resetUserPassword,
//   loginWithGoogle,
// } from '../services/auth';

// function LoginScreen({navigation}) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] =
//     useState(false);

//   // ==================================================
//   // Email Login
//   // ==================================================

//   const handleLogin = async () => {
//     const cleanEmail = email.trim();

//     if (!cleanEmail) {
//       Alert.alert(
//         'Error',
//         'Please enter your email.',
//       );
//       return;
//     }

//     if (!password) {
//       Alert.alert(
//         'Error',
//         'Please enter your password.',
//       );
//       return;
//     }

//     try {
//       setLoading(true);

//       await loginUser(
//         cleanEmail,
//         password,
//       );

//       // App.js detects the Firebase auth
//       // state change and opens HomeScreen.

//     } catch (error) {
//       console.log(
//         'LOGIN ERROR:',
//         error,
//       );

//       switch (error.code) {
//         case 'auth/invalid-email':
//           Alert.alert(
//             'Invalid Email',
//             'Please enter a valid email address.',
//           );
//           break;

//         case 'auth/invalid-credential':
//           Alert.alert(
//             'Login Failed',
//             'Invalid email or password.',
//           );
//           break;

//         case 'auth/user-not-found':
//           Alert.alert(
//             'Login Failed',
//             'No account exists with this email.',
//           );
//           break;

//         case 'auth/wrong-password':
//           Alert.alert(
//             'Login Failed',
//             'Incorrect password.',
//           );
//           break;

//         case 'auth/too-many-requests':
//           Alert.alert(
//             'Too Many Attempts',
//             'Please try again later.',
//           );
//           break;

//         case 'auth/network-request-failed':
//           Alert.alert(
//             'Network Error',
//             'Please check your internet connection.',
//           );
//           break;

//         default:
//           Alert.alert(
//             'Login Failed',
//             error.message ||
//               'Something went wrong.',
//           );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==================================================
//   // Google Login
//   // ==================================================

//   const handleGoogleLogin = async () => {
//     try {
//       setGoogleLoading(true);

//       await loginWithGoogle();

//       // Firebase auth state changes automatically.
//       // App.js will show HomeScreen.

//     } catch (error) {
//       console.log(
//         'GOOGLE LOGIN ERROR:',
//         error,
//       );

//       if (
//         error.code ===
//         'SIGN_IN_CANCELLED'
//       ) {
//         return;
//       }

//       if (
//         error.code ===
//         'IN_PROGRESS'
//       ) {
//         Alert.alert(
//           'Google Sign-In',
//           'Google Sign-In is already in progress.',
//         );
//         return;
//       }

//       if (
//         error.code ===
//         'PLAY_SERVICES_NOT_AVAILABLE'
//       ) {
//         Alert.alert(
//           'Google Play Services',
//           'Google Play Services is not available or needs to be updated.',
//         );
//         return;
//       }

//       Alert.alert(
//         'Google Login Failed',
//         error.message ||
//           'Unable to sign in with Google.',
//       );
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

//   // ==================================================
//   // Forgot Password
//   // ==================================================

//   const handleForgotPassword = async () => {
//     const cleanEmail = email.trim();

//     if (!cleanEmail) {
//       Alert.alert(
//         'Email Required',
//         'Enter your email first.',
//       );
//       return;
//     }

//     try {
//       await resetUserPassword(
//         cleanEmail,
//       );

//       Alert.alert(
//         'Password Reset',
//         'Password reset email sent successfully.',
//       );
//     } catch (error) {
//       console.log(
//         'RESET PASSWORD ERROR:',
//         error,
//       );

//       Alert.alert(
//         'Error',
//         error.message ||
//           'Unable to reset password.',
//       );
//     }
//   };

//   return (
//     <View style={styles.container}>

//       <Text style={styles.title}>
//         Welcome Back
//       </Text>

//       <Text style={styles.subtitle}>
//         Login to your account
//       </Text>

//       {/* ============================================
//           Email
//       ============================================ */}

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         placeholderTextColor="#9ca3af"
//         keyboardType="email-address"
//         autoCapitalize="none"
//         autoCorrect={false}
//         value={email}
//         onChangeText={setEmail}
//       />

//       {/* ============================================
//           Password
//       ============================================ */}

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         placeholderTextColor="#9ca3af"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />

//       {/* ============================================
//           Forgot Password
//       ============================================ */}

//       <View style={styles.forgotPasswordContainer}>
//       <TouchableOpacity
//         onPress={handleForgotPassword}
//         disabled={
//           loading ||
//           googleLoading
//         }>

//         <Text style={styles.forgotPassword}>
//           Forgot Password?
//         </Text>

//       </TouchableOpacity>
//       </View>

//       {/* ============================================
//           Email Login Button
//       ============================================ */}

//       <TouchableOpacity
//         style={styles.loginButton}
//         onPress={handleLogin}
//         disabled={
//           loading ||
//           googleLoading
//         }>

//         {loading ? (
//           <ActivityIndicator
//             color="#fff"
//           />
//         ) : (
//           <Text
//             style={
//               styles.loginButtonText
//             }>
//             Login
//           </Text>
//         )}

//       </TouchableOpacity>

//       {/* ============================================
//           OR Divider
//       ============================================ */}

//       <View style={styles.dividerContainer}>

//         <View
//           style={styles.divider}
//         />

//         <Text
//           style={styles.orText}>
//           OR
//         </Text>

//         <View
//           style={styles.divider}
//         />

//       </View>

//       {/* ============================================
//           Google Login
//       ============================================ */}

//       <TouchableOpacity
//         style={styles.googleButton}
//         onPress={handleGoogleLogin}
//         disabled={
//           loading ||
//           googleLoading
//         }>

//         {googleLoading ? (
//           <ActivityIndicator
//             color="#111827"
//           />
//         ) : (
//           <>
//             <Text
//               style={styles.googleIcon}>
//               G
//             </Text>

//             <Text
//               style={
//                 styles.googleButtonText
//               }>
//               Continue with Google
//             </Text>
//           </>
//         )}

//       </TouchableOpacity>

//       {/* ============================================
//           Signup
//       ============================================ */}

//       <View
//         style={
//           styles.signupContainer
//         }>

//         <Text
//           style={styles.signupLabel}>
//           Don't have an account?
//         </Text>

//         <TouchableOpacity
//           onPress={() =>
//             navigation.navigate(
//               'Signup',
//             )
//           }>

//           <Text
//             style={styles.signupText}>
//             {' '}Sign Up
//           </Text>

//         </TouchableOpacity>

//       </View>

//     </View>
//   );
// }

// export default LoginScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 24,
//     backgroundColor: '#f5f7fb',
//   },

//   title: {
//     fontSize: 32,
//     fontWeight: '700',
//     textAlign: 'center',
//     color: '#111827',
//   },

//   subtitle: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#6b7280',
//     marginTop: 8,
//     marginBottom: 32,
//   },

//   input: {
//     height: 52,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 10,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     color: '#111827',
//     marginBottom: 14,
//   },

//   forgotPasswordContainer: {
//   alignItems: 'flex-end',
//   marginBottom: 20,
//   },

//   forgotPassword: {
//     color: '#2563eb',
//     textAlign: 'right',
//     fontWeight: '600',
//   },

//   loginButton: {
//     height: 52,
//     backgroundColor: '#2563eb',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   loginButtonText: {
//     color: '#fff',
//     fontSize: 17,
//     fontWeight: '700',
//   },

//   dividerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 24,
//   },

//   divider: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#d1d5db',
//   },

//   orText: {
//     marginHorizontal: 12,
//     color: '#6b7280',
//     fontWeight: '600',
//   },

//   googleButton: {
//     height: 52,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 10,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   googleIcon: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#4285F4',
//     marginRight: 10,
//   },

//   googleButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#111827',
//   },

//   signupContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 25,
//   },

//   signupLabel: {
//     color: '#6b7280',
//   },

//   signupText: {
//     color: '#2563eb',
//     fontWeight: '700',
//   },
// });


import React, {
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  loginUser,
  resetUserPassword,
  loginWithGoogle,
} from '../services/auth';


// =====================================================
// Login Screen
// =====================================================
// Responsibilities:
//
// - Collect email/password credentials.
// - Start email/password authentication.
// - Start Google authentication.
// - Request a password-reset email.
// - Navigate to Signup.
//
// Firebase implementation details are intentionally kept
// inside ../services/auth. This screen is responsible only
// for UI state, validation, user interaction, and displaying
// appropriate feedback.
function LoginScreen({navigation}) {

  // =====================================================
  // Form State
  // =====================================================
  // Controlled inputs keep the current form values inside
  // React state so the UI and submitted values stay in sync.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  // =====================================================
  // Request State
  // =====================================================
  // Separate loading states allow the UI to display the
  // correct progress indicator for each authentication
  // operation.
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] =
    useState(false);
  const [resetLoading, setResetLoading] =
    useState(false);


  // =====================================================
  // Derived UI State
  // =====================================================
  // Any authentication/password-reset request in progress
  // disables actions that could start another request.
  const isBusy =
    loading ||
    googleLoading ||
    resetLoading;


  // =====================================================
  // Email Validation
  // =====================================================
  // Keep basic client-side validation here so obviously
  // invalid input does not result in an unnecessary network
  // request.
  const validateEmail = value => {

    const cleanEmail = value.trim();

    if (!cleanEmail) {

      Alert.alert(
        'Email Required',
        'Please enter your email address.',
      );

      return null;
    }


    // This is intentionally basic client-side validation.
    // Firebase remains the source of truth for whether the
    // email is actually valid.
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {

      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.',
      );

      return null;
    }


    return cleanEmail;
  };


  // =====================================================
  // Email Login
  // =====================================================
  const handleLogin = async () => {

    // Protect against duplicate submissions.
    if (isBusy) {
      return;
    }


    const cleanEmail =
      validateEmail(email);


    if (!cleanEmail) {
      return;
    }


    if (!password) {

      Alert.alert(
        'Password Required',
        'Please enter your password.',
      );

      return;
    }


    try {

      setLoading(true);


      // The authentication service owns Firebase Auth.
      await loginUser(
        cleanEmail,
        password,
      );


      // No manual navigation is required here.
      //
      // Firebase Auth changes its authenticated state.
      // The root authentication listener detects that change
      // and renders the authenticated navigation tree.

    } catch (error) {

      console.error(
        'LOGIN ERROR:',
        error,
      );


      // Convert known Firebase error codes into messages
      // appropriate for users.
      switch (error?.code) {

        case 'auth/invalid-email':

          Alert.alert(
            'Invalid Email',
            'Please enter a valid email address.',
          );

          break;


        case 'auth/invalid-credential':

          Alert.alert(
            'Login Failed',
            'Invalid email or password.',
          );

          break;


        case 'auth/user-not-found':

          Alert.alert(
            'Login Failed',
            'Invalid email or password.',
          );

          break;


        case 'auth/wrong-password':

          Alert.alert(
            'Login Failed',
            'Invalid email or password.',
          );

          break;


        case 'auth/too-many-requests':

          Alert.alert(
            'Too Many Attempts',
            'Too many login attempts. Please try again later.',
          );

          break;


        case 'auth/network-request-failed':

          Alert.alert(
            'Network Error',
            'Please check your internet connection and try again.',
          );

          break;


        default:

          Alert.alert(
            'Login Failed',
            'Unable to sign in. Please try again.',
          );
      }

    } finally {

      // Always release the loading state, including when
      // Firebase rejects the request.
      setLoading(false);
    }
  };


  // =====================================================
  // Google Login
  // =====================================================
  const handleGoogleLogin = async () => {

    // Prevent Google authentication from starting while
    // another request is already active.
    if (isBusy) {
      return;
    }


    try {

      setGoogleLoading(true);


      // Google authentication is encapsulated by the
      // authentication service.
      await loginWithGoogle();


      // Successful Google authentication updates Firebase
      // Auth state. The root navigator reacts to that change.

    } catch (error) {

      console.error(
        'GOOGLE LOGIN ERROR:',
        error,
      );


      // Google Sign-In libraries commonly expose these
      // status codes. Your auth service should ideally
      // normalize provider-specific errors before they
      // reach this screen.
      if (
        error?.code ===
        'SIGN_IN_CANCELLED'
      ) {

        // Cancellation is user-driven and does not require
        // an error message.
        return;
      }


      if (
        error?.code ===
        'IN_PROGRESS'
      ) {

        Alert.alert(
          'Google Sign-In',
          'Google Sign-In is already in progress.',
        );

        return;
      }


      if (
        error?.code ===
        'PLAY_SERVICES_NOT_AVAILABLE'
      ) {

        Alert.alert(
          'Google Play Services',
          'Google Play Services is unavailable or needs to be updated.',
        );

        return;
      }


      Alert.alert(
        'Google Login Failed',
        'Unable to sign in with Google. Please try again.',
      );

    } finally {

      setGoogleLoading(false);
    }
  };


  // =====================================================
  // Forgot Password
  // =====================================================
  const handleForgotPassword = async () => {

    // Prevent password-reset requests from being submitted
    // repeatedly or at the same time as authentication.
    if (isBusy) {
      return;
    }


    const cleanEmail =
      validateEmail(email);


    if (!cleanEmail) {
      return;
    }


    try {

      setResetLoading(true);


      await resetUserPassword(
        cleanEmail,
      );


      // Keep the success message generic and avoid exposing
      // account-existence information through the UI.
      Alert.alert(
        'Password Reset',
        'If an account exists for this email, a password reset email has been sent.',
      );

    } catch (error) {

      console.error(
        'RESET PASSWORD ERROR:',
        error,
      );


      switch (error?.code) {

        case 'auth/invalid-email':

          Alert.alert(
            'Invalid Email',
            'Please enter a valid email address.',
          );

          break;


        case 'auth/network-request-failed':

          Alert.alert(
            'Network Error',
            'Please check your internet connection and try again.',
          );

          break;


        case 'auth/too-many-requests':

          Alert.alert(
            'Too Many Attempts',
            'Please wait and try again later.',
          );

          break;


        default:

          Alert.alert(
            'Password Reset Failed',
            'Unable to process the password reset request. Please try again.',
          );
      }

    } finally {

      setResetLoading(false);
    }
  };


  // =====================================================
  // Navigate To Signup
  // =====================================================
  const handleSignup = () => {

    // Authentication requests should not be running while
    // moving to another authentication screen.
    if (isBusy) {
      return;
    }


    navigation.navigate('Signup');
  };


  // =====================================================
  // Screen
  // =====================================================
  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >

      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.container}>

          {/* =================================================
              Header
              ================================================= */}
          <Text
            style={styles.title}
            accessibilityRole="header"
          >
            Welcome Back
          </Text>

          <Text style={styles.subtitle}>
            Login to your account
          </Text>


          {/* =================================================
              Email Input
              ================================================= */}
          <Text
            style={styles.inputLabel}
            accessibilityRole="text"
          >
            Email
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardAppearance="default"
            value={email}
            onChangeText={setEmail}
            editable={!isBusy}
            returnKeyType="next"
            accessibilityLabel="Email address"
            accessibilityHint="Enter the email address associated with your account"
          />


          {/* =================================================
              Password Input
              ================================================= */}
          <Text
            style={styles.inputLabel}
            accessibilityRole="text"
          >
            Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            textContentType="password"
            autoComplete="password"
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={setPassword}
            editable={!isBusy}
            returnKeyType="done"
            accessibilityLabel="Password"
            accessibilityHint="Enter your account password"
          />


          {/* =================================================
              Forgot Password
              ================================================= */}
          <View
            style={
              styles.forgotPasswordContainer
            }
          >

            <Pressable
              onPress={handleForgotPassword}
              disabled={isBusy}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Forgot password"
              accessibilityState={{
                disabled: isBusy,
                busy: resetLoading,
              }}
            >

              {resetLoading ? (

                <ActivityIndicator
                  size="small"
                  color="#2563eb"
                  accessibilityLabel="Sending password reset email"
                />

              ) : (

                <Text
                  style={styles.forgotPassword}
                >
                  Forgot Password?
                </Text>
              )}

            </Pressable>

          </View>


          {/* =================================================
              Email Login
              ================================================= */}
          <Pressable
            style={({pressed}) => [
              styles.loginButton,
              isBusy &&
                styles.disabledButton,
              pressed &&
                !isBusy &&
                styles.pressedButton,
            ]}
            onPress={handleLogin}
            disabled={isBusy}
            accessibilityRole="button"
            accessibilityLabel="Log in"
            accessibilityState={{
              disabled: isBusy,
              busy: loading,
            }}
          >

            {loading ? (

              <ActivityIndicator
                color="#ffffff"
                accessibilityLabel="Logging in"
              />

            ) : (

              <Text
                style={styles.loginButtonText}
              >
                Login
              </Text>
            )}

          </Pressable>


          {/* =================================================
              Authentication Divider
              ================================================= */}
          <View
            style={styles.dividerContainer}
          >

            <View style={styles.divider} />

            <Text style={styles.orText}>
              OR
            </Text>

            <View style={styles.divider} />

          </View>


          {/* =================================================
              Google Login
              ================================================= */}
          <Pressable
            style={({pressed}) => [
              styles.googleButton,
              isBusy &&
                styles.disabledGoogleButton,
              pressed &&
                !isBusy &&
                styles.pressedGoogleButton,
            ]}
            onPress={handleGoogleLogin}
            disabled={isBusy}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
            accessibilityState={{
              disabled: isBusy,
              busy: googleLoading,
            }}
          >

            {googleLoading ? (

              <ActivityIndicator
                color="#111827"
                accessibilityLabel="Signing in with Google"
              />

            ) : (

              <>
                <Text
                  style={styles.googleIcon}
                  accessibilityElementsHidden
                >
                  G
                </Text>

                <Text
                  style={styles.googleButtonText}
                >
                  Continue with Google
                </Text>
              </>
            )}

          </Pressable>


          {/* =================================================
              Signup Navigation
              ================================================= */}
          <View
            style={styles.signupContainer}
          >

            <Text style={styles.signupLabel}>
              Don't have an account?
            </Text>

            <Pressable
              onPress={handleSignup}
              disabled={isBusy}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Sign up"
              accessibilityState={{
                disabled: isBusy,
              }}
            >

              <Text style={styles.signupText}>
                {' '}Sign Up
              </Text>

            </Pressable>

          </View>

        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}


export default LoginScreen;


// =====================================================
// Styles
// =====================================================
const styles = StyleSheet.create({

  keyboardContainer: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  container: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: '#f5f7fb',
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111827',
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    marginBottom: 32,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },

  input: {
    height: 52,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    marginBottom: 14,
  },

  forgotPasswordContainer: {
    minHeight: 32,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 20,
  },

  forgotPassword: {
    color: '#2563eb',
    fontWeight: '600',
  },

  loginButton: {
    minHeight: 52,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  loginButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },

  disabledButton: {
    opacity: 0.6,
  },

  pressedButton: {
    opacity: 0.8,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d5db',
  },

  orText: {
    marginHorizontal: 12,
    color: '#6b7280',
    fontWeight: '600',
  },

  googleButton: {
    minHeight: 52,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  disabledGoogleButton: {
    opacity: 0.6,
  },

  pressedGoogleButton: {
    opacity: 0.8,
  },

  googleIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4285F4',
    marginRight: 10,
  },

  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  signupLabel: {
    color: '#6b7280',
  },

  signupText: {
    color: '#2563eb',
    fontWeight: '700',
  },

});

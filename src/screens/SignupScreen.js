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
//   registerUser,
// } from '../services/auth';

// function SignupScreen({navigation}) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] =
//     useState('');
//   const [confirmPassword, setConfirmPassword] =
//     useState('');
//   const [loading, setLoading] =
//     useState(false);

//   const handleSignup = async () => {
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
//         'Please enter a password.',
//       );
//       return;
//     }

//     if (password.length < 6) {
//       Alert.alert(
//         'Weak Password',
//         'Password must be at least 6 characters.',
//       );
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert(
//         'Error',
//         'Passwords do not match.',
//       );
//       return;
//     }

//     try {
//       setLoading(true);

//       await registerUser(
//         cleanEmail,
//         password,
//       );

//       // Firebase signs the new user in.
//       // App.js detects the user and
//       // automatically displays HomeScreen.

//     } catch (error) {
//       console.log(
//         'SIGNUP ERROR:',
//         error,
//       );

//       switch (error.code) {
//         case 'auth/email-already-in-use':
//           Alert.alert(
//             'Account Exists',
//             'This email is already registered.',
//           );
//           break;

//         case 'auth/invalid-email':
//           Alert.alert(
//             'Invalid Email',
//             'Please enter a valid email.',
//           );
//           break;

//         case 'auth/weak-password':
//           Alert.alert(
//             'Weak Password',
//             'Please choose a stronger password.',
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
//             'Signup Failed',
//             error.message ||
//               'Something went wrong.',
//           );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>

//       <Text style={styles.title}>
//         Create Account
//       </Text>

//       <Text style={styles.subtitle}>
//         Sign up to continue
//       </Text>

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

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         placeholderTextColor="#9ca3af"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Confirm Password"
//         placeholderTextColor="#9ca3af"
//         secureTextEntry
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//       />

//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleSignup}
//         disabled={loading}>

//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>
//             Create Account
//           </Text>
//         )}

//       </TouchableOpacity>

//       <View style={styles.loginContainer}>

//         <Text style={styles.loginLabel}>
//           Already have an account?
//         </Text>

//         <TouchableOpacity
//           onPress={() =>
//             navigation.navigate('Login')
//           }>

//           <Text style={styles.loginText}>
//             {' '}Login
//           </Text>

//         </TouchableOpacity>

//       </View>

//     </View>
//   );
// }

// export default SignupScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 24,
//     backgroundColor: '#f5f7fb',
//   },

//   title: {
//     fontSize: 30,
//     fontWeight: '700',
//     color: '#111827',
//     textAlign: 'center',
//   },

//   subtitle: {
//     textAlign: 'center',
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

//   button: {
//     height: 52,
//     backgroundColor: '#2563eb',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   buttonText: {
//     color: '#fff',
//     fontSize: 17,
//     fontWeight: '700',
//   },

//   loginContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 25,
//   },

//   loginLabel: {
//     color: '#6b7280',
//   },

//   loginText: {
//     color: '#2563eb',
//     fontWeight: '700',
//   },
// });



import React, {useCallback, useState} from 'react';

import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {registerUser} from '../services/auth';

/**
 * SignupScreen is responsible for:
 * - Collecting signup credentials.
 * - Performing client-side validation.
 * - Calling the authentication service.
 * - Showing user-friendly errors.
 *
 * Firebase Authentication logic stays inside ../services/auth
 * so this component does not need to know how Firebase works.
 */
function SignupScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Prevents duplicate Firebase signup requests while one is running.
  const [loading, setLoading] = useState(false);

  /**
   * Converts Firebase Auth errors into messages appropriate for users.
   *
   * We intentionally do not expose error.message directly because
   * Firebase/internal error messages are implementation details and
   * may not be suitable for production UI.
   */
  const getSignupErrorMessage = useCallback(error => {
    switch (error?.code) {
      case 'auth/email-already-in-use':
        return {
          title: 'Account Exists',
          message: 'An account already exists for this email address.',
        };

      case 'auth/invalid-email':
        return {
          title: 'Invalid Email',
          message: 'Please enter a valid email address.',
        };

      case 'auth/weak-password':
        return {
          title: 'Weak Password',
          message: 'Please choose a stronger password.',
        };

      case 'auth/network-request-failed':
        return {
          title: 'Network Error',
          message:
            'Unable to connect to the server. Please check your internet connection and try again.',
        };

      case 'auth/operation-not-allowed':
        return {
          title: 'Signup Unavailable',
          message:
            'Email and password signup is currently unavailable. Please try again later.',
        };

      case 'auth/user-disabled':
        return {
          title: 'Account Disabled',
          message:
            'This account has been disabled. Please contact support.',
        };

      default:
        return {
          title: 'Signup Failed',
          message: 'Unable to create your account. Please try again.',
        };
    }
  }, []);

  /**
   * Validates credentials before making a network request.
   *
   * Client-side validation improves UX, but Firebase remains the
   * authoritative source for authentication validation.
   */
  const validateForm = useCallback(() => {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      return 'Please enter your email address.';
    }

    if (!password) {
      return 'Please enter a password.';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    return null;
  }, [email, password, confirmPassword]);

  /**
   * Creates the Firebase account through the authentication service.
   *
   * The service is responsible for communicating with Firebase.
   * The AuthProvider observes Firebase's auth-state change and
   * updates application navigation automatically.
   */
  const handleSignup = useCallback(async () => {
    if (loading) {
      return;
    }

    Keyboard.dismiss();

    const validationError = validateForm();

    if (validationError) {
      Alert.alert('Invalid Information', validationError);
      return;
    }

    const cleanEmail = email.trim();

    try {
      setLoading(true);

      await registerUser(cleanEmail, password);

      /*
       * registerUser signs the user into Firebase after successful
       * account creation. AuthProvider receives the Firebase auth
       * state change, so this screen does not manually navigate
       * to the authenticated part of the application.
       */
    } catch (error) {
      // Log technical details for development/debugging.
      // Do not expose the raw Firebase error to the user.
      console.error('SIGNUP ERROR:', error);

      const {title, message} = getSignupErrorMessage(error);

      Alert.alert(title, message);
    } finally {
      // Always release the loading state, including failures.
      setLoading(false);
    }
  }, [
    email,
    password,
    loading,
    validateForm,
    getSignupErrorMessage,
  ]);

  /**
   * Moves the user back to the Login screen.
   *
   * Navigation is disabled while signup is running to avoid
   * leaving the screen while a Firebase request is in progress.
   */
  const handleLoginNavigation = useCallback(() => {
    if (loading) {
      return;
    }

    navigation.navigate('Login');
  }, [loading, navigation]);

  return (
    <View style={styles.container}>
      <Text
        style={styles.title}
        accessibilityRole="header">
        Create Account
      </Text>

      <Text style={styles.subtitle}>
        Sign up to continue
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#9ca3af"
        keyboardType="email-address"
        inputMode="email"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
        returnKeyType="next"
        accessibilityLabel="Email address"
        accessibilityHint="Enter the email address you want to use for your account"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#9ca3af"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        value={password}
        onChangeText={setPassword}
        editable={!loading}
        returnKeyType="next"
        accessibilityLabel="Password"
        accessibilityHint="Enter a password with at least 6 characters"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#9ca3af"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!loading}
        returnKeyType="done"
        onSubmitEditing={handleSignup}
        accessibilityLabel="Confirm password"
        accessibilityHint="Re-enter your password"
      />

      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.disabledButton,
        ]}
        onPress={handleSignup}
        disabled={loading}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityState={{disabled: loading, busy: loading}}
        accessibilityLabel={
          loading ? 'Creating account' : 'Create account'
        }>
        {loading ? (
          <ActivityIndicator
            color="#ffffff"
            accessibilityLabel="Creating account"
          />
        ) : (
          <Text style={styles.buttonText}>
            Create Account
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginLabel}>
          Already have an account?
        </Text>

        <TouchableOpacity
          onPress={handleLoginNavigation}
          disabled={loading}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityState={{disabled: loading}}
          accessibilityLabel="Go to login">
          <Text style={styles.loginText}>
            {' '}Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f5f7fb',
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 8,
    marginBottom: 32,
    fontSize: 16,
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

  button: {
    height: 52,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  loginLabel: {
    color: '#6b7280',
  },

  loginText: {
    color: '#2563eb',
    fontWeight: '700',
  },
});

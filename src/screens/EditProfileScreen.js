// import React, {
//   useEffect,
//   useState,
// } from 'react';

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
//   useAuth,
// } from '../context/AuthContext';


// function EditProfileScreen({navigation}) {

//   const {
//     user,
//     updateUserProfile,
//   } = useAuth();


//   const [name, setName] = useState(
//     user?.displayName || '',
//   );

//   const [loading, setLoading] = useState(false);


//   // =====================================================
//   // Keep input synchronized with Firebase user
//   // =====================================================

//   useEffect(() => {

//     setName(
//       user?.displayName || '',
//     );

//   }, [user]);


//   // =====================================================
//   // Save Profile
//   // =====================================================

//   const handleSave = async () => {

//     const cleanName = name.trim();


//     // ==========================================
//     // Validate name
//     // ==========================================

//     if (!cleanName) {

//       Alert.alert(
//         'Error',
//         'Please enter your name.',
//       );

//       return;
//     }


//     // ==========================================
//     // Validate authenticated user
//     // ==========================================

//     if (!user) {

//       Alert.alert(
//         'Error',
//         'No authenticated user found.',
//       );

//       return;
//     }


//     try {

//       setLoading(true);


//       // ==========================================
//       // Update Firebase profile
//       // ==========================================

//       await updateUserProfile({
//         displayName: cleanName,
//       });


//       // ==========================================
//       // Success
//       // ==========================================

//       Alert.alert(
//         'Success',
//         'Profile updated successfully.',
//         [
//           {
//             text: 'OK',
//             onPress: () => navigation.goBack(),
//           },
//         ],
//       );

//     } catch (error) {

//       console.log(
//         'UPDATE PROFILE ERROR:',
//         error,
//       );


//       Alert.alert(
//         'Error',
//         error?.message ||
//           'Unable to update profile.',
//       );

//     } finally {

//       setLoading(false);
//     }
//   };


//   // =====================================================
//   // Screen
//   // =====================================================

//   return (
//     <View style={styles.container}>

//       <Text style={styles.title}>
//         Edit Profile
//       </Text>


//       {/* Name */}

//       <Text style={styles.label}>
//         Name
//       </Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter your name"
//         placeholderTextColor="#9ca3af"
//         value={name}
//         onChangeText={setName}
//         autoCapitalize="words"
//         autoCorrect={false}
//         editable={!loading}
//       />


//       {/* Email */}

//       <Text style={styles.label}>
//         Email
//       </Text>

//       <TextInput
//         style={[
//           styles.input,
//           styles.disabledInput,
//         ]}
//         value={user?.email || ''}
//         editable={false}
//         autoCapitalize="none"
//       />


//       {/* Save */}

//       <TouchableOpacity
//         style={[
//           styles.saveButton,
//           loading && styles.disabledButton,
//         ]}
//         onPress={handleSave}
//         disabled={loading}
//       >

//         {loading ? (

//           <ActivityIndicator
//             color="#fff"
//           />

//         ) : (

//           <Text style={styles.saveButtonText}>
//             Save Changes
//           </Text>

//         )}

//       </TouchableOpacity>

//     </View>
//   );
// }


// export default EditProfileScreen;


// // =====================================================
// // Styles
// // =====================================================

// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//     padding: 24,
//     backgroundColor: '#f5f7fb',
//   },

//   title: {
//     fontSize: 30,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 32,
//   },

//   label: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 8,
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
//     marginBottom: 20,
//   },

//   disabledInput: {
//     backgroundColor: '#e5e7eb',
//     color: '#6b7280',
//   },

//   saveButton: {
//     height: 52,
//     backgroundColor: '#2563eb',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 10,
//   },

//   disabledButton: {
//     opacity: 0.6,
//   },

//   saveButtonText: {
//     color: '#fff',
//     fontSize: 17,
//     fontWeight: '700',
//   },

// });


import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  useAuth,
} from '../context/AuthContext';


// =====================================================
// Edit Profile Screen
// =====================================================
// Responsibilities:
// - Display the authenticated user's profile information.
// - Allow the user to edit their display name.
// - Validate the form.
// - Delegate profile persistence to AuthContext.
// - Handle loading, success, and error UI states.
//
// Firebase operations are intentionally handled by
// AuthContext rather than directly in this screen.
function EditProfileScreen({navigation}) {

  const {
    user,
    updateUserProfile,
  } = useAuth();


  // =====================================================
  // Local Form State
  // =====================================================
  const [name, setName] = useState(
    user?.displayName || '',
  );

  const [loading, setLoading] = useState(false);


  // =====================================================
  // Synchronize Form With Current User
  // =====================================================
  // Keep the input synchronized if the authenticated user
  // changes while this screen is mounted.
  useEffect(() => {

    setName(
      user?.displayName || '',
    );

  }, [user]);


  // =====================================================
  // Save Profile
  // =====================================================
  const handleSave = async () => {

    // Prevent duplicate submissions.
    if (loading) {
      return;
    }


    // Normalize the input before validation/persistence.
    const cleanName = name.trim();


    // Validate the display name.
    if (!cleanName) {

      Alert.alert(
        'Invalid name',
        'Please enter your name.',
      );

      return;
    }


    // The screen should normally only be reachable when
    // authenticated, but guard against a session changing
    // unexpectedly while the screen is mounted.
    if (!user) {

      Alert.alert(
        'Session expired',
        'Your session is no longer available. Please sign in again.',
      );

      return;
    }


    try {

      setLoading(true);


      // AuthContext owns the Firebase Auth/Firestore
      // persistence logic.
      await updateUserProfile({
        displayName: cleanName,
      });


      // Only navigate away after the update succeeds.
      Alert.alert(
        'Success',
        'Profile updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ],
        {
          cancelable: false,
        },
      );

    } catch (error) {

      // Keep detailed error information in development logs.
      // Do not expose raw Firebase/internal errors to users.
      console.error(
        'UPDATE PROFILE ERROR:',
        error,
      );


      Alert.alert(
        'Update failed',
        'Unable to update your profile. Please try again.',
      );

    } finally {

      // Always restore the interactive state after the
      // asynchronous operation completes.
      setLoading(false);
    }
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

      <View style={styles.container}>

        <Text style={styles.title}>
          Edit Profile
        </Text>


        {/* =================================================
            Name
            ================================================= */}
        <Text style={styles.label}>
          Name
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#9ca3af"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
          editable={!loading}
          returnKeyType="done"
          accessibilityLabel="Name"
          accessibilityHint="Enter your display name"
        />


        {/* =================================================
            Email
            ================================================= */}
        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.disabledInput,
          ]}
          value={user?.email || ''}
          editable={false}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Email"
          accessibilityHint="Email cannot be edited here"
        />


        {/* =================================================
            Save Button
            ================================================= */}
        <Pressable
          style={({pressed}) => [
            styles.saveButton,
            loading && styles.disabledButton,
            pressed &&
              !loading &&
              styles.pressedButton,
          ]}
          onPress={handleSave}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Save profile changes"
          accessibilityState={{
            disabled: loading,
            busy: loading,
          }}
        >

          {loading ? (

            <ActivityIndicator
              color="#ffffff"
              accessibilityLabel="Saving profile"
            />

          ) : (

            <Text style={styles.saveButtonText}>
              Save Changes
            </Text>

          )}

        </Pressable>

      </View>

    </KeyboardAvoidingView>
  );
}


export default EditProfileScreen;


// =====================================================
// Styles
// =====================================================
const styles = StyleSheet.create({

  keyboardContainer: {
    flex: 1,
  },

  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f5f7fb',
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 32,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
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
    marginBottom: 20,
  },

  disabledInput: {
    backgroundColor: '#e5e7eb',
    color: '#6b7280',
  },

  saveButton: {
    minHeight: 52,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 16,
  },

  disabledButton: {
    opacity: 0.6,
  },

  pressedButton: {
    opacity: 0.8,
  },

  saveButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },

});

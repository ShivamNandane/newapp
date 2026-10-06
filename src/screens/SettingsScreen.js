// import React, {
//   useState,
// } from 'react';

// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Alert,
// } from 'react-native';

// import {
//   launchImageLibrary,
// } from 'react-native-image-picker';

// import {
//   useAuth,
// } from '../context/AuthContext';


// function SettingsScreen({navigation}) {

//   const {
//     user,
//     profilePhoto,
//     saveProfilePhoto,
//   } = useAuth();


//   const [loading, setLoading] = useState(false);


//   // =====================================================
//   // Choose Profile Photo
//   // =====================================================

//   const handleChoosePhoto = async () => {

//     try {

//       setLoading(true);


//       // ==========================================
//       // Open gallery
//       // ==========================================

//       const result =
//         await launchImageLibrary({
//           mediaType: 'photo',
//           selectionLimit: 1,
//           quality: 0.8,
//         });


//       // ==========================================
//       // User cancelled
//       // ==========================================

//       if (result.didCancel) {

//         console.log(
//           'USER CANCELLED IMAGE PICKER',
//         );

//         return;
//       }


//       // ==========================================
//       // Picker error
//       // ==========================================

//       if (result.errorCode) {

//         console.log(
//           'IMAGE PICKER ERROR:',
//           result.errorCode,
//           result.errorMessage,
//         );


//         Alert.alert(
//           'Error',
//           result.errorMessage ||
//             'Unable to select image.',
//         );

//         return;
//       }


//       // ==========================================
//       // Selected image
//       // ==========================================

//       const asset =
//         result.assets?.[0];


//       if (!asset?.uri) {

//         Alert.alert(
//           'Error',
//           'No image was selected.',
//         );

//         return;
//       }


//       console.log(
//         'SELECTED IMAGE:',
//         asset,
//       );


//       // ==========================================
//       // Save to Firestore
//       // ==========================================

//       await saveProfilePhoto(
//         asset.uri,
//       );


//       // ==========================================
//       // Success
//       // ==========================================

//       Alert.alert(
//         'Success',
//         'Profile photo saved.',
//       );

//     } catch (error) {

//       console.log(
//         'PROFILE PHOTO ERROR:',
//         error,
//       );


//       Alert.alert(
//         'Error',
//         error?.message ||
//           'Unable to save profile photo.',
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
//         Settings
//       </Text>


//       {/* ================================================
//           Profile Photo
//       ================================================= */}

//       <TouchableOpacity
//         style={styles.photoContainer}
//         onPress={handleChoosePhoto}
//         disabled={loading}
//       >

//         {profilePhoto ? (

//           <Image
//             source={{
//               uri: profilePhoto,
//             }}
//             style={styles.profileImage}
//           />

//         ) : (

//           <View style={styles.placeholder}>

//             <Text style={styles.placeholderText}>
//               {user?.displayName
//                 ?.charAt(0)
//                 ?.toUpperCase() || '?'}
//             </Text>

//           </View>
//         )}

//       </TouchableOpacity>


//       <TouchableOpacity
//         onPress={handleChoosePhoto}
//         disabled={loading}
//       >

//         <Text style={styles.changePhoto}>
//           {loading
//             ? 'Saving...'
//             : 'Change Profile Photo'}
//         </Text>

//       </TouchableOpacity>


//       {/* ================================================
//           User Information
//       ================================================= */}

//       <Text style={styles.name}>
//         {user?.displayName ||
//           'No name set'}
//       </Text>


//       <Text style={styles.email}>
//         {user?.email ||
//           'No email'}
//       </Text>


//       {/* ================================================
//           Edit Profile
//       ================================================= */}

//       <TouchableOpacity
//         style={styles.button}
//         onPress={() =>
//           navigation.navigate(
//             'EditProfile',
//           )
//         }
//       >

//         <Text style={styles.buttonText}>
//           Edit Profile
//         </Text>

//       </TouchableOpacity>

//     </View>
//   );
// }


// export default SettingsScreen;


// // =====================================================
// // Styles
// // =====================================================

// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 24,
//     backgroundColor: '#f5f7fb',
//   },

//   title: {
//     fontSize: 30,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 25,
//   },

//   photoContainer: {
//     marginBottom: 10,
//   },

//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//   },

//   placeholder: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#2563eb',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   placeholderText: {
//     color: '#fff',
//     fontSize: 45,
//     fontWeight: '700',
//   },

//   changePhoto: {
//     color: '#2563eb',
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 25,
//   },

//   name: {
//     fontSize: 22,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 8,
//   },

//   email: {
//     fontSize: 16,
//     color: '#6b7280',
//     marginBottom: 30,
//   },

//   button: {
//     width: '100%',
//     height: 52,
//     borderRadius: 10,
//     backgroundColor: '#2563eb',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   buttonText: {
//     color: '#fff',
//     fontSize: 17,
//     fontWeight: '700',
//   },

// });



import React, {useState} from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {launchImageLibrary} from 'react-native-image-picker';

import {useAuth} from '../context/AuthContext';

function SettingsScreen({navigation}) {
  const {
    user,
    profilePhoto,
    saveProfilePhoto,
  } = useAuth();

  const [loading, setLoading] = useState(false);

  /**
   * Opens the device image library and saves the selected
   * profile photo through the AuthContext.
   *
   * Important:
   * `saveProfilePhoto` should upload the local URI to
   * Firebase Storage and store the resulting download URL
   * in Firestore. A local `file://` URI should not be treated
   * as a permanent remote image URL.
   */
  const handleChoosePhoto = async () => {
    if (loading) {
      return;
    }

    if (!user?.uid) {
      Alert.alert(
        'Authentication Required',
        'Please sign in again before changing your profile photo.',
      );
      return;
    }

    try {
      setLoading(true);

      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
      });

      // The user closed the picker without selecting an image.
      if (result.didCancel) {
        return;
      }

      // The native image picker reported an error.
      if (result.errorCode) {
        Alert.alert(
          'Unable to Select Image',
          result.errorMessage ||
            'Please try selecting the image again.',
        );
        return;
      }

      const asset = result.assets?.[0];

      // The picker completed successfully, but no usable URI
      // was returned.
      if (!asset?.uri) {
        Alert.alert(
          'Invalid Image',
          'The selected image could not be read. Please choose another image.',
        );
        return;
      }

      /**
       * AuthContext owns persistence logic.
       *
       * The screen only handles:
       * 1. User interaction.
       * 2. Image selection.
       * 3. Loading/error UI.
       *
       * The context/service should handle:
       * local URI -> Firebase Storage upload -> download URL
       * -> Firestore persistence.
       */
      await saveProfilePhoto(asset.uri);

      Alert.alert(
        'Success',
        'Your profile photo has been updated.',
      );
    } catch (error) {
      console.error('PROFILE PHOTO UPDATE ERROR:', error);

      Alert.alert(
        'Update Failed',
        error?.message ||
          'Unable to update your profile photo. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const userInitial =
    user?.displayName?.trim()?.charAt(0)?.toUpperCase() || '?';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Settings
      </Text>

      {/* Profile photo is tappable and opens the image picker. */}
      <TouchableOpacity
        style={styles.photoButton}
        onPress={handleChoosePhoto}
        disabled={loading}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Change profile photo"
        accessibilityHint="Opens your photo library"
      >
        {profilePhoto ? (
          <Image
            source={{uri: profilePhoto}}
            style={styles.profileImage}
            resizeMode="cover"
            accessibilityRole="image"
            accessibilityLabel="Profile photo"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              {userInitial}
            </Text>
          </View>
        )}

        {loading && (
          <View style={styles.photoLoadingOverlay}>
            <ActivityIndicator
              size="small"
              color="#ffffff"
            />
          </View>
        )}
      </TouchableOpacity>

      {/* Secondary action for users who prefer a text button. */}
      <TouchableOpacity
        onPress={handleChoosePhoto}
        disabled={loading}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Change profile photo"
      >
        <Text style={styles.changePhoto}>
          {loading ? 'Saving...' : 'Change Profile Photo'}
        </Text>
      </TouchableOpacity>

      {/* Authenticated user's profile information. */}
      <Text style={styles.name}>
        {user?.displayName || 'No name set'}
      </Text>

      <Text
        style={styles.email}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {user?.email || 'No email'}
      </Text>

      {/* Opens the nested EditProfile screen. */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EditProfile')}
        disabled={loading}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Edit profile"
      >
        <Text style={styles.buttonText}>
          Edit Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f7fb',
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 25,
  },

  photoButton: {
    position: 'relative',
    marginBottom: 10,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e5e7eb',
  },

  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    color: '#ffffff',
    fontSize: 45,
    fontWeight: '700',
  },

  photoLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  changePhoto: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 25,
  },

  name: {
    maxWidth: '100%',
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },

  email: {
    maxWidth: '100%',
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 30,
    textAlign: 'center',
  },

  button: {
    width: '100%',
    height: 52,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
});

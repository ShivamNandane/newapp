// import React from 'react';

// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Image,
// } from 'react-native';

// import {
//   useAuth,
// } from '../context/AuthContext';


// function HomeScreen() {

//   const {
//     user,
//     profilePhoto,
//     logout,
//   } = useAuth();


//   // =====================================================
//   // Logout
//   // =====================================================

//   const handleLogout = async () => {

//     try {

//       await logout();

//     } catch (error) {

//       console.log(
//         'LOGOUT ERROR:',
//         error,
//       );

//       Alert.alert(
//         'Logout Failed',
//         error?.message ||
//           'Unable to logout.',
//       );
//     }
//   };


//   // =====================================================
//   // User Initial
//   // =====================================================

//   const userInitial =
//     user?.displayName
//       ?.charAt(0)
//       ?.toUpperCase() || '?';


//   return (
//     <View style={styles.container}>

//       {/* =================================================
//           Profile Card
//       ================================================= */}

//       <View style={styles.profileCard}>

//         {/* Profile Image */}

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
//               {userInitial}
//             </Text>

//           </View>
//         )}


//         {/* Name */}

//         <Text style={styles.name}>
//           {user?.displayName ||
//             'Welcome'}
//         </Text>


//         {/* Email */}

//         <Text style={styles.email}>
//           {user?.email ||
//             'No email'}
//         </Text>

//       </View>


//       {/* =================================================
//           Welcome
//       ================================================= */}

//       <Text style={styles.title}>
//         Welcome 🎉
//       </Text>


//       <Text style={styles.message}>
//         You are successfully logged in
//         with Firebase Authentication.
//       </Text>


//       {/* =================================================
//           Logout
//       ================================================= */}

//       <TouchableOpacity
//         style={styles.logoutButton}
//         onPress={handleLogout}
//       >

//         <Text style={styles.logoutText}>
//           Logout
//         </Text>

//       </TouchableOpacity>

//     </View>
//   );
// }


// export default HomeScreen;


// // =====================================================
// // Styles
// // =====================================================

// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     backgroundColor: '#f5f7fb',
//   },

//   profileCard: {
//     width: '100%',
//     backgroundColor: '#fff',
//     borderRadius: 18,
//     padding: 25,
//     alignItems: 'center',
//     marginBottom: 30,

//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 3,
//     },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,

//     elevation: 3,
//   },

//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 15,
//   },

//   placeholder: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#2563eb',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 15,
//   },

//   placeholderText: {
//     color: '#fff',
//     fontSize: 38,
//     fontWeight: '700',
//   },

//   name: {
//     fontSize: 23,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 5,
//   },

//   email: {
//     fontSize: 15,
//     color: '#6b7280',
//   },

//   title: {
//     fontSize: 30,
//     fontWeight: '700',
//     color: '#111827',
//   },

//   message: {
//     textAlign: 'center',
//     color: '#6b7280',
//     marginTop: 15,
//     marginBottom: 30,
//   },

//   logoutButton: {
//     backgroundColor: '#dc2626',
//     paddingHorizontal: 40,
//     paddingVertical: 14,
//     borderRadius: 10,
//   },

//   logoutText: {
//     color: '#fff',
//     fontSize: 16,
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
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useAuth,
} from '../context/AuthContext';


// =====================================================
// Home Screen
// =====================================================
// Responsibilities:
//
// - Display the authenticated user's profile information.
// - Display the user's profile photo when available.
// - Display a fallback avatar when the photo is unavailable.
// - Allow the authenticated user to log out.
// - Handle logout loading and error states.
//
// Firebase operations are intentionally handled by
// AuthContext. This screen only consumes the auth state
// and calls the logout action exposed by the context.
function HomeScreen() {

  const {
    user,
    profilePhoto,
    logout,
  } = useAuth();


  // =====================================================
  // Local UI State
  // =====================================================
  // Tracks whether the profile image failed to load.
  //
  // A remote image URI can become invalid or temporarily
  // unavailable, so the UI should have a safe fallback.
  const [imageError, setImageError] = useState(false);


  // Prevents duplicate logout requests and gives the user
  // visual feedback while logout is being processed.
  const [loggingOut, setLoggingOut] = useState(false);


  // =====================================================
  // Profile Image State Synchronization
  // =====================================================
  // When the profile photo changes, allow the new image to
  // attempt loading again.
  useEffect(() => {

    setImageError(false);

  }, [profilePhoto]);


  // =====================================================
  // Logout
  // =====================================================
  const handleLogout = async () => {

    // Prevent duplicate logout requests.
    if (loggingOut) {
      return;
    }


    try {

      setLoggingOut(true);


      // AuthContext owns the Firebase sign-out logic.
      await logout();

    } catch (error) {

      // Keep implementation details in development logs.
      // Do not expose raw Firebase errors directly to users.
      console.error(
        'LOGOUT ERROR:',
        error,
      );


      Alert.alert(
        'Logout Failed',
        'Unable to log out. Please try again.',
      );

    } finally {

      // Restore the button state if the current screen
      // is still mounted.
      setLoggingOut(false);
    }
  };


  // =====================================================
  // User Initial
  // =====================================================
  // Used when a profile photo is unavailable or fails
  // to load.
  const userInitial =
    user?.displayName
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || '?';


  // =====================================================
  // Profile Image
  // =====================================================
  const shouldShowProfileImage =
    Boolean(profilePhoto) && !imageError;


  // =====================================================
  // Screen
  // =====================================================
  return (
    <View style={styles.container}>

      {/* =================================================
          Profile Card
          =================================================
          Displays the authenticated user's profile data.
      */}
      <View
        style={styles.profileCard}
        accessible
        accessibilityLabel="User profile"
      >

        {/* -------------------------------------------------
            Profile Photo
            -------------------------------------------------
            Show the remote image when available.
            Otherwise show an initial-based avatar.
        */}
        {shouldShowProfileImage ? (

          <Image
            source={{
              uri: profilePhoto,
            }}
            style={styles.profileImage}
            onError={() => {
              setImageError(true);
            }}
            accessibilityRole="image"
            accessibilityLabel="Profile photo"
          />

        ) : (

          <View
            style={styles.placeholder}
            accessible
            accessibilityLabel={`Profile avatar for ${
              user?.displayName || 'user'
            }`}
          >

            <Text style={styles.placeholderText}>
              {userInitial}
            </Text>

          </View>
        )}


        {/* -------------------------------------------------
            Display Name
            ------------------------------------------------- */}
        <Text
          style={styles.name}
          numberOfLines={1}
          ellipsizeMode="tail"
          accessibilityRole="header"
        >
          {user?.displayName || 'Welcome'}
        </Text>


        {/* -------------------------------------------------
            Email
            ------------------------------------------------- */}
        <Text
          style={styles.email}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {user?.email || 'No email'}
        </Text>

      </View>


      {/* =================================================
          Welcome Section
          ================================================= */}
      <Text
        style={styles.title}
        accessibilityRole="header"
      >
        Welcome 🎉
      </Text>


      <Text style={styles.message}>
        You are successfully logged in with Firebase
        Authentication.
      </Text>


      {/* =================================================
          Logout
          ================================================= */}
      <Pressable
        style={({pressed}) => [
          styles.logoutButton,
          loggingOut && styles.disabledButton,
          pressed &&
            !loggingOut &&
            styles.pressedButton,
        ]}
        onPress={handleLogout}
        disabled={loggingOut}
        accessibilityRole="button"
        accessibilityLabel="Log out"
        accessibilityState={{
          disabled: loggingOut,
          busy: loggingOut,
        }}
      >

        {loggingOut ? (

          <ActivityIndicator
            color="#ffffff"
            accessibilityLabel="Logging out"
          />

        ) : (

          <Text style={styles.logoutText}>
            Logout
          </Text>

        )}

      </Pressable>

    </View>
  );
}


export default HomeScreen;


// =====================================================
// Styles
// =====================================================
const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f5f7fb',
  },

  profileCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 25,
    alignItems: 'center',
    marginBottom: 30,

    // Android shadow.
    elevation: 3,

    // iOS shadow.
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    backgroundColor: '#e5e7eb',
  },

  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  placeholderText: {
    color: '#ffffff',
    fontSize: 38,
    fontWeight: '700',
  },

  name: {
    maxWidth: '100%',
    fontSize: 23,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 5,
  },

  email: {
    maxWidth: '100%',
    fontSize: 15,
    color: '#6b7280',
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
  },

  message: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 15,
    marginBottom: 30,
  },

  logoutButton: {
    minHeight: 52,
    minWidth: 140,
    backgroundColor: '#dc2626',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  pressedButton: {
    opacity: 0.8,
  },

  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

});

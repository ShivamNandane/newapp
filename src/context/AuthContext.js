// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from 'react';

// import {
//   getAuth,
//   onAuthStateChanged,
//   signOut,
//   updateProfile,
// } from '@react-native-firebase/auth';

// import {
//   getFirestore,
//   doc,
//   setDoc,
//   getDoc,
// } from '@react-native-firebase/firestore';

// import {
//   GoogleSignin,
// } from '@react-native-google-signin/google-signin';


// // =====================================================
// // Create Context
// // =====================================================

// const AuthContext = createContext(null);


// // =====================================================
// // Auth Provider
// // =====================================================

// export function AuthProvider({children}) {

//   const auth = getAuth();

//   const firestore = getFirestore();


//   const [user, setUser] = useState(null);

//   const [initializing, setInitializing] = useState(true);

//   const [profilePhoto, setProfilePhoto] = useState(null);


//   // =====================================================
//   // Load Profile Data From Firestore
//   // =====================================================

//   const loadProfileData = async firebaseUser => {

//     if (!firebaseUser) {

//       setProfilePhoto(null);

//       return;
//     }


//     try {

//       const userRef = doc(
//         firestore,
//         'users',
//         firebaseUser.uid,
//       );


//       const userSnapshot = await getDoc(
//         userRef,
//       );


//       if (userSnapshot.exists) {

//         const data = userSnapshot.data();


//         setProfilePhoto(
//           data?.photoUri || null,
//         );


//         console.log(
//           'PROFILE DATA LOADED:',
//           data,
//         );

//       } else {

//         console.log(
//           'NO FIRESTORE PROFILE FOUND',
//         );


//         // ==========================================
//         // Create initial user profile
//         // ==========================================

//         await setDoc(
//           userRef,
//           {
//             displayName:
//               firebaseUser.displayName || '',

//             email:
//               firebaseUser.email || '',

//             photoUri:
//               firebaseUser.photoURL || null,
//           },
//           {
//             merge: true,
//           },
//         );

//       }

//     } catch (error) {

//       console.log(
//         'LOAD PROFILE ERROR:',
//         error,
//       );
//     }
//   };


//   // =====================================================
//   // Listen For Firebase Authentication Changes
//   // =====================================================

//   useEffect(() => {

  
//     const unsubscribe = onAuthStateChanged(
//       auth,
//       async firebaseUser => {

//         console.log(
//           'AUTH STATE CHANGED:',
//           firebaseUser?.email,
//         );


//         setUser(firebaseUser);


//         if (firebaseUser) {

//           await loadProfileData(
//             firebaseUser,
//           );

//         } else {

//           setProfilePhoto(null);
//         }


//         setInitializing(false);
//       },
//     );


//     return unsubscribe;

//   }, [auth]);


//   // =====================================================
//   // Update User Profile
//   // =====================================================

//   const updateUserProfile = async ({
//     displayName,
//   }) => {

//     if (!user) {

//       throw new Error(
//         'No authenticated user found.',
//       );
//     }


//     const cleanName = displayName.trim();


//     if (!cleanName) {

//       throw new Error(
//         'Please enter a valid name.',
//       );
//     }


//     // ==========================================
//     // Update Firebase Authentication
//     // ==========================================

//     await updateProfile(
//       user,
//       {
//         displayName: cleanName,
//       },
//     );


//     // ==========================================
//     // Reload Firebase user
//     // ==========================================

//     await user.reload();


//     const refreshedUser =
//       auth.currentUser;


//     setUser(refreshedUser);


//     // ==========================================
//     // Update Firestore profile
//     // ==========================================

//     const userRef = doc(
//       firestore,
//       'users',
//       refreshedUser.uid,
//     );


//     await setDoc(
//       userRef,
//       {
//         displayName: cleanName,

//         email:
//           refreshedUser.email || '',

//         photoUri:
//           profilePhoto || null,
//       },
//       {
//         merge: true,
//       },
//     );


//     console.log(
//       'PROFILE UPDATED:',
//       refreshedUser.displayName,
//       refreshedUser.email,
//     );
//   };


//   // =====================================================
//   // Save Profile Photo
//   // =====================================================

//   const saveProfilePhoto = async photoUri => {

//     if (!user) {

//       throw new Error(
//         'No authenticated user found.',
//       );
//     }


//     if (!photoUri) {

//       throw new Error(
//         'No photo selected.',
//       );
//     }


//     try {

//       const userRef = doc(
//         firestore,
//         'users',
//         user.uid,
//       );


//       // ==========================================
//       // Save photo URI to Firestore
//       // ==========================================

//       await setDoc(
//         userRef,
//         {
//           displayName:
//             user.displayName || '',

//           email:
//             user.email || '',

//           photoUri: photoUri,
//         },
//         {
//           merge: true,
//         },
//       );


//       // ==========================================
//       // Update local React state
//       // ==========================================

//       setProfilePhoto(photoUri);


//       console.log(
//         'PROFILE PHOTO SAVED:',
//         photoUri,
//       );

//     } catch (error) {

//       console.log(
//         'SAVE PROFILE PHOTO ERROR:',
//         error,
//       );

//       throw error;
//     }
//   };


//   // =====================================================
//   // Logout
//   // =====================================================

//   const logout = async () => {

//     try {

//       await signOut(auth);


//       try {

//         await GoogleSignin.signOut();

//       } catch (googleError) {

//         console.log(
//           'GOOGLE SIGNOUT:',
//           googleError?.message,
//         );
//       }

//     } catch (error) {

//       console.log(
//         'LOGOUT ERROR:',
//         error,
//       );

//       throw error;
//     }
//   };


//   // =====================================================
//   // Context Value
//   // =====================================================

//   const value = {

//     user,

//     initializing,

//     profilePhoto,

//     updateUserProfile,

//     saveProfilePhoto,

//     logout,
//   };


//   // =====================================================
//   // Provider
//   // =====================================================

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }


// // =====================================================
// // useAuth Hook
// // =====================================================

// export function useAuth() {

//   const context = useContext(
//     AuthContext,
//   );


//   if (!context) {

//     throw new Error(
//       'useAuth must be used inside AuthProvider',
//     );
//   }


//   return context;
// }



import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from '@react-native-firebase/auth';

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from '@react-native-firebase/firestore';

import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';


// =====================================================
// Auth Context
// =====================================================
// Provides authentication state and auth-related actions
// to components without prop drilling.
const AuthContext = createContext(null);


// =====================================================
// Firebase Services
// =====================================================
// These service instances are application-level dependencies.
// Keeping them outside the component avoids recreating the
// references on every AuthProvider render.
const auth = getAuth();
const firestore = getFirestore();


// =====================================================
// Auth Provider
// =====================================================
export function AuthProvider({children}) {

  // Currently authenticated Firebase user.
  const [user, setUser] = useState(null);

  // Prevents the application from rendering an incorrect
  // authenticated/unauthenticated screen while Firebase
  // restores the persisted authentication session.
  const [initializing, setInitializing] = useState(true);

  // Application-specific profile photo stored in Firestore.
  const [profilePhoto, setProfilePhoto] = useState(null);

  // Used to identify the latest auth event.
  //
  // Firebase auth events and Firestore requests are asynchronous.
  // If multiple auth events happen close together, an older
  // Firestore request must not overwrite state belonging to
  // a newer authentication state.
  const authRequestIdRef = useRef(0);


  // =====================================================
  // Load Profile Data
  // =====================================================
  const loadProfileData = useCallback(
    async (firebaseUser, requestId) => {

      if (!firebaseUser) {
        setProfilePhoto(null);
        return;
      }

      try {
        const userRef = doc(
          firestore,
          'users',
          firebaseUser.uid,
        );

        const userSnapshot = await getDoc(userRef);

        // Ignore the result if a newer auth event has already
        // occurred while this Firestore request was running.
        if (authRequestIdRef.current !== requestId) {
          return;
        }

        if (userSnapshot.exists()) {

          const data = userSnapshot.data();

          setProfilePhoto(
            data?.photoUri || null,
          );

          return;
        }

        // Firebase Auth user exists, but their application
        // profile has not been created yet.
        const initialProfile = {
          displayName:
            firebaseUser.displayName || '',

          email:
            firebaseUser.email || '',

          photoUri:
            firebaseUser.photoURL || null,
        };

        await setDoc(
          userRef,
          initialProfile,
          {
            merge: true,
          },
        );

        // The component may still be mounted, but another auth
        // event could have happened while setDoc was running.
        // Only update state for the latest auth request.
        if (authRequestIdRef.current !== requestId) {
          return;
        }

        // Keep local state consistent with the newly created
        // Firestore profile.
        setProfilePhoto(
          initialProfile.photoUri,
        );

      } catch (error) {

        // Do not allow a Firestore failure to break the auth
        // provider. Authentication itself can still be valid.
        console.error(
          'LOAD PROFILE ERROR:',
          error,
        );

        // Clear potentially stale profile state if this is
        // still the latest authentication request.
        if (authRequestIdRef.current === requestId) {
          setProfilePhoto(null);
        }
      }
    },
    [],
  );


  // =====================================================
  // Firebase Auth State Listener
  // =====================================================
  useEffect(() => {

    // Marks this effect as active. React sets this to false
    // when AuthProvider unmounts.
    let isActive = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async firebaseUser => {

        // Ignore callbacks that arrive after the provider
        // has been unmounted.
        if (!isActive) {
          return;
        }

        // Every auth event gets a new request ID.
        // This prevents older async Firestore operations from
        // updating state after a newer auth event.
        const requestId =
          ++authRequestIdRef.current;

        setUser(firebaseUser);

        if (!firebaseUser) {

          // User signed out.
          setProfilePhoto(null);

          if (isActive) {
            setInitializing(false);
          }

          return;
        }

        try {

          await loadProfileData(
            firebaseUser,
            requestId,
          );

        } finally {

          // Only the active/latest auth operation should
          // complete initialization.
          if (
            isActive &&
            authRequestIdRef.current === requestId
          ) {
            setInitializing(false);
          }
        }
      },
    );

    // Firebase returns an unsubscribe function. React invokes
    // this cleanup when the provider unmounts or before the
    // effect is recreated.
    return () => {

      isActive = false;

      // Invalidate any in-flight auth-related async operation.
      authRequestIdRef.current += 1;

      unsubscribe();
    };

  }, [loadProfileData]);


  // =====================================================
  // Update User Profile
  // =====================================================
  const updateUserProfile = useCallback(
    async ({displayName}) => {

      if (!user) {
        throw new Error(
          'No authenticated user found.',
        );
      }

      if (
        typeof displayName !== 'string'
      ) {
        throw new Error(
          'Display name must be a string.',
        );
      }

      const cleanName =
        displayName.trim();

      if (!cleanName) {
        throw new Error(
          'Please enter a valid name.',
        );
      }


      // -----------------------------------------------------
      // Update Firebase Authentication
      // -----------------------------------------------------
      await updateProfile(
        user,
        {
          displayName: cleanName,
        },
      );


      // -----------------------------------------------------
      // Refresh Firebase User
      // -----------------------------------------------------
      //
      // reload() ensures we use the latest Firebase Auth
      // representation before synchronizing Firestore.
      await user.reload();

      const refreshedUser =
        auth.currentUser;

      if (!refreshedUser) {
        throw new Error(
          'User is no longer authenticated.',
        );
      }

      setUser(refreshedUser);


      // -----------------------------------------------------
      // Synchronize Firestore Profile
      // -----------------------------------------------------
      const userRef = doc(
        firestore,
        'users',
        refreshedUser.uid,
      );

      await setDoc(
        userRef,
        {
          displayName: cleanName,

          email:
            refreshedUser.email || '',

          // Preserve the currently stored application photo.
          photoUri:
            profilePhoto || null,
        },
        {
          merge: true,
        },
      );
    },
    [user, profilePhoto],
  );


  // =====================================================
  // Save Profile Photo
  // =====================================================
  const saveProfilePhoto = useCallback(
    async photoUri => {

      if (!user) {
        throw new Error(
          'No authenticated user found.',
        );
      }

      if (
        typeof photoUri !== 'string' ||
        !photoUri.trim()
      ) {
        throw new Error(
          'No photo selected.',
        );
      }

      const cleanPhotoUri =
        photoUri.trim();

      const userRef = doc(
        firestore,
        'users',
        user.uid,
      );

      try {

        // Persist first so local state cannot get ahead of
        // Firestore when the write fails.
        await setDoc(
          userRef,
          {
            displayName:
              user.displayName || '',

            email:
              user.email || '',

            photoUri:
              cleanPhotoUri,
          },
          {
            merge: true,
          },
        );

        // Update local state only after Firestore succeeds.
        setProfilePhoto(cleanPhotoUri);

      } catch (error) {

        console.error(
          'SAVE PROFILE PHOTO ERROR:',
          error,
        );

        // Allow the screen calling this function to handle
        // the failure and display appropriate feedback.
        throw error;
      }
    },
    [user],
  );


  // =====================================================
  // Logout
  // =====================================================
  const logout = useCallback(
    async () => {

      try {

        // Firebase Auth is the primary authentication state.
        // This triggers onAuthStateChanged with null.
        await signOut(auth);

        try {

          // Google Sign-In maintains its own session, so clear
          // it separately when Google authentication is used.
          await GoogleSignin.signOut();

        } catch (googleError) {

          // Firebase logout has already succeeded. A Google
          // sign-out failure should not turn a successful Firebase
          // logout into a failed logout operation.
          console.warn(
            'GOOGLE SIGNOUT ERROR:',
            googleError?.message ||
              googleError,
          );
        }

      } catch (error) {

        console.error(
          'LOGOUT ERROR:',
          error,
        );

        throw error;
      }
    },
    [],
  );


  // =====================================================
  // Context Value
  // =====================================================
  // Memoizing the context value prevents consumers from
  // receiving a new object whenever AuthProvider renders for
  // unrelated reasons.
  const value = useMemo(
    () => ({
      user,
      initializing,
      profilePhoto,
      updateUserProfile,
      saveProfilePhoto,
      logout,
    }),
    [
      user,
      initializing,
      profilePhoto,
      updateUserProfile,
      saveProfilePhoto,
      logout,
    ],
  );


  // =====================================================
  // Provider
  // =====================================================
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


// =====================================================
// useAuth Hook
// =====================================================
// Provides a convenient and type-safe access point to the
// authentication context. Consumers do not need to know
// that the implementation uses React Context.
export function useAuth() {

  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    );
  }

  return context;
}
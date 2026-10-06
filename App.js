// import React from 'react';

// import {
//   View,
//   ActivityIndicator,
//   StyleSheet,
// } from 'react-native';

// import {
//   NavigationContainer,
// } from '@react-navigation/native';

// import {
//   createNativeStackNavigator,
// } from '@react-navigation/native-stack';

// import LoginScreen from './src/screens/LoginScreen';
// import SignupScreen from './src/screens/SignupScreen';

// import MainTabNavigator from './src/navigation/MainTabNavigator';

// import {
//   AuthProvider,
//   useAuth,
// } from './src/context/AuthContext';


// const Stack = createNativeStackNavigator();


// // =====================================================
// // App Navigator
// // =====================================================

// function AppNavigator() {

//   const {
//     user,
//     initializing,
//   } = useAuth();


//   // ===================================================
//   // Firebase is checking authentication state
//   // ===================================================

//   if (initializing) {

//     return (
//       <View style={styles.loadingContainer}>

//         <ActivityIndicator
//           size="large"
//           color="#2563eb"
//         />

//       </View>
//     );
//   }


//   // ===================================================
//   // Navigation
//   // ===================================================

//   return (
//     <NavigationContainer>

//       {user ? (

//         // ==============================================
//         // User is logged in
//         // ==============================================

//         <Stack.Navigator>

//           <Stack.Screen
//             name="MainTabs"
//             component={MainTabNavigator}
//             options={{
//               headerShown: false,
//             }}
//           />

//         </Stack.Navigator>

//       ) : (

//         // ==============================================
//         // User is NOT logged in
//         // ==============================================

//         <Stack.Navigator
//           initialRouteName="Login"
//         >

//           <Stack.Screen
//             name="Login"
//             component={LoginScreen}
//             options={{
//               headerShown: false,
//             }}
//           />

//           <Stack.Screen
//             name="Signup"
//             component={SignupScreen}
//             options={{
//               title: 'Create Account',
//             }}
//           />

//         </Stack.Navigator>

//       )}

//     </NavigationContainer>
//   );
// }


// // =====================================================
// // App
// // =====================================================

// function App() {

//   return (
//     <AuthProvider>

//       <AppNavigator />

//     </AuthProvider>
//   );
// }


// export default App;


// // =====================================================
// // Styles
// // =====================================================

// const styles = StyleSheet.create({

//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

// });


import React from 'react';

import {
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';

import MainTabNavigator from './src/navigation/MainTabNavigator';

import {
  AuthProvider,
  useAuth,
} from './src/context/AuthContext';


// =====================================================
// Stack Navigators
// =====================================================
// Keep authentication and application navigation as
// separate navigation trees.
//
// AuthStack:
//   Login
//   Signup
//
// AppStack:
//   MainTabs
const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();


// =====================================================
// Loading Screen
// =====================================================
// Displayed while Firebase Auth is restoring/checking
// the user's persisted authentication session.
//
// We must wait for this result before deciding whether
// to show the authenticated or unauthenticated flow.
function LoadingScreen() {

  return (
    <View style={styles.loadingContainer}>

      <ActivityIndicator
        size="large"
        color="#2563eb"
      />

    </View>
  );
}


// =====================================================
// Authenticated Navigator
// =====================================================
// Contains screens that should only be accessible when
// Firebase Auth has an authenticated user.
function AppNavigator() {

  return (
    <AppStack.Navigator>

      <AppStack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{
          // MainTabNavigator owns the application's primary
          // navigation UI, so the stack header is unnecessary.
          headerShown: false,
        }}
      />

    </AppStack.Navigator>
  );
}


// =====================================================
// Unauthenticated Navigator
// =====================================================
// Contains screens available when there is no authenticated
// Firebase user.
function AuthNavigator() {

  return (
    <AuthStack.Navigator
      initialRouteName="Login"
    >

      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          // Login screen provides its own UI, so the native
          // stack header is hidden.
          headerShown: false,
        }}
      />

      <AuthStack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          title: 'Create Account',
        }}
      />

    </AuthStack.Navigator>
  );
}


// =====================================================
// Root Navigator
// =====================================================
// Converts Firebase authentication state into the
// application's navigation state.
//
// Firebase/AuthContext is the source of truth.
// This component only decides which navigation tree
// should be rendered.
function RootNavigator() {

  const {
    user,
    initializing,
  } = useAuth();


  // -----------------------------------------------------
  // Firebase Auth Initialization
  // -----------------------------------------------------
  // Firebase may need time to restore a previously
  // authenticated session when the application starts.
  //
  // Rendering the login screen before this completes could
  // cause a brief login-screen flash for an already
  // authenticated user.
  if (initializing) {
    return <LoadingScreen />;
  }


  // -----------------------------------------------------
  // Authentication-Based Navigation
  // -----------------------------------------------------
  // Authenticated user:
  //   Firebase user exists → AppNavigator
  //
  // Unauthenticated user:
  //   Firebase user is null → AuthNavigator
  //
  // Because the navigation trees are mutually exclusive,
  // authenticated screens are removed from the component
  // tree after logout.
  return user
    ? <AppNavigator />
    : <AuthNavigator />;
}


// =====================================================
// Application Root
// =====================================================
// AuthProvider must wrap RootNavigator because RootNavigator
// calls useAuth(), which reads authentication state from
// React Context.
function App() {

  return (
    <AuthProvider>

      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>

    </AuthProvider>
  );
}


export default App;


// =====================================================
// Styles
// =====================================================
const styles = StyleSheet.create({

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

});

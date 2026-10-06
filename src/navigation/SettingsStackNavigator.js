// import React from 'react';

// import {
//   createNativeStackNavigator,
// } from '@react-navigation/native-stack';

// import SettingsScreen from '../screens/SettingsScreen';
// import EditProfileScreen from '../screens/EditProfileScreen';

// const Stack = createNativeStackNavigator();

// function SettingsStackNavigator() {
//   return (
//     <Stack.Navigator>

//       <Stack.Screen
//         name="SettingsHome"
//         component={SettingsScreen}
//         options={{
//           title: 'Settings',
//         }}
//       />

//       <Stack.Screen
//         name="EditProfile"
//         component={EditProfileScreen}
//         options={{
//           title: 'Edit Profile',
//         }}
//       />

//     </Stack.Navigator>
//   );
// }

// export default SettingsStackNavigator;


import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import SettingsScreen from '../screens/SettingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';


// =====================================================
// Settings Stack Navigator
// =====================================================
// This navigator manages navigation within the Settings
// section of the authenticated application.
//
// Navigation hierarchy:
//
// MainTabNavigator
//   └── Settings tab
//        └── SettingsStackNavigator
//             ├── SettingsHome
//             └── EditProfile
//
// Authentication is handled by AuthProvider/RootNavigator.
// Firebase operations should remain in the appropriate
// context, service, or screen layer rather than here.
const Stack = createNativeStackNavigator();


// =====================================================
// SettingsStackNavigator
// =====================================================
function SettingsStackNavigator() {

  return (
    <Stack.Navigator>

      {/* -------------------------------------------------
          Settings Home
          -------------------------------------------------
          Initial screen of the Settings stack.
      */}
      <Stack.Screen
        name="SettingsHome"
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />


      {/* -------------------------------------------------
          Edit Profile
          -------------------------------------------------
          Screen used to edit the authenticated user's
          profile information.
      */}
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: 'Edit Profile',
        }}
      />

    </Stack.Navigator>
  );
}


export default SettingsStackNavigator;


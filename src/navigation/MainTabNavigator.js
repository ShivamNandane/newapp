// import React from 'react';

// import {
//   createBottomTabNavigator,
// } from '@react-navigation/bottom-tabs';

// import HomeScreen from '../screens/HomeScreen';
// import SettingsStackNavigator from './SettingsStackNavigator';
// import NotesScreen from '../screens/NotesScreen';

// const Tab = createBottomTabNavigator();

// function MainTabNavigator() {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//       />

//       <Tab.Screen
//         name="Settings"
//         component={SettingsStackNavigator}
//       />

//       <Tab.Screen
//         name="Notes"
//         component={NotesScreen}
//       />
//     </Tab.Navigator>
//   );
// }

// export default MainTabNavigator;


import React from 'react';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import SettingsStackNavigator from './SettingsStackNavigator';
import NotesScreen from '../screens/NotesScreen';


// =====================================================
// Main Application Tab Navigator
// =====================================================
// This navigator defines the top-level navigation sections
// available after authentication.
//
// Authentication is intentionally handled outside this
// navigator by AuthProvider/RootNavigator.
//
// Tabs:
//   Home
//   Settings
//   Notes
const Tab = createBottomTabNavigator();


// =====================================================
// MainTabNavigator
// =====================================================
function MainTabNavigator() {

  return (
    <Tab.Navigator
      screenOptions={{
        // Individual screens/nested navigators are responsible
        // for their own headers.
        headerShown: false,

        // Keep tab labels visible for accessibility and clarity.
        tabBarShowLabel: true,

        // Prevent inactive tabs from being visually emphasized.
        tabBarHideOnKeyboard: false,
      }}
    >

      {/* =================================================
          Home
          ================================================= */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          // Explicitly identify the tab for testing/debugging
          // and keep configuration close to the route.
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />


      {/* =================================================
          Settings
          =================================================
          Settings uses a nested stack navigator because it
          contains multiple screens that belong to the same
          Settings section.

          Example:

          Settings tab
              ↓
          SettingsStackNavigator
              ├── Settings
              ├── Profile
              ├── Account
              └── Privacy
      */}
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{
          tabBarAccessibilityLabel: 'Settings tab',
        }}
      />


      {/* =================================================
          Notes
          ================================================= */}
      <Tab.Screen
        name="Notes"
        component={NotesScreen}
        options={{
          tabBarAccessibilityLabel: 'Notes tab',
        }}
      />

    </Tab.Navigator>
  );
}


export default MainTabNavigator;


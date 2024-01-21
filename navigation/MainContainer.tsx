import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import ManageRevisionsScreen from './screens/ManageRevisionsScreen';

//Screen names
const homeName = 'Home';
const revisionManagerName = 'Manage Revision';
const Tab = createBottomTabNavigator();

const MainContainer = () => {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white',
    },
  };
  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            let routeName = route.name;
            if (routeName === homeName) {
              iconName = focused ? 'home' : 'home-outline';
            } else if (routeName === revisionManagerName) {
              iconName = focused ? 'clipboard-list' : 'clipboard-list-outline';
            }

            return (
              <Material name={iconName as string} size={size} color={color} />
            );
          },
          activeTintColor: 'green',
          labelStyle: {paddingBottom: 10, fontSize: 14},
          inactiveTintColor: 'grey',
        })}>
        <Tab.Screen name={homeName} component={HomeScreen} />
        <Tab.Screen
          name={revisionManagerName}
          component={ManageRevisionsScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainContainer;

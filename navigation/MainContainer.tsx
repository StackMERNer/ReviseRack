import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from './screens/HomeScreen';
import ManageRevisionsScreen from './screens/ManageRevisionsScreen';
import {primaryColor} from '../utils/colors';

//Screen names
const homeName = 'Home';
const revisionsManagerName = 'Manage Revisions';
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
          tabBarIcon: ({focused, size}) => {
            let iconName;
            let color;
            let routeName = route.name;
            if (routeName === homeName) {
              iconName = focused ? 'home' : 'home-outline';
              color = focused ? primaryColor : 'black';
            } else if (routeName === revisionsManagerName) {
              iconName = focused ? 'clipboard-list' : 'clipboard-list-outline';
              color = focused ? primaryColor : 'black';
            }
            return (
              <Material name={iconName as string} size={size} color={color} />
            );
          },
          // labelStyle: {paddingBottom: 10, fontSize: 20},
          tabBarLabelStyle: {fontSize: 14},
          tabBarActiveTintColor: primaryColor,
        })}>
        <Tab.Screen
          name={homeName}
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name={revisionsManagerName}
          component={ManageRevisionsScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainContainer;

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import ManageRevisionsScreen from './screens/ManageRevisionsScreen';

//Screen names
const homeName = 'ড্যাশবোর্ড';
const settingsName = 'সেটিংস';
const revisionManagerName = 'ম্যানেজ রিভিশন';
const Tab = createBottomTabNavigator();

const MainContainer = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            let routeName = route.name;
            if (routeName === homeName) {
              iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
            } else if (routeName === settingsName) {
              iconName = focused
                ? 'account-settings'
                : 'account-settings-outline';
            } else if (routeName === revisionManagerName) {
              iconName = focused ? 'clipboard-list' : 'clipboard-list-outline';
            }

            return (
              <Material name={iconName as string} size={size} color={color} />
            );
          },
          activeTintColor: 'green',
          style: {padding: 10, height: 70},
          labelStyle: {paddingBottom: 10, fontSize: 14},
          inactiveTintColor: 'grey',
        })}>
        <Tab.Screen name={homeName} component={HomeScreen} />
        <Tab.Screen
          name={revisionManagerName}
          component={ManageRevisionsScreen}
        />
        <Tab.Screen name={settingsName} component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainContainer;

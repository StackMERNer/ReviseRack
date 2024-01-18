import React from 'react';
import {Text, View} from 'react-native';

const SettingScreen = ({navigation}) => {
  return (
    <View>
      <Text onPress={() => navigation.navigate('Home')}>
        Hello From setting
      </Text>
    </View>
  );
};

export default SettingScreen;

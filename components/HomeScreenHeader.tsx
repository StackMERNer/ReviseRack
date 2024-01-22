import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {primaryColor} from '../utils/colors';

const HomeScreenHeader = ({onRefresh}: {onRefresh: () => void}) => {
  return (
    <TouchableOpacity
      onPress={onRefresh}
      style={{
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
      {/* <Text>hello world</Text> */}
      <Icon name="refresh-circle" color={primaryColor} size={34} />
    </TouchableOpacity>
  );
};

export default HomeScreenHeader;

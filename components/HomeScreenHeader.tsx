import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {primaryColor} from '../utils/colors';

const HomeScreenHeader = ({onRefresh}: {onRefresh: () => void}) => {
  return (
    <TouchableOpacity
      onPress={onRefresh}
      style={{
        paddingTop: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
      <Icon name="refresh-circle" color={primaryColor} size={34} />
    </TouchableOpacity>
  );
};

export default HomeScreenHeader;

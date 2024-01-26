import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {primaryColor} from '../utils/colors';

const EmptyBoxWithInfo = ({
  title='',
  description='',
}: {
  title: string;
  description: string;
}) => {
  return (
    <View style={styles.infoContainer}>
      <Image source={require('./../assets/images/empty-box-96.png')} />
      <Text style={styles.infoHeader}>{title}</Text>
      <Text style={styles.infoText}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: primaryColor,
    marginTop: 30,
    gap: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  infoHeader: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  infoText: {textAlign: 'center', color: 'white'},
});

export default EmptyBoxWithInfo;

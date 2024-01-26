import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import MainContainer from './navigation/MainContainer';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <MainContainer />
        <Toast />
      </SafeAreaView>
    </>
  );
};

export default App;

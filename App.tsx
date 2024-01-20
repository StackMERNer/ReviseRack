import React from 'react';
import {StatusBar} from 'react-native';
import MainContainer from './navigation/MainContainer';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <MainContainer />
      <Toast />
    </>
  );
};

export default App;

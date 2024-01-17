import React, {useState} from 'react';

import FileManagement from './screens/FileManager';
import {Text, View} from 'react-native';
import Revisions from './screens/Revisions';
const FilePicker = () => {
  const [addPdfs, setAddPdf] = useState(false);
  // return <>{addPdfs ? <FileManagement /> : <View></View>}</>;

  return false ? <FileManagement /> : <Revisions />;
};

export default FilePicker;

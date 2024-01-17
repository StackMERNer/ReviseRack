import React, {useState} from 'react';

import FileManagement from './screens/FileManager';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Revisions from './screens/Revisions';
const FilePicker = () => {
  const [addPdfs, setAddPdf] = useState(true);
  // return <>{addPdfs ? <FileManagement /> : <View></View>}</>;

  return addPdfs ? (
    <>
      <TouchableOpacity
        onPress={() => setAddPdf(!addPdfs)}
        style={styles.addButton}>
        <Text style={styles.plusTest}>{addPdfs ? 'Back' : 'Add Pdf'}</Text>
      </TouchableOpacity>
      <FileManagement />
    </>
  ) : (
    <>
      <TouchableOpacity
        onPress={() => setAddPdf(!addPdfs)}
        style={styles.addButton}>
        <Text style={styles.plusTest}>{addPdfs ? 'Back' : 'Add Pdf'}</Text>
      </TouchableOpacity>
      <Revisions />
    </>
  );
};

const styles = StyleSheet.create({
  addButton: {
    // height: 50,
    // width: 50,
    position: 'absolute',
    bottom: 30,
    right: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusTest: {
    color: '#fff',
    fontSize: 20,
  },
});

export default FilePicker;

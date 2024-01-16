import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Pdf from 'react-native-pdf';

const PdfViewer = ({pdfUri}) => {
  return (
    <View style={styles.container}>
      <Text>h</Text>
      {/* <Pdf
        source={{uri: pdfUri, cache: true}}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`current page: ${page}`);
        }}
        onError={error => {
          console.log(error);
        }}
        style={styles.pdf}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
});

export default PdfViewer;




// const pickDocument = async () => {
  //   try {
  //     const result = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.pdf],
  //     });
  //     console.log('result', result);

  //     // setPdfUri(result[0].uri);
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       // User cancelled the picker
  //     } else {
  //       Alert.alert(
  //         'Error',
  //         'Something went wrong while picking the document.',
  //       );
  //     }
  //   }
  // };

<Button title="Pick PDF" onPress={pickDocument} />
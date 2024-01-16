import React, {useState} from 'react';
import {
  View,
  Button,
  Linking,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import FileManagement from './screens/FileManager';
const FilePicker = () => {
  const [pdfUri, setPdfUri] = useState('');
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
        copyTo: 'documentDirectory',
      });
      // console.log('result', result);

      if (result.fileCopyUri) {
        setPdfUri(decodeURIComponent(result.fileCopyUri));
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        Alert.alert(
          'Error',
          'Something went wrong while picking the document.',
        );
      }
    }
  };
  // const requestStoragePermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACTION_OPEN_DOCUMENT,
  //       {
  //         title: 'Cool Photo App Storage Permission',
  //         message:
  //           'Cool Photo App needs access to your Storage ' +
  //           'so you can take awesome pictures.',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       },
  //     );

  //     console.log('result', granted);

  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log('You can use the Storage');
  //     } else {
  //       console.log('Storage permission denied');
  //       if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
  //         // The user selected "Never ask again," guide them to app settings
  //         Alert.alert(
  //           'Permission Denied',
  //           'This app needs storage access to pick PDF files. Please enable the permission in the app settings.',
  //           [
  //             {
  //               text: 'Open Settings',
  //               onPress: () => Linking.openSettings(),
  //             },
  //             {
  //               text: 'Cancel',
  //               style: 'cancel',
  //             },
  //           ],
  //         );
  //       }
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };
  // console.log(pdfUri);

  // return (
  //   <View style={styles.container}>
  //     {/* <Button title="Pick PDF" onPress={pickDocument} />
  //     <Pdf
  //       trustAllCerts={false}
  //       source={{
  //         uri: pdfUri,
  //       }}
  //       page={1}
  //       scale={1.0}
  //       minScale={0.5}
  //       maxScale={3.0}
  //       renderActivityIndicator={() => (
  //         <ActivityIndicator color="black" size="large" />
  //       )}
  //       enablePaging={true}
  //       onLoadProgress={percentage => console.log(`Loading :${percentage}`)}
  //       onLoadComplete={() => console.log('Loading Complete')}
  //       // onPageChanged={(page, totalPages) =>
  //       //   console.log(`${page}/${totalPages}`)
  //       // }
  //       onError={error => console.log(error)}
  //       // onPageSingleTap={page => alert(page)}
  //       onPressLink={link => Linking.openURL(link)}
  //       onScaleChanged={scale => console.log(scale)}
  //       // singlePage={true}
  //       spacing={10}
  //       // horizontal
  //       style={styles.pdf}
  //     /> */}
  //   </View>
  // );
  return <FileManagement />;
};

// const styles = StyleSheet.create({
//   container: {flex: 1, justifyContent: 'flex-start', alignItems: 'center'},
//   pdf: {flex: 1, width: Dimensions.get('window').width},
// });

export default FilePicker;

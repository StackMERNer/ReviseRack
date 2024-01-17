import React from 'react';
import {ActivityIndicator, Dimensions, Linking, StyleSheet} from 'react-native';
import Pdf from 'react-native-pdf';

const PDFReader = ({pdfFilePath}: {pdfFilePath: string}) => {
  return (
    <Pdf
      trustAllCerts={false}
      source={{
        uri: pdfFilePath,
      }}
      page={1}
      scale={1.0}
      minScale={0.5}
      maxScale={3.0}
      renderActivityIndicator={() => (
        <ActivityIndicator color="black" size="large" />
      )}
      enablePaging={true}
      onLoadProgress={percentage => console.log(`Loading :${percentage}`)}
      onLoadComplete={() => console.log('Loading Complete')}
      onError={error => console.log(error)}
      onPressLink={link => Linking.openURL(link)}
      onScaleChanged={scale => console.log(scale)}
      spacing={10}
      style={styles.pdf}
    />
  );
};
const styles = StyleSheet.create({
  pdf: {flex: 1, width: Dimensions.get('window').width},
});

export default PDFReader;

import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Pdf from 'react-native-pdf';

function App() {
  const pdfSource = 'https://api.printnode.com/static/test/pdf/multipage.pdf';
  return (
    <>
      <View style={styles.container}>
        <Pdf
          trustAllCerts={false}
          source={{
            uri: pdfSource,
          }}
          style={styles.pdf}
        />
        {/* <Text>hello</Text> */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'flex-start', alignItems: 'center'},
  pdf: {flex: 1, width: Dimensions.get('window').width},
});

export default App;

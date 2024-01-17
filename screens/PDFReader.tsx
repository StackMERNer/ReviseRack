import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Pdf from 'react-native-pdf';

const PDFReader = ({
  pdfFilePath,
  onPressBackBtn,
}: {
  pdfFilePath: string;
  onPressBackBtn: () => void;
}) => {
  //one url type: /data/user/0/com.myreader/files/Revisions/Revision 1/test.pdf
  const [totalPages, setTotalPages] = useState(0);
  const [activePage, setActivePage] = useState(1);
  useEffect(() => {
    if (totalPages) {
      const randomPage = Math.round(Math.random() * totalPages);

      setActivePage(randomPage);
    }
  }, [totalPages]);
  return (
    <>
      <View style={styles.pdfNavBar}>
        <TouchableOpacity onPress={onPressBackBtn}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <View>
          <Text>
            {activePage}/{totalPages}
          </Text>
        </View>
      </View>
      <Pdf
        trustAllCerts={false}
        source={{
          uri: pdfFilePath,
        }}
        page={activePage}
        scale={1.0}
        minScale={0.5}
        maxScale={3.0}
        renderActivityIndicator={() => (
          <ActivityIndicator color="black" size="large" />
        )}
        enablePaging={true}
        onLoadProgress={percentage => console.log(`Loading :${percentage}`)}
        onLoadComplete={pages => {
          setTotalPages(pages);
        }}
        onError={error => console.log(error)}
        onPressLink={link => Linking.openURL(link)}
        onScaleChanged={scale => console.log(scale)}
        // spacing={10}

        style={styles.pdf}
      />
    </>
  );
};
const styles = StyleSheet.create({
  pdfNavBar: {
    // padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backBtn: {
    fontSize: 30,
    fontWeight: 'bold',
    alignItems: 'center',

    paddingBottom: 4,
    justifyContent: 'center',
  },
  pdf: {flex: 1, width: Dimensions.get('window').width},
});

export default PDFReader;

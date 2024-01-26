import React, {useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  ScrollView,
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
  onPressBackBtn: (currentPath: string) => void;
}) => {
  //example pdfFilePath : /data/user/0/com.myreader/files/Revisions/Revision 1/test.pdf
  const [totalPages, setTotalPages] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [displayAblePageNo, setDisplayAblePageNo] = useState(0);

  const setRandomPage = () => {
    const randomPage = Math.round(Math.random() * totalPages);
    setActivePage(randomPage);
  };
  return (
    <View style={{flex: 1}}>
      <View style={styles.pdfNavBar}>
        <TouchableOpacity onPress={() => onPressBackBtn(pdfFilePath)}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <View style={styles.navBarInfo}>
          <Text style={{color: '#fff'}}>
            {displayAblePageNo}/{totalPages}
          </Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{flex: 1}}>
        <Pdf
          source={{
            uri: pdfFilePath,
            cache: true,
          }}
          page={activePage}
          onPageChanged={page => {
            setDisplayAblePageNo(page);
          }}
          style={styles.pdf}
          onError={error => {
            console.error(error);
          }}
          onLoadComplete={pages => {
            setTotalPages(pages);
          }}
          scale={1.0}
          minScale={0.5}
          maxScale={3.0}
          onPressLink={link => Linking.openURL(link)}
          renderActivityIndicator={() => (
            <ActivityIndicator color="black" size="large" />
          )}
        />
      </ScrollView>

      <View>
        <TouchableOpacity onPress={setRandomPage} style={styles.shuffleBtn}>
          <Text style={styles.shuffleBtnTxt}>Shuffle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  pdfNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'black',
  },
  backBtn: {
    fontSize: 30,
    fontWeight: 'bold',
    alignItems: 'center',
    paddingBottom: 4,
    justifyContent: 'center',
    color: '#fff',
  },
  shuffleBtn: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shuffleBtnTxt: {
    color: '#fff',
    fontSize: 15,
  },
  navBarInfo: {
    flex: 10,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'flex-end',
  },
  pdf: {flex: 1, width: Dimensions.get('window').width},
});

export default PDFReader;

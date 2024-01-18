import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import Calendar from '../../components/Calendar';

import Revisions from '../../screens/Revisions';
import FileManagement from '../../screens/FileManager';
import PDFReader from '../../screens/PDFReader';
interface Range {
  startDate: Date;
  endDate: Date;
}

const HomeScreen = () => {
  const dateRanges: Range[] = [
    {
      startDate: new Date(), // Current date
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
    },
    {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 5),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
    },
    {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 20),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5),
    },
    // Add more ranges as needed
  ];
  const renderHeader = () => <Calendar colors={[]} ranges={dateRanges} />;
  const [selectedPdf, setSelectedPdf] = useState('');
  // console.log('selectedPdf', selectedPdf);
  if (selectedPdf) {
    return (
      <PDFReader
        pdfFilePath={selectedPdf}
        onPressBackBtn={() => setSelectedPdf('')}
      />
    );
  }
  return (
    <>
      {/* <ScrollView> */}
      {/* <View style={{maxHeight: '98%'}}>
          <Calendar colors={[]} ranges={dateRanges} />

          <Revisions onPdfSelect={pdfPath => setSelectedPdf(pdfPath)} />
        </View> */}
      {/* </ScrollView> */}
      {/* <View style={{maxHeight: '98%'}}>
        <Calendar colors={[]} ranges={dateRanges} />

        <Revisions onPdfSelect={pdfPath => setSelectedPdf(pdfPath)} />
      </View> */}

      <View>
        <FlatList
          data={['header', 'revisions']}
          keyExtractor={item => item}
          renderItem={({item}) => {
            switch (item) {
              case 'header':
                return renderHeader();
              case 'revisions':
                return (
                  <Revisions onPdfSelect={pdfPath => setSelectedPdf(pdfPath)} />
                );
              case 'fileManagement':
                return <FileManagement />;
              default:
                return null;
            }
          }}
          // ListFooterComponent={<View style={{height: 200}} />}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    width: '100%',
    marginTop: 10,
    paddingVertical: 16,
    marginHorizontal: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto',
  },
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

export default HomeScreen;

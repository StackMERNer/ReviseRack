import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import Calendar from '../../components/Calendar';

import Revisions from '../../screens/Revisions';
import FileManagement from '../../screens/FileManager';
import PDFReader from '../../screens/PDFReader';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface Range {
  startDate: Date;
  endDate: Date;
}

export type RangeManagerType = {
  ranges: Range[];
  lastUpdated: number;
  nextRevisionIndex: number;
};
const HomeScreen = () => {
  const [rangeManager, setRangeManger] = useState<RangeManagerType>({
    lastUpdated: new Date().getDate(),
    nextRevisionIndex: 0,
    ranges: [],
  });
  // console.log('ranges', ranges);
  useEffect(() => {
    AsyncStorage.getItem('RangeManager').then(res => {
      // console.log('RangeManager', res);
      if (res) {
        setRangeManger(JSON.parse(res));
      }
    });
  }, []);
  const renderHeader = () => <Calendar colors={[]} ranges={rangeManager.ranges} />;
  const [selectedPdf, setSelectedPdf] = useState('');
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
                  <Revisions
                    rangeManager={rangeManager}
                    onRangeManagerUpdate={updatedRangeManager => setRangeManger(updatedRangeManager)}
                    onPdfSelect={pdfPath => setSelectedPdf(pdfPath)}
                  />
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

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
  useEffect(() => {
    AsyncStorage.getItem('RangeManager').then(res => {
      if (res) {
        setRangeManger(JSON.parse(res));
      }
    });
  }, []);
  const renderHeader = () => (
    <Calendar colors={[]} ranges={rangeManager.ranges} />
  );
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
                    onRangeManagerUpdate={updatedRangeManager =>
                      setRangeManger(updatedRangeManager)
                    }
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



export default HomeScreen;

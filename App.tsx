import React, {useState} from 'react';

import FileManagement from './screens/FileManager';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Revisions from './screens/Revisions';
import Calendar from './components/Calendar';
import MainContainer from './navigation/MainContainer';
interface Range {
  startDate: Date;
  endDate: Date;
}
const FilePicker = () => {
  const [addPdfs, setAddPdf] = useState(true);
  // return <>{addPdfs ? <FileManagement /> : <View></View>}</>;
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
  const renderHeader = () => (
    <View style={styles.calendarContainer}>
      <Calendar colors={[]} ranges={dateRanges} />
    </View>
  );
  return (
    // <FlatList
    //   data={['header', 'revisions', 'fileManagement']}
    //   keyExtractor={item => item}
    //   renderItem={({item}) => {
    //     switch (item) {
    //       case 'header':
    //         return renderHeader();
    //       case 'revisions':
    //         return <Revisions />;
    //       case 'fileManagement':
    //         return <FileManagement />;
    //       default:
    //         return null;
    //     }
    //   }}
    //   ListFooterComponent={<View style={{height: 200}} />}
    // />
    <MainContainer/>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    width: '100%',
    paddingVertical: 16,
    marginHorizontal: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
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

export default FilePicker;

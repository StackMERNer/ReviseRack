import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import RNFS from 'react-native-fs';
import PDFReader from './PDFReader';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FileObject {
  ctime: Date | undefined;
  isDirectory: () => boolean;
  isFile: () => boolean;
  mtime: Date | undefined;
  name: string | null;
  path: string;
  size: number;
}
const Revisions = ({onPdfSelect}: {onPdfSelect: (pdfPath: string) => void}) => {
  const [revisionFolders, setRevisionFolders] = useState<FileObject[]>([]);
  const revisionsPath = `${RNFS.DocumentDirectoryPath}/Revisions`;
  useEffect(() => {
    RNFS.readDir(revisionsPath)
      .then(result => {
        setRevisionFolders(result);
      })
      .catch(err => {
        console.log(err.message);
        // console.log(err.message, err.code);
      });
  }, [revisionsPath]);
  const [files, setFiles] = useState<FileObject[]>([]);
  const [activePdf, setActivePdf] = useState('');
  const [filePath, setFilePath] = useState('');
  useEffect(() => {
    if (filePath) {
      RNFS.readDir(filePath)
        .then(result => {
          setFiles(result);
        })
        .catch(err => {
          console.log(err.message, err.code);
        });
    }
  }, [filePath]);
  if (activePdf) {
    return (
      <PDFReader
        onPressBackBtn={() => setActivePdf('')}
        pdfFilePath={activePdf}
      />
    );
  }
  interface Range {
    startDate: Date;
    endDate: Date;
  }
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
  const storeData = async () => {
    try {
      await AsyncStorage.setItem('key', 'value');
      // console.log('Data stored successfully.');
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('key');
      if (value !== null) {
        console.log('Retrieved data:', value);
      } else {
        console.log('No data found.');
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };
  

  useEffect(() => {
    const todaysRevision = revisionFolders[0];
    if (todaysRevision) {
      setFilePath(todaysRevision.path);
    }
  }, [revisionFolders]);
  
  

  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={styles.revisionsContainer}>
        <View>
          {files.length > 1 && (
            <Text
              style={{
                textAlign: 'center',
                paddingVertical: 10,
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              Todays Revision
            </Text>
          )}
        </View>
        <FlatList
          data={files}
          renderItem={({item, index}) => (
            <View style={styles.revision}>
              <View>
                <Text
                  onPress={() => onPdfSelect(item.path)}
                  style={{fontSize: 18}}>
                  {index + 1}. {item.name}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: '#EAFFE1',
                  paddingHorizontal: 10,
                  borderRadius: 50,
                }}>
                <Text style={{color: 'green'}}>done</Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  revisionsContainer: {
    marginVertical: 15,
    width: '96%',
    // height: 240,
    backgroundColor: 'white',
    paddingBottom:20,
    borderRadius: 10,
    gap: 2,
  },
  revisionList: {
    borderWidth: 1,
    padding: 10,
  },
  revision: {
    padding: 10,

    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  calendarContainer: {
    height: '50%',
    width: '100%',
    paddingVertical: 16,
    // borderWidth: 2,
    marginHorizontal: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Revisions;

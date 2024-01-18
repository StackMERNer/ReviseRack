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

  type RevisionCompletionType = {
    date: Date;
    completedNames: string[];
    RevFolderName: string;
  };

  const [revisionCompletion, setRevisionCompletion] =
    useState<RevisionCompletionType>({
      date: new Date(),
      completedNames: [],
      RevFolderName: '',
    });

  useEffect(() => {
    const todaysRevision = revisionFolders[0];
    if (todaysRevision) {
      setFilePath(todaysRevision.path);
    }
  }, [revisionFolders]);

  useEffect(() => {
    AsyncStorage.getItem('revisionCompletion').then(res => {
      if (res) {
        setRevisionCompletion(JSON.parse(res));
      }
    });
  }, []);
  // useEffect(()=>{},[]) EAFFE1

  const handlePdfClick = (file: FileObject) => {
    if (file.name && !revisionCompletion.completedNames.includes(file.name)) {
      const updated = {
        ...revisionCompletion,
        completedNames: [...revisionCompletion.completedNames, file.name],
      };
      AsyncStorage.setItem('revisionCompletion', JSON.stringify(updated))
        .then(res => {
          console.log('stored', res);
        })
        .catch(err => console.log('failed to store', err))
        .finally(() => onPdfSelect(file.path));
    } else {
      onPdfSelect(file.path);
    }
  };
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
          renderItem={({item, index}) => {
            const isCompleted = revisionCompletion.completedNames.includes(
              item.name ?? '',
            );

            return (
              <View style={styles.revision}>
                <View>
                  <Text
                    onPress={() => handlePdfClick(item)}
                    style={{fontSize: 18}}>
                    {index + 1}. {item.name}
                  </Text>
                </View>
                <View
                  style={[
                    isCompleted
                      ? {backgroundColor: '#EAFFE1'}
                      : {
                          backgroundColor: '#eef0f2',
                        },
                    {
                      paddingHorizontal: 10,
                      borderRadius: 20,
                    },
                  ]}>
                  <Text
                    style={[isCompleted ? {color: 'green'} : {color: 'black'}]}>
                    {isCompleted ? 'done' : 'pending'}
                  </Text>
                </View>
              </View>
            );
          }}
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
    paddingBottom: 20,
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

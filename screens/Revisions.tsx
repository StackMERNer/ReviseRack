import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import RNFS from 'react-native-fs';
import PDFReader from './PDFReader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RangeManagerType} from '../navigation/screens/HomeScreen';

type RevisionCompletionType = {
  date: number;
  completedNames: string[];
  RevFolderName: string;
};
interface FileObject {
  ctime: Date | undefined;
  isDirectory: () => boolean;
  isFile: () => boolean;
  mtime: Date | undefined;
  name: string | null;
  path: string;
  size: number;
}
const Revisions = ({
  onPdfSelect,
  onRangeManagerUpdate,
  rangeManager,
}: {
  onPdfSelect: (pdfPath: string) => void;
  onRangeManagerUpdate: (updatedRangeManager: RangeManagerType) => void;
  rangeManager: RangeManagerType;
}) => {
  const [revisionFolders, setRevisionFolders] = useState<FileObject[]>([]);
  const revisionsPath = `${RNFS.DocumentDirectoryPath}/Revisions`;
  const currDate = new Date().getDate();
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
  const [nextRevisionIndex, setNextRevisionIndex] = useState(0);

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

  const [todaysRevFolder, setTodaysRevFolder] = useState<
    undefined | FileObject
  >(undefined);

  const [revisionCompletion, setRevisionCompletion] =
    useState<RevisionCompletionType>({
      date: currDate,
      completedNames: [],
      RevFolderName: '',
    });

  useEffect(() => {
    if (nextRevisionIndex > revisionFolders.length) {
      setNextRevisionIndex(0);
    }
    const todaysRevision = revisionFolders[nextRevisionIndex];
    if (todaysRevision) {
      setTodaysRevFolder(todaysRevision);
      setFilePath(todaysRevision.path);
    }
  }, [revisionFolders, nextRevisionIndex]);

  useEffect(() => {
    AsyncStorage.getItem('revisionCompletion').then(res => {
      if (res) {
        const revisionCompletionObj: RevisionCompletionType = JSON.parse(res);
        if (
          revisionCompletionObj.date === currDate &&
          revisionCompletionObj.completedNames.length === files.length &&
          rangeManager.lastUpdated !== currDate
        ) {
          updateRangeManager();
        }
        if (revisionCompletionObj.date === currDate) {
          setRevisionCompletion(revisionCompletionObj);
        }
      }
    });
    AsyncStorage.getItem('RangeManager').then(res => {
      if (res) {
        const rangeManager: RangeManagerType = JSON.parse(res);
        const nextRevisionIndex = rangeManager.nextRevisionIndex ?? 0;
        if (rangeManager.lastUpdated !== currDate) {
          setNextRevisionIndex(nextRevisionIndex);
        }
      }
    });
  }, []);

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
  const updateRangeManager = () => {
    AsyncStorage.getItem('RangeManager').then(res => {
      let rangeManager: RangeManagerType = res
        ? JSON.parse(res)
        : {lastUpdated: currDate, nextRevisionIndex: 0, ranges: []};
      let ranges = rangeManager.ranges;
      let lastRange = ranges[ranges.length - 1] ?? {
        startDate: new Date(),
        endDate: new Date(),
      };
      let updatedLastRange = {...lastRange, endDate: new Date()};
      let withoutLastRange = ranges.slice(0, ranges.length - 2);
      let updatedNextRevisionIndex =
        nextRevisionIndex < revisionFolders.length - 1
          ? nextRevisionIndex + 1
          : 0;
      const updatedRangeManager: RangeManagerType = {
        nextRevisionIndex: updatedNextRevisionIndex,
        lastUpdated: currDate,
        ranges: [...withoutLastRange, updatedLastRange].slice(-5),
      };
      AsyncStorage.setItem(
        'RangeManager',
        JSON.stringify(updatedRangeManager),
      ).then(() => {
        AsyncStorage.getItem('RangeManager').then(res => {
          if (res) {
            let rangeManager: RangeManagerType = JSON.parse(res);
            onRangeManagerUpdate(rangeManager);
          }
        });
      });
    });
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
              Todays Revision: {todaysRevFolder?.name}
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

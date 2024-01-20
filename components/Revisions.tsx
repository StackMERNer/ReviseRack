import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import PDFReader from './PDFReader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RangeManagerType} from '../navigation/screens/HomeScreen';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { primaryColor } from '../utils/colors';

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
        } else {
          setNextRevisionIndex(
            rangeManager.nextRevisionIndex > 1
              ? rangeManager.nextRevisionIndex - 1
              : revisionFolders.length
              ? revisionFolders.length - 1
              : 0,
          );
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
          // console.log('stored', res);
          AsyncStorage.getItem('revisionCompletion').then(res => {
            if (res) {
              const revisionCompletionObj: RevisionCompletionType =
                JSON.parse(res);
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
        })
        .catch(err => console.log('failed to store', err))
        .finally(() => onPdfSelect(file.path));
    } else {
      onPdfSelect(file.path);
    }
  };
  const updateRangeManager = () => {
    // console.log('updating ranges');
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
                // textAlign: 'center',
                paddingVertical: 10,
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              To Read : {todaysRevFolder?.name}
            </Text>
          )}
        </View>
        <FlatList
          data={files}
          // contentContainerStyle={{gap: 2}}
          renderItem={({item, index}) => {
            const isCompleted = revisionCompletion.completedNames.includes(
              item.name ?? '',
            );

            return (
              <View style={styles.revision}>
                <View>
                  <TouchableOpacity onPress={() => handlePdfClick(item)}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View>
                        <Image
                          style={{
                            height: 45,
                            objectFit: 'contain',
                          }}
                          source={require('./../assets/images/pdficon.png')}
                        />
                      </View>
                      <View>
                        <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                          {index + 1}. {item.name}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View>
                  <AntDesign
                    name="rightcircle"
                    style={{color: primaryColor}}
                    size={25}
                  />
                </View>
                {/* <View
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
                </View> */}
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
    paddingHorizontal: 15,
    borderRadius: 10,
    gap: 2,
  },
  revisionList: {
    borderWidth: 1,
    padding: 10,
  },
  revision: {
    padding: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FCF2E7',
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

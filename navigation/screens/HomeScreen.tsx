import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import Calendar from '../../components/Calendar';
import Revisions from '../../components/Revisions';
import RNFS from 'react-native-fs';
import PDFReader from '../../components/PDFReader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import HomeScreenHeader from '../../components/HomeScreenHeader';
interface Range {
  startDate: Date;
  endDate: Date;
}
export interface FileObject {
  ctime: Date | null;
  isDirectory: () => boolean;
  isFile: () => boolean;
  mtime: Date | null;
  name: string;
  path: string;
  size: number;
  numberOfFiles?: number;
}
export type RangeManagerType = {
  ranges: Range[];
  lastUpdated: Date | undefined;
  nextRevisionIndex: number;
};
export type CompletedRevsionsContainerObjType = {
  currentDate: Date;
  completedNames: string[];
  RevFolderName: string;
};

const HomeScreen = () => {
  const currDate = new Date();
  const [nextRevisionIndex, setNextRevisionIndex] = useState(0);
  const [selectedPdf, setSelectedPdf] = useState<FileObject | undefined>();

  const [files, setFiles] = useState<FileObject[]>([]);
  const [filePath, setFilePath] = useState('');
  const [todaysRevFolder, setTodaysRevFolder] = useState<
    undefined | FileObject
  >(undefined);
  const [refreshCount, setRefreshCount] = useState(0);
  const [revisionFolders, setRevisionFolders] = useState<FileObject[]>([]);
  const [rangeManager, setRangeManager] = useState<RangeManagerType>({
    lastUpdated: undefined,
    nextRevisionIndex: 0,
    ranges: [],
  });

  useEffect(() => {
    AsyncStorage.getItem('RangeManager').then(res => {
      if (res) {
        setRangeManager(JSON.parse(res));
      }
    });
  }, []);
  const revisionsPath = `${RNFS.DocumentDirectoryPath}/Revisions`;
  useEffect(() => {
    if (filePath) {
      RNFS.readDir(filePath)
        .then(result => {
          setFiles(result as FileObject[]);
        })
        .catch(err => {
          console.log(err.message, err.code);
        });
    }
  }, [filePath, refreshCount]);

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Great!',
      text2: "You completed today's revision 👋",
    });
  };

  useEffect(() => {
    const todaysRevision = revisionFolders[nextRevisionIndex];
    if (todaysRevision) {
      setTodaysRevFolder(todaysRevision);
      setFilePath(todaysRevision.path);
    }
  }, [revisionFolders, nextRevisionIndex, refreshCount]);
  const [completedRevisionsContainer, setCompletedRevisionsContainer] =
    useState<CompletedRevsionsContainerObjType>({
      currentDate: currDate,
      completedNames: [],
      RevFolderName: '',
    });

  useEffect(() => {
    RNFS.readDir(revisionsPath)
      .then(result => {
        setRevisionFolders(result as FileObject[]);
      })
      .catch(err => {
        console.log(err.message);
      });
  }, [revisionsPath, refreshCount]);

  useEffect(() => {
    AsyncStorage.getItem('completedRevisionsContainer').then(res => {
      if (res) {
        const revisionCompletionObj: CompletedRevsionsContainerObjType =
          JSON.parse(res);
        if (
          new Date(revisionCompletionObj.currentDate).getDate() ===
          currDate.getDate()
        ) {
          setCompletedRevisionsContainer(revisionCompletionObj);
        }
      }
    });
    AsyncStorage.getItem('RangeManager').then(res => {
      if (res) {
        const rangeManager: RangeManagerType = JSON.parse(res);
        const nextRevisionIndex = rangeManager.nextRevisionIndex ?? 0;
        if (
          rangeManager.lastUpdated &&
          new Date(rangeManager.lastUpdated).getDate() !== currDate.getDate()
        ) {
          setNextRevisionIndex(nextRevisionIndex);
        } else {
          setNextRevisionIndex(
            rangeManager.nextRevisionIndex > 0
              ? rangeManager.nextRevisionIndex - 1
              : revisionFolders.length
              ? revisionFolders.length - 1
              : 0,
          );
        }
      }
    });
  }, [revisionFolders, refreshCount]);

  const handleupdatingRevisionCompletion = (file: FileObject) => {
    if (
      file.name &&
      !completedRevisionsContainer.completedNames.includes(file.name)
    ) {
      const updated = {
        ...completedRevisionsContainer,
        completedNames: [
          ...completedRevisionsContainer.completedNames,
          file.name,
        ],
      };

      // update ranges if all revisions completed
      AsyncStorage.setItem(
        'completedRevisionsContainer',
        JSON.stringify(updated),
      )
        .then(() => {
          AsyncStorage.getItem('completedRevisionsContainer').then(res => {
            if (res) {
              const revisionCompletionObj: CompletedRevsionsContainerObjType =
                JSON.parse(res);
              // update ranges if, revisionCompletionObj contain today and all revisions completed and ranges not include today.
              if (
                new Date(revisionCompletionObj.currentDate).getDate() ===
                  currDate.getDate() &&
                revisionCompletionObj.completedNames.length === files.length &&
                (!rangeManager.lastUpdated ||
                  new Date(rangeManager.lastUpdated).getMonth() !==
                    new Date().getMonth() ||
                  new Date(rangeManager.lastUpdated).getDate() !==
                    currDate.getDate())
              ) {
                updateRangeManager();
              }
              if (
                new Date(revisionCompletionObj.currentDate).getDate() ===
                currDate.getDate()
              ) {
                setCompletedRevisionsContainer(revisionCompletionObj);
              }
            }
          });
        })
        .catch(err => console.log('failed to store', err));
      // .finally(() => onPdfSelect(file.path));
    } else {
      // onPdfSelect(file.path);
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
      let updatedRangeManager: RangeManagerType;
      let updatedNextRevisionIndex =
        nextRevisionIndex < revisionFolders.length - 1
          ? nextRevisionIndex + 1
          : 0;
      // Update the last range's end date if the following conditions are met:
      // 1. There is a last updated date.
      // 2. The month of the last update is the same as the current month.
      // 3. The current date is one day after the end date of the last range.
      if (
        rangeManager.lastUpdated &&
        new Date(rangeManager.lastUpdated).getMonth() ===
          new Date().getDate() &&
        new Date().getDate() - new Date(lastRange.endDate).getDate() === 1
      ) {
        let updatedLastRange = {...lastRange, endDate: new Date()};
        let withoutLastRange = ranges.slice(0, ranges.length - 1);
        updatedRangeManager = {
          nextRevisionIndex: updatedNextRevisionIndex,
          lastUpdated: new Date(),
          ranges: [...withoutLastRange, updatedLastRange].slice(-5),
        };
      } else {
        const newRange: Range = {startDate: new Date(), endDate: new Date()};
        updatedRangeManager = {
          nextRevisionIndex: updatedNextRevisionIndex,
          lastUpdated: new Date(),
          ranges: [...ranges, newRange].slice(-5),
        };
      }
      AsyncStorage.setItem(
        'RangeManager',
        JSON.stringify(updatedRangeManager),
      ).then(() => {
        AsyncStorage.getItem('RangeManager').then(res => {
          if (res) {
            let rangeManager: RangeManagerType = JSON.parse(res);
            setRangeManager(rangeManager);
            showToast();
          }
        });
      });
    });
  };
  if (selectedPdf?.name) {
    return (
      <PDFReader
        pdfFilePath={selectedPdf.path}
        onPressBackBtn={() => {
          setSelectedPdf(undefined);
          setTimeout(() => {
            handleupdatingRevisionCompletion(selectedPdf);
          }, 100);
        }}
      />
    );
  }
  return (
    <>
      <View>
        <FlatList
          data={['header', 'calendar', 'revisions']}
          keyExtractor={item => item}
          renderItem={({item}) => {
            switch (item) {
              case 'header':
                return (
                  <HomeScreenHeader
                    onRefresh={() => setRefreshCount(count => count + 1)}
                  />
                );
              case 'calendar':
                return <Calendar ranges={rangeManager.ranges} />;
              case 'revisions':
                return (
                  <Revisions
                    files={files}
                    rangeManager={rangeManager}
                    completedRevisionsContainer={completedRevisionsContainer}
                    onPdfSelect={pdfPath => setSelectedPdf(pdfPath)}
                    todaysRevFolder={todaysRevFolder}
                  />
                );
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

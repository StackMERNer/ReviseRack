import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';

import PDFReader from './PDFReader';
import Calendar from '../components/Calendar';
interface FileObject {
  ctime: Date | undefined;
  isDirectory: () => boolean;
  isFile: () => boolean;
  mtime: Date | undefined;
  name: string | null;
  path: string;
  size: number;
}
const Revisions = () => {
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
  //   const [readFiles,setReadFileType] = useState('')l
  const [activePdf, setActivePdf] = useState('');

  const [filePath, setFilePath] = useState('');
  useEffect(() => {
    if (filePath) {
      //   const readFiles = () => {
      RNFS.readDir(filePath)
        .then(result => {
          setFiles(result);
        })
        .catch(err => {
          console.log(err.message, err.code);
        });
      //   };
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

  return (
    <>
      <View style={styles.calendarContainer}>
        {/* <Text>My Calendar</Text> */}
        <Calendar colors={[]} ranges={dateRanges} />
      </View>
      <View style={styles.revisionsContainer}>
        {revisionFolders.map((revision, index) => (
          <TouchableOpacity
            onPress={() => setFilePath(revision.path)}
            style={styles.revision}
            key={index}>
            <Text>{revision.name}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.revisionList}>
          {files.map((file, index) => (
            <TouchableOpacity
              onPress={() => setActivePdf(file.path)}
              key={index}>
              <Text>{file.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  revisionsContainer: {
    marginTop: 30,
    paddingHorizontal: 10,
  },
  revisionList: {
    borderWidth: 1,
    gap: 10,
    padding: 10,
  },
  revision: {
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
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

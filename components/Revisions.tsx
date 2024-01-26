import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PDFReader from './PDFReader';
import {
  FileObject,
  RangeManagerType,
  RevisionCompletionContainerType,
} from '../navigation/screens/HomeScreen';

import AntDesign from 'react-native-vector-icons/AntDesign';
import {fileColors, greenPrimary, primaryColor} from '../utils/colors';
import EmptyBoxWithInfo from './EmptyBoxWithInfo';

const Revisions = ({
  onPdfSelect,
  todaysRevFolder,
  files,
  completedRevisionsContainer,
  rangeManager,
}: {
  onPdfSelect: (pdfFile: FileObject) => void;
  rangeManager: RangeManagerType;
  todaysRevFolder: FileObject | undefined;
  files: FileObject[];
  completedRevisionsContainer: RevisionCompletionContainerType;
}) => {
  const [selectedPdfPath, setSelectedPdfPath] = useState('');
  const [pendingRevisions, setPendingRevisions] = useState<FileObject[]>([]);
  const [completedRevisions, setCompletedRevisions] = useState<FileObject[]>(
    [],
  );
  useEffect(() => {
    const completed = files.filter(file =>
      completedRevisionsContainer.completedNames.includes(file.name ?? ''),
    );
    const pending = files.filter(
      file =>
        !completedRevisionsContainer.completedNames.includes(file.name ?? ''),
    );
    setCompletedRevisions(completed);
    setPendingRevisions(pending);
  }, [completedRevisionsContainer, files]);
  if (selectedPdfPath) {
    return (
      <PDFReader
        onPressBackBtn={() => setSelectedPdfPath('')}
        pdfFilePath={selectedPdfPath}
      />
    );
  }
  return (
    <View style={styles.mainContainer}>
      {files.length > 0 ? (
        <View style={styles.revisionsContainer}>
          {completedRevisions.length > 0 && (
            <View>
              <Text style={styles.heading}>
                Completed{' '}
                {rangeManager.lastUpdated === new Date().getDate() &&
                  ': ' + todaysRevFolder?.name}
              </Text>

              <FlatList
                data={completedRevisions}
                style={{gap: 15}}
                renderItem={({item, index}) => {
                  return (
                    <View style={styles.revision}>
                      <TouchableOpacity
                        style={styles.pdfNameAndIconContainer}
                        onPress={() => onPdfSelect(item)}>
                        <View style={styles.pdfNameAndImgContainer}>
                          <AntDesign
                            color={fileColors[index % fileColors.length]}
                            name="pdffile1"
                            size={30}
                          />

                          <Text style={styles.pdfName}>
                            {index + 1}. {item.name?.slice(0, -4)}
                          </Text>
                        </View>
                        <View>
                          <AntDesign
                            name="checkcircle"
                            style={{color: greenPrimary}}
                            size={25}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
          )}
          {pendingRevisions.length > 0 && (
            <View>
              <Text style={styles.heading}>
                To Read : {todaysRevFolder?.name}
              </Text>

              <FlatList
                data={pendingRevisions}
                style={{gap: 15}}
                renderItem={({item, index}) => {
                  return (
                    <View style={styles.revision}>
                      <TouchableOpacity
                        style={styles.pdfNameAndIconContainer}
                        onPress={() => onPdfSelect(item)}>
                        <View style={styles.pdfNameAndImgContainer}>
                          <AntDesign
                            color={fileColors[index % fileColors.length]}
                            name="pdffile1"
                            size={30}
                          />

                          <Text style={styles.pdfName}>
                            {index + 1}. {item.name?.slice(0, -4)}
                          </Text>
                        </View>
                        <View>
                          <AntDesign
                            name="rightcircle"
                            style={{color: primaryColor}}
                            size={25}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
          )}
        </View>
      ) : (
        <EmptyBoxWithInfo
          title="You have no PDFs stored yet!"
          description="Go to 'Manage Revisions,' create some folders (e.g., revision 1,
          revision 2), and add PDFs to these folders."
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  revisionsContainer: {
    marginVertical: 15,
    width: '96%',
    backgroundColor: 'white',
    paddingBottom: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    gap: 2,
  },
  heading: {
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  revisionList: {
    borderWidth: 1,
    padding: 10,
  },
  pdfNameAndIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  pdfNameAndImgContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  pdfImg: {
    height: 45,
    objectFit: 'contain',
  },
  pdfName: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  revision: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
    borderWidth: 0.2,
    paddingHorizontal: 14,
    paddingVertical: 20,

    // borderColor:'red'
  },
});

export default Revisions;

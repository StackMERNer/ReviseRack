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
import {greenPrimary, primaryColor} from '../utils/colors';

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
  const [activePdf, setActivePdf] = useState('');
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
  if (activePdf) {
    return (
      <PDFReader
        onPressBackBtn={() => setActivePdf('')}
        pdfFilePath={activePdf}
      />
    );
  }
  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={styles.revisionsContainer}>
        {completedRevisions.length > 0 && (
          <View>
            <View>
              {files.length > 0 && (
                <Text style={styles.heading}>
                  Completed{' '}
                  {rangeManager.lastUpdated === new Date().getDate() &&
                    ': ' + todaysRevFolder?.name}
                </Text>
              )}
            </View>
            <FlatList
              data={completedRevisions}
              renderItem={({item, index}) => {
                return (
                  <View style={[styles.revision, styles.completedRevision]}>
                    <TouchableOpacity
                      style={styles.pdfNameAndIconContainer}
                      onPress={() => onPdfSelect(item)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Image
                          style={{
                            height: 45,
                            objectFit: 'contain',
                          }}
                          source={require('./../assets/images/pdficon.png')}
                        />

                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            textTransform: 'capitalize',
                          }}>
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
        {files.length > 0 && pendingRevisions.length > 0 && (
          <View>
            <View>
              {files.length > 0 && (
                <Text style={styles.heading}>
                  To Read : {todaysRevFolder?.name}
                </Text>
              )}
            </View>
            <FlatList
              data={pendingRevisions}
              renderItem={({item, index}) => {
                return (
                  <View style={[styles.revision, styles.pendingRevision]}>
                    <TouchableOpacity
                      style={styles.pdfNameAndIconContainer}
                      onPress={() => onPdfSelect(item)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Image
                          style={{
                            height: 45,
                            objectFit: 'contain',
                          }}
                          source={require('./../assets/images/pdficon.png')}
                        />

                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            textTransform: 'capitalize',
                          }}>
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
    paddingHorizontal: 5,
    borderRadius: 10,
    gap: 2,
  },
  heading: {
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: 'bold',
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
  revision: {
    paddingRight: 16,
    paddingVertical: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderRadius: 15,
  },
  pendingRevision: {
    backgroundColor: '#FCF2E7',
  },
  completedRevision: {
    backgroundColor: '#BFFEDF',
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

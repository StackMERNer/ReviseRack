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
import {greenPrimary, primaryColor, secondaryColor} from '../utils/colors';

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
                renderItem={({item, index}) => {
                  return (
                    <View style={[styles.revision, styles.completedRevision]}>
                      <TouchableOpacity
                        style={styles.pdfNameAndIconContainer}
                        onPress={() => onPdfSelect(item)}>
                        <View style={styles.pdfNameAndImgContainer}>
                          <Image
                            style={styles.pdfImg}
                            source={require('./../assets/images/pdficon.png')}
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
                renderItem={({item, index}) => {
                  return (
                    <View style={[styles.revision, styles.pendingRevision]}>
                      <TouchableOpacity
                        style={styles.pdfNameAndIconContainer}
                        onPress={() => onPdfSelect(item)}>
                        <View style={styles.pdfNameAndImgContainer}>
                          <Image
                            style={styles.pdfImg}
                            source={require('./../assets/images/pdficon.png')}
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
        <View style={styles.infoContainer}>
          <Image source={require('./../assets/images/empty-box-96.png')} />
          <Text style={styles.infoHeader}>You have no PDFs stored yet!</Text>
          <Text style={styles.infoText}>
            Go to 'Manage Revisions,' enter the 'Revisions' folder, create some
            folders (e.g., revision 1, revision 2), and add PDFs to these
            folders.
          </Text>
        </View>
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
  infoContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: primaryColor,
    marginTop: 30,
    gap: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  infoHeader: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  infoText: {textAlign: 'center', color: 'white'},
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

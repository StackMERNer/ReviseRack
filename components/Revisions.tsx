import React, {useState} from 'react';
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
        {files.filter(file =>
          completedRevisionsContainer.completedNames.includes(file.name ?? ''),
        ).length > 0 && (
          <View>
            <View>
              {files.length > 0 && (
                <Text
                  style={{
                    // textAlign: 'center',
                    paddingVertical: 10,
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                  Completed{' '}
                  {rangeManager.lastUpdated === new Date().getDate() &&
                    ': ' + todaysRevFolder?.name}
                </Text>
              )}
            </View>
            <FlatList
              data={files.filter(file =>
                completedRevisionsContainer.completedNames.includes(
                  file.name ?? '',
                ),
              )}
              renderItem={({item, index}) => {
                return (
                  <View style={[styles.revision, styles.completedRevision]}>
                    <View>
                      <TouchableOpacity onPress={() => onPdfSelect(item)}>
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
                            <Text
                              style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                textTransform: 'capitalize',
                              }}>
                              {index + 1}. {item.name?.slice(0, -4)}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <AntDesign
                        name="checkcircle"
                        style={{color: greenPrimary}}
                        size={25}
                      />
                    </View>
                  </View>
                );
              }}
            />
          </View>
        )}
        {files.length > 0 &&
          files.filter(
            file =>
              !completedRevisionsContainer.completedNames.includes(
                file.name ?? '',
              ),
          ).length > 0 && (
            <View>
              <View>
                {files.length > 0 && (
                  <Text
                    style={{
                      paddingVertical: 10,
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    To Read : {todaysRevFolder?.name}
                  </Text>
                )}
              </View>
              <FlatList
                data={files.filter(
                  file =>
                    !completedRevisionsContainer.completedNames.includes(
                      file.name ?? '',
                    ),
                )}
                // contentContainerStyle={{gap: 2}}
                renderItem={({item, index}) => {
                  return (
                    <View style={[styles.revision, styles.pendingRevision]}>
                      <View>
                        <TouchableOpacity onPress={() => onPdfSelect(item)}>
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
                              <Text
                                style={{
                                  fontSize: 18,
                                  fontWeight: 'bold',
                                  textTransform: 'capitalize',
                                }}>
                                {index + 1}. {item.name?.slice(0, -4)}
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
  revisionList: {
    borderWidth: 1,
    padding: 10,
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

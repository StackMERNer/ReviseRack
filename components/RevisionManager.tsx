import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Modal,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';

import DocumentPicker from 'react-native-document-picker';
import PDFReader from './PDFReader';
interface Folder {
  name: string;
}

function FileManagement() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currPath, setCurrPath] = useState(RNFS.DocumentDirectoryPath);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [folderName, setFolderName] = useState('');

  const getAllFolders = () => {
    RNFS.readDir(currPath)
      .then(result => {
        setFolders(result);
      })
      .catch(err => {
        console.log(err.message, err.code);
      });
  };

  // creating Revisions folder if it's not exist
  useEffect(() => {
    const revisionsFolderPath = `${RNFS.DocumentDirectoryPath}/Revisions`;
    RNFS.exists(revisionsFolderPath)
      .then(exists => {
        if (!exists) {
          return RNFS.mkdir(revisionsFolderPath);
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  }, []);
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Need Storage Permission',
          message: 'this app needs access to your Storage ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      // console.log(granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('You can use the Storage');
        getAllFolders();
      } else {
        console.log(granted);
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    requestStoragePermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currPath]);
  const createFolder = () => {
    RNFS.mkdir(currPath + '/' + folderName)
      .then(() => {
        getAllFolders();
      })
      .catch(err => console.log(err));
  };

  const hanldeDelete = (path: string) => {
    RNFS.unlink(path)
      .then(() => {
        getAllFolders();
      })
      .catch(err => console.log(err));
  };
  const selectPDF = async () => {
    try {
      const selectedFiles = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        allowMultiSelection: true,
      });
      if (selectedFiles.length) {
        selectedFiles.map(selectedFile => {
          copyPDFToAppFolder(selectedFile);
        });
      }
    } catch (error) {
      console.log('selecting error', error);
    }
  };

  const copyPDFToAppFolder = async (selectedFile: {
    fileCopyUri: null | string;
    name: string | null;
    size: number | null;
    type: string | null;
    uri: string;
  }) => {
    try {
      const destinationPath = currPath.endsWith('/')
        ? `currPath${selectedFile.name}`
        : `${currPath}/${selectedFile.name}`;
      await RNFS.copyFile(selectedFile.uri, destinationPath);
      getAllFolders();
    } catch (error) {
      console.log('error occurred', error);
    }
  };

  const [pdfFilePath, setPdfFilePath] = useState('');

  const folderNames = currPath.split('/');
  const isInsideRevisions = folderNames[folderNames.length - 2] === 'Revisions';

  function removeLastFileName(filePath: string) {
    // Find the last occurrence of '/' in the file path
    const lastSlashIndex = filePath.lastIndexOf('/');

    // If a slash is found, remove the last part of the path (file name)
    if (lastSlashIndex !== -1) {
      return filePath.substring(0, lastSlashIndex);
    } else {
      // If no slash is found, return the original path
      return filePath;
    }
  }

  return (
    <View style={styles.container}>
      {!pdfFilePath ? (
        <View style={{width: '100%', height: '100%'}}>
          <View style={styles.backBtnContainer}>
            {currPath === RNFS.DocumentDirectoryPath ? null : (
              <TouchableOpacity
                onPress={() => {
                  setCurrPath(RNFS.DocumentDirectoryPath);
                  setPdfFilePath('');
                }}
                style={styles.backBtn}>
                <Text style={styles.backBtnText}>←</Text>
              </TouchableOpacity>
            )}
          </View>
          {isInsideRevisions && (
            <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor: 'black',
                borderRadius: 10,
                position: 'absolute',
                right: 10,
                bottom: 60,
              }}
              onPress={selectPDF}>
              <Text style={{color: 'white'}}>Add Pdf</Text>
            </TouchableOpacity>
          )}

          <View style={styles.folderContainer}>
            <FlatList
              data={folders}
              numColumns={2}
              //   contentContainerStyle={{columnGap: 5}}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    if (!item.name.includes('.')) {
                      setCurrPath(currPath + '/' + item.name);
                    } else {
                      setPdfFilePath(currPath + '/' + item.name);
                    }
                  }}
                  onLongPress={() => hanldeDelete(item.path)}
                  style={styles.folder}>
                  <View>
                    {item.name?.includes('.') ? (
                      <Image
                        style={styles.folderImage}
                        source={require('./../assets/images/fileIcon.png')}
                      />
                    ) : (
                      <Image
                        style={styles.folderImage}
                        source={require('./../assets/images/folderOpen.png')}
                      />
                    )}
                  </View>

                  <Text>
                    {item.name.length > 20
                      ? item.name.substring(0, 20) + '..'
                      : item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
          {!isInsideRevisions && (
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.addButton}>
              <Text style={styles.plusTest}>+</Text>
            </TouchableOpacity>
          )}
          <Modal
            onRequestClose={() => setModalVisible(false)}
            transparent={true}
            visible={modalVisible}>
            <View style={styles.modal}>
              <View style={styles.modalView}>
                <TextInput
                  onChangeText={text => setFolderName(text)}
                  placeholder="Enter Folder Name"
                  style={styles.textInput}
                />
                <TouchableOpacity
                  onPress={() => {
                    createFolder();
                    setModalVisible(false);
                  }}
                  style={styles.createFolderButton}>
                  <Text style={styles.createFolderButtonText}>
                    Create Folder
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    // createFolder();
                    setModalVisible(false);
                  }}
                  style={styles.createFolderButton}>
                  <Text style={styles.createFolderButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <PDFReader
          onPressBackBtn={currentPath =>
            // setCurrPath(removeLastFileName(currentPath))
            setPdfFilePath('')
          }
          pdfFilePath={pdfFilePath}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 40,
  },

  addButton: {
    height: 50,
    width: 50,
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: 'black',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusTest: {
    color: '#fff',
    fontSize: 30,
  },
  backBntText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  modal: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#fff',
    // height: 200,
    paddingVertical: 30,
    width: '80%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '90%',
    borderRadius: 5,
  },
  createFolderButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
  },
  createFolderButton: {
    backgroundColor: 'black',
    // height: ,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    width: '90%',
    marginTop: 30,
    alignContent: 'center',
  },
  folders: {
    flexDirection: 'row',
    flexShrink: 4,
  },
  folderContainer: {
    marginTop: 20,
  },
  folder: {
    // height: 40,
    width: '45%',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // padding: 10,
  },
  folderImage: {transform: [{scale: 0.6}]},
  backBtnContainer: {
    flexDirection: 'row', // Arrange children horizontally
    alignItems: 'center', // Align children vertically at the center
    // paddingTop: 60,
  },
  backBtn: {
    flex: 1, // Takes 1 part of the available space
    // marginTop: 10,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  pathContainer: {
    flex: 10, // Takes 4 parts of the available space
    backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 5,
  },
  pathText: {
    fontSize: 16,
    color: 'black',
  },
});

export default FileManagement;

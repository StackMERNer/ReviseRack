import React, {useEffect, useState} from 'react';
import {
  Alert,
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import {primaryColor} from '../utils/colors';
import MIcon from 'react-native-vector-icons/MaterialIcons';

interface FileObject {
  ctime: Date | null;
  isDirectory: () => boolean;
  isFile: () => boolean;
  mtime: Date | null;
  name: string;
  path: string;
  size: number;
}

function RevisionManager() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currPath, setCurrPath] = useState(RNFS.DocumentDirectoryPath);
  const [folders, setFolders] = useState<FileObject[]>([]);
  const [folderName, setFolderName] = useState('');
  const [itemToModify, setItemToModify] = useState<FileObject | undefined>(
    undefined,
  );
  const [newFolderName, setNewFolderName] = useState('');
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

  // delete unnecessary files and folders except 'Revisions'
  useEffect(() => {
    RNFS.readDir(RNFS.DocumentDirectoryPath).then(res => {
      res
        .filter(file => file.name !== 'Revisions')
        .forEach(file => {
          RNFS.unlink(file.path);
        });
    });
  }, []);
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Need Storage Permission',
          message: 'This app needs access to your Storage ',
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
        // console.log(granted);
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
  const pickPDF = async () => {
    try {
      const selectedFiles = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        allowMultiSelection: true,
      });
      if (selectedFiles.length) {
        selectedFiles.map(selectedFile => {
          copyPDFToAnotherFolder(selectedFile);
        });
      }
    } catch (error) {
      console.log('selecting error', error);
    }
  };

  const copyPDFToAnotherFolder = async (selectedFile: {
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
  // console.log('folders', folders);
  // console.log(isInsideRevisions);

  return (
    <View style={styles.container}>
      {!pdfFilePath ? (
        <View style={{width: '100%', height: '100%'}}>
          <View style={styles.backBtnContainer}>
            {currPath === RNFS.DocumentDirectoryPath ? null : (
              <TouchableOpacity
                onPress={() => {
                  setCurrPath(removeLastFileName(currPath));
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
              onPress={pickPDF}>
              <Text style={{color: 'white'}}>+ Add Pdf</Text>
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
                  // onLongPress={() => hanldeDelete(item.path)}
                  onLongPress={() => setItemToModify(item)}
                  style={styles.folder}>
                  <View>
                    {item.name?.includes('.') ? (
                      <AntDesign
                        color={primaryColor}
                        name="pdffile1"
                        size={40}
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
              style={styles.addFolderBtn}>
              <Text style={styles.addFolderBtnText}> + Add Folder</Text>
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

          <Modal
            onRequestClose={() => setModalVisible(false)}
            transparent={true}
            visible={itemToModify?.name ? true : false}>
            <View style={styles.modal}>
              <View style={styles.modalView}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingHorizontal: 20,
                    paddingBottom: 10,
                    alignItems: 'center',
                  }}>
                  <Text>{itemToModify?.name}</Text>
                  <TouchableOpacity onPress={() => setItemToModify(undefined)}>
                    <MIcon name="cancel" size={30} />
                  </TouchableOpacity>
                </View>

                <TextInput
                  onChangeText={text => setNewFolderName(text)}
                  placeholder="Enter New Name"
                  style={styles.textInput}
                />

                <TouchableOpacity
                  onPress={() => {
                    if (newFolderName.trim() !== '') {
                      let newPath;
                      if (itemToModify?.isDirectory()) {
                        newPath = (itemToModify as FileObject)?.path.replace(
                          itemToModify?.name || '',
                          newFolderName,
                        );
                        console.log('object', newPath);
                      } else if (itemToModify?.isFile) {
                        newPath =
                          (itemToModify as FileObject)?.path.replace(
                            itemToModify?.name || '',
                            newFolderName,
                          ) + '.pdf';
                        console.log('obafadfadfject', newPath);
                      }

                      if (newPath) {
                        RNFS.moveFile(
                          (itemToModify as FileObject)?.path,
                          newPath,
                        )
                          .then(() => {
                            setItemToModify(undefined);
                            setNewFolderName('');
                            getAllFolders();
                            setModalVisible(false);
                          })
                          .catch(error => {
                            console.log('Error renaming folder:', error);
                            setModalVisible(false);
                          });
                      }
                    } else {
                      Alert.alert('Error', 'Please enter a valid folder name.');
                    }
                  }}
                  style={styles.createFolderButton}>
                  <Text style={styles.createFolderButtonText}>
                    Rename This Folder
                  </Text>
                </TouchableOpacity>

                <Text style={{paddingTop: 20}}>Or</Text>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Confirmation',
                      'Are you sure you want to proceed?',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'Yes',
                          onPress: () => {
                            hanldeDelete((itemToModify as FileObject).path);
                            setItemToModify(undefined);
                          },
                        },
                      ],
                      {cancelable: false},
                    );
                  }}
                  style={styles.deleteFolderButton}>
                  <Text style={styles.createFolderButtonText}>
                    Delete This Folder
                  </Text>
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

  addFolderBtn: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: 'black',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFolderBtnText: {
    color: '#fff',
    fontSize: 15,
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
  deleteFolderButton: {
    backgroundColor: 'red',
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
    flex: 1,
    backgroundColor: 'black',
    padding: 4,
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 30,
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

export default RevisionManager;

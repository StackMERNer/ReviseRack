import React, {useEffect, useState} from 'react';
import {
  Alert,
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

import MIcon from 'react-native-vector-icons/MaterialIcons';
import EmptyBoxWithInfo from '../../components/EmptyBoxWithInfo';
import Folders from '../../components/Folders';
import PdfFiles from '../../components/PdfFiles';
import PDFReader from '../../components/PDFReader';
import {FileObject} from './HomeScreen';

function ManageRevisionsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currPath, setCurrPath] = useState(
    RNFS.DocumentDirectoryPath + '/Revisions',
  );

  const [files, setFiles] = useState<FileObject[]>([]);
  const [folderName, setFolderName] = useState('');
  const [itemToModify, setItemToModify] = useState<FileObject | undefined>(
    undefined,
  );
  const [newFolderName, setNewFolderName] = useState('');
  const getAllFiles = async () => {
    try {
      const result = await Promise.all(
        (
          await RNFS.readDir(currPath)
        ).map(async item => {
          if (item.isDirectory()) {
            const numberOfFiles = await getNumberOfFiles(item.path);
            return {
              ...item,
              numberOfFiles,
            };
          }
          return item;
        }),
      );
      setFiles(result as FileObject[]);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  // create Revisions folder if it's not exist
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

  // delete unnecessary files and files except 'Revisions'
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
          message: 'This app needs access to your Storage for managing PDFs',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getAllFiles();
      } else {
        Alert.alert(
          'Storage permission denied',
          'Your device is denying permission to access storage for managing files. Clear the app data and try again.',
        );
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
        getAllFiles();
      })
      .catch(err => console.log(err));
  };

  const hanldeDelete = (path: string) => {
    RNFS.unlink(path)
      .then(() => {
        getAllFiles();
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
      getAllFiles();
    } catch (error) {
      console.log('error occurred', error);
    }
  };

  const [pdfFilePath, setPdfFilePath] = useState('');

  const folderNames = currPath.split('/');
  const isInsideRevisionsFolder =
    folderNames[folderNames.length - 1] === 'Revisions';

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

  const getNumberOfFiles = async (directoryPath: string): Promise<number> => {
    try {
      const res = await RNFS.readDir(directoryPath);
      return res.length;
    } catch (err) {
      return 0;
    }
  };

  return (
    <View style={styles.container}>
      {!pdfFilePath ? (
        <View style={{width: '100%', height: '100%'}}>
          <View style={styles.backBtnContainer}>
            {currPath === RNFS.DocumentDirectoryPath + '/Revisions' ? null : (
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
          <View
            style={{
              paddingHorizontal: 10,
            }}>
            {/* display info message suggesting user to create some folders if user inside 'Revisions' folder and it's empty */}
            {isInsideRevisionsFolder && !(files.length > 0) && (
              <EmptyBoxWithInfo
                title="No Folders Found"
                description="Add Some Folders Here (e.g., revision 1,
                  revision 2)."
              />
            )}
            {/* display info message suggesting user to add some pdfs if user inside 'Revisions/AnyFolder' folder and it's empty */}
            {!isInsideRevisionsFolder &&
              currPath.includes('/Revisions/') &&
              !(files.length > 0) && (
                <EmptyBoxWithInfo
                  title="No PDFs Found"
                  description="Add Some PDFs Here"
                />
              )}
          </View>
          {!isInsideRevisionsFolder && (
            <TouchableOpacity
              style={{
                padding: 10,
                borderWidth: 1,
                borderRadius: 10,
                position: 'absolute',
                right: 10,
                bottom: 60,
              }}
              onPress={pickPDF}>
              <Text>+ Add Pdf</Text>
            </TouchableOpacity>
          )}

          {isInsideRevisionsFolder ? (
            <Folders
              onPress={file => {
                if (file.isDirectory()) {
                  setCurrPath(currPath + '/' + file.name);
                } else {
                  setPdfFilePath(currPath + '/' + file.name);
                }
              }}
              onLongPress={file => setItemToModify(file)}
              files={files}
            />
          ) : (
            <PdfFiles
              onPress={file => {
                if (file.isDirectory()) {
                  setCurrPath(currPath + '/' + file.name);
                } else {
                  setPdfFilePath(currPath + '/' + file.name);
                }
              }}
              onLongPress={file => setItemToModify(file)}
              files={files}
            />
          )}

          {isInsideRevisionsFolder && (
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
                    setModalVisible(false);
                  }}
                  style={styles.createFolderButton}>
                  <Text style={styles.createFolderButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal transparent={true} visible={itemToModify?.name ? true : false}>
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
                  defaultValue={
                    itemToModify?.isFile()
                      ? itemToModify?.name?.slice(0, -4)
                      : itemToModify?.name
                  }
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
                      } else if (itemToModify?.isFile) {
                        newPath =
                          (itemToModify as FileObject)?.path.replace(
                            itemToModify?.name || '',
                            newFolderName,
                          ) + '.pdf';
                      }

                      if (newPath) {
                        RNFS.moveFile(
                          (itemToModify as FileObject)?.path,
                          newPath,
                        )
                          .then(() => {
                            setItemToModify(undefined);
                            setNewFolderName('');
                            getAllFiles();
                          })
                          .catch(error => {
                            setItemToModify(undefined);
                          });
                      }
                    } else {
                      Alert.alert('Error', 'Please enter a valid file name.');
                    }
                  }}
                  style={styles.createFolderButton}>
                  <Text style={styles.createFolderButtonText}>
                    Rename This file
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
                    Delete This file
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <PDFReader
          onPressBackBtn={currentPath => setPdfFilePath('')}
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
  },

  addFolderBtn: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    // backgroundColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFolderBtnText: {
    fontSize: 15,
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
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    width: '90%',
    marginTop: 30,
    alignContent: 'center',
  },
  deleteFolderButton: {
    backgroundColor: 'brown',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    width: '90%',
    marginTop: 30,
    alignContent: 'center',
  },
  files: {
    flexDirection: 'row',
  },
  filesContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  file: {
    borderRadius: 10,
    gap: 4,
    margin: 5,
    flexGrow: 1,
    borderWidth: 0.2,
    padding: 14,
  },
  fileName: {
    fontSize: 16,
    textTransform: 'capitalize',
    color: '#23395F',
  },
  backBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    flex: 1,
    borderBottomWidth: 0.2,
    padding: 4,
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  pathContainer: {
    flex: 10,
    backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 5,
  },
  pathText: {
    fontSize: 16,
    color: 'black',
  },
});

export default ManageRevisionsScreen;

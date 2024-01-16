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

interface Folder {
  name: string;
}

function FileManagement() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currPath, setCurrPath] = useState(RNFS.DocumentDirectoryPath);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [folderName, setFolderName] = useState('');
  const getAllFolders = () => {
    RNFS.readDir(currPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then(result => {
        // console.log('GOT RESULT', result);
        setFolders(result);

        // stat the first file
        // return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      })
      .catch(err => {
        console.log(err.message, err.code);
      });
  };
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Cool Photo App Storage Permission',
          message:
            'Cool Photo App needs access to your Storage ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log(granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('You can use the Storage');
        getAllFolders();
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    requestStoragePermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const createFolder = () => {
    RNFS.mkdir(currPath + '/' + folderName)
      .then(() => {
        getAllFolders();
      })
      .catch(err => console.log(err));
  };
  // console.log(folderName);
  return (
    <View style={styles.container}>
      <View style={styles.backBtnContainer}>
        <TouchableOpacity
          // onPress={() => setModalVisible(true)}
          style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>

        <View style={styles.pathContainer}>
          <Text style={styles.pathText}>{currPath}</Text>
        </View>
      </View>
      <View style={styles.folderContainer}>
        <FlatList
          data={folders}
          numColumns={2}
          //   contentContainerStyle={{columnGap: 5}}
          renderItem={({item, index}) => (
            <TouchableOpacity style={styles.folder}>
              {/* <Icon name="stepforward" size={50} color="black" /> */}

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

              <Text>{item.name.substring(0, 8) + '..'}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addButton}>
        <Text style={styles.plusTest}>+</Text>
      </TouchableOpacity>
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
              <Text style={styles.createFolderButtonText}>Create Folder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderBlockColor: 'red',
    // borderWidth: 2,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
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
  // backBtn: {
  //   // height: 50,
  //   // width: 50,
  //   position: 'absolute',
  //   top: 10,
  //   left: 2,
  //   backgroundColor: 'gray',
  //   // borderRadius: 10,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  backBntText: {
    // color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  modal: {
    position: 'absolute',
    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0,
    // height: 100,
    // width: 100,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#fff',
    height: 200,
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
    fontSize: 25,
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
    padding: 10,
  },
  folderImage: {transform: 'scale(.6)'},
  backBtnContainer: {
    flexDirection: 'row', // Arrange children horizontally
    alignItems: 'center', // Align children vertically at the center
    padding: 10, // Add padding for better appearance
  },
  backBtn: {
    flex: 1, // Takes 1 part of the available space
    marginRight: 10, // Add some margin between the button and text
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

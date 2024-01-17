import React, {useState} from 'react';
import {
  Button,
  FlatList,
  Image,
  Modal,
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
const DisplayFolders = ({folders,}: {folders: Folder[]}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [folderName, setFolderName] = useState('');
  const createFolder = () => {
    RNFS.mkdir(currPath + '/' + folderName)
      .then(() => {
        // getAllFolders(); 
      })
      .catch(err => console.log(err));
  };
  return (
    <View>
      {/* <View>
        <Button title="Copy PDF" onPress={selectPDF} />
      </View> */}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  folderImage: {transform: [{scale: 0.6}]},
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

export default DisplayFolders;

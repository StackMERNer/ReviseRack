import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {fileColors} from '../utils/colors';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { FileObject } from '../navigation/screens/HomeScreen';

const Folders = ({
  onLongPress,
  onPress,
  files: folders,
}: {
  files: FileObject[];
  onLongPress: (file: FileObject) => void;
  onPress: (file: FileObject) => void;
}) => {
  return (
    <View style={styles.filesContainer}>
      <FlatList
        data={folders}
        numColumns={3}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() => onPress(item)}
            onLongPress={() => onLongPress(item)}
            style={styles.file}>
            <View>
              {item.isFile() ? (
                <AntDesign
                  color={fileColors[index % fileColors.length]}
                  name="pdffile1"
                  size={30}
                />
              ) : (
                <MCIcon
                  name="folder-open"
                  color={fileColors[index % fileColors.length]}
                  size={30}
                />
              )}
            </View>

            <Text style={styles.fileName}>
              {item.name.length > 40
                ? item.name.substring(0, 40) + '..'
                : item.name}
            </Text>
            {item.isDirectory() && (
              <Text>
                {item.numberOfFiles !== undefined
                  ? `${item.numberOfFiles} files`
                  : ''}
              </Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filesContainer: {
    marginTop: 20,
    paddingHorizontal: 4,
    width: '100%',
  },
  file: {
    borderRadius: 10,
    gap: 4,
    margin: 3,
    flexGrow: 1,
    borderWidth: 0.2,
    padding: 14,
  },
  fileName: {
    fontSize: 16,
    textTransform: 'capitalize',
    color: '#23395F',
  },
});
export default Folders;

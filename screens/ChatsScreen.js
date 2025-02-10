import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useState } from 'react';
import {Camera, User, ChevronDown} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../AuthContext';

const ChatsScreen = () => {
  const [options, setOptions] = useState(['Chats']);
  const [chats, setChats] = useState([]);
  const [requests, setRequests] = useState([]);
  const {token, setToken, setUserId, userId} = useContext(AuthContext);
  const chooseOption = option => {
    if (options.includes(option)) {
      setOptions(options.filter(c => c !== option));
    } else {
      setOptions([...options, option]);
    }
  };
  const navigation = useNavigation();
  const logout = () => {
    clearAuthToken();
  };
  const clearAuthToken = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setToken('');
      navigation.replace('Login');
    } catch (error) {
      console.log('Error', error);
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {/* Header Section */}
      <View style={styles.header}>
        <Pressable onPress={logout}>
          <Image
            style={styles.profileImage}
            source={{
              uri: 'https://lh3.googleusercontent.com/ogw/AF2bZyi09EC0vkA0pKVqrtBq0Y-SLxZc0ynGmNrVKjvV66i3Yg=s64-c-mo',
            }}
          />
        </Pressable>

        <Text style={styles.headerText}>Chats</Text>

        <View style={styles.iconContainer}>
          <TouchableOpacity>
            <Camera color="black" size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('People')}>
            <User color="black" size={30} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chats Section */}
      <View style={styles.optionContainer}>
        <Pressable onPress={() => chooseOption('Chats')} style={styles.option}>
          <Text style={styles.optionText}>Chats</Text>
          <ChevronDown color="black" size={20} />
        </Pressable>

        <Pressable style={styles.option}>
          <Text style={styles.optionText}>Requests</Text>
          <ChevronDown color="black" size={20} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
  header: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  optionContainer: {
    padding: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    // Removed the borderBottom styling here
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

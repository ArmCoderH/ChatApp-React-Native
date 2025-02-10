import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Camera, User, ChevronDown, Trash} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../AuthContext';
import jwtDecode from 'jwt-decode'; // Corrected import
import axios from 'axios';
import Chat from '../components/Chat';

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

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const decodedToken = jwtDecode(token);
      setToken(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      getRequests();
    }
  }, [userId]);
  useEffect(() => {
    if (userId) {
      getUser();
    }
  }, [userId]);

  const getRequests = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.52:4000/getrequests/${userId}`,
      );
      console.log('Fetched requests:', response.data); // Add logging here
      setRequests(response.data);
    } catch (error) {
      console.log('Error fetching requests:', error);
    }
  };

  const acceptRequest = async requestId => {
    try {
      const response = await axios.post('http://192.168.0.52:4000/acceptrequest', {
        userId: userId,
        requestId: requestId,
      });

      if (response.status == 200) {
        await getRequests();
      }
    } catch (error) {
      console.log('error', error);
    }
  };

const getUser = async () => {
  try {
    const response = await axios.get(`http://192.168.0.52:4000/users/${userId}`)
    setChats(response.data)
    
  } catch (error) {
    console.log("Error is=",error)
    throw error;
  }
}

  return (
    <ScrollView>
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
          <Pressable
            onPress={() => chooseOption('Chats')}
            style={styles.option}>
            <Text style={styles.optionText}>Chats</Text>
            <ChevronDown color="black" size={20} />
          </Pressable>

          <View>
          {options?.includes('Chats') &&
            (chats?.length > 0 ? (
              <View>
                {chats?.map((item, index) => (
                  <Chat item={item} key={item?._id} />
                ))}
              </View>
            ) : (
              <View
                style={{
                  height: 300,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View>
                  <Text style={{textAlign: 'center', color: 'gray'}}>
                    No Chats yet
                  </Text>
                  <Text style={{marginTop: 4, color: 'gray'}}>
                    Get started by nessaging a friend
                  </Text>
                </View>
              </View>
            ))}
        </View>
          <Pressable
            onPress={() => chooseOption('Requests')}
            style={styles.option}>
            <Text style={styles.optionText}>Requests</Text>
            <ChevronDown color="black" size={20} />
          </Pressable>

          <View>
            {options.includes('Requests') && (
              <View>
                <Text>Checkout all the requests</Text>
                {requests.length > 0 ? (
                  requests.map((item, index) => (
                    <View key={index} style={styles.requestItem}>
                      <Pressable>
                        <Image
                          source={{uri: item?.from?.image}}
                          style={styles.requestImage}
                        />
                      </Pressable>
                      <View style={styles.requestInfo}>
                        <Text>{item?.from?.name}</Text>
                        <Text>{item?.message}</Text>
                      </View>

                      <TouchableOpacity
                      onPress={() => acceptRequest(item?.from?._id)}
                        style={{ 
                          padding: 8,
                          marginRight: 10,
                          backgroundColor: '#005187',
                          width: 75,
                          borderRadius: 10,
                        }}>
                        <Text
                          style={{
                            frontSize: 13,
                            textAlign: 'center',
                            color: 'white',
                          }}>
                          Accept
                        </Text>
                      </TouchableOpacity>

                      <View>
                        <Trash color="red" size={30} />
                      </View>
                    </View>
                  ))
                ) : (
                  <Text>No requests found</Text>
                )}
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
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
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  requestImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  requestInfo: {
    marginLeft: 10,
    flex: 1,
  },
  requestName: {
    fontSize: 16,
    fontWeight: '500',
  },
  requestEmail: {
    fontSize: 14,
    color: 'gray',
  },
});

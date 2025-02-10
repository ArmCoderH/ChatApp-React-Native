import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, { useContext, useLayoutEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MessageCircle, Smile, Camera, Mic, ArrowLeft } from 'lucide-react-native'; // Corrected import
import { AuthContext } from '../AuthContext';
import axios from 'axios';

const RequestChatRoom = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const route = useRoute();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ArrowLeft size={24} color="red" /> {/* Corrected component */}
          <View style={{ marginLeft: 10 }}>
            <Text>{route?.params?.name}</Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, route]);

  const sendMessage = async() => {
    try {
      const userData = {
        senderId:userId,
        receiverId:route?.params?.receiverId, 
        message:message,
      };

      const response = await axios.post('http://192.168.0.52:4000/sendrequest',userData)
      if (response.status === 200) {
        setMessage("")
        Alert.alert('Friend Request Sent', 'A friend request has been sent to the user.');
      }
    } catch (error) {
      console.log("Erro is",error)
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white', marginBottom:10 }} behavior="padding">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
        <View style={{ padding: 10 }}>
          {/* Add your chat messages here */}
        </View>
        <View
          style={{
            backgroundColor: 'white',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: '#dddddd',
          }}
        >
          <TouchableOpacity>
            <Smile color="black" size={24} />
          </TouchableOpacity>

          <TextInput
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage} // Added onChangeText handler
            style={{
              flex: 1,
              height: 40,
              borderWidth: 1,
              borderColor: '#dddddd',
              borderRadius: 20,
              paddingHorizontal: 10,
              marginLeft: 10,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 8,
            }}
          >
            <TouchableOpacity>
              <Camera color="black" size={24} />
            </TouchableOpacity>

            <TouchableOpacity>
              <Mic color="black" size={24} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={sendMessage} // Added onPress handler
            style={{
              backgroundColor: '#0066b2',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Text style={{ textAlign: 'center', color: 'white' }}>Send</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RequestChatRoom;

const styles = StyleSheet.create({});
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../AuthContext';
import { MessageCircle, Smile, Camera, Mic, ArrowLeft } from 'lucide-react-native'; // Corrected import
import axios from 'axios';
// import { Socket } from 'socket.io-client';
import { useSocketContext } from '../SocketContext';

const ChatRoom = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const {token,userId,setToken,setUserId} = useContext(AuthContext)
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const {socket} = useSocketContext()

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


const listeMessages = () => {
  const {socket} = useSocketContext()

  useEffect(() => {
    socket?.on('newMessage',newMessage => {
      newMessage.shouldShake = true;
      setMessages([...messages,newMessage])
    });

    return () => socket?.off('newMessage')
  },[socket,messages,setMessages])
}

listeMessages();
  const sendMessage = async(senderId,receiverId) => {
    try {
      await axios.post('http://192.168.0.52:4000/sendMessage',{
        senderId:senderId,
        receiverId:receiverId, 
        message:message,
      })

      socket.emit('sendMessage', {senderId, receiverId, message});

      setMessage('')

      setTimeout(()=>{
        fetchMessages()
      },100)
    } catch (error) {
      console.log("error is",error)
    }
  }


  const fetchMessages = async () => {
    try {
      const senderId = userId;
      const receiverId = route?.params?.receiverId;

      const response = await axios.get('http://192.168.0.52:4000/messages',{
        params: {senderId, receiverId},
      })

      setMessages(response.data)
    } catch (error) {
      console.log("error is",error)
    }
  }

  useEffect(() => {
    fetchMessages()
  },[])

  console.log("message",messages)

  const formatTime = time => {
    const options = {hour: 'numeric', minute: 'numeric'};
    return new Date(time).toLocaleString('en-US',options)
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white', marginBottom:10 }}>
          <ScrollView>
            {messages?.map((item,index) => {
              return(
                <Pressable style={[
                  item?.senderId?._id === userId ? {
                    alignSelf:'flex-end',
                    backgroundColor:"#A0C878",
                    padding:8,
                    maxWidth:"60%",
                    borderRadius:7,
                    margin:10,
                    marginRight:20
                  }:{
                    alignSelf:'flex-start',
                    backgroundColor:"#F9CB43",
                    padding:8,
                    maxWidth:"60%",
                    borderRadius:7,
                    margin:10,
                    marginLeft:20
                  }
                ]}>
                  <Text style={{fontSize:14,textAlign:'left'}}>{item.message}</Text>
                  <Text style={{textAlign:'right',fontSize:9,color:'grey',marginTop:4}}>{formatTime(item?.timeStamp)}</Text>
                </Pressable>
              )
            })}
          </ScrollView>
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
                onPress={() => sendMessage(userId,route?.params?.receiverId)} // Added onPress handler
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
        </KeyboardAvoidingView>
  )
}

export default ChatRoom

const styles = StyleSheet.create({})
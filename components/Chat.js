import {Pressable, StyleSheet, Text, View, Image} from 'react-native';
import React, {useContext, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../AuthContext';

const Chat = ({item}) => {
  const navigation = useNavigation();
  const {userId} = useContext(AuthContext);
  const [message, setMessage] = useState([]);
  console.log('Chat item data:', item);
  return (
    <Pressable
      style={{marginVertical: 15}}
      onPress={() =>
        navigation.navigate('ChatRoom', {
          name: item?.name,
          receiverId: item?._id,
          image: item?.image,
        })
      }>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <Pressable>
          <Image
            source={{uri: item?.image}}
            style={{width: 40, height: 40, borderRadius: 20}}
          />
        </Pressable>
        <View>
          <Text style={{fontSize: 15, fontWeight: '500'}}>{item?.name}</Text>
          <Text style={{marginTop: 4, color: 'grey'}}>
            chat with {item?.name}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default Chat;

const styles = StyleSheet.create({});

import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const User = ({ item }) => {
  const navigation = useNavigation();
  return (
    <View style={{ padding: 20, marginTop: 15 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pressable>
          <Image
            source={{ uri: item?.image }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </Pressable>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.name}>{item?.name}</Text>
          <Text style={styles.email}>{item?.email}</Text>
        </View>

        <Pressable
          style={{
            padding: 10,
            width: 80,
            backgroundColor: '#005187',
            borderRadius: 5,
          }}
          onPress={() =>
            navigation.navigate('Request', {
              name: item?.name,
              receiverId: item?._id,
            })
          }
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Chat</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  email: {
    fontSize: 14,
    color: 'gray',
  },
});

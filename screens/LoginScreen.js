import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { token, setToken } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      navigation.replace('MainStack', { screen: 'Main' });
    }
  }, [token, navigation]);

  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };
  
    axios
      .post('http://192.168.0.52:4000/login', user)
      .then(response => {
        const token = response.data.token;
        AsyncStorage.setItem('authToken', token);
        setToken(token);
        Alert.alert('Login Successful', 'You have successfully logged in.');
      })
      .catch(error => {
        if (error.response) {
          // The request was made, but the server responded with an error
          console.error('Response error:', error.response);
          Alert.alert('Login Failed', 'Invalid email or password.');
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Request error:', error.request);
          Alert.alert('Network Error', 'Please check your network connection.');
        } else {
          // Something happened while setting up the request
          console.error('Error:', error.message);
          Alert.alert('Error', 'Something went wrong.');
        }
      });
  };
  
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ padding: 20, alignItems: 'center' }}>
        <KeyboardAvoidingView>
          <View
            style={{
              marginTop: 80,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ fontSize: 20, fontWeight: '500' }}>
              Login to your account
            </Text>
          </View>
          <View style={{ marginTop: 50 }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '600', color: 'gray' }}>
                Email
              </Text>
              <View>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#BEBEBE"
                  style={styles.inputBox}
                  placeholder="Enter your email"
                />
              </View>
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: 'gray',
                marginTop: 25,
              }}>
              Password
            </Text>
            <View>
              <TextInput
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#BEBEBE"
                style={{
                  width: 340,
                  marginTop: 15,
                  borderBottomColor: '#BEBEBE',
                  borderBottomWidth: 1,
                  paddingBottom: 10,
                  fontFamily: 'GeezaPro-Bold',
                  fontSize: email ? 15 : 15,
                }}
                placeholder="Enter your password"
              />
            </View>
            <TouchableOpacity
              onPress={handleLogin}
              style={{
                width: 200,
                backgroundColor: '#4A55A2',
                padding: 15,
                marginTop: 50,
                marginLeft: 'auto',
                marginRight: 'auto',
                borderRadius: 6,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                Login
              </Text>
            </TouchableOpacity>

            <Pressable>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'gray',
                  fontSize: 16,
                  margin: 20,
                }}>
                Don't have an account?{' '}
                <Text
                  style={{ color: 'red' }}
                  onPress={() => navigation.navigate('Register')}>
                  Sign Up
                </Text>
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              marginTop: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{ width: 140, height: 170 }}
              source={{
                uri: 'https://signal.org/assets/images/features/Media.png',
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  inputBox: {
    width: 320,
    marginTop: 15,
    borderBottomColor: '#BEBEBE',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    fontFamily: 'Helvetica',
    fontSize: 16,
  },
});
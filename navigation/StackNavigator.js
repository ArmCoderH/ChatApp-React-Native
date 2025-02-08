import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import MaterialIcons from '@react-native-vector-icons/material-icons';
// import Ionicons from '@react-native-vector-icons/ionicons';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PeopleScreen from '../screens/PeopleScreen';
import { NavigationContainer } from '@react-navigation/native';
import ChatsScreen from '../screens/ChatsScreen';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Chats"
          component={ChatsScreen}
          options={{
            tabBarStyle: {backgroundColor: '#101010'},
            headerShown: false,
            // tabBarIcon: ({focused}) =>
            //   focused ? (
            //     <Ionicons name="house" color="#ff0000" size={20} />
            //   ) : (
            //     <Ionicons name="house" color="#ff0000" size={20} />
            //   ),
          }}>

          </Tab.Screen>
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarStyle: {backgroundColor: '#101010'},
            headerShown: false,
            // tabBarIcon: ({focused}) =>
            //   focused ? (
            //   <Ionicons name="house" color="#ff0000" size={20} />
            //   ) : (
            //   <Ionicons name="house" color="#ff0000" size={20} />
            //   ),
          }}></Tab.Screen>
      </Tab.Navigator>
    );
  }

  const AuthStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown : false}}/>
            <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown : false}}/>
        </Stack.Navigator>
    )
  }

  const MainStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="BottomTabs" component={BottomTabs} options={{headerShown : false}}/>
            <Stack.Screen name="People" component={PeopleScreen} options={{headerShown : false}}/>
        </Stack.Navigator>
    )
  }
  return (
    <NavigationContainer>
        <AuthStack/>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});

import {StyleSheet, Text, View} from 'react-native';
import React, { useContext } from 'react';
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
import { AuthContext } from '../AuthContext';
import { Camera , User, MessageCircle} from 'lucide-react-native';
import RequestChatRoom from '../screens/RequestChatRoom';



const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const {token,setToken} = useContext(AuthContext);

  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Chats"
          component={ChatsScreen}
          options={{
            tabBarStyle: {backgroundColor: '#101010'},
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <MessageCircle color="white" size={30} />
                
              ) : (
                <MessageCircle color="white" size={30} />
                
              ),
          }}>

          </Tab.Screen>
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarStyle: {backgroundColor: '#101010'},
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
              <User color="white" size={30} />
                
              ) : (
              <User color="white" size={30} />
              ),
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
            <Stack.Screen name="Request" component={RequestChatRoom}/>
        </Stack.Navigator>
    )
  }
  return (
    <NavigationContainer>
        {token === null || token === '' ? <AuthStack /> : <MainStack />}
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});

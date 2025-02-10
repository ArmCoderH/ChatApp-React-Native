import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { AuthContext } from '../AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import User from '../components/User';

const PeopleScreen = () => {
  const { userId, token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('🔍 Current userId in PeopleScreen:', userId);
  console.log('🔍 Current token in PeopleScreen:', token);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userId) {
        console.error('❌ No userId found in AuthContext');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://192.168.0.52:4000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (response.ok) {
          console.log('✅ Users fetched:', data);
          setUsers(data);
        } else {
          console.error('❌ Error fetching users:', data.message);
        }
      } catch (error) {
        console.error('❌ Network error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userId, token]);

  if (loading) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" color="#005187" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <View>
        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '500', marginTop: 10 }}>
          People using Signal
        </Text>
        {users.length > 0 ? (
          <FlatList
            data={users}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <User item={item} />}
          />
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
            No users found
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PeopleScreen;

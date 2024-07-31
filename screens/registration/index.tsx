import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'components/ui/Button';
import Input from 'components/ui/Input';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserAvatarCreator from 'screens/user-avatar-creator/UserAvatarCreator';

import { checkIfemailExists } from './features';
import { getItem, setItem } from 'utils/storage';
import { handleSignup } from 'utils/supabase';

const Stack = createStackNavigator();

const UsernameScreen = ({ route, navigation }: any) => {
  const [username, setUsername] = useState('');
  const { email, password } = route.params;

  async function handleSubmit() {
    navigation.navigate('UserAvatarCreator', { email, password, username });
  }

  return (
    <SafeAreaView style={{ paddingTop: 20, paddingHorizontal: 10, gap: 20 }}>
      <Input placeholder="Username" value={username} onChangeText={setUsername} />
      <Button title="Register" onPress={handleSubmit} />
    </SafeAreaView>
  );
};

const EmailAndPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    const enrolled = await checkIfemailExists(email);
    if (enrolled) {
      setError('Email already exists');
      return;
    }
    navigation.navigate('UsernameScreen', { email, password });
  }

  return (
    <SafeAreaView style={{ gap: 10, paddingTop: 20, paddingHorizontal: 10 }}>
      <Input
        autoCapitalize="none"
        onBlur={() => checkIfemailExists(email)}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Input secureTextEntry value={password} onChangeText={setPassword} />
      <Text>{error}</Text>
      <Button title="Register" onPress={handleSubmit} />
    </SafeAreaView>
  );
};

const RegistrationScreen = () => {
  return (
    <Stack.Navigator initialRouteName="EmailAndPassword" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EmailAndPassword" component={EmailAndPasswordScreen} />
      <Stack.Screen name="UsernameScreen" component={UsernameScreen} />
      <Stack.Screen name="UserAvatarCreator" component={UserAvatarCreator} />
    </Stack.Navigator>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({});

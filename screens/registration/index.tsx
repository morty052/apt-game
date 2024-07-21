import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'components/ui/Button';
import Input from 'components/ui/Input';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { checkIfemailExists, handleSignup } from './features';

const Stack = createStackNavigator();

const UsernameScreen = ({ route, navigation }: any) => {
  const [username, setUsername] = React.useState('');
  const { email, password } = route.params;

  async function handleSubmit() {
    console.log(email, password, username);
    await handleSignup({ email, password, username });
    navigation.navigate('GameStack');
  }

  return (
    <SafeAreaView style={{ paddingTop: 20, paddingHorizontal: 10, gap: 20 }}>
      <Input placeholder="Username" value={username} onChangeText={setUsername} />
      <Button title="Register" onPress={handleSubmit} />
    </SafeAreaView>
  );
};

const EmailAndPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

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
    </Stack.Navigator>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({});

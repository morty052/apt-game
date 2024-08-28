import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'components/ui/Button';
import Input from 'components/ui/Input';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import { useState } from 'react';
import { ActivityIndicator, ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import UserAvatarCreator from 'screens/user-avatar-creator/UserAvatarCreator';

import { checkIfemailExists, checkIfUsernameExists } from '../../api/index';

const Stack = createStackNavigator();

const OverLay = () => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
      }}
    />
  );
};

const RegisterForm = ({
  email,
  password,
  error,
  setError,
  setPassword,
  setEmail,
  loading,
  handleSubmit,
}: {
  email: string;
  password: string;
  error: string;
  setError: (value: string) => void;
  setPassword: (value: string) => void;
  setEmail: (value: string) => void;
  loading: boolean;
  handleSubmit: () => void;
}) => {
  return (
    <Animated.View entering={SlideInDown} style={styles.form}>
      <View style={{ gap: 2 }}>
        <Text style={{ color: 'black', fontSize: 25 }}>Welcome</Text>
        <Text style={{ color: 'black', fontSize: 14 }}>Create a new account to play</Text>
      </View>
      <View style={{ gap: 10 }}>
        <Input
          autoCapitalize="none"
          onBlur={() => checkIfemailExists(email)}
          onFocus={() => setError('')}
          keyboardType="email-address"
          value={email}
          onChangeText={(value) => {
            if (error) {
              setError('');
            }
            setEmail(value);
          }}
          placeholder="Email"
          style={{
            backgroundColor: 'white',
          }}
        />
        <Input
          style={{
            backgroundColor: 'white',
          }}
          secureTextEntry
          value={password}
          onChangeText={(value) => {
            if (error) {
              setError('');
            }
            setPassword(value);
          }}
          placeholder="Password"
          onFocus={() => setError('')}
        />
        <Text style={{ color: 'red', fontSize: 12, textAlign: 'center' }}>{error}</Text>
      </View>
      <Button onPress={handleSubmit}>
        {loading ? <ActivityIndicator /> : <Text>Continue</Text>}
      </Button>
      <Text style={{ textAlign: 'center', fontSize: 10, color: 'gray' }}>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </Animated.View>
  );
};

const UsernameScreen = ({ route, navigation }: any) => {
  const [username, setUsername] = useState('');
  const [hasCode, setHasCode] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { email, password } = route.params;

  const handleButtonPress = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    if (!username) {
      setError('Please enter a username');
      setLoading(false);
      return;
    }
    const usernameTaken = await checkIfUsernameExists(username);
    if (usernameTaken) {
      setError('Username already taken');
      setLoading(false);
      return;
    }

    setLoading(false);
    navigation.navigate('UserAvatarCreator', { email, password, username, referralCode });
  };

  return (
    <ImageBackground
      resizeMode="cover"
      source={require('../../assets/registration_background.png')}
      style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          zIndex: 1,
          justifyContent: 'flex-end',
        }}>
        <Animated.View entering={SlideInDown} style={styles.form}>
          <View style={{ gap: 3 }}>
            <Text>Create a username</Text>
            <Text style={{ color: 'black', fontSize: 12 }}>
              Your username will be visible on your profile
            </Text>
          </View>
          <View style={{ gap: 5 }}>
            <Input
              placeholder="Username"
              value={username}
              onChangeText={(username) => {
                if (error) {
                  setError('');
                }
                if (username.length + 1 > 21) {
                  setError('Username cannot be longer than 20 characters');
                  return;
                }
                setUsername(username);
              }}
              maxLength={21}
            />
            {hasCode && (
              <Input
                placeholder="Referral Code"
                value={referralCode}
                onChangeText={(code) => {
                  if (error) {
                    setError('');
                  }
                  // if (username.length + 1 > 21) {
                  //   setError('Username cannot be longer than 20 characters');
                  //   return;
                  // }
                  setReferralCode(code);
                }}
                maxLength={21}
              />
            )}
            <Text style={{ color: 'red', fontSize: 12, textAlign: 'center' }}>{error}</Text>
          </View>
          <Pressable onPress={() => setHasCode(!hasCode)}>
            <Text style={{ textAlign: 'center', color: 'blue', fontSize: 12 }}>
              I have a referral code
            </Text>
          </Pressable>
          <Button onPress={handleButtonPress}>
            {loading ? <ActivityIndicator /> : <Text>Register</Text>}
          </Button>
        </Animated.View>
      </View>
      <OverLay />
    </ImageBackground>
  );
};

const EmailAndPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (loading) {
      return;
    }
    setLoading(true);
    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }
    const enrolled = await checkIfemailExists(email);
    if (enrolled) {
      setError('Email already exists');
      setLoading(false);
      return;
    }
    setLoading(false);
    navigation.navigate('UsernameScreen', { email, password });
  }

  return (
    <ImageBackground
      resizeMode="cover"
      source={require('../../assets/registration_background.png')}
      style={{ flex: 1, backgroundColor: Colors.backGround }}>
      <View
        style={{
          flex: 1,
          zIndex: 1,
          justifyContent: 'flex-end',
        }}>
        <RegisterForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          setError={setError}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </View>
      <OverLay />
    </ImageBackground>
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

const styles = StyleSheet.create({
  form: {
    gap: 20,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});

import { Ionicons } from '@expo/vector-icons';
import { PlayerAvatar } from 'components/Avatar';
import {
  RiveAvatarComponent,
  RiveAvatarComponentPreview,
  setStateMachineInput,
} from 'components/rive/RiveAvatarComponent';
import RiveIconsContainer from 'components/rive/RiveIconsContainer';
import RiveOptionsContainer from 'components/rive/RiveOptionsContainer';
import { BackButton } from 'components/ui/BackButton';
import { Colors } from 'constants/colors';
import dayjs from 'dayjs';
import { useAvatarStateContext } from 'models/avatarStateContext';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RiveRef } from 'rive-react-native';
import { getItem, setItem } from 'utils/storage';

import { handleSignup } from '../../api/index';

const STATE_MACHINE_NAME = 'State Machine 1';

export const UserAvatarEditor = ({ navigation, route }: any) => {
  const riveRef = React.useRef<RiveRef>(null);

  const { riveAvatarSelections, setRiveAvatarSelection } = useAvatarStateContext();

  async function handleSubmit() {
    const previousSelectionsData = getItem('AVATAR') || '{}';

    const previousSelections = JSON.parse(previousSelectionsData);

    const totalData = {
      ...previousSelections,
      ...riveAvatarSelections,
    };

    const avatar = JSON.stringify(totalData);

    console.log(JSON.parse(avatar));
    setItem('AVATAR', avatar);
    navigation.goBack();
  }

  React.useEffect(() => {
    // setStateMachineInput('avatar', avatar);

    const selections = getItem('AVATAR') || '{}';
    const avatarObject = JSON.parse(selections);
    console.log(selections);

    riveRef.current?.setInputState(STATE_MACHINE_NAME, 'numBodyColor', avatarObject.BodyColor);
    riveRef.current?.setInputState(STATE_MACHINE_NAME, 'numBodySize', avatarObject.BodySize);
    riveRef.current?.setInputState(STATE_MACHINE_NAME, 'numBodyEyes', avatarObject.BodyEyes);
    riveRef.current?.setInputState(STATE_MACHINE_NAME, 'numBodyHair', avatarObject.BodyHair);
    riveRef.current?.setInputState(
      STATE_MACHINE_NAME,
      'numBodyFaceHair',
      avatarObject.BodyFaceHair
    );
    riveRef.current?.setInputState(
      STATE_MACHINE_NAME,
      'numBackgroundColor',
      avatarObject.BackgroundColor
    );
  }, []);

  return (
    <SafeAreaView
      style={{ paddingTop: 10, flex: 1, backgroundColor: 'black', paddingHorizontal: 10 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <BackButton onPress={() => navigation.goBack()} />
        <Pressable
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 10,
            marginRight: 10,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 5,
            gap: 5,
          }}
          onPress={handleSubmit}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Done</Text>
          <Ionicons name="checkmark-circle-outline" size={24} color="white" />
        </Pressable>
      </View>
      <View style={{ paddingHorizontal: 10, flex: 1 }}>
        <View>
          <Text style={styles.title}>Create an avatar</Text>
          <Text style={styles.subTitle}>Create an avatar to display on your profile</Text>
        </View>
        <View style={{ width: 300, height: 300, alignSelf: 'center' }}>
          <RiveAvatarComponentPreview ref={riveRef} />
        </View>
        <RiveIconsContainer />
        <RiveOptionsContainer
          onPress={(mainName, value) => {
            setStateMachineInput({ riveRef, partToUpdate: `num${mainName}`, value });
            setRiveAvatarSelection(mainName, value);
            console.log('riveAvatarSelections', mainName, value);
          }}
        />
      </View>
      {/* <Button title="Submit" onPress={() => console.log(riveAvatarSelections)} /> */}
    </SafeAreaView>
  );
};

const UserAvatarCreator = ({ navigation, route }: any) => {
  const { password, username, email } = route.params;
  const riveRef = React.useRef<RiveRef>(null);

  const { riveAvatarSelections, setRiveAvatarSelection } = useAvatarStateContext();

  async function handleSubmit() {
    console.log(riveAvatarSelections);
    const expo_push_token = getItem('expo_push_token') as string;
    const id = await handleSignup({
      email,
      password,
      username,
      expo_push_token,
      avatar: riveAvatarSelections,
    });
    const now = dayjs();
    setItem('LAST_LOGIN', `${now.format('YYYY-MM-DD HH:mm:ss')}`);
    setItem('LOGIN_COUNT', `${1}`);
    setItem('ID', id);
    setItem('USERNAME', username);
    setItem('EMAIL', email);
    setItem('PASSWORD', password);
    setItem('ONBOARDED', 'TRUE');
    setItem('AVATAR', JSON.stringify(riveAvatarSelections));

    const settings = {
      soundOn: true,
      vibrations: true,
      friendRequest: true,
      gameInvites: true,
    };

    setItem('SETTINGS', JSON.stringify(settings));

    navigation.navigate('GameStack');
  }

  return (
    <SafeAreaView
      style={{ paddingTop: 10, flex: 1, backgroundColor: 'black', paddingHorizontal: 10 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <BackButton onPress={() => navigation.goBack()} />
        <Pressable
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 10,
            marginRight: 10,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 5,
            gap: 5,
          }}
          onPress={handleSubmit}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Done</Text>
          <Ionicons name="checkmark-circle-outline" size={24} color="white" />
        </Pressable>
      </View>
      <View style={{ paddingHorizontal: 10, flex: 1 }}>
        <View>
          <Text style={styles.title}>Create an avatar</Text>
          <Text style={styles.subTitle}>Create an avatar to display on your profile</Text>
        </View>
        <View style={{ width: 300, height: 300, alignSelf: 'center' }}>
          <RiveAvatarComponent ref={riveRef} />
        </View>
        <RiveIconsContainer />
        <RiveOptionsContainer
          onPress={(mainName, value) => {
            setStateMachineInput({ riveRef, partToUpdate: `num${mainName}`, value });
            setRiveAvatarSelection(mainName, value);
            console.log('riveAvatarSelections', mainName, value);
          }}
        />
      </View>
      {/* <Button title="Submit" onPress={() => console.log(riveAvatarSelections)} /> */}
    </SafeAreaView>
  );
};

export default UserAvatarCreator;

const styles = StyleSheet.create({
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
  },
  subTitle: {
    color: 'white',
    fontSize: 18,
  },
});

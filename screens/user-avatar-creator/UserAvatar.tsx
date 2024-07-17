import { Ionicons } from '@expo/vector-icons';
import { RiveAvatarComponent, setStateMachineInput } from 'components/rive/RiveAvatarComponent';
import RiveIconsContainer from 'components/rive/RiveIconsContainer';
import RiveOptionsContainer from 'components/rive/RiveOptionsContainer';
import { Colors } from 'constants/colors';
import { useAvatarStateContext } from 'models/avatarStateContext';
import { UserProps, useUserModel } from 'models/userModel';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RiveRef } from 'rive-react-native';
import { setItem } from 'utils/storage';
import { supabase } from 'utils/supabase';

import avatarConfig from '../../constants/json/avatarConfig.json';
import { SafeAreaView } from 'react-native-safe-area-context';

type JSONData = typeof avatarConfig;

const localData = JSON.parse(JSON.stringify(avatarConfig));

async function createUser(user: UserProps) {
  const { data, error } = await supabase.from('users').insert([user]).select();

  console.log(data, error);
  return data;
}

const UserAvatar = ({ navigation }: { navigation: any }) => {
  const riveRef = React.useRef<RiveRef>(null);

  const { activeIcon, riveAvatarSelections, setRiveAvatarSelection } = useAvatarStateContext();
  const { firstname, lastname, email, username } = useUserModel();

  // @ts-ignore
  const trimmedActiveIcon: keyof JSONData =
    activeIcon === 'BackgroundColor' ? activeIcon : activeIcon.split('Body')[1];

  async function handleSubmit() {
    console.log(riveAvatarSelections);
    const user = {
      firstname,
      lastname,
      email,
      username,
      avatar: riveAvatarSelections,
    };
    const data = await createUser(user);
    const id = data?.[0].id;
    setItem('id', JSON.stringify(id));
    setItem('firstname', firstname);
    setItem('lastname', lastname);
    setItem('email', email);
    setItem('username', username);
    setItem('avatar', JSON.stringify(riveAvatarSelections));
    setItem('ONBOARDED', 'true');
    navigation.navigate('App');
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
        {/* <BackButton onPress={() => navigation.goBack()} /> */}
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
          numOptions={localData[trimmedActiveIcon].numOptions}
          buttonCollectionName={trimmedActiveIcon}
        />
      </View>
      {/* <Button title="Submit" onPress={() => console.log(riveAvatarSelections)} /> */}
    </SafeAreaView>
  );
};

export default UserAvatar;

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

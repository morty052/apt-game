import { Ionicons } from '@expo/vector-icons';
import { RiveAvatarComponent, setStateMachineInput } from 'components/rive/RiveAvatarComponent';
import RiveIconsContainer from 'components/rive/RiveIconsContainer';
import RiveOptionsContainer from 'components/rive/RiveOptionsContainer';
import { BackButton } from 'components/ui/BackButton';
import { Colors } from 'constants/colors';
import { useAvatarStateContext } from 'models/avatarStateContext';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RiveRef } from 'rive-react-native';
import { getItem, setItem } from 'utils/storage';
import { handleSignup } from 'utils/supabase';

const UserAvatarCreator = ({ navigation, route }: any) => {
  const { password, username, email } = route.params;
  const riveRef = React.useRef<RiveRef>(null);

  const { activeIcon, riveAvatarSelections, setRiveAvatarSelection } = useAvatarStateContext();

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
    setItem('ID', id);
    setItem('USERNAME', username);
    setItem('EMAIL', email);
    setItem('PASSWORD', password);
    setItem('ONBOARDED', 'TRUE');
    setItem('AVATAR', JSON.stringify(riveAvatarSelections));
    setItem('ONBOARDED', 'true');
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

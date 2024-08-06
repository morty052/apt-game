import { Ionicons } from '@expo/vector-icons';
import Avatar from 'components/Avatar';
import { BackButton } from 'components/ui/BackButton';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const avatarObject = {
  BodyColor: 0,
  BodySize: 1,
  BodyEyes: 2,
  BodyHair: 3,
  BodyFaceHair: 4,
  BackgroundColor: 5,
};

const UserInfoBar = () => {
  return (
    <View style={styles.userBar}>
      <View>
        <Text style={styles.userBarText}>User Name</Text>
        <Text style={styles.userBarEmail}>abdulojehumen@outlook.com</Text>
      </View>
    </View>
  );
};

const SettingsItem = ({ title, subtitle }: { title: string; subtitle: string }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  return (
    <Pressable style={styles.settingsItem}>
      <View style={{ flex: 1, rowGap: 5 }}>
        <Text>{title}</Text>
        <Text style={{ color: 'gray', fontSize: 14 }}>{subtitle}</Text>
      </View>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </Pressable>
  );
};

const SettingsScreen = ({ navigation }: any) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.plain }}>
      <View style={styles.container}>
        <SettingsItem title="Sound on" subtitle="Turn sound effects on or off" />
        <SettingsItem title="Music" subtitle="Turn background music on or off" />
        <SettingsItem title="Vibrations" subtitle="Turn vibrations  on or off" />
        <SettingsItem title="Notification Sounds" subtitle="Turn vibrations  on or off" />
        <SettingsItem title="Friend requests" subtitle="Allow  users to send you friend requests" />
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: Colors.plain,
    gap: 30,
    paddingTop: 20,
  },
  settingsItem: {
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    columnGap: 5,
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -10,
    right: -5,
    backgroundColor: 'white',
    padding: 5,
    zIndex: 1,
    height: 40,
    width: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  userBarText: {},
  userBarEmail: {
    fontSize: 13,
  },
});

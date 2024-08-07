import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import { useState, useMemo, useCallback } from 'react';
import { Pressable, StyleSheet, View, Switch } from 'react-native';
import { getItem, setItem } from 'utils/storage';

type SettingsProps = {
  soundOn: boolean;
  vibrations: boolean;
  friendRequest: boolean;
  gameInvites: boolean;
};

const SettingsItem = ({
  title,
  subtitle,
  isEnabled,
  toggleSwitch,
}: {
  title: string;
  subtitle: string;
  isEnabled: boolean;
  toggleSwitch: () => void;
}) => {
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
  const [settings, setSettings] = useState<SettingsProps>({
    soundOn: true,
    vibrations: true,
    friendRequest: true,
    gameInvites: true,
  });

  const [changedValues, setChangedValues] = useState<string[]>([]);

  const hasChanges = useMemo(() => {
    return changedValues.length > 0;
  }, [changedValues]);

  const retrieveSettings = useCallback(() => {
    const settingsData = getItem('SETTINGS');
    const settings = settingsData ? JSON.parse(settingsData) : {};
    console.log(settings, changedValues);
    setSettings(settings);
  }, [setSettings, settings]);

  const toggleSwitch = (value: keyof SettingsProps) => {
    setSettings((previousState) => {
      return { ...previousState, [value]: !previousState[value] };
    });
    if (changedValues.includes(value)) {
      setChangedValues(changedValues.filter((item) => item !== value));
      return;
    }
    setChangedValues([...changedValues, value]);
  };

  const confirmChanges = useCallback(() => {
    console.log('confirmed');
    setItem('SETTINGS', JSON.stringify(settings));
    navigation.goBack();
  }, [settings, navigation]);

  return (
    <View onLayout={retrieveSettings} style={styles.container}>
      <View style={styles.innerContainer}>
        <SettingsItem
          isEnabled={settings.soundOn}
          toggleSwitch={() => toggleSwitch('soundOn')}
          title="Sound on"
          subtitle="Turn sound effects on or off"
        />
        <SettingsItem
          isEnabled={settings.vibrations}
          toggleSwitch={() => toggleSwitch('vibrations')}
          title="Vibrations"
          subtitle="Turn vibrations  on or off"
        />
        <SettingsItem
          isEnabled={settings.friendRequest}
          toggleSwitch={() => toggleSwitch('friendRequest')}
          title="Friend requests"
          subtitle="Allow  users to send you friend requests"
        />
        <SettingsItem
          isEnabled={settings.gameInvites}
          toggleSwitch={() => toggleSwitch('gameInvites')}
          title="Game  invites"
          subtitle="Allow  users to challenge you to games"
        />
      </View>
      {hasChanges ? (
        <Button style={{ backGroundColor: 'red' }} onPress={confirmChanges} title="Save Changes" />
      ) : (
        <View style={styles.disabledButton}>
          <Text style={{ color: 'gray' }}>Save Changes</Text>
        </View>
      )}
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.plain, paddingBottom: 20, paddingHorizontal: 10 },
  innerContainer: {
    flex: 1,
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
  disabledButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 8,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: 'rgba(0,0,0,0.5)',
  },
});

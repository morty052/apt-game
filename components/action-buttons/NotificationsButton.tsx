import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'components/ui/Text';
import { useAppStore } from 'models/appStore';
import { View, StyleSheet, Pressable } from 'react-native';

const Badge = ({ invites }: { invites: number | undefined }) => {
  return (
    <View style={styles.badge}>
      <Text
        style={{
          fontSize: 12,
          color: 'white',
          textAlign: 'center',
        }}>
        {invites}
      </Text>
    </View>
  );
};

function NotificationsButton() {
  const navigation = useNavigation<any>();
  const { invites } = useAppStore();

  return (
    <>
      <Pressable
        onPress={() => navigation.navigate('NotificationsScreen')}
        style={styles.notificationContainer}>
        <View style={{ position: 'relative' }}>
          <Ionicons name="notifications-outline" size={35} color="black" />
          {invites > 0 && <Badge invites={invites} />}
        </View>
      </Pressable>
    </>
  );
}

export default NotificationsButton;

const styles = StyleSheet.create({
  notificationContainer: {
    height: 60,
    width: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: -4,
    backgroundColor: 'red',
    padding: 5,
    zIndex: 1,
    height: 20,
    width: 20,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: 'black',
  },
});

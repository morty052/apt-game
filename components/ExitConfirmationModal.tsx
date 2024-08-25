import { Pressable, View, StyleSheet, Image } from 'react-native';

import { ModalComponent } from './ui/ModalComponent';
import { Text } from './ui/Text';
import hurtFace from '../assets/icons/hurt-face-min.png';

function ExitConfirmationModal({
  visible,
  setVisible,
  onExit,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onExit: () => void;
}) {
  return (
    <ModalComponent transparent style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} visible={visible}>
      <View style={styles.container}>
        <Image source={hurtFace} style={{ width: 200, height: 200 }} />
        <View style={{ gap: 10 }}>
          <Text style={styles.mainText}>Are you sure you want to exit ?</Text>
          <Text style={styles.subText}>Your current progress will be lost</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, { backgroundColor: 'red', borderColor: '#DD0000' }]}
            onPress={() => onExit()}>
            <Text style={{ color: 'white', fontSize: 18 }}>Exit</Text>
          </Pressable>
          <Pressable
            style={[styles.button, { backgroundColor: '#00c4ee', borderColor: '#00a4ee' }]}
            onPress={() => {
              setVisible(false);
              console.log('exit cancelled');
            }}>
            <Text style={{ color: 'white', fontSize: 18 }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </ModalComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  mainText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  subText: {
    fontSize: 14,
    textAlign: 'center',
    color: 'white',
  },
  buttonContainer: { flexDirection: 'row', gap: 20, paddingTop: 20 },
  button: {
    backgroundColor: 'red',
    padding: 10,
    width: 120,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 8,
    borderLeftWidth: 4,
    borderRightWidth: 4,
  },
});

export default ExitConfirmationModal;

import { useNavigation } from '@react-navigation/native';
import { useAppStore } from 'models/appStore';
import { useGameStore } from 'models/gameStore';
import React, { useEffect } from 'react';
import { Modal, Platform, StyleSheet, Text, View } from 'react-native';
import { playerProps } from 'types';

import Avatar from './Avatar';
import { Button } from './ui/Button';
import useSound from 'hooks/useSound';

const avatarObject = {
  BodyColor: 1,
  BodySize: 1,
  BodyEyes: 2,
  BodyHair: 1,
  BodyFaceHair: 2,
  BackgroundColor: 0,
};

function HeadtoHeadUi({ player, opponents }: { player: playerProps; opponents: playerProps[] }) {
  return (
    <View
      style={{
        flex: 1,
        paddingTop: 20,
        paddingBottom: 50,
        gap: 20,
        justifyContent: 'center',
      }}>
      <View style={{ gap: 20 }}>
        <View style={{ alignItems: 'flex-start' }}>
          <View style={{ alignItems: 'center' }}>
            <Avatar avatarObject={avatarObject} />
            <Text
              style={{
                fontFamily: 'Crispy-Tofu',
                fontSize: 30,
                color: 'white',
                textAlign: 'center',
              }}>
              {player.username}
            </Text>
          </View>
        </View>
        <Text
          style={{ fontFamily: 'Crispy-Tofu', fontSize: 60, color: 'white', textAlign: 'center' }}>
          VS
        </Text>
        <View
          style={{
            justifyContent: 'flex-end',
            flexDirection: 'row',
            // backgroundColor: 'red',
            marginTop: -0,
          }}>
          {opponents.map((opponent) => (
            <View style={{ alignItems: 'center' }} key={opponent.username}>
              <Avatar avatarObject={avatarObject} />
              <Text
                style={{
                  fontFamily: 'Crispy-Tofu',
                  fontSize: 30,
                  color: 'white',
                  textAlign: 'center',
                }}>
                {opponent.username}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function GroupMatchUi() {
  return <View />;
}

const MatchConfirmationModal = () => {
  const { playSound } = useSound();

  const { matchFound, mode } = useAppStore();

  const { player, opponents, room } = useGameStore();

  const navigation = useNavigation<any>();

  useEffect(() => {
    if (matchFound) playSound();
  }, [matchFound]);

  return (
    <Modal
      animationType="fade"
      visible={matchFound}
      transparent={Platform.select({ android: true, ios: false })}
      statusBarTranslucent
      presentationStyle={Platform.select({ android: undefined, ios: 'fullScreen' })}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            flex: 0.8,
            backgroundColor: '#00c4ee',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 30,
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            paddingBottom: 20,
          }}>
          <Text
            style={{
              fontFamily: 'Crispy-Tofu',
              color: 'white',
              fontSize: 30,
              textAlign: 'center',
            }}>
            Match Found
          </Text>
          {mode === 'HEAD_TO_HEAD' && <HeadtoHeadUi player={player} opponents={opponents} />}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 20,
            }}>
            <Button
              style={{ flex: 1 }}
              title="Accept"
              onPress={() => {
                navigation.navigate('GameScreen', { room });
                useAppStore.getState().setMatchFound(false);
              }}
            />
            <Button
              style={{ flex: 1, backgroundColor: 'red' }}
              title="Reject"
              onPress={() => {
                navigation.navigate('GameScreen', { room });
                useAppStore.getState().setMatchFound(false);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MatchConfirmationModal;

const styles = StyleSheet.create({});
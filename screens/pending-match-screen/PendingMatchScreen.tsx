import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MatchConfirmationModal from 'components/MatchConfirmationModal';
import { ModalComponent } from 'components/ui/ModalComponent';
import { useAppStore } from 'models/appStore';

export default function PendingMatchScreen() {
  const matchmaking = useAppStore((state) => state.matchmaking);

  return (
    <ModalComponent visible={matchmaking}>
      <View>
        <Text>PendingMatchScreen</Text>
      </View>
    </ModalComponent>
  );
}

const styles = StyleSheet.create({});

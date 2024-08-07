import { useAvatarStateContext } from 'models/avatarStateContext';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Rive, { RiveRef } from 'rive-react-native';
import { getItem } from 'utils/storage';
import { useIsFocused } from '@react-navigation/native';

export type AvatarObject = {
  BodyColor: number;
  BodySize: number;
  BodyEyes: number;
  BodyHair: number;
  BodyFaceHair: number;
  BackgroundColor: number;
};

const STATE_MACHINE_NAME = 'State Machine 1';

export function PlayerAvatar({ width, height }: { width?: number; height?: number }) {
  const riveRef = React.useRef<RiveRef>(null);
  const { riveAvatarSelections } = useAvatarStateContext();

  const isFocused = useIsFocused();

  // useEffect(() => {
  //   console.log('isFocused', isFocused);
  // }, [isFocused]);

  const updateAvatar = () => {
    const selections = getItem('AVATAR') || '{}';
    const avatarObject = JSON.parse(selections);
    console.log('selections updated');

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
  };

  React.useEffect(() => {
    // setStateMachineInput('avatar', avatar);

    if (!isFocused) {
      return;
    }

    const selections = getItem('AVATAR') || '{}';
    const avatarObject = JSON.parse(selections);
    console.log('isFocused', isFocused);

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
  }, [isFocused]);

  return (
    <View onLayout={updateAvatar}>
      <Rive
        style={{
          width: width || 60,
          height: height || 60,
          // borderWidth: 1,
        }}
        ref={riveRef}
        url="https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722345626/avatar.riv"
        stateMachineName={STATE_MACHINE_NAME}
        autoplay={false}
      />
    </View>
  );
}

function Avatar({
  avatarObject,
  width,
  height,
}: {
  avatarObject: AvatarObject;
  width?: number;
  height?: number;
}) {
  const [loaded, setloaded] = useState(false);
  const riveRef = React.useRef<RiveRef>(null);

  React.useEffect(() => {
    if (!loaded) {
      return;
    }
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
  }, [loaded]);

  return (
    <View onLayout={() => setloaded(true)}>
      <Rive
        style={{
          width: width || 60,
          height: height || 60,
          // borderWidth: 1,
        }}
        ref={riveRef}
        url="https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722345626/avatar.riv"
        stateMachineName={STATE_MACHINE_NAME}
        autoplay={false}
      />
    </View>
  );
}

export default Avatar;

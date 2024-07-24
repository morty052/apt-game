import { avatarStateProps } from '../models/avatarStateContext';
import React from 'react';
import { View } from 'react-native';
import Rive, { RiveRef } from 'rive-react-native';

import { RiveAvatarComponent, setStateMachineInput } from './rive/RiveAvatarComponent';

export type AvatarObject = {
  BodyColor: number;
  BodySize: number;
  BodyEyes: number;
  BodyHair: number;
  BodyFaceHair: number;
  BackgroundColor: number;
};

const STATE_MACHINE_NAME = 'State Machine 1';

function Avatar({ avatarObject }: { avatarObject: AvatarObject }) {
  const [loaded, setloaded] = React.useState(false);

  const riveRef = React.useRef<RiveRef>(null);

  // const avatar = React.useMemo(() => {
  //   const avatarData = JSON.stringify(avatarObject);
  //   const riveAvatarSelections = JSON.parse(avatarData);
  //   return riveAvatarSelections;
  // }, []);

  const updateAvatar = () => {
    for (const key in avatarObject) {
      riveRef.current?.setInputState(
        STATE_MACHINE_NAME,
        `num${key}`,
        avatarObject[key as keyof typeof avatarObject]
      );
    }
  };

  React.useEffect(() => {
    // setStateMachineInput('avatar', avatar);

    if (!loaded) {
      return;
    }

    // for (const key in avatarObject) {
    //   setStateMachineInput({
    //     riveRef,
    //     partToUpdate: `num${key}`,
    //     value: avatarObject[key as keyof typeof avatarObject],
    //   });
    // }

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
    <View onLayout={() => setloaded(true)} style={{ width: 75, height: 75 }}>
      <View style={{ width: 75, height: 75 }}>
        <Rive
          ref={riveRef}
          url="https://hezpbxzutspjqunzdtdi.supabase.co/storage/v1/object/public/thumbnails/avatar_creator.riv"
          stateMachineName={STATE_MACHINE_NAME}
        />
      </View>
    </View>
  );
}

export default Avatar;

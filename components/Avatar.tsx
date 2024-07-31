import React from 'react';
import { View } from 'react-native';
import Rive, { RiveRef } from 'rive-react-native';

export type AvatarObject = {
  BodyColor: number;
  BodySize: number;
  BodyEyes: number;
  BodyHair: number;
  BodyFaceHair: number;
  BackgroundColor: number;
};

const STATE_MACHINE_NAME = 'State Machine 1';

export function PlayerAvatar({
  avatarObject,
  width,
  height,
}: {
  avatarObject: AvatarObject;
  width?: number;
  height?: number;
}) {
  const [loaded, setloaded] = React.useState(false);

  const riveRef = React.useRef<RiveRef>(null);

  React.useEffect(() => {
    // setStateMachineInput('avatar', avatar);

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
  );
}

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
    <View onLayout={() => setloaded(true)} style={{ zIndex: 1, width: 60, height: 60 }}>
      <Rive
        style={{ width: 60, height: 60 }}
        ref={riveRef}
        url="https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722345626/avatar.riv"
        stateMachineName={STATE_MACHINE_NAME}
      />
    </View>
  );
}

export default Avatar;

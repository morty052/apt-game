import { avatarStateProps } from '../models/avatarStateContext';
import React from 'react';
import { View } from 'react-native';
import { RiveRef } from 'rive-react-native';

import { RiveAvatarComponent, setStateMachineInput } from './rive/RiveAvatarComponent';

type avatarObject = {
  BodyColor: number;
  BodySize: number;
  BodyEyes: number;
  BodyHair: number;
  BodyFaceHair: number;
  BackgroundColor: number;
};
function Avatar({ avatarObject }: { avatarObject: avatarObject }) {
  // const { setAvatar } = useAvatarStateContext();

  const riveRef = React.useRef<RiveRef>(null);

  const avatar = React.useMemo(() => {
    const avatarData = JSON.stringify(avatarObject);
    const riveAvatarSelections = JSON.parse(avatarData);
    return riveAvatarSelections;
  }, []);

  React.useEffect(() => {
    // setStateMachineInput('avatar', avatar);
    for (const key in avatar) {
      setStateMachineInput({ riveRef, partToUpdate: `num${key}`, value: avatar[key] });
    }
  }, []);

  return (
    <View>
      <View style={{ width: 75, height: 75 }}>
        <RiveAvatarComponent ref={riveRef} />
      </View>
    </View>
  );
}

export default Avatar;

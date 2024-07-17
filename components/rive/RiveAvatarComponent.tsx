import Rive, { RiveRef } from 'rive-react-native';

import React, { LegacyRef, Ref } from 'react';
import { useAvatarStateContext } from '../../models/avatarStateContext';

const STATE_MACHINE_NAME = 'State Machine 1';

type RiveAvatarComponentProps = {
  ref: Ref<RiveRef>;
};

export const setStateMachineInput = ({
  riveRef,
  partToUpdate,
  value,
}: {
  riveRef: React.MutableRefObject<RiveRef | null>;
  partToUpdate: string;
  value: number;
}) => {
  riveRef.current?.setInputState(STATE_MACHINE_NAME, partToUpdate, value);
  riveRef.current?.fireState(STATE_MACHINE_NAME, 'changes');
};

/**
 * Component for the actual Avatar character preview. It listens to the global state context
 * to listen to when users select new character feature options and updates the avatar state
 * machine accordingly
 */
export const RiveAvatarComponent = React.forwardRef(({}, ref: LegacyRef<RiveRef>) => {
  const { riveAvatarSelections } = useAvatarStateContext();

  return (
    <Rive
      ref={ref}
      url="https://hezpbxzutspjqunzdtdi.supabase.co/storage/v1/object/public/thumbnails/avatar_creator.riv"
      // alignment={Alignment.TopCenter}
      // style={{ width: 300, height: 300, backgroundColor: 'white' }}
      stateMachineName={STATE_MACHINE_NAME}
    />
  );
});

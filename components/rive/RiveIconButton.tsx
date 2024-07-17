import { Dimensions, Pressable } from 'react-native';
import Rive, { RiveRef, Alignment } from 'rive-react-native';
import React from 'react';
import { useAvatarStateContext } from '../../models/avatarStateContext';

// @refresh reset

interface RiveIconButtonProps {
  artboardName: string;
}

const STATE_MACHINE_NAME = 'State Machine 1';

/**
 * Reusable component for the character feature icons that users can click to see
 * a list of options for that feature (i.e. Facial Hair, Body Color, etc.)
 */
export default function RiveIconButton({ artboardName }: RiveIconButtonProps) {
  // const {
  //   state: { activeIcon, riveAvatarSelections },
  //   setActiveIcon,
  // } = useContext(AvatarStateContext);

  const riveRef = React.useRef<RiveRef>(null);
  const { setActiveIcon, activeIcon } = useAvatarStateContext();

  const strippedDownName = artboardName.replace('Icon', '');

  // const numOption = useStateMachineInput(rive, STATE_MACHINE_NAME, `num${strippedDownName}`);

  /**
   * The icon graphic should update to reflect the chosen feature option for that icon
   * and so this listens for user selections in the options and updates accordingly
   */
  // useEffect(() => {
  //   if (rive && numOption) {
  //     numOption.value = riveAvatarSelections[strippedDownName];
  //   }
  // }, [rive, numOption, riveAvatarSelections, strippedDownName]);

  /**
   * When a user clicks on an icon, we want to set the isIconActive flag on the state machine input
   * to true for that icon, and false for all other icons
   */
  // useEffect(() => {
  //   if (rive && isIconActive) {
  //     if (activeIcon === strippedDownName) {
  //       isIconActive.value = true;
  //     } else {
  //       isIconActive.value = false;
  //     }
  //   }
  // }, [rive, activeIcon, isIconActive, strippedDownName]);

  const onFocus = React.useCallback(() => {
    riveRef.current?.setInputState(STATE_MACHINE_NAME, 'isHover', true);
  }, [riveRef]);

  const onBlur = () => {
    riveRef.current?.setInputState(STATE_MACHINE_NAME, 'isIconActive', false);
    riveRef.current?.setInputState(STATE_MACHINE_NAME, 'isHover', false);
  };

  const onClick = React.useCallback(() => {
    riveRef.current?.setInputState(STATE_MACHINE_NAME, 'isIconActive', true);
    setActiveIcon(artboardName as any);
  }, [riveRef, setActiveIcon, artboardName]);

  return (
    <Rive
      url="https://hezpbxzutspjqunzdtdi.supabase.co/storage/v1/object/public/thumbnails/avatar_creator.riv"
      artboardName={artboardName}
      stateMachineName={STATE_MACHINE_NAME}
      autoplay
      alignment={Alignment.Center}
      style={{ width: 50, height: 50 }}
      ref={riveRef}>
      <Pressable
        style={{
          // width: Dimensions.get('window').width / 6,
          height: 50,
          // backgroundColor: 'red',
          borderWidth: 1,
          zIndex: 1,
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        onPress={onClick}
      />
    </Rive>
  );
}

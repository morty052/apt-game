import React from 'react';
import { Dimensions, Pressable } from 'react-native';
import Rive, { RiveRef } from 'rive-react-native';

interface RiveOptionButtonProps {
  artboardName: string;
  optionIdx: number;
  onPress: (mainName: string, optionIdx: number) => void;
}

const STATE_MACHINE_NAME = 'State Machine 1';

/**
 * Reusable component for a character feature option button (i.e. mustache and beard for facial hair feature)
 */
export default function RiveOptionButton({
  artboardName,
  optionIdx,
  onPress,
}: RiveOptionButtonProps) {
  const riveRef = React.useRef<RiveRef>(null);

  const mainName = artboardName.replace('Button', '');

  React.useEffect(() => {
    if (riveRef.current) {
      riveRef.current?.setInputState(STATE_MACHINE_NAME, 'numOption', optionIdx);
    }
  }, []);

  // const onClick = () => {
  //   setRiveAvatarSelection(mainName, numOption);
  // };

  return (
    <Pressable
      style={{ width: Dimensions.get('window').width * 0.3, height: 150 }}
      // className={`exp-option-button aspect-[21/16] min-w-[150px] opacity-100`}
      onPress={() => onPress(mainName, optionIdx)}>
      <Pressable
        style={{
          width: Dimensions.get('window').width * 0.3,
          height: 150,
          pointerEvents: 'none',
        }}>
        <Rive
          ref={riveRef}
          url="https://hezpbxzutspjqunzdtdi.supabase.co/storage/v1/object/public/thumbnails/avatar_creator.riv"
          artboardName={artboardName}
          stateMachineName={STATE_MACHINE_NAME}
          autoplay
        />
      </Pressable>
    </Pressable>
  );
}

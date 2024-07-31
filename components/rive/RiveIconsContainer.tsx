import { useAvatarStateContext } from 'models/avatarStateContext';
import React from 'react';
import { Pressable, View } from 'react-native';
import Rive, { Alignment, RiveRef } from 'rive-react-native';

interface RiveIconButtonProps {
  artboardName: string;
  url: string;
}

const getArtboardName = (artboardName: string) => {
  if (artboardName === 'BackgroundColor') {
    return `${artboardName}Icon`;
  }
  return `Body${artboardName}Icon`;
};

const STATE_MACHINE_NAME = 'State Machine 1';

function RiveIconButton({ artboardName, url }: RiveIconButtonProps) {
  // const {
  //   state: { activeIcon, riveAvatarSelections },
  //   setActiveIcon,
  // } = useContext(AvatarStateContext);

  const riveRef = React.useRef<RiveRef>(null);
  const { setActiveIcon, activeIcon } = useAvatarStateContext();

  const onFocus = React.useCallback(() => {
    riveRef.current?.setInputState(STATE_MACHINE_NAME, 'isHover', true);
  }, [riveRef]);

  const onBlur = () => {
    riveRef.current?.setInputState(STATE_MACHINE_NAME, 'isIconActive', false);
    riveRef.current?.setInputState(STATE_MACHINE_NAME, 'isHover', false);
  };

  const onClick = React.useCallback(() => {
    setActiveIcon(artboardName as any);
  }, [riveRef, setActiveIcon, artboardName]);

  React.useEffect(() => {
    if (activeIcon === artboardName) {
      riveRef.current?.setInputState(STATE_MACHINE_NAME, 'isIconActive', true);
      return;
    }
    riveRef.current?.setInputState(STATE_MACHINE_NAME, 'isIconActive', false);
  }, [activeIcon]);

  return (
    <Rive
      url={url}
      // artboardName={artboardName}
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

/**
 * List out all the character feature icon buttons
 */
export default function RiveIconsContainer() {
  return (
    <View style={{ width: '100%', backgroundColor: '#1D1D1D', flexDirection: 'row' }}>
      <RiveIconButton
        url="https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722346923/AvatarComponents/bodyColorIcon.riv"
        artboardName="BodyColor"
      />
      <RiveIconButton
        url="https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722347273/AvatarComponents/bodySizeIcon.riv"
        artboardName="BodySize"
      />
      <RiveIconButton
        url="https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722347158/AvatarComponents/bodyEyesIcon.riv"
        artboardName="BodyEyes"
      />
      <RiveIconButton
        url="https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722347226/AvatarComponents/bodyHairIcon.riv"
        artboardName="BodyHair"
      />
      <RiveIconButton
        url="https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722347197/AvatarComponents/bodyFaceHairIcon.riv"
        artboardName="BodyFaceHair"
      />
      <RiveIconButton
        url="https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722346883/AvatarComponents/backGroundColorIcon.riv"
        artboardName="BackgroundColor"
      />
    </View>
  );
}

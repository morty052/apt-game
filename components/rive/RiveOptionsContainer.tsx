import { useAvatarStateContext } from 'models/avatarStateContext';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, View } from 'react-native';
import Rive, { RiveRef } from 'rive-react-native';

import { avatarConfig } from 'constants/avatarConfig';

const STATE_MACHINE_NAME = 'State Machine 1';

const BODY_COLOR_BUTTON_URL =
  'https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722357868/AvatarComponents/ekknoofxrw1av6elrq4f.riv';

const BACKGROUND_COLOR_BUTTON_URL =
  'https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722351787/AvatarComponents/backgroundColorButton.riv';

const BODY_EYES_BUTTON_URL =
  'https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722352377/AvatarComponents/bodyEyeButton.riv';

const BODY_FACE_HAIR_BUTTON_URL =
  'https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722352460/AvatarComponents/bodyFaceHairButton.riv';

const BODY_HAIR_BUTTON_URL =
  'https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722352582/AvatarComponents/bodyHairButton.riv';

const BODY_SIZE_BUTTON_URL =
  'https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722352651/AvatarComponents/bodySizeButton.riv';

interface RiveOptionButtonProps {
  artboardName: string;
  optionIdx: number;
  onPress: (mainName: string, optionIdx: number) => void;
  url: string;
  bodyPart: string;
}
// TODO FIX BEARD BUTTON BUG HAPPENING CUZ NAME MISMATCH
/**
 * Reusable component for a character feature option button (i.e. mustache and beard for facial hair feature)
 */
function RiveOptionButton({
  artboardName,
  optionIdx,
  onPress,
  url,
  bodyPart,
}: RiveOptionButtonProps) {
  const riveRef = React.useRef<RiveRef>(null);
  const [loaded, setloaded] = useState(false);

  const mainName = artboardName.replace('Button', '');

  // React.useEffect(() => {
  //   if (!loaded) {
  //     console.log('not visible at', optionIdx);
  //     return;
  //   } else if (loaded) {
  //     riveRef.current?.setInputState(STATE_MACHINE_NAME, 'numOption', optionIdx);
  //     // riveRef.current?.play();
  //   }
  // }, [loaded]);

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
          // onPlay={(state) => console.log('playing', state)}
          // onPlay={(state, stateName) => {
          //   setloaded(true);
          //   if (loaded) {
          //     return;
          //   }
          //   console.log('state', stateName);
          // }}
          ref={riveRef}
          url={url}
          autoplay
          stateMachineName={STATE_MACHINE_NAME}
          animationName={`${bodyPart}${optionIdx}`}
        />
      </Pressable>
    </Pressable>
  );
}

interface RiveOptionsContainerProps {
  onPress: (mainName: string, optionIdx: number) => void;
}

const getArtboardName = (artboardName: string) => {
  if (artboardName === 'BackgroundColor') {
    return `${artboardName}Button`;
  }
  return `Body${artboardName}Button`;
};

const colors = ['068399', 'C86069', 'FBCC40', '7656D7', '8E1F79'];

function BodyColorPicker({ color, onPress }: { color: string; onPress: () => void }) {
  return (
    <Pressable
      style={{
        backgroundColor: color,
        width: Dimensions.get('window').width * 0.25,
        height: 100,
        borderRadius: 10,
      }}
      onPress={onPress}
    />
  );
}

function BodySizeOptions({ onPress }: any) {
  const options = useMemo(() => Array.from({ length: avatarConfig.Size.numOptions }), []);

  return (
    <ScrollView
      contentContainerStyle={{
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
      {/* {optionButtons.map((buttonComp) => buttonComp)} */}
      {options.map((option, index) => (
        <RiveOptionButton
          url={BODY_SIZE_BUTTON_URL}
          onPress={(mainName, optionIdx) => onPress(mainName, optionIdx)}
          key={index}
          optionIdx={index}
          artboardName="BodySizeButton"
          bodyPart="Size"
        />
      ))}
    </ScrollView>
  );
}

function BodyColorOptions({ onPress }: any) {
  return (
    <ScrollView
      contentContainerStyle={{
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingTop: 10,
        justifyContent: 'center',
      }}>
      {colors.map((option, index) => (
        <BodyColorPicker
          color={`#${option}`}
          onPress={() => onPress('BodyColor', index)}
          key={index}
        />
      ))}
    </ScrollView>
  );
}

function BodyEyesOptions({ onPress }: any) {
  const options = useMemo(() => Array.from({ length: avatarConfig.Eyes.numOptions }), []);

  return (
    <ScrollView
      contentContainerStyle={{
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
      {/* {optionButtons.map((buttonComp) => buttonComp)} */}
      {options.map((option, index) => (
        <RiveOptionButton
          url={BODY_EYES_BUTTON_URL}
          onPress={(mainName, optionIdx) => onPress(mainName, optionIdx)}
          key={index}
          optionIdx={index}
          artboardName="BodyEyesButton"
          bodyPart="Eyes"
        />
      ))}
    </ScrollView>
  );
}
function BodyHairOptions({ onPress }: any) {
  const options = useMemo(() => Array.from({ length: avatarConfig.Hair.numOptions }), []);

  return (
    <ScrollView
      contentContainerStyle={{
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
      {/* {optionButtons.map((buttonComp) => buttonComp)} */}
      {options.map((option, index) => (
        <RiveOptionButton
          url={BODY_HAIR_BUTTON_URL}
          onPress={(mainName, optionIdx) => onPress(mainName, optionIdx)}
          key={index}
          optionIdx={index}
          artboardName="BodyHairButton"
          bodyPart="Hair"
        />
      ))}
    </ScrollView>
  );
}
function BodyFaceHairOptions({ onPress }: any) {
  const options = useMemo(() => Array.from({ length: avatarConfig.FaceHair.numOptions }), []);

  return (
    <ScrollView
      contentContainerStyle={{
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
      {/* {optionButtons.map((buttonComp) => buttonComp)} */}
      {options.map((option, index) => (
        <RiveOptionButton
          url={BODY_FACE_HAIR_BUTTON_URL}
          onPress={(mainName, optionIdx) => onPress(mainName, optionIdx)}
          key={index}
          optionIdx={index}
          artboardName="BodyFaceHairButton"
          bodyPart="FaceHair"
        />
      ))}
    </ScrollView>
  );
}
function BodyBackgroundOptions({ onPress }: any) {
  const options = useMemo(
    () => Array.from({ length: avatarConfig.BackgroundColor.numOptions }),
    []
  );

  return (
    <ScrollView
      contentContainerStyle={{
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
      {/* {optionButtons.map((buttonComp) => buttonComp)} */}
      {options.map((option, index) => (
        <RiveOptionButton
          url={BACKGROUND_COLOR_BUTTON_URL}
          onPress={(mainName, optionIdx) => onPress(mainName, optionIdx)}
          key={index}
          optionIdx={index}
          artboardName="BackgroundColorButton"
          bodyPart="BackgroundColor"
        />
      ))}
    </ScrollView>
  );
}

/**
 * List out all the character feature option buttons
 */
export default function RiveOptionsContainer({ onPress }: RiveOptionsContainerProps) {
  const { activeIcon } = useAvatarStateContext();

  // useEffect(() => {
  //   console.log('activeIcon', activeIcon);
  // }, [activeIcon]);

  return (
    <>
      {activeIcon === 'BodyColor' && <BodyColorOptions onPress={onPress} />}
      {activeIcon === 'BodySize' && <BodySizeOptions onPress={onPress} />}
      {activeIcon === 'BodyEyes' && <BodyEyesOptions onPress={onPress} />}
      {activeIcon === 'BodyHair' && <BodyHairOptions onPress={onPress} />}
      {activeIcon === 'BodyFaceHair' && <BodyFaceHairOptions onPress={onPress} />}
      {activeIcon === 'BackgroundColor' && <BodyBackgroundOptions onPress={onPress} />}
    </>
  );
}

// import { Button } from 'components/ui/Button';
// import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
// import { Pressable, StyleSheet, Text, View } from 'react-native';
// import Animated, {
//   Easing,
//   useAnimatedStyle,
//   useFrameCallback,
//   useSharedValue,
//   withDelay,
//   withSequence,
//   runOnJS,
//   withTiming,
//   measure,
//   useAnimatedRef,
//   runOnUI,
// } from 'react-native-reanimated';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Rive, { RiveRef, Alignment } from 'rive-react-native';
// import * as ScreenOrientation from 'expo-screen-orientation';
// import {
//   GestureHandlerRootView,
//   Gesture,
//   Directions,
//   GestureDetector,
// } from 'react-native-gesture-handler';

// const checkOrientation = async () => {
//   const orientation = await ScreenOrientation.getOrientationAsync();
//   console.log('Current orientation:', orientation);
//   await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
// };

// const MoveButton = ({ moveRight }: { moveRight: () => void }) => {
//   return (
//     <Pressable
//       onPress={moveRight}
//       style={{
//         position: 'absolute',
//         top: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'transparent',
//         zIndex: 10,
//         width: 100,
//       }}
//     />
//   );
// };

// const ActionsButton = ({ moveLeft }: { moveLeft: () => void }) => {
//   return (
//     <Pressable
//       onPress={moveLeft}
//       style={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         bottom: 0,
//         backgroundColor: 'transparent',
//         zIndex: 1,
//         width: 100,
//       }}
//     />
//   );
// };

// const totalPads = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

// const FROG_WIDTH = 100;

// const LILLYPAD_WIDTH = 120;

// const CAMERA_MOVE_SIZE = FROG_WIDTH + LILLYPAD_WIDTH + 50;

// const stageWidth = totalPads.length * FROG_WIDTH;

// const VELOCITY = 30;

// const LillyPad = ({ frogX }: { frogX: number }) => {
//   const animatedRef = useAnimatedRef();

//   const [occupied, setOccupied] = useState(false);

//   const getMeasurement = () => {
//     runOnUI(() => {
//       const measurement = measure(animatedRef);
//       if (measurement === null) {
//         return;
//       }
//       const { x, width, pageX } = measurement;
//       console.log({ x, width, pageX });
//       if (Math.round(pageX) === frogX) {
//         console.log('occupied at', pageX);
//         runOnJS(setOccupied)(true);
//       } else runOnJS(setOccupied)(false);
//     })();
//   };

//   useEffect(() => {
//     getMeasurement();
//   }, [frogX]);

//   return (
//     <Animated.View
//       ref={animatedRef}
//       style={[styles.lilyPad, { backgroundColor: occupied ? 'red' : 'yellow' }]}
//     />
//   );
// };

// const LilyPads = ({ frogX, started }: { frogX: number; started: boolean }) => {
//   // const stagePosition = useSharedValue(0);

//   // useEffect(() => {
//   //   if (!started) return;

//   //   stagePosition.value = withTiming(stagePosition.value - stageWidth, {
//   //     duration: 40000,
//   //     easing: Easing.linear,
//   //   });
//   // }, [started]);

//   // const stageStyles = useAnimatedStyle(() => {
//   //   return {
//   //     transform: [{ translateX: stagePosition.value }],
//   //   };
//   // });

//   return (
//     <Animated.View style={[{ width: 6000, flexDirection: 'row', columnGap: 150 }]}>
//       {totalPads.map((i) => (
//         <LillyPad frogX={frogX} key={i} />
//       ))}
//     </Animated.View>
//   );
// };

// const Bars = ({
//   energyBars,
//   setEnergyBars,
// }: {
//   energyBars: number;
//   setEnergyBars: React.Dispatch<React.SetStateAction<number>>;
// }) => {
//   const bars = useMemo(() => {
//     if (energyBars < 0) {
//       setEnergyBars(0);
//       return [];
//     }

//     return new Array(energyBars).fill(0);
//   }, [energyBars]);

//   useEffect(() => {
//     if (energyBars >= 3) {
//       return;
//     }

//     const barRefill = setTimeout(() => {
//       setEnergyBars((energyBars) => energyBars + 1);
//     }, 1500);

//     return () => {
//       clearTimeout(barRefill);
//     };
//   }, [bars]);

//   return (
//     <View style={styles.energyBarContainer}>
//       <View
//         style={{
//           width: '100%',
//           height: '100%',
//           flexDirection: 'row',
//           columnGap: 10,
//           backgroundColor: 'white',
//           padding: 10,
//         }}>
//         {bars.map((_, index) => (
//           <View key={index} style={{ backgroundColor: 'green', width: '25%' }} />
//         ))}
//       </View>
//     </View>
//   );
// };

// const StartButton = ({
//   started,
//   setStarted,
//   moveLeft,
// }: {
//   setStarted: React.Dispatch<React.SetStateAction<boolean>>;
//   moveLeft: () => void;
//   started: boolean;
// }) => {
//   return (
//     <Pressable
//       onPress={() => {
//         if (started) {
//           setStarted(false);
//           moveLeft();
//           return;
//         }
//         setStarted(true);
//       }}
//       style={[
//         {
//           position: 'absolute',
//           height: 50,
//           left: 30,
//           top: 30,
//           backgroundColor: 'yellow',
//           zIndex: 1,
//           width: 80,
//           justifyContent: 'center',
//           alignItems: 'center',
//         },
//       ]}>
//       <Text>Start</Text>
//     </Pressable>
//   );
// };

// const Frog = ({
//   energyBars,
//   setEnergyBars,
//   x,
//   y,
//   riveRef,
// }: {
//   energyBars: number;
//   setEnergyBars: React.Dispatch<React.SetStateAction<number>>;
//   x: Animated.SharedValue<number>;
//   y: Animated.SharedValue<number>;
//   riveRef: React.MutableRefObject<RiveRef | null>;
// }) => {
//   const hitBoxRef = useRef<Animated.View>(null);
//   const animatedStyles = useAnimatedStyle(() => {
//     return {
//       transform: [{ translateX: x.value }, { translateY: y.value }],
//     };
//   });

//   return (
//     <Animated.View style={[{ width: 120, height: 100 }, animatedStyles]}>
//       <Rive
//         alignment={Alignment.BottomCenter}
//         ref={riveRef}
//         stateMachineName=""
//         style={{
//           height: 100,
//           width: 120,
//           backgroundColor: 'transparent',
//           marginBottom: -24,
//         }}
//         url="https://res.cloudinary.com/dg6bgaasp/raw/upload/v1720643840/byivbwbumagfir6k2h2s.riv"
//       />
//     </Animated.View>
//   );
// };

// export function TestScreen() {
//   const [energyBars, setEnergyBars] = useState(3);
//   const [frogX, setFrogX] = useState(170 + FROG_WIDTH);
//   const [gotCaught, setGotCaught] = useState(false);
//   const [started, setStarted] = useState(false);

//   const riveRef = useRef<RiveRef>(null);
//   const hitBoxRef = useRef<Animated.View>(null);
//   const fishRef = useRef<View>(null);

//   const x = useSharedValue(0);
//   const fishx = useSharedValue(0);
//   const y = useSharedValue(0);
//   const stagePosition = useSharedValue(0);

//   const checkCollision = () => {
//     hitBoxRef.current?.measureInWindow((x, y, width, height) => {
//       const frogLeft = x;

//       console.log({ frogX: x, y, width, height });

//       fishRef.current?.measureInWindow((fishX, fishY, fishWidth, fishHeight) => {
//         const fishRight = fishX + fishWidth;

//         if (fishRight >= frogLeft) {
//           console.log('hit');
//           setGotCaught(true);
//         }

//         console.log({ fishX, fishY, fishWidth, fishHeight });
//       });

//       return x;
//     });
//   };

//   const moveRight = () => {
//     if (energyBars <= 0) {
//       return;
//     }

//     stagePosition.value = withTiming(stagePosition.value - CAMERA_MOVE_SIZE, {
//       duration: 300,
//       easing: Easing.linear,
//     });
//     riveRef.current?.play('Frog Jump Right 2');

//     withSequence(
//       withTiming((y.value = y.value - 100), { duration: 1000 }),
//       withTiming((x.value = x.value + 170 + FROG_WIDTH), { duration: 1000 }),
//       withDelay(2000, (y.value = withTiming(0)))
//     );

//     setFrogX((prev) => prev + 170 + FROG_WIDTH);
//     setEnergyBars((prev) => prev - 1);
//     console.log('jumped');
//   };

//   const swipeUp = useMemo(
//     () =>
//       Gesture.Fling()
//         .onStart(() => {
//           console.log('up_swipe_start');
//           if (energyBars <= 0) return;
//           runOnJS(moveRight)();
//         })
//         .direction(Directions.UP)
//         .onEnd(() => {
//           console.log(' up_swipe_end');
//         }),
//     []
//   );

//   const swipeDown = useMemo(
//     () =>
//       Gesture.Fling()
//         .onStart(() => {
//           console.log('down_swipe_start');
//         })
//         .direction(Directions.DOWN)
//         .onEnd(() => {
//           console.log('down_swipe_end');
//         }),
//     []
//   );

//   const moveLeft = () => {
//     x.value = 0;
//     y.value = 0;

//     stagePosition.value = 0;
//   };

//   const stageStyles = useAnimatedStyle(() => {
//     return {
//       transform: [{ translateX: stagePosition.value }],
//     };
//   });

//   const fishStyles = useAnimatedStyle(() => {
//     return {
//       transform: [{ translateX: fishx.value }],
//     };
//   });

//   useLayoutEffect(() => {
//     checkOrientation();
//   }, []);

//   // useFrameCallback(({ timeSincePreviousFrame: dt }) => {
//   //   if (!dt || !started) return;
//   //   stagePosition.value = withTiming(stagePosition.value - VELOCITY + dt / 1000, {
//   //     easing: Easing.linear,
//   //   });
//   //   // console.log(dt);
//   // });

//   useEffect(() => {
//     if (!started) return;

//     // stagePosition.value = withTiming(stagePosition.value - stageWidth, {
//     //   duration: 40000,
//     //   easing: Easing.linear,
//     // });
//   }, [started]);

//   const composed = Gesture.Race(swipeUp, swipeDown);

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <GestureDetector gesture={composed}>
//         <View style={{ flex: 1, backgroundColor: '#00c4ee' }}>
//           <SafeAreaView style={{ flex: 1, position: 'relative' }}>
//             <Bars setEnergyBars={setEnergyBars} energyBars={energyBars} />
//             <ActionsButton moveLeft={moveLeft} />
//             <StartButton setStarted={setStarted} moveLeft={moveLeft} started={started} />
//             <Animated.View
//               style={[
//                 { flexGrow: 1, justifyContent: 'flex-end', position: 'relative' },
//                 stageStyles,
//               ]}>
//               <Frog
//                 riveRef={riveRef}
//                 energyBars={energyBars}
//                 setEnergyBars={setEnergyBars}
//                 x={x}
//                 y={y}
//               />
//               <LilyPads started={started} frogX={x.value} />
//             </Animated.View>
//             <View style={{ height: 10, backgroundColor: 'white' }} />
//           </SafeAreaView>
//         </View>
//       </GestureDetector>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'blue',
//     paddingHorizontal: 10,
//     justifyContent: 'flex-end',
//     gap: 0,
//     position: 'relative',
//   },
//   lilyPad: { height: 10, width: LILLYPAD_WIDTH },
//   energyBarContainer: {
//     position: 'absolute',
//     right: 30,
//     top: 30,
//     backgroundColor: 'transparent',
//     zIndex: 5,
//     width: 100,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

import { Button } from 'components/ui/Button';
import { Colors } from 'constants/colors';
import { useSoundTrackModel } from 'models/soundtrackModel';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

export function TestScreen() {
  const { playOuterGameSound } = useSoundTrackModel();

  useEffect(() => {
    playOuterGameSound('MATCH_FOUND');
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.plain,
        paddingVertical: 20,
        gap: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}>
      {/* @ts-ignore */}
      <Button
        onPress={() => playOuterGameSound('MATCH_FOUND')}
        style={{ width: '100%' }}
        title="Confirm"
      />
    </View>
  );
}

const styles = StyleSheet.create({});

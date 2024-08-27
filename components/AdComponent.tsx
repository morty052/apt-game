import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import { Platform, View } from 'react-native';
import {
  useInterstitialAd,
  TestIds,
  BannerAd,
  BannerAdSize,
  useForeground,
} from 'react-native-google-mobile-ads';

import { Button } from './ui/Button';

function BannerAdComponent() {
  const bannerRef = useRef<BannerAd>(null);

  // (iOS) WKWebView can terminate if app is in a "suspended state", resulting in an empty banner when app returns to foreground.
  // Therefore it's advised to "manually" request a new ad when the app is foregrounded (https://groups.google.com/g/google-admob-ads-sdk/c/rwBpqOUr8m8).
  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  });

  return (
    <BannerAd
      ref={bannerRef}
      unitId={TestIds.BANNER}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
    />
  );
}

export default function AdComponent() {
  const { isLoaded, isClosed, load, show } = useInterstitialAd(TestIds.INTERSTITIAL);

  //   const navigation = useNavigation<any>();

  useEffect(() => {
    // Start loading the interstitial straight away
    load();
  }, [load]);

  useEffect(() => {
    if (isClosed) {
      // Action after the ad is closed
      //   navigation.navigate('NextScreen');
    }
  }, [isClosed]);

  return (
    <View style={{}}>
      <BannerAdComponent />
      <Button
        title="Navigate to next screen"
        onPress={() => {
          if (isLoaded) {
            show();
          } else {
            // No advert ready to show yet
            // navigation.navigate('NextScreen');
          }
        }}
      />
    </View>
  );
}

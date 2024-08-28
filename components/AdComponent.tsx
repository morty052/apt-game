import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import {
  useInterstitialAd,
  TestIds,
  BannerAd,
  BannerAdSize,
  useForeground,
} from 'react-native-google-mobile-ads';

import { Button } from './ui/Button';

export function BannerAdComponent() {
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

const useADComponent = () => {
  const { isLoaded, isClosed, load, show } = useInterstitialAd(TestIds.INTERSTITIAL);

  return { isLoaded, isClosed, load, show };
};

export default function AdComponent({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const { isLoaded, isClosed, load, show } = useInterstitialAd(TestIds.INTERSTITIAL);

  const handleShow = () => {
    setVisible(false);
    if (isLoaded) {
      show();
    } else {
      // No advert ready to show yet
      // navigation.navigate('NextScreen');
    }
  };

  //   const navigation = useNavigation<any>();

  useEffect(() => {
    // Start loading the interstitial straight away
    load();
  }, [load]);

  useEffect(() => {
    // show when visible is true
    if (visible) {
      handleShow();
    }
  }, [visible, handleShow]);

  useEffect(() => {
    if (isClosed) {
      // Action after the ad is closed
      //   navigation.navigate('NextScreen');
      load();
    }
  }, [isClosed]);

  //   if (!visible) {
  //     return null;
  //   }

  return <View style={{}}></View>;
}

import dayjs from 'dayjs';
import { useAppStore } from 'models/appStore';
import { useEffect, useState } from 'react';
import { getItem, setItem } from 'utils/storage';

type reward = {
  day: any;
  reward: any;
};

const getRewardForDay = async (day: number) => {
  const rewards = [
    { day: 1, reward: 10 },
    { day: 2, reward: 20 },
    { day: 3, reward: 30 },
    { day: 4, reward: 40 },
    { day: 5, reward: 50 },
    { day: 6, reward: 60 },
    { day: 7, reward: 60 },
  ];

  return rewards[day];
};

const getTimeCycles = () => {
  //* get current time
  const now = dayjs();
  //* get last login time
  const lastLogin = dayjs(getItem('LAST_LOGIN'));

  const test = dayjs('2024-08-03 15:01:58');
  const isOver24Hours = now.diff(lastLogin, 'minutes') >= 1440;
  const isDaySkipped = now.diff(lastLogin, 'days') >= 1;

  return {
    isOver24Hours,
    isDaySkipped,
    lastLogin,
  };
};

/**
 * Hook to get the appopriate daily login reward
 * and updates the LAST_LOGIN and LOGIN_COUNT items in storage if the current time
 * is more than 24 hours after the last login time.
 *
 * @return {{ dailyLogin: () => void }} An object with a dailyLogin function.
 */
export const useDailyLogin = () => {
  const [rewardForDay, setRewardForDay] = useState<null | reward>(null);
  const [loadedReward, setLoadedReward] = useState(false);
  const { isDaySkipped, isOver24Hours, lastLogin } = getTimeCycles();

  useEffect(() => {
    //* login count
    const dailyLoginCount = getItem('LOGIN_COUNT') || 0;

    //* TODO handle case where last login is over 48 hours (cycle broken)
    if (isDaySkipped) {
      console.log('day was skipped, cycle broken');
      useAppStore.setState(() => ({
        rewardCount: 0,
      }));
      setLoadedReward(true);
      return;
    }

    //* handle case where last login is over 24 hours
    if (isOver24Hours) {
      console.log('day has passed, cycle kept');
      const DAILY_LOGIN_COUNT = Number(dailyLoginCount) + 1;
      setItem('LOGIN_COUNT', DAILY_LOGIN_COUNT.toString());
      getRewardForDay(DAILY_LOGIN_COUNT).then((reward) => {
        setRewardForDay(reward);
        setLoadedReward(true);
      });
      useAppStore.setState(() => ({
        rewardCount: DAILY_LOGIN_COUNT,
      }));
      return;
    }

    console.log('just updating last login time', {
      isDaySkipped,
      isOver24Hours,
      lastLogin: `was ${dayjs().diff(lastLogin, 'minutes')} minutes ago`,
    });
    //* handle updating last login time
    // setItem('LAST_LOGIN', `${dayjs().format('YYYY-MM-DD HH:mm:ss')}`);
    setLoadedReward(true);
  }, []);

  return { rewardForDay, loadedReward };
};

import { getItem } from 'utils/storage';
import { create } from 'zustand';

import { MAX_POINTS_PER_ANSWER, ALPHABETS } from '../constants';
import { CharacterNames, playerProps } from '../types';

type singlePlayer = {
  username: string;
  answers: {
    Animal: string;
    Place: string;
    Thing: string;
  };
  character: CharacterNames | null;
};

type GameProps = {
  player: singlePlayer;
  round: number;
  totalScore: number;
  lives: number;
  takenDamage: boolean;
  gameOver: boolean;
  winner: null | playerProps;
  activeLetter: string;
  alphabets: string[];
  selectingLetter: boolean;
  playing: boolean;
  tallying: boolean;
  viewingResults: boolean;
  getPointsForPlayer: ({ player }: { player: singlePlayer }) => number;
  updateScoreForRound: () => void;
  confirmLetterSelection: (letter: string) => void;
  updateAnswers: ({ answer, field }: { answer: string; field: string }) => void;
  readyTallyMode: () => void;
  handleBonusPoints: (character: CharacterNames) => void;
  readyNextRound: (round: number) => void;
  endMatch: () => void;
};

const checkForLongWords = (uniqueAnswers: string[]) => {
  if (uniqueAnswers.length === 0) {
    return [];
  }

  const longWords = uniqueAnswers
    .filter((answer) => answer.length > 4)
    .map((answer) => answer.toLowerCase());
  return longWords;
};

const getPointsForPlayer = ({ player }: { player: singlePlayer }) => {
  if (!player) {
    return 0;
  }

  const halfPoint = 25;
  const validAnswers = Object.values(player.answers)
    .filter((a) => a !== 'FORFEITED')
    .filter((a) => a !== 'BUSTED')
    .filter((a) => a !== '');

  // * Points for all unique answers
  const uniqueAnswerPoints = validAnswers.length * MAX_POINTS_PER_ANSWER;

  // * Handle RacoonPoints
  // if (player.character === 'RACOON') {
  //   // * Points for racoon player
  //   const duplicateAnswersPoints = duplicates.length * MAX_POINTS_PER_ANSWER;
  //   const totalPoints = uniqueAnswerPoints + duplicateAnswersPoints;
  //   console.log('Racoon not affected by deduction', totalPoints);
  //   return totalPoints;
  // }

  // * handleGeniusPoints
  // if (player.character === 'GENIUS') {
  //   const longAnswers = checkForLongWords(uniqueAnswers);

  //   // * points for long answer
  //   const longAnswerPoints = longAnswers.length * halfPoint;

  //   // * points for unique answers
  //   const uniqueAnswerPoints = uniqueAnswers.length * MAX_POINTS_PER_ANSWER;

  //   // * Points for non unique answers
  //   const duplicateAnswersPoints = duplicates.length * halfPoint;

  //   // * Sum of points unique and non unique answers
  //   const totalPoints = uniqueAnswerPoints + duplicateAnswersPoints + longAnswerPoints;
  //   console.log('totalPoints for genius', totalPoints);

  //   return totalPoints;
  // }

  // * Sum of points unique and non unique answers
  const totalPoints = uniqueAnswerPoints;

  console.log('totalPoints', totalPoints);

  return totalPoints;
};

export const useSinglePlayerStore = create<GameProps>((set, state) => ({
  player: {
    username: getItem('USERNAME') || 'Guest',
    answers: { Animal: '', Place: '', Thing: '' },
    character: null,
  },
  winner: null,
  round: 0,
  activeLetter: 'A',
  totalScore: 0,
  lives: 3,
  takenDamage: false,
  gameOver: false,
  alphabets: ALPHABETS,
  selectingLetter: true,
  playing: false,
  tallying: false,
  viewingResults: false,
  confirmLetterSelection: (letter) => {
    set((state) => ({
      selectingLetter: false,
      playing: true,
      alphabets: state.alphabets.filter((l) => l !== letter),
      activeLetter: letter,
    }));
  },
  updateAnswers: ({ answer, field }: { answer: string; field: string }) => {
    set((state) => ({
      player: {
        ...state.player,
        answers: {
          ...state.player.answers,
          [field]: answer,
        },
      },
    }));
  },
  updateScoreForRound: () => {
    const { player } = state();
    const totalPoints = getPointsForPlayer({ player });
    const newScore = state().totalScore + totalPoints;

    console.log(newScore);

    set((state) => ({
      totalScore: newScore,
    }));
  },
  readyTallyMode: () => {
    set((state) => ({
      tallying: true,
      playing: false,
    }));
  },
  handleBonusPoints: (character) => {
    switch (character) {
      case 'DETECTIVE':
        console.log('extra fifty points for', state().player.username);
        set((state) => ({
          totalScore: state.totalScore + 50,
        }));

        break;

      default:
        break;
    }
  },
  readyNextRound: (round: number) => {
    const { player } = state();
    const totalPoints = getPointsForPlayer({ player });
    const newScore = state().totalScore + totalPoints;
    set((state) => ({
      tallying: false,
      playing: false,
      selectingLetter: true,
      activeLetter: '',
      totalScore: newScore,
      player: {
        ...state.player,
        answers: { Animal: '', Place: '', Thing: '' },
      },
      round,
    }));
  },
  getPointsForPlayer: ({ player }: { player: singlePlayer }) => {
    if (!player) {
      return 0;
    }
    const validAnswers = Object.values(player.answers)
      .filter((a) => a !== 'FORFEITED')
      .filter((a) => a !== 'BUSTED')
      .filter((a) => a !== '');

    // * Points for all unique answers
    const uniqueAnswerPoints = validAnswers.length * MAX_POINTS_PER_ANSWER;

    // * Sum of points unique and non unique answers
    const totalPoints = uniqueAnswerPoints;

    console.log('totalPoints', totalPoints);

    return totalPoints;
  },
  endMatch: () => {
    const { player } = state();
    const totalPoints = getPointsForPlayer({ player });
    const newScore = state().totalScore + totalPoints;
    set((state) => ({
      totalScore: newScore,
    }));
  },
}));

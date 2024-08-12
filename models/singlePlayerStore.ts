import { create } from 'zustand';

import { MAX_POINTS_PER_ANSWER, ALPHABETS } from '../constants';
import { CharacterNames, playerProps } from '../types';
import { getItem } from 'utils/storage';

type GameProps = {
  room: string;
  player: playerProps;
  opponents: playerProps[];
  round: number;
  totalScore: number;
  winner: null | playerProps;
  activeLetter: string;
  alphabets: string[];
  selectingLetter: boolean;
  playing: boolean;
  tallying: boolean;
  currentTurn: number;
  updateScoreForRound: () => void;
  updateOpponents: (opponents: playerProps[]) => void;
  confirmLetterSelection: (letter: string) => void;
  updateAnswers: ({ answer, field }: { answer: string; field: string }) => void;
  readyTallyMode: () => void;
  handleBustedPlayer: ({
    username,
    type,
    self,
  }: {
    username: string;
    type: string;
    self: boolean;
  }) => void;
  handleBonusPoints: (character: CharacterNames) => void;
  readyNextRound: (round: number) => void;
  endMatch: () => void;
  initGame: ({ room, queue }: { room: string; queue: playerProps[] }) => void;
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

const checkForDuplicateAnswers = ({
  validAnswers,
  opponents,
}: {
  validAnswers: string[];
  opponents: playerProps[];
}) => {
  const opponentAnswers = opponents
    .map((opponent) => Object.values(opponent?.answers))
    .flat()
    .map((answer) => answer.toLowerCase())
    .filter((a) => a !== '');

  // * All answers unique to player in this round
  const uniqueAnswers = validAnswers?.filter(
    (answer) => !opponentAnswers.includes(answer.toLowerCase())
  );

  // * Answers that occur more than once in this round
  const duplicates = validAnswers
    .filter((answer) => opponentAnswers.includes(answer.toLowerCase()))
    .filter((a) => a !== '');

  // console.log('opponentAnswers', opponentAnswers);
  // console.log('uniqueAnswers', uniqueAnswers);
  // console.log('duplicates', duplicates);

  return { uniqueAnswers, duplicates };
};

export const getPointsForPlayer = ({
  player,
  opponents,
}: {
  player: playerProps;
  opponents: playerProps[];
}) => {
  if (!opponents || !player) {
    return 0;
  }

  const halfPoint = 25;
  const validAnswers = Object.values(player.answers)
    .filter((a) => a !== 'FORFEITED')
    .filter((a) => a !== 'BUSTED')
    .filter((a) => a !== '');

  const { uniqueAnswers, duplicates } = checkForDuplicateAnswers({
    validAnswers,
    opponents,
  });

  // * Points for all unique answers
  const uniqueAnswerPoints = uniqueAnswers.length * MAX_POINTS_PER_ANSWER;

  // * Points for non unique answers
  const duplicateAnswersPoints = duplicates.length * halfPoint;

  // * Handle RacoonPoints
  if (player.character === 'RACOON') {
    // * Points for racoon player
    const duplicateAnswersPoints = duplicates.length * MAX_POINTS_PER_ANSWER;
    const totalPoints = uniqueAnswerPoints + duplicateAnswersPoints;
    console.log('Racoon not affected by deduction', totalPoints);
    return totalPoints;
  }

  // * handleGeniusPoints
  if (player.character === 'GENIUS') {
    const longAnswers = checkForLongWords(uniqueAnswers);

    // * points for long answer
    const longAnswerPoints = longAnswers.length * halfPoint;

    // * points for unique answers
    const uniqueAnswerPoints = uniqueAnswers.length * MAX_POINTS_PER_ANSWER;

    // * Points for non unique answers
    const duplicateAnswersPoints = duplicates.length * halfPoint;

    // * Sum of points unique and non unique answers
    const totalPoints = uniqueAnswerPoints + duplicateAnswersPoints + longAnswerPoints;
    console.log('totalPoints for genius', totalPoints);

    return totalPoints;
  }

  // * Sum of points unique and non unique answers
  const totalPoints = uniqueAnswerPoints + duplicateAnswersPoints;

  console.log('totalPoints', totalPoints);

  return totalPoints;
};

const getNextTurn = (state: () => GameProps): number => {
  // * total turns = opponents + 1 (for self)
  const maxTurn = state().opponents.length + 1;

  // * next turn = current turn + 1
  const nextTurn = state().currentTurn + 1;

  if (nextTurn + 1 > maxTurn) {
    return 0;
  }

  return nextTurn;
};

export const useSinglePlayerStore = create<GameProps>((set, state) => ({
  room: '',
  player: {
    username: getItem('USERNAME') || 'Guest',
    answers: { Name: '', Animal: '', Place: '', Thing: '' },
    score: 0,
    inTallyMode: false,
    turn: 0,
    strikes: 0,
    doneTallying: false,
    character: null,
  },
  opponents: [],
  winner: null,
  round: 0,
  activeLetter: 'A',
  totalScore: 0,
  alphabets: ALPHABETS,
  selectingLetter: true,
  playing: false,
  tallying: false,
  currentTurn: 0,
  initGame: ({ queue, room }) => {
    const player = queue.find((player) => player.username === state().player.username);

    // * get opponents from queue
    const opponents = queue.filter((player) => player.username !== state().player.username);
    set({
      player,
      opponents,
      room,
    });
  },
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
    const { player, opponents } = state();
    const totalPoints = getPointsForPlayer({ player, opponents });
    const newScore = state().totalScore + totalPoints;

    console.log(newScore);

    set((state) => ({
      totalScore: newScore,
    }));
  },
  updateOpponents: (opponents) => {
    set((state) => ({
      opponents,
    }));
  },
  readyTallyMode: () => {
    set((state) => ({
      tallying: true,
      playing: false,
      // player: {
      //   ...state.player,
      //   answers,
      // },
    }));
  },
  handleBustedPlayer: ({
    username,
    type,
    self,
  }: {
    username: string;
    type: string;
    self: boolean;
  }) => {
    if (self) {
      set((state) => ({
        player: {
          ...state.player,
          answers: {
            ...state.player.answers,
            [type]: 'BUSTED',
          },
        },
      }));
      console.log(state().player);
      return;
    }

    const updatedOpponentsList = state().opponents.map((opponent) => {
      if (opponent.username === username) {
        return {
          ...opponent,
          answers: {
            ...opponent.answers,
            [type]: 'BUSTED',
          },
        };
      }
      return opponent;
    });

    set(() => ({
      opponents: updatedOpponentsList,
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
    const { player, opponents } = state();
    const totalPoints = getPointsForPlayer({ player, opponents });
    const newScore = state().totalScore + totalPoints;
    const nextTurn = getNextTurn(state);
    const resetOpponents = state().opponents.map((opponent) => ({
      ...opponent,
      answers: { Name: '', Animal: '', Place: '', Thing: '' },
      inTallyMode: false,
      score: 0,
    }));
    set((state) => ({
      currentTurn: nextTurn,
      tallying: false,
      playing: false,
      selectingLetter: true,
      opponents: resetOpponents,
      activeLetter: '',
      totalScore: newScore,
      player: {
        ...state.player,
        answers: { Name: '', Animal: '', Place: '', Thing: '' },
      },
      round,
    }));
  },
  endMatch: () => {
    const { player, opponents } = state();
    const totalPoints = getPointsForPlayer({ player, opponents });
    const newScore = state().totalScore + totalPoints;
    set((state) => ({
      totalScore: newScore,
    }));
  },
}));

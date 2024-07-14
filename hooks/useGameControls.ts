import { useGameStore } from 'models/gameStore';
import React from 'react';

export const useGameControls = () => {
  const { updateTallying, updatePlaying, updateTurn, currentTurn, updateSelectingLetter } =
    useGameStore();

  const readyNextRound = React.useCallback((nextTurn: number) => {
    updateTurn(nextTurn);
    updateTallying(false);
    updatePlaying(false);
    updateSelectingLetter(true);
  }, []);

  return { readyNextRound };
};

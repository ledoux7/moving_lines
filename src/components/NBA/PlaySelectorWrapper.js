import React from 'react';
import { useLocation } from 'react-router';
import PlaySelector from './PlaySelecter';
import { useGetPBPForGame } from '../../hooks/analytics';

const PlaySelectorWrapper = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const gameId = query.get('gameId');

  const {
    data,
  } = useGetPBPForGame(gameId);

  return <PlaySelector data={data} />;
};

export default PlaySelectorWrapper;

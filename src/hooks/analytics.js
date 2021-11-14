/* eslint-disable import/prefer-default-export */
import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import {
  useQuery, useQueries, useMutation, useInfiniteQuery,
} from 'react-query';
import {
  fetchFromDynamoDb, fetchNew, fetchViaProxy, fetchPBP, fetchGames, fetchPlayUrl,
} from '../api';

export const useGetPBPForGame = gameId => {
  const [page, setPage] = React.useState(0);
  // const [gameId, setGameId] = React.useState('0022100078');

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isSuccess,
  } = useInfiniteQuery(
    ['pbp', gameId],
    fetchPBP,
    {
      getNextPageParam: (lastPage, pages) => {
        // const { page, total_pages: totalPages } = lastPage.data;
        // return (page < totalPages) ? page + 1 : undefined;
        const a = 12;
        return {
          NextToken: encodeURIComponent(lastPage.NextToken),
          QueryExecutionId: lastPage.QueryExecutionId,
        };
      },
      // select: d => ({
      //   pages: [...d.pages].reverse(),
      //   pageParams: [...d.pageParams].reverse(),
      // }),
    },
  );

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isSuccess,
  };
};

export const useGetGames = () => {
  const [page, setPage] = React.useState(0);
  // const [gameId, setGameId] = React.useState('0022100078');

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    ['games'],
    fetchGames,
    {
      getNextPageParam: (lastPage, pages) => {
        // const { page, total_pages: totalPages } = lastPage.data;
        // return (page < totalPages) ? page + 1 : undefined;
        const a = 12;
        return {
          NextToken: encodeURIComponent(lastPage.NextToken),
          QueryExecutionId: lastPage.QueryExecutionId,
        };
      },
    },
  );

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};

export const useGetVideoUrl = (gameId, eventNum, eventType, cached = true) => {
  const [page, setPage] = React.useState(0);
  // const [gameId, setGameId] = React.useState('0022100078');

  const fn = cached
    ? ({ queryKey }) => fetchFromDynamoDb({ queryKey })
    : ({ queryKey }) => fetchViaProxy({ queryKey });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isSuccess,
  } = useQuery(
    {
      queryKey: ['videoUrl', { gameId, eventNum: curEventNum, eventType: curEventType }],
      // queryFn: ({ queryKey }) => fetchFromDynamoDb({ queryKey }),
      queryFn: fn,
      // queryFn: state.checkedB
      //   ? ({ queryKey }) => fetchFromDynamoDb({ queryKey })
      //   : ({ queryKey }) => fetchViaProxy({ queryKey }),

      refetchOnWindowFocus: false,
      retry: 0,
      // staleTime: 60 * 1000,
      refetchOnMount: false,
    },
  );

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isSuccess,
  };
};

export const useGetPlayUrl = (gameId, eventNum, eventType) => {
  const [page, setPage] = React.useState(0);
  // const [gameId, setGameId] = React.useState('0022100078');

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isSuccess,
  } = useQuery(
    ['play', gameId, eventNum, eventType],
    fetchPlayUrl,
    {

      // getNextPageParam: (lastPage, pages) => {
      //   // const { page, total_pages: totalPages } = lastPage.data;
      //   // return (page < totalPages) ? page + 1 : undefined;
      //   const a = 12;
      //   return {
      //     NextToken: encodeURIComponent(lastPage.NextToken),
      //     QueryExecutionId: lastPage.QueryExecutionId,
      //   };
      // },
    },
  );

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isSuccess,
  };
};

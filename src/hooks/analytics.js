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

  const query = useInfiniteQuery(
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
    ...query,
  };
};

export const useGetGames = () => {
  const [page, setPage] = React.useState(0);
  // const [gameId, setGameId] = React.useState('0022100078');

  const query = useInfiniteQuery(
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
    ...query,
  };
};

export const useGetVideoUrlFresh = (gameId, eventNum, eventType, enabled = false) => {
  const query = useQuery(
    {
      queryKey: ['playProxy', { gameId, eventNum, eventType }],
      queryFn: ({ queryKey }) => fetchViaProxy({ queryKey }),
      refetchOnWindowFocus: false,
      retry: 0,
      enabled,
      // staleTime: 60 * 1000,
      refetchOnMount: false,
    },
  );

  return {
    ...query,
  };
};

// export const useGetPlayUrl = (gameId, eventNum, eventType) => {
//   const [page, setPage] = React.useState(0);
//   // const [gameId, setGameId] = React.useState('0022100078');

//   const {
//     data,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     status,
//     isSuccess,
//   } = useQuery(
//     ['play', gameId, eventNum, eventType],
//     fetchPlayUrl,
//     {

//       // getNextPageParam: (lastPage, pages) => {
//       //   // const { page, total_pages: totalPages } = lastPage.data;
//       //   // return (page < totalPages) ? page + 1 : undefined;
//       //   const a = 12;
//       //   return {
//       //     NextToken: encodeURIComponent(lastPage.NextToken),
//       //     QueryExecutionId: lastPage.QueryExecutionId,
//       //   };
//       // },
//     },
//   );

//   return {
//     data,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     status,
//     isSuccess,
//   };
// };

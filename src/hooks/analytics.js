import {
  useQuery, useInfiniteQuery,
} from 'react-query';
import {
  fetchViaProxy, fetchPBP,
  fetchGames,
  fetchRandomShotsPlayer,
  fetchPlayerNames,
  fetchTeamNames,
  fetchRandomShotsTeam,
  fetchRandomShotsOpp,
  fetchIsItFoulPlayer,
  fetchShotLog,
  fetchBoxScore,
} from '../api';

export const useGetPBPForGame = gameId => {
  const query = useInfiniteQuery(
    ['pbp', gameId],
    fetchPBP,
    {
      getNextPageParam: (lastPage, pages) => {
        const a = 12;
        if (lastPage.NextToken) {
          return {
            NextToken: lastPage.NextToken ? encodeURIComponent(lastPage.NextToken) : '',
            QueryExecutionId: lastPage.QueryExecutionId,
          };
        }
        return undefined;
      },
    },
  );

  return {
    ...query,
  };
};

export const useGetGames = () => {
  const query = useInfiniteQuery(
    ['games'],
    fetchGames,
    {
      retry: 2,
      staleTime: 2 * 60 * 60 * 1000,
      cacheTime: 2 * 60 * 60 * 1000,
      getNextPageParam: (lastPage, pages) => {
        const a = 12;
        if (lastPage.NextToken) {
          return {
            NextToken: lastPage.NextToken ? encodeURIComponent(lastPage.NextToken) : '',
            QueryExecutionId: lastPage.QueryExecutionId,
          };
        }
        return undefined;
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

export const useGetRandomShotsPlayer = (playerName, fg3) => {
  const query = useQuery(
    {
      queryKey: ['random_shots_player', { playerName, fg3 }],
      queryFn: ({ queryKey }) => fetchRandomShotsPlayer({ queryKey }),
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!playerName,
      // staleTime: 60 * 1000,
      refetchOnMount: false,
    },
  );

  return {
    ...query,
  };
};

export const useGetRandomShotsTeam = (team, fg3) => {
  const query = useQuery(
    {
      queryKey: ['random_shots_team', { team, fg3 }],
      queryFn: ({ queryKey }) => fetchRandomShotsTeam({ queryKey }),
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!team,
      // staleTime: 60 * 1000,
      refetchOnMount: false,
    },
  );

  return {
    ...query,
  };
};

export const useGetRandomShotsOpp = (team, fg3) => {
  const query = useQuery(
    {
      queryKey: ['random_shots_opp', { team, fg3 }],
      queryFn: ({ queryKey }) => fetchRandomShotsOpp({ queryKey }),
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!team,
      // staleTime: 60 * 1000,
      refetchOnMount: false,
    },
  );

  return {
    ...query,
  };
};

export const useGetIsItFoul = (playerName, gameId) => {
  const query = useQuery(
    {
      queryKey: ['isit_foul', { playerName, gameId }],
      queryFn: ({ queryKey }) => fetchIsItFoulPlayer({ queryKey }),
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!playerName,
      // staleTime: 60 * 1000,
      refetchOnMount: false,
    },
  );

  return {
    ...query,
  };
};

export const useGetPlayerNames = () => {
  const query = useQuery(
    {
      queryKey: ['playernames'],
      queryFn: () => fetchPlayerNames(),
      refetchOnWindowFocus: false,
      retry: 0,
      // staleTime: 60 * 1000,
      refetchOnMount: false,
    },
  );

  return {
    ...query,
  };
};

export const useGetTeamNames = () => {
  const query = useQuery(
    {
      queryKey: ['teamnames'],
      queryFn: () => fetchTeamNames(),
      refetchOnWindowFocus: false,
      retry: 0,
      // staleTime: 60 * 1000,
      refetchOnMount: false,
    },
  );

  return {
    ...query,
  };
};

export const useGetShotLog = playerName => {
  const query = useInfiniteQuery(
    ['shots/player', playerName],
    fetchShotLog,
    {
      enabled: !!playerName,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.NextToken) {
          return {
            NextToken: lastPage.NextToken ? encodeURIComponent(lastPage.NextToken) : '',
            QueryExecutionId: lastPage.QueryExecutionId,
          };
        }
        return undefined;
      },
    },
  );

  return {
    ...query,
  };
};

export const useGetBoxScoreGame = gameId => {
  const query = useInfiniteQuery(
    ['boxscore', gameId],
    fetchBoxScore,
    {
      enabled: !!gameId,
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

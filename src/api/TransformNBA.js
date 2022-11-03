/* eslint-disable import/prefer-default-export */
export const transform = teamStats => {
  // console.log("in", teamStats.resource,
  // !!teamStats?.resultSets[0]?.headers, !!teamStats?.resultSets[0]?.rowSet);
  if ((teamStats?.resultSets?.length && teamStats?.resultSets[0]?.headers)
    && (teamStats?.resultSets?.length && teamStats?.resultSets[0]?.rowSet)
  ) {
    const { headers } = teamStats.resultSets[0];
    const { rowSet } = teamStats.resultSets[0];
    // console.log(headers);
    const hmm = [];

    for (let i = 0; i < rowSet.length; i++) {
      const row = rowSet[i];
      const objj = {};

      for (let j = 0; j < headers.length; j++) {
        objj[headers[j]] = row[j];
      }
      hmm.push(objj);
    }
    // console.log(hmm);
    return hmm;
  }
  return null;
};

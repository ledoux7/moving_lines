import {
  ButtonBase, Card, CardContent, Grid, Typography,
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import ExploreIcon from '@material-ui/icons/Explore';
import { useGetGames } from '../hooks/analytics';

function useImportImage(filePath) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    import(`../styles/images/${filePath}`)
      .then(img => (isMounted ? setImage(img.default) : null))
      .catch(() => null);

    // eslint-disable-next-line no-return-assign
    return () => isMounted = false;
  }, [filePath]);
  return image;
}

const My = ({ title, path, content }) => {
  const a = 123;

  return (
    <Grid item>
      <ButtonBase component={Link} to={path}>
        <Card style={{ width: 350, minHeight: 300 }}>
          <CardContent style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
          >
            <Typography style={{ fontSize: 36 }} color='textSecondary' align='center' gutterBottom>
              {title}
            </Typography>
            {content}
          </CardContent>
        </Card>
      </ButtonBase>
    </Grid>
  );
};

const App = () => {
  const shotchart = useImportImage('shotchart.png');
  // const court = useImportImage('court.png');
  useGetGames(); // prefetch games

  const games = (
    <OndemandVideoIcon style={{
      width: 150,
      height: 150,
    }}
    />
  );

  const explore = (
    <ExploreIcon style={{
      width: 150,
      height: 150,
    }}
    />
  );

  const sc = (
    <div style={{
      backgroundImage: `url(${shotchart})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      width: 220,
      height: 192,
    }}
    />
  );

  return (
    <div style={{
      fontSize: 60,
      height: '100%',
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 50,
    }}
    >
      <Grid
        style={{
          flexGrow: 1,
          width: '100%',
          margin: 0,
        }}
        container
        spacing={2}
      >
        <Grid
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            margin: 0,
          }}
          container
          spacing={4}
          columns={3}
        >
          <My title='Recent Games' path='/games' content={games} />
          <My title='Explore' path='/random' content={explore} />
          <My title='Shot Chart' path='/shots' content={sc} />
        </Grid>
      </Grid>
    </div>
  );
};

export default App;

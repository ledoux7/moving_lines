import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          p={3}
          style={{ padding: 0 }}
          // classes={{
          //   flexContainer: classes.flexContainer,
          // // textColorInherit: classes.textColorInherit,
          // }}
        >
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  // eslint-disable-next-line react/require-default-props
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    justifyContent: 'center',
  },
  flexContainer: {
    // width: '100%',
    // justifyContent: 'center',
  },
  textColorInherit: {
    color: 'inherit',
    opacity: '0.85',
  },
}));

const MyTabs = ({ labels, tabContents, title }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div
      className={classes.root}
      style={{
        // width: 800,
        // width: ' 80vw',
        // display: 'flex',
        // flexDirection: 'column',
        // flex: 1,
        // maxWidth: 600,
        // width: 600,
      }}
    >
      <AppBar
        position='static'
        style={{
          width: 800,
          // width: ' 80vw',
          // display: 'flex',
          // flexDirection: 'column',
          // flex: 1,
          maxWidth: '85vw',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant='scrollable'
          scrollButtons='on'
          // textColor='secondary'
          // indicatorColor='#FFFFFF'
          // centered
          classes={{
            flexContainer: classes.flexContainer,
            // textColorInherit: classes.textColorInherit,
          }}
          // indicatorColor='primary'
          // textColor='primary'
          aria-label='scrollable force tabs example'
          // style={{ justifyContent: 'center' }}
        >
          {labels.map((l, i) => (
            <Tab
              key={i}
              classes={{
                // flexContainer: classes.flexContainer,
                textColorInherit: classes.textColorInherit,
              }}
              label={l}
              {...a11yProps(i)}
            />
          ))}
          {/* <Tab label='Item Two' {...a11yProps(1)} />
          <Tab label='Item Three' {...a11yProps(2)} /> */}
        </Tabs>
      </AppBar>
      <Typography component='h5' variant='h3' style={{ display: 'flex', justifyContent: 'center', margin: 10 }}>
        {title}
      </Typography>
      {tabContents.map((c, i) => (
        <TabPanel key={i} value={value} index={i}>
          {c}
        </TabPanel>
      ))}
    </div>
  );
};

MyTabs.defaultProps = {
  labels: [],
  tabContents: [],
};

export default MyTabs;

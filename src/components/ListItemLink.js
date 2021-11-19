/* eslint-disable react/display-name */
import React, { useMemo, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { ButtonBase, Tooltip } from '@material-ui/core';
import useStyles from '../styles';

const ListItemLink = ({
  to, name, icon, button = false, onClick = () => null,
}) => {
  const classes = useStyles();

  const CustomLink = useMemo(
    () => forwardRef((linkProps, ref) => (
      <Link
        ref={ref}
        to={to}
        {...linkProps}
        style={{
          textDecoration: 'none',
          color: '#FFFFFF',
        }}
      />
    )),
    [to],
  );

  if (button) {
    return (
      <Tooltip title={name}>
        <ButtonBase onClick={onClick}>
          <ListItem button key={'Home'}>
            <ListItemIcon>
              {icon}
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItem>
        </ButtonBase>
      </Tooltip>
    );
  }

  return (
    <CustomLink to={to}>
      <Tooltip title={name} placement='right'>
        <ListItem button key={'Home'}>
          <ListItemIcon>
            {icon}
          </ListItemIcon>
          <ListItemText primary={name} className={classes.listItem} />
        </ListItem>
      </Tooltip>
    </CustomLink>
  );
};

export default ListItemLink;

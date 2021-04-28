/* eslint-disable react/display-name */
import React, { useMemo, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { ButtonBase } from '@material-ui/core';
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
      <ButtonBase onClick={onClick}>
        <ListItem button key={'Home'}>
          <ListItemIcon>
            {icon}
          </ListItemIcon>
          <ListItemText primary={name} />
        </ListItem>
      </ButtonBase>
    );
  }

  return (
    <CustomLink to={to}>
      <ListItem button key={'Home'}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={name} className={classes.listItem} />
      </ListItem>
    </CustomLink>
  );
};

export default ListItemLink;

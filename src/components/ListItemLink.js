/* eslint-disable react/display-name */
import React, { useMemo, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { IconButton } from '@material-ui/core';

const ListItemLink = ({
  to, name, icon, button = false, onClick = () => null,
}) => {
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
      <ListItem button key={'Home'}>
        <ListItemIcon>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={onClick}
            edge='start'
          >
            {icon}
          </IconButton>

        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
    );
  }

  return (
    <CustomLink to={to}>
      <ListItem button key={'Home'}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
    </CustomLink>
  );
};

export default ListItemLink;

import React, { useState } from 'react';
import { FC } from 'react';
import {
  Box,
  InputAdornment,
  SvgIcon,
  TextField,
  makeStyles
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { Search as SearchIcon } from 'react-feather';
import { THEMES } from '../../constants';
import { Theme } from 'src/theme';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor:
      theme.name === THEMES.ONE_DARK
        ? theme.palette.background.default
        : grey[300],
    borderRadius: 5
  }
}));

const Search: FC = () => {
  const [value, setValue] = useState<string>('');
  const classes = useStyles();

  return (
    <Box ml={12}>
      <TextField
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SvgIcon fontSize="small" color="action">
                <SearchIcon />
              </SvgIcon>
            </InputAdornment>
          )
        }}
        onChange={event => setValue(event.target.value)}
        className={classes.root}
        placeholder="Search people &amp; places"
        value={value}
        variant="outlined"
        size="small"
      />
    </Box>
  );
};

export default Search;

import React, { FC, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import axios from 'src/utils/axios';
import {
  Box,
  InputAdornment,
  SvgIcon,
  TextField,
  makeStyles
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { grey } from '@material-ui/core/colors';
import { Search as SearchIcon } from 'react-feather';
import { THEMES } from '../../constants';
import { Theme } from 'src/theme';
import { Tag } from 'src/types/post';

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
  const history = useHistory();
  const classes = useStyles();
  const [value, setValue] = useState<string>('');
  const [results, setResults] = useState<Tag[]>([]);

  useEffect(() => {
    const fecthData = async () => {
      const response = await axios.get<Tag[]>(`/stock/search/${value}`);

      if (response.data && response.data.length > 0) {
        let data = response.data.map(item => {
          return { symbol: item.symbol, securityName: item.securityName };
        });
        setResults(data);
      }
    };
    value !== '' ? fecthData() : setResults([]);
  }, [value]);

  const handleChangeTag = (event, value) => {
    const symbol = value.split(': ')[0];
    history.push(`/symbol/${symbol}`);
  };

  return (
    <Box ml={12}>
      <Autocomplete
        freeSolo
        disableClearable
        options={results.map(
          option => option.symbol + ': ' + option.securityName
        )}
        onChange={handleChangeTag}
        renderInput={params => (
          <TextField
            {...params}
            fullWidth
            className={classes.root}
            placeholder="Search Ticker"
            variant="outlined"
            size="small"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon fontSize="small" color="action">
                    <SearchIcon />
                  </SvgIcon>
                </InputAdornment>
              )
            }}
            style={{ width: '15vw' }}
            value={value}
            onChange={event => setValue(event.target.value)}
          />
        )}
      />
    </Box>
  );
};

export default Search;

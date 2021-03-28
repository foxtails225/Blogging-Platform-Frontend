import React, { FC, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
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
import { IEX_BASE_URL, THEMES } from '../../constants';
import { Theme } from 'src/theme';
import { env } from 'src/config';
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
  const [options, setOptions] = useState<Tag[]>([]);

  useEffect(() => {
    const fecthData = async () => {
      const response = await axios.get<Tag[]>(
        `${IEX_BASE_URL}/search/${value}`,
        {
          params: { token: env.IEX_TOKEN }
        }
      );

      if (response.data && response.data.length > 0) {
        let data = response.data.map(item => {
          return { symbol: item.symbol, securityName: item.securityName };
        });
        setOptions(data);
      }
    };
    value !== '' ? fecthData() : setOptions([]);
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
        options={options.map(
          option => option.symbol + ': ' + option.securityName
        )}
        onChange={handleChangeTag}
        renderInput={params => (
          <TextField
            {...params}
            fullWidth
            className={classes.root}
            placeholder="Search stock"
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

import React, { FC, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useSnackbar } from 'notistack';
import axios from 'src/utils/axios';
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  InputAdornment,
  Link,
  SvgIcon,
  TextField,
  Tooltip,
  Typography,
  makeStyles,
  Divider,
  colors
} from '@material-ui/core';
import { Search as SearchIcon, XCircle as XIcon } from 'react-feather';
import { Tag } from 'src/types/post';

const useStyles = makeStyles(() => ({
  drawer: {
    width: 500,
    maxWidth: '100%'
  }
}));

const Search: FC = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = useState<string>('');
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<Tag[]>([]);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleSearch = async (): Promise<void> => {
    try {
      setLoading(true);

      const response = await axios.get<Tag[]>(`/stock/search/${value}`);

      if (response.data && response.data.length > 0) {
        let data = response.data.map(item => {
          return { symbol: item.symbol, securityName: item.securityName };
        });
        setResults(data);
      }
    } catch (err) {
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Search">
        <IconButton color="inherit" onClick={handleOpen}>
          <SvgIcon fontSize="small">
            <SearchIcon />
          </SvgIcon>
        </IconButton>
      </Tooltip>
      <Drawer
        anchor="right"
        classes={{ paper: classes.drawer }}
        ModalProps={{ BackdropProps: { invisible: true } }}
        onClose={handleClose}
        open={isOpen}
        variant="temporary"
      >
        <PerfectScrollbar options={{ suppressScrollX: true }}>
          <Box p={3}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h4" color="textPrimary">
                Search
              </Typography>
              <IconButton onClick={handleClose}>
                <SvgIcon fontSize="small">
                  <XIcon />
                </SvgIcon>
              </IconButton>
            </Box>
            <Box mt={2}>
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
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    //@ts-ignore
                    setValue(e.target.value);
                    handleSearch();
                  }
                }}
                placeholder="Search Tickers"
                value={value}
                variant="outlined"
              />
            </Box>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                style={{ background: colors.green[800], color: '#fff' }}
                variant="contained"
                onClick={handleSearch}
              >
                Search
              </Button>
            </Box>
            <Box mt={4}>
              {isLoading ? (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {results.map((result, i) => (
                    <React.Fragment key={i}>
                      <Box mb={1} mt={1}>
                        <Link
                          variant="h4"
                          color="textPrimary"
                          component={RouterLink}
                          to={`/symbol/${result.symbol}`}
                        >
                          {result.symbol}
                        </Link>
                        <Typography variant="body2" color="textPrimary">
                          {result.securityName}
                        </Typography>
                      </Box>
                      <Divider />
                    </React.Fragment>
                  ))}
                </>
              )}
            </Box>
          </Box>
        </PerfectScrollbar>
      </Drawer>
    </>
  );
};

export default Search;

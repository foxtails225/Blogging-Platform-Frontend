import React, { FC, useState, ChangeEvent, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Divider,
  makeStyles
} from '@material-ui/core';
import { Theme } from 'src/theme';
import Page from 'src/components/Page';
import Header from './Header';
import Opinions from './Opinions';
import Financials from './Financials';
import News from './News';

const tabs = [
  { value: 'opinions', label: 'Opinions' },
  { value: 'news', label: 'News' },
  { value: 'financials', label: 'Financials/Earnings' },
  { value: 'sec', label: 'SEC Filings' }
];

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
}));

const SymbolView: FC = () => {
  const classes = useStyles();
  const location = useLocation();
  const [path, setPath] = useState<string>(null);
  const [currentTab, setCurrentTab] = useState<string>('opinions');

  useEffect(() => {
    const value = location.pathname.split('/')[2];
    value && setPath(value);
  }, [location]);

  const handleTabsChange = (event: ChangeEvent, value: string): void => {
    setCurrentTab(value);
  };

  return (
    <Page className={classes.root} title={path ? `${path} Stock Price` : ''}>
      <Container maxWidth="lg">
        <Header path={path} />
        <Box mt={6}>
          <Tabs
            onChange={handleTabsChange}
            scrollButtons="auto"
            value={currentTab}
            textColor="secondary"
            variant="scrollable"
          >
            {tabs.map(tab => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>
        <Divider />
        <Box pb={6}>
          {currentTab === 'opinions' && <Opinions path={path} />}
          {currentTab === 'news' && <News path={path} />}
          {currentTab === 'financials' && <Financials path={path} />}
          {currentTab === 'sec' && <Financials path={path} />}
        </Box>
      </Container>
    </Page>
  );
};

export default SymbolView;

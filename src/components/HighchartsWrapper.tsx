import React, { FC, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'src/utils/axios';
import Highcharts from 'highcharts/highstock';
import darkUnica from 'highcharts/themes/dark-unica';
import HighchartsReact from 'highcharts-react-official';
import { makeStyles, useTheme, useMediaQuery } from '@material-ui/core';
import { Theme } from 'src/theme';
import { Chart } from 'src/types/stock';

interface HighchartsWrapperProps {
  className?: string;
  path: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {}
}));

const HighchartsWrapper: FC<HighchartsWrapperProps> = ({
  className,
  path,
  ...rest
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [source, setSource] = useState<any[]>([]);
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  darkUnica(Highcharts);

  const fetchHistory = async (value: string, type: string) => {
    const response = await axios.get<Chart[]>(`/stock/chart/${value}`, {
      params: { type }
    });
    setSource(response.data);
  };

  useEffect(() => {
    path && fetchHistory(path, '5d');
  }, [path]);

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      {source.length > 0 && (
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            title: {
              text: undefined
            },
            chart: { height: mobileDevice ? '70%' : '40%' },
            legend: {
              enabled: false
            },
            xAxis: {
              type: 'datetime',
              min: source[0][0],
              max: source[source.length - 1][0],
              minRange: 3600 * 1000 * 7
            },
            time: {
              useUTC: false
            },
            rangeSelector: {
              buttons: [
                {
                  type: 'dynamic',
                  count: 1,
                  text: '1d',
                  events: {
                    //@ts-ignore
                    click: function() {
                      //@ts-ignore
                      fetchHistory(path, 'dynamic');
                    }
                  }
                },
                {
                  type: '5d',
                  count: 1,
                  text: '1w',
                  events: {
                    click: function() {
                      //@ts-ignore
                      fetchHistory(path, '5d');
                    }
                  }
                },
                {
                  type: '1m',
                  count: 1,
                  text: '1m',
                  events: {
                    click: function() {
                      //@ts-ignore
                      fetchHistory(path, this.text);
                    }
                  }
                },
                {
                  type: '1y',
                  count: 1,
                  text: '1y',
                  events: {
                    click: function() {
                      //@ts-ignore
                      fetchHistory(path, this.text);
                    }
                  }
                },
                {
                  type: 'max',
                  text: 'All',
                  events: {
                    click: function() {
                      //@ts-ignore
                      fetchHistory(path, 'max');
                    }
                  }
                }
              ],
              selected: 1,
              enabled: true,
              allButtonsEnabled: true
            },
            series: [
              {
                name: path ? path : '',
                data: source,
                threshold: null,
                pointInterval: 3600 * 1000,
                tooltip: {
                  valueDecimals: 2
                },
                fillColor: {
                  linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                  },
                  stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [
                      1,
                      Highcharts.color(Highcharts.getOptions().colors[0])
                        .setOpacity(0)
                        .get('rgba')
                    ]
                  ]
                }
              }
            ]
          }}
        />
      )}
    </div>
  );
};

HighchartsWrapper.propTypes = {
  className: PropTypes.string,
  path: PropTypes.string
};

export default HighchartsWrapper;

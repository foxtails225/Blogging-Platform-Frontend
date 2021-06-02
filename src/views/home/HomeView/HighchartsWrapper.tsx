import React, { FC, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'src/utils/axios';
import Highcharts from 'highcharts/highstock';
import darkUnica from 'highcharts/themes/dark-unica';
import HighchartsReact from 'highcharts-react-official';
import { makeStyles } from '@material-ui/core';
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
  const [source, setSource] = useState<any[]>([]);
  darkUnica(Highcharts);
  
  useEffect(() => {
    const fetchHistory = async (value: string) => {
      const response = await axios.get<Chart[]>(`/stock/chart/${value}`, {
        params: { type: 'dynamic' }
      });
      setSource(response.data);
    };
    path && fetchHistory(path);
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
            chart: { height: '50%' },
            legend: {
              enabled: false
            },
            xAxis: {
              type: 'datetime',
              min: source[0][0],
              max: source[source.length - 1][0],
              minRange: 3600 * 1000 * 7,
              visible: false
            },
            yAxis: {
              visible: false
            },
            time: {
              useUTC: false
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

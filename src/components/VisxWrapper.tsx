import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'src/utils/axios';
import { AreaClosed, Line, Bar } from '@visx/shape';
import { AppleStock } from '@visx/mock-data/lib/mocks/appleStock';
import { curveMonotoneX } from '@visx/curve';
import { GridRows } from '@visx/grid';
import { scaleTime, scaleLinear } from '@visx/scale';
import { withTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { max, min, extent, bisector } from 'd3-array';
import { timeFormat } from 'd3-time-format';
import {
  Box,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
  colors
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Theme } from 'src/theme';
import { Chart, Quote } from 'src/types/stock';

type TooltipData = AppleStock;

const background = '#3b6978';
const background2 = '#204051';
const accentColor = '#edffea';
const accentColorDark = '#75daad';
const tooltipStyles = {
  ...defaultStyles,
  background: 'transparent',
  color: '#fff',
  boxShadow: 'none'
};
const formatDate = timeFormat("%b %d, '%y");
const getDate = (d: AppleStock) => new Date(d.date);
const getStockValue = (d: AppleStock) => d.close;
const bisectDate = bisector<AppleStock, Date>(d => new Date(d.date)).left;

interface VisxWrapperProps {
  className?: string;
  path: string;
  period: string;
  width?: number;
  ratio?: number;
  quote?: Quote;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const useStyles = makeStyles((theme: Theme) => ({
  box: {
    position: 'absolute',
    top: 0,
    maxWidth: '190px',
    color: '#35477d',
    borderRadius: '8px',
    lineHeight: '1.2em'
  },
  listItemText: {
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    fontWeight: 'bolder'
  },
  listItemSecondaryText: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

export default withTooltip<VisxWrapperProps, TooltipData>(
  ({
    path,
    period,
    width,
    ratio,
    quote,
    margin = { top: 0, right: 15, bottom: 0, left: 15 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0
  }: VisxWrapperProps & WithTooltipProvidedProps<TooltipData>) => {
    const theme = useTheme();
    const classes = useStyles();
    const [results, setResults] = useState<any[]>([]);
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
    const innerWidth = mobileDevice ? 150 : width;
    const innerHeight = innerWidth * ratio - margin.top;

    const getData = async (value: string, type: string) => {
      const response = await axios.get<Chart[]>(`/stock/chart/${value}`, {
        params: { type }
      });
      setResults(response.data);
    };

    useEffect(() => {
      path && getData(path, period);
    }, [path, period]);

    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [0, innerWidth - margin.left],
          domain: extent(results, getDate) as [Date, Date]
        }),
      [innerWidth, results, margin.left]
    );

    const stockValueScale = useMemo(() => {
      const value =
        Math.abs(max(results, getStockValue) - min(results, getStockValue)) / 2;

      return scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [
          min(results, getStockValue) - value / 3 || 0,
          max(results, getStockValue) + value || 0
        ],
        nice: true
      });
    }, [innerHeight, results, margin.top]);

    const handleTooltip = useCallback(
      (
        event:
          | React.TouchEvent<SVGRectElement>
          | React.MouseEvent<SVGRectElement>
      ) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);
        const index = bisectDate(results, x0, 1);
        const d0 = results[index - 1];
        const d1 = results[index];
        let d = d0;
        if (d1 && getDate(d1)) {
          d =
            x0.valueOf() - getDate(d0).valueOf() >
            getDate(d1).valueOf() - x0.valueOf()
              ? d1
              : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: stockValueScale(getStockValue(d))
        });
      },
      [showTooltip, stockValueScale, dateScale, results]
    );

    return (
      <>
        {results.length > 0 && (
          <>
            <svg width={innerWidth} height={innerHeight}>
              <rect
                x={0}
                y={0}
                width={innerWidth}
                height={innerHeight}
                fill="url(#area-background-gradient)"
                rx={3}
              />
              <LinearGradient
                id="area-background-gradient"
                from={background}
                to={background2}
              />
              <LinearGradient
                id="area-gradient"
                from={accentColor}
                to={accentColor}
                toOpacity={0.1}
              />
              <GridRows
                left={0}
                scale={stockValueScale}
                width={innerWidth}
                strokeDasharray="1,3"
                stroke={accentColor}
                strokeOpacity={0}
                pointerEvents="none"
              />
              <AreaClosed<AppleStock>
                data={results}
                x={d => dateScale(getDate(d)) ?? 0}
                y={d => stockValueScale(getStockValue(d)) ?? 0}
                yScale={stockValueScale}
                strokeWidth={1}
                stroke="url(#area-gradient)"
                fill="url(#area-gradient)"
                curve={curveMonotoneX}
              />
              <Bar
                x={0}
                y={margin.top}
                width={innerWidth - margin.left}
                height={innerHeight}
                fill="transparent"
                rx={14}
                onTouchStart={handleTooltip}
                onTouchMove={handleTooltip}
                onMouseMove={handleTooltip}
                onMouseLeave={() => hideTooltip()}
              />
              {tooltipData && (
                <g>
                  <Line
                    from={{ x: tooltipLeft, y: margin.top }}
                    to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                    stroke={accentColorDark}
                    strokeWidth={2}
                    pointerEvents="none"
                    strokeDasharray="5,2"
                  />
                  <circle
                    cx={tooltipLeft}
                    cy={tooltipTop + 1}
                    r={4}
                    fill="black"
                    fillOpacity={0.1}
                    stroke="black"
                    strokeOpacity={0.1}
                    strokeWidth={2}
                    pointerEvents="none"
                  />
                  <circle
                    cx={tooltipLeft}
                    cy={tooltipTop}
                    r={4}
                    fill={accentColorDark}
                    stroke="white"
                    strokeWidth={2}
                    pointerEvents="none"
                  />
                </g>
              )}
            </svg>
            {tooltipData && (
              <div>
                <TooltipWithBounds
                  key={Math.random()}
                  top={tooltipTop - 12}
                  left={tooltipLeft + 12}
                  style={tooltipStyles}
                >
                  {formatDate(getDate(tooltipData))}
                </TooltipWithBounds>
              </div>
            )}
            {quote && (
              <Box className={classes.box}>
                <ListItem key={quote.symbol}>
                  <ListItemText
                    primary={
                      <Typography
                        style={{ fontWeight: 'bolder' }}
                        variant="body2"
                      >
                        {quote.symbol}
                      </Typography>
                    }
                    primaryTypographyProps={{
                      variant: 'body2',
                      component: 'strong'
                    }}
                    secondary={
                      <Typography
                        style={{ fontWeight: 'bolder' }}
                        variant="body2"
                      >
                        {tooltipData
                          ? `$${getStockValue(tooltipData)}`
                          : quote.latestPrice}
                      </Typography>
                    }
                    className={classes.listItemText}
                  />
                  <ListItemText
                    primary={
                      <Typography
                        style={{
                          fontWeight: 'bolder',
                          color:
                            quote.changePercent > 0
                              ? colors.green[300]
                              : colors.red[300]
                        }}
                        variant="body2"
                      >
                        {quote.change >= 0 ? '+' : '-'}$
                        {typeof quote.change === 'number'
                          ? Math.abs(quote.change)
                          : quote.change}{' '}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        style={{
                          fontWeight: 'bolder',
                          color:
                            quote.changePercent > 0
                              ? colors.green[300]
                              : colors.red[300]
                        }}
                        variant="body2"
                      >
                        {quote.changePercent >= 0 && '+'}
                        {((quote.changePercent as number) * 100).toFixed(3)}%
                      </Typography>
                    }
                    className={classes.listItemSecondaryText}
                  />
                </ListItem>
              </Box>
            )}
          </>
        )}
      </>
    );
  }
);

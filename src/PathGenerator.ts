import {curveMonotoneX, line, scaleLinear, scaleTime} from 'd3';
import {GRAPH_HEIGHT, GRAPH_WIDTH} from './Constants';
import {Coordinates, DataPoint} from './Types';

const parseGraphData = (data: DataPoint[]) => {
  const valuesArray = data.map(val => val.value);
  const max = Math.max(...valuesArray);
  const min = Math.min(...valuesArray);

  const yScale = scaleLinear().domain([min, max]).range([GRAPH_HEIGHT, 35]);

  const xScale = scaleTime()
    .domain([new Date(2000, 1, 1), new Date(2000, 1, 15)])
    .range([10, GRAPH_WIDTH - 10]);

  return {xScale, yScale, max, min};
};

export const generatePath = (data: DataPoint[]): string => {
  const {xScale, yScale} = parseGraphData(data);

  const curvedLine = line<DataPoint>()
    .x(d => xScale(new Date(d.date)))
    .y(d => yScale(d.value))
    .curve(curveMonotoneX)(data);

  return curvedLine!;
};

export const getDataPointCoordinates = (data: DataPoint[]): Coordinates[] => {
  const {xScale, yScale} = parseGraphData(data);
  const coordinates = data.map(({date, value}) => {
    return {
      x: xScale(new Date(date)),
      y: yScale(value),
    };
  });
  return coordinates;
};

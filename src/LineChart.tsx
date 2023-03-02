import {interpolate} from 'polymorph-js';
import React, {FC, useCallback, useState, useEffect} from 'react';
import {StyleSheet, SafeAreaView, View, Text} from 'react-native';

import Animated, {
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {G, Line, Path, Circle} from 'react-native-svg';

import ButtonSection from './ButtonSection';
import {animatedData, animatedData2, animatedData3, originalData} from './Data';
import {generatePath, getDataPointCoordinates} from './PathGenerator';
import {DataPoint} from './Types';

type LineChartProps = {
  height: number;
  width: number;
  leftPadding: number;
  bottomPadding: number;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

const LineChart: FC<LineChartProps> = ({
  width,
  height,
  leftPadding,
  bottomPadding,
}: LineChartProps) => {
  const [data, setData] = useState<DataPoint[]>(originalData);
  const [interpolatedPath, setInterpolatedPath] = useState('');

  const animationProgress = useSharedValue(0);
  const isAnimationComplete = useSharedValue(true);
  const [paths, setPaths] = useState({
    currentPath: generatePath(data),
    previousPath: generatePath(data),
  });
  const {currentPath, previousPath} = paths;

  const circleCoordinates = getDataPointCoordinates(data);

  const pathInterpolator = (
    prevPath: string,
    newPath: string,
    value: number,
  ) => {
    const np = interpolate([prevPath, newPath])(value);
    setInterpolatedPath(np);
  };

  const startAnimation = useCallback(() => {
    'worklet';
    isAnimationComplete.value = false;
    animationProgress.value = withTiming(1, {duration: 500}, () => {
      isAnimationComplete.value = true;
      animationProgress.value = 0;
    });
  }, [animationProgress, isAnimationComplete]);

  useEffect(() => {
    startAnimation();
  }, [currentPath, previousPath]);

  const animatedProps = useAnimatedProps(() => {
    'worklet';
    if (isAnimationComplete.value) {
      return {d: currentPath};
    } else {
      runOnJS(pathInterpolator)(
        previousPath,
        currentPath,
        animationProgress.value,
      );
      return {
        d: interpolatedPath,
      };
    }
  }, [
    currentPath,
    previousPath,
    animationProgress,
    isAnimationComplete,
    previousPath,
    interpolatedPath,
  ]);

  const updateData = (newData: DataPoint[]) => {
    if (!isAnimationComplete.value || data === newData) {
      return;
    }
    setPaths({currentPath: generatePath(newData), previousPath: currentPath});
    setData(newData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>FACEBOOK</Text>
        <Text style={styles.titleText}>0</Text>
      </View>
      <Animated.View style={styles.chartContainer}>
        <Svg width={width} height={height} stroke="#6231ff">
          <G y={-bottomPadding}>
            {!isAnimationComplete.value &&
              circleCoordinates.map(({x, y}) => (
                <Circle stroke="red" fill="red" r={2} cx={x} cy={y} key={x} />
              ))}
            <Line
              x1={leftPadding}
              y1={height}
              x2={width}
              y2={height}
              stroke={'#d7d7d7'}
              strokeWidth="1"
            />
            <Line
              x1={leftPadding}
              y1={height * 0.6}
              x2={width}
              y2={height * 0.6}
              stroke={'#d7d7d7'}
              strokeWidth="1"
            />
            <Line
              x1={leftPadding}
              y1={height * 0.2}
              x2={width}
              y2={height * 0.2}
              stroke={'#d7d7d7'}
              strokeWidth="1"
            />
            <AnimatedPath animatedProps={animatedProps} strokeWidth="2" />
          </G>
        </Svg>
      </Animated.View>
      <ButtonSection
        q1Tapped={() => {
          updateData(originalData);
        }}
        q2Tapped={() => {
          updateData(animatedData);
        }}
        q3Tapped={() => {
          updateData(animatedData2);
        }}
        q4Tapped={() => {
          updateData(animatedData3);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    marginHorizontal: 30,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'black',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default LineChart;

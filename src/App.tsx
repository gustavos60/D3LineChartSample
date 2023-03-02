import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';

import Animated from 'react-native-reanimated';
import {CARD_HEIGHT, CARD_WIDTH, GRAPH_HEIGHT, GRAPH_WIDTH} from './Constants';
import LineChart from './LineChart';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={styles.graphCard}>
        <LineChart
          height={GRAPH_HEIGHT}
          width={GRAPH_WIDTH}
          bottomPadding={20}
          leftPadding={0}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
  },
  graphCard: {
    elevation: 5,
    borderRadius: 20,
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default App;

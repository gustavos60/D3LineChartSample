import {Dimensions} from 'react-native';

const {width} = Dimensions.get('screen');

export const CARD_WIDTH = width - 20;
export const GRAPH_WIDTH = CARD_WIDTH - 60;
export const CARD_HEIGHT = 325;
export const GRAPH_HEIGHT = 200;

import React, {useEffect} from 'react';
import {
  View,
  FlatList,
  Animated,
  Easing,
  Text,
  ColorValue,
  Image,
} from 'react-native';
import {styles} from './styles';
import RenderBars from './RenderBars';
import RenderStackBars from './RenderStackBars';

const img = require('./arrow.png');

type PropTypes = {
  width?: number;
  height?: number;
  noOfSections?: number;
  maxValue?: number;
  stepHeight?: number;
  stepValue?: number;
  spacing?: number;
  data?: any;
  stackData?: any;
  side?: String;
  rotateLabel?: Boolean;
  isAnimated?: Boolean;
  animationDuration?: number;
  animationEasing?: any;
  opacity?: number;
  isThreeD?: Boolean;
  xAxisThickness?: number;
  xAxisColor?: ColorValue;
  yAxisThickness?: number;
  yAxisColor?: ColorValue;
  yAxisTextStyle?: any;
  yAxisLabelWidth?: number;
  hideYAxisText?: Boolean;
  initialSpacing?: number;
  barWidth?: number;
  sideWidth?: number;

  cappedBars?: Boolean;
  capThickness?: number;
  capColor?: ColorValue;
  capRadius?: number;

  hideAxesAndRules?: Boolean;
  hideRules?: Boolean;
  rulesColor?: ColorValue;
  rulesThickness?: number;
  showVerticalLines?: Boolean;
  verticalLinesThickness?: number;
  verticalLinesColor?: ColorValue;
  verticalLinesZIndex?: number;

  showYAxisIndices?: Boolean;
  showXAxisIndices?: Boolean;
  yAxisIndicesHeight?: number;
  xAxisIndicesHeight?: number;
  yAxisIndicesWidth?: number;
  xAxisIndicesWidth?: number;
  xAxisIndicesColor?: ColorValue;
  yAxisIndicesColor?: ColorValue;

  showFractionalValues?: Boolean;
  roundToDigits?: number;
  backgroundColor?: ColorValue;

  disableScroll?: Boolean;
  showScrollIndicator?: Boolean;
  roundedTop?: Boolean;
  roundedBottom?: Boolean;
  disablePress?: boolean;

  frontColor?: ColorValue;
  sideColor?: ColorValue;
  topColor?: ColorValue;
  gradientColor?: ColorValue;
  showGradient?: Boolean;
  activeOpacity?: number;

  horizontal?: Boolean;
  yAxisAtTop?: Boolean;

  intactTopLabel?: Boolean;

  horizSections?: Array<sectionType>;
  barBorderRadius?: number;
  hideOrigin?: Boolean;
  labelWidth?: number;
  yAxisLabelTexts?: Array<string>;
  showRef?: Boolean;
  referenceLines: Array<referenceLine>;
  refRightMarginAdjustment?: number;
  refLeftMarginAdjustment?: number;
  chartPaddingLeft?: number;
  chartPaddingRight?: number;
  refLineWidthPercentage?: number;
  refLineBg?: ColorValue;
  refLineTxtStyle?: any;
  refLineTxtBg?: ColorValue;
  refLineArrowOffset?: number;
  noDataText: String;
  noDataTextStyle: any;
  allarezero: Boolean;
};
type referenceLine = {
  value: number;
  thickness: number;
  color: ColorValue;
  showText: Boolean;
};
type sectionType = {
  value: string;
};
type itemType = {
  value?: number;
  onPress?: any;
  frontColor?: ColorValue;
  sideColor?: ColorValue;
  topColor?: ColorValue;
  showGradient?: Boolean;
  gradientColor?: any;
  label?: String;
  barWidth?: number;
  sideWidth?: number;
  labelTextStyle?: any;
  topLabelComponent?: Function;
  topLabelContainerStyle?: any;
  disablePress?: any;
  labelComponent?: View;
  spacing?: number;
};

export const BarChart = (props: PropTypes) => {
  const containerHeight = props.height || 200;
  const noOfSections = props.noOfSections || 10;
  const horizSections = [{value: '0'}];
  const stepHeight = props.stepHeight || containerHeight / noOfSections;
  const data = props.data || [];
  const spacing = props.spacing === 0 ? 0 : props.spacing ? props.spacing : 20;
  const labelWidth = props.labelWidth || 0;

  let totalWidth = spacing;
  let maxItem = 0;
  if (props.stackData) {
    props.stackData.forEach(stackItem => {
      // console.log('stackItem', stackItem);
      let stackSum = stackItem.stacks.reduce(
        (acc, stack) => acc + stack.value,
        0,
      );
      // console.log('stackSum--->', stackSum);
      if (stackSum > maxItem) {
        maxItem = stackSum;
      }
      totalWidth +=
        (stackItem.stacks[0].barWidth || props.barWidth || 30) + spacing;
      // console.log('totalWidth for stack===', totalWidth);
    });
  } else {
    data.forEach((item: itemType) => {
      if (item.value > maxItem) {
        maxItem = item.value;
      }
      totalWidth +=
        (item.barWidth || props.barWidth || 30) +
        (item.spacing === 0 ? 0 : item.spacing || spacing);
      // console.log('totalWidth for bar===', totalWidth);
    });
  }

  if (props.showFractionalValues || props.roundToDigits) {
    maxItem *= 10 * (props.roundToDigits || 1);
    maxItem = maxItem + (10 - (maxItem % 10));
    maxItem /= 10 * (props.roundToDigits || 1);
    maxItem = parseFloat(maxItem.toFixed(props.roundToDigits || 1));
  } else {
    maxItem = maxItem + (10 - (maxItem % 10));
  }

  const maxValue = props.maxValue || maxItem;

  const stepValue = props.stepValue || maxValue / noOfSections;
  const disableScroll = props.disableScroll || false;
  const showScrollIndicator = props.showScrollIndicator || false;
  const initialSpacing =
    props.initialSpacing === 0 ? 0 : props.initialSpacing || 40;
  // const oldData = props.oldData || [];
  const side = props.side || '';
  const rotateLabel = props.rotateLabel || false;
  const isAnimated = props.isAnimated || false;
  const animationDuration = props.animationDuration || 800;
  const animationEasing = props.animationEasing || Easing.ease;
  const opacity = props.opacity || 1;
  const isThreeD = props.isThreeD || false;
  const refLineArrowOffset = props.refLineArrowOffset || 0;

  const showVerticalLines = props.showVerticalLines || false;
  const rulesThickness =
    props.rulesThickness === 0 ? 0 : props.rulesThickness || 1;
  const rulesColor = props.rulesColor || 'lightgray';
  const verticalLinesThickness =
    props.verticalLinesThickness === 0 ? 0 : props.verticalLinesThickness || 1;
  const verticalLinesColor = props.verticalLinesColor || 'lightgray';
  const verticalLinesZIndex = props.verticalLinesZIndex || -1;

  const showYAxisIndices = props.showYAxisIndices || false;
  const showXAxisIndices = props.showXAxisIndices || false;
  const yAxisIndicesHeight = props.yAxisIndicesHeight || 2;
  const xAxisIndicesHeight = props.xAxisIndicesHeight || 2;
  const yAxisIndicesWidth = props.yAxisIndicesWidth || 4;
  const xAxisIndicesWidth = props.xAxisIndicesWidth || 4;
  const xAxisIndicesColor = props.xAxisIndicesColor || 'black';
  const yAxisIndicesColor = props.yAxisIndicesColor || 'black';
  const noDataText = props.noDataText || 'No data available yet';
  const noDataTextStyle = props.noDataTextStyle || {fontSize: 16};
  const allarezero = props.allarezero || false;

  const xAxisThickness =
    props.xAxisThickness === 0
      ? props.xAxisThickness
      : props.xAxisThickness || 1;
  const xAxisColor = props.xAxisColor || 'black';

  const hideRules = props.hideRules || false;

  const yAxisThickness =
    props.yAxisThickness === 0
      ? props.yAxisThickness
      : props.yAxisThickness || 1;
  const yAxisColor = props.yAxisColor || 'black';
  const yAxisTextStyle = props.yAxisTextStyle;
  const showFractionalValues = props.showFractionalValues || false;
  const yAxisLabelWidth = props.yAxisLabelWidth || 35;
  const hideYAxisText = props.hideYAxisText || false;

  const backgroundColor = props.backgroundColor || 'transparent';
  const horizontal = props.horizontal || false;
  const yAxisAtTop = props.yAxisAtTop || false;
  const intactTopLabel = props.intactTopLabel || false;
  const hideOrigin = props.hideOrigin || false;

  // const referenceLine1 = props.referenceLine1 || (maxItem / 5) * 2;
  // const referenceLine2 = props.referenceLine2 || (maxItem / 5) * 4;
  // const referenceLine1Thickness =
  //   props.rulesThickness === 0 ? 0 : props.rulesThickness || 1;
  // const referenceLine1Color = props.rulesColor || 'lightgray';
  // const referenceLine2Thickness =
  //   props.rulesThickness === 0 ? 0 : props.rulesThickness || 1;
  // const referenceLine2Color = props.rulesColor || 'lightgreen';
  const showRef = props.showRef || false;

  const referenceLines = props.referenceLines
    ? props.referenceLines
    : [{color: 'lightgreen', value: maxItem / 2, showText: false}];

  const leftMarginAdjustment = props.refLeftMarginAdjustment
    ? props.refLeftMarginAdjustment
    : 30;

  const refLineWidthPercentage = props.refLineWidthPercentage
    ? props.refLineWidthPercentage
    : '100%';

  const chartPaddingLeft = props.chartPaddingLeft
    ? props.chartPaddingLeft
    : ((data && data[0] && data[0].barWidth) || props.barWidth || 30) / 2;

  const chartPaddingRight = props.chartPaddingRight
    ? props.chartPaddingRight
    : 0;

  const refLineTxtFont = props.refLineTxtFont ? props.refLineTxtFont : null;

  const refLineBg = props.refLineBg ? props.refLineBg : 'white';

  horizSections.pop();
  for (let i = 0; i <= noOfSections; i++) {
    let value = maxValue - stepValue * i;
    if (props.showFractionalValues || props.roundToDigits) {
      value = parseFloat(value.toFixed(props.roundToDigits || 1));
    }
    horizSections.push({
      value: props.yAxisLabelTexts
        ? props.yAxisLabelTexts[noOfSections - i] ?? value.toString()
        : value.toString(),
    });
  }

  const heightValue = new Animated.Value(0);
  const opacValue = new Animated.Value(0);

  const labelsAppear = () => {
    opacValue.setValue(0);
    Animated.timing(opacValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };
  const moveBar = () => {
    heightValue.setValue(0);
    Animated.timing(heightValue, {
      toValue: 1,
      duration: animationDuration,
      easing: animationEasing,
      useNativeDriver: false,
    }).start();
  };
  // console.log('olddata', oldData);

  useEffect(() => {
    moveBar();
    setTimeout(() => labelsAppear(), animationDuration);
  }, []);

  const animatedHeight = heightValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  const appearingOpacity = opacValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const renderRefLines = () => {
    return (
      <>
        {referenceLines.map((item, ind) => {
          return (
            <>
              <View
                key={ind}
                style={[
                  {
                    width: refLineWidthPercentage,
                    position: 'absolute',
                    bottom: -15,
                    left: leftMarginAdjustment,
                  },
                ]}>
                <View
                  style={[
                    styles.lastLeftPart,
                    {
                      left: leftMarginAdjustment,
                      bottom: (stepHeight / stepValue) * item.value,

                      // bottom: 0,
                    },
                  ]}>
                  <View
                    style={[
                      {
                        opacity: 0.5,
                        // borderStyle: 'dashed',
                        //shadowColor: 'grey',
                        //shadowOffset: {width: 4, height: 4},
                        //shadowOpacity: 0.5,
                        //shadowRadius: 1,
                        backgroundColor: item.color,
                        height: 2,
                      },
                    ]}
                  />
                </View>
              </View>
              {item.showText ? (
                <View
                  style={{
                    position: 'absolute',
                    bottom: (stepHeight / stepValue) * item.value - 46,
                    width: 60,
                    height: 100,
                    backgroundColor: props.refLineTxtBg
                      ? props.refLineTxtBg
                      : '#ffffff',
                    right: -50,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingLeft: 10,
                  }}>
                  <Image
                    source={img}
                    style={{
                      height: 40,
                      width: 30,
                      marginLeft: refLineArrowOffset,
                    }}
                    resizeMode="contain"
                    fadeDuration={0}
                  />
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'clip'}
                    style={[
                      {marginTop: -5},
                      yAxisTextStyle,
                      props.refLineTxtStyle ? props.refLineTxtStyle : '',
                    ]}>
                    Goal
                  </Text>
                </View>
              ) : null}
            </>
          );
        })}
      </>
    );
  };

  const renderHorizSections = () => {
    return (
      <>
        {horizSections.map((sectionItems, index) => {
          return (
            <View key={index} style={[styles.horizBar, {width: totalWidth}]}>
              <View
                style={[
                  styles.leftLabel,
                  {
                    borderRightWidth: yAxisThickness,
                    borderColor: yAxisColor,
                  },
                  horizontal &&
                    !yAxisAtTop && {
                      transform: [{translateX: totalWidth + yAxisThickness}],
                    },
                  {
                    height:
                      index === noOfSections ? stepHeight / 2 : stepHeight,
                    width: yAxisLabelWidth,
                  },
                ]}>
                {!hideYAxisText ? (
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'clip'}
                    style={[
                      yAxisTextStyle,
                      index === noOfSections && {marginBottom: stepHeight / -2},
                      horizontal && {
                        transform: [
                          {rotate: '270deg'},
                          {translateY: yAxisAtTop ? 0 : 50},
                        ],
                      },
                    ]}>
                    {showFractionalValues
                      ? sectionItems.value
                        ? sectionItems.value
                        : hideOrigin
                        ? ''
                        : '0'
                      : sectionItems.value
                      ? sectionItems.value.toString().split('.')[0]
                      : hideOrigin
                      ? ''
                      : '0'}
                  </Text>
                ) : null}
              </View>
              <View
                style={[
                  index === noOfSections
                    ? styles.lastLeftPart
                    : styles.leftPart,
                  {backgroundColor: backgroundColor},
                ]}>
                {index === noOfSections ? (
                  <View
                    style={[
                      styles.lastLine,
                      {height: xAxisThickness, backgroundColor: xAxisColor},
                    ]}
                  />
                ) : hideRules ? null : (
                  <View
                    style={[
                      styles.line,
                      {
                        height: rulesThickness,
                        backgroundColor: rulesColor,
                      },
                    ]}
                  />
                )}
                {showYAxisIndices && index !== noOfSections ? (
                  <View
                    style={[
                      {
                        position: 'absolute',
                        height: yAxisIndicesHeight,
                        width: yAxisIndicesWidth,
                        left: yAxisIndicesWidth / -2,
                        backgroundColor: yAxisIndicesColor,
                      },
                      horizontal &&
                        !yAxisAtTop && {
                          transform: [
                            {translateX: totalWidth + yAxisThickness},
                          ],
                        },
                    ]}
                  />
                ) : null}
              </View>
            </View>
          );
        })}
      </>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          height: containerHeight,
        },
        props.width && {width: props.width},
        horizontal && {transform: [{rotate: '90deg'}, {translateY: -15}]},
      ]}>
      {props.hideAxesAndRules !== true && renderHorizSections()}
      {showRef !== false && renderRefLines()}
      <FlatList
        style={[
          {
            marginLeft: initialSpacing + 6,
            position: 'absolute',
            bottom: stepHeight * -0.5 - 60 + xAxisThickness,
          },
          horizontal && {width: totalWidth + 10},
        ]}
        scrollEnabled={!disableScroll}
        contentContainerStyle={{
          height: containerHeight + 130,
          width: '100%',
          paddingLeft: chartPaddingLeft,
          paddingRight: chartPaddingRight,
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
        showsHorizontalScrollIndicator={showScrollIndicator}
        horizontal
        data={props.stackData || data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          // console.log('index--->', index);
          // console.log('itemhere--->', item);
          if (props.stackData) {
            return (
              <RenderStackBars
                item={item}
                index={index}
                containerHeight={containerHeight}
                maxValue={maxValue}
                spacing={spacing}
                barWidth={props.barWidth}
                opacity={opacity}
                disablePress={props.disablePress}
                rotateLabel={rotateLabel}
                showVerticalLines={showVerticalLines}
                verticalLinesThickness={verticalLinesThickness}
                verticalLinesColor={verticalLinesColor}
                verticalLinesZIndex={verticalLinesZIndex}
                showXAxisIndices={showXAxisIndices}
                xAxisIndicesHeight={xAxisIndicesHeight}
                xAxisIndicesWidth={xAxisIndicesWidth}
                xAxisIndicesColor={xAxisIndicesColor}
                horizontal={horizontal}
                intactTopLabel={intactTopLabel}
                barBorderRadius={props.barBorderRadius}
              />
            );
          }
          return (
            <RenderBars
              item={item}
              index={index}
              containerHeight={containerHeight}
              maxValue={maxValue}
              spacing={item.spacing === 0 ? 0 : item.spacing || spacing}
              side={side}
              data={data}
              barWidth={props.barWidth}
              sideWidth={props.sideWidth}
              labelWidth={labelWidth}
              opacity={opacity}
              isThreeD={isThreeD}
              isAnimated={isAnimated}
              animationDuration={animationDuration}
              rotateLabel={rotateLabel}
              animatedHeight={animatedHeight}
              appearingOpacity={appearingOpacity}
              roundedTop={props.roundedTop}
              roundedBottom={props.roundedBottom}
              disablePress={props.disablePress}
              frontColor={props.frontColor}
              sideColor={props.sideColor}
              topColor={props.topColor}
              showGradient={props.showGradient}
              gradientColor={props.gradientColor}
              activeOpacity={props.activeOpacity}
              cappedBars={props.cappedBars}
              capThickness={props.capThickness}
              capColor={props.capColor}
              capRadius={props.capRadius}
              showVerticalLines={showVerticalLines}
              verticalLinesThickness={verticalLinesThickness}
              verticalLinesColor={verticalLinesColor}
              verticalLinesZIndex={verticalLinesZIndex}
              showXAxisIndices={showXAxisIndices}
              xAxisIndicesHeight={xAxisIndicesHeight}
              xAxisIndicesWidth={xAxisIndicesWidth}
              xAxisIndicesColor={xAxisIndicesColor}
              horizontal={horizontal}
              intactTopLabel={intactTopLabel}
              barBorderRadius={props.barBorderRadius}
            />
          );
        }}
      />
      {allarezero ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 50,
            right: 0,
            bottom: -20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={noDataTextStyle}>{noDataText}</Text>
        </View>
      ) : null}
    </View>
  );
};

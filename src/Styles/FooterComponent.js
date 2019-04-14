import React from 'react';
import { Text, Animated, Dimensions, ProgressBarAndroid } from 'react-native';

import styled from 'styled-components/native';

const ContainerFooterPost = styled.View`
  align-items: center;
  justify-content: center;
  width: ${Dimensions.get('window').width};
  background-color: #FFF;
`;

export const FooterPost = props => (
  <Animated.View
    style={{
      heigth: props.animatedValueToFooterPost.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 60]
      })
    }}
  >
    {!props.listComplete ? (
      <ContainerFooterPost>
        <ProgressBarAndroid
          styleAttr='Small'
          color='#08F'
          indeterminate={true}
        />
        
        <Text
          style={{
            color: '#08F',
            marginVertical: 10,
            fontSize: 12
          }}
        >
          Carregando
        </Text>
      </ContainerFooterPost>
    ) : (
      <ContainerFooterPost>
        <Text
          style={{
            color: '#08F',
            marginVertical: 10,
            fontSize: 12
          }}
        >
          Não Contem mais postagens
        </Text>
      </ContainerFooterPost>
    )}
  </Animated.View>
)

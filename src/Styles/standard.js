import { Dimensions } from "react-native";

import styled from 'styled-components/native';

export const MinhaView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #FFF;
`;

export const StandardButton = styled.TouchableOpacity`
  width: 200px;
  height: 45px;
  margin: 5px;
  background-color: #08F;
  border: 1px solid #08f;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
`;

export const StandardInput = styled.TextInput`
  width: ${Dimensions.get('window').width - 85};
  height: ${Dimensions.get('window').height - 600};
  background-color: transparent;
  border-radius: 8px;
  padding: 10px;
  border: 0px;
  margin: 4px;
  font-size: 14;
  color: #FFF;
`;
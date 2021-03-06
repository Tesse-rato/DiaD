import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';

import styled from 'styled-components/native';

import Debug from '../funcs/debug';

const ContainerUserSearch = styled.View`
  flex: 1;
  background-color: #FFF;
`;
const ContainerUserResult = styled.View`
  width: ${Dimensions.get('window').width};
  height: 70px;
  padding: 10px;
  flex-direction: row;
`;

export const UserSearch = props => (
  <View style={{ flex: 1 }}>
    {props.result.length ? (
      <ScrollView style={{ flex: 1 }}>
        {props.result.map(user => (
          <TouchableOpacity onPress={() => props.clickImageProfile(user._id.toString())}>
            <ContainerUserResult>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 35
                }}
                source={{ uri: user.photo.thumbnail }}
              />
              <View style={{ marginLeft: 5 }}>
                <Text style={{ fontSize: 18 }} >{user.name.first + ' ' + user.name.last}</Text>
                <Text style={{ fontSize: 12 }} >@{user.name.nickname}</Text>
              </View>
            </ContainerUserResult>
          </TouchableOpacity>
        ))}
      </ScrollView>
    ) : (
        <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 14, color: '#AAA' }}>Sem Resultado</Text>
        </View>
      )}
  </View>
);

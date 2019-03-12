
import React from 'react';
import { Dimensions, View, TouchableOpacity, Image, ScrollView, Text } from "react-native";

import styled from 'styled-components/native';

export const MinhaView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.white ? '#FFF' : '#E8E8E8'};
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


export const Find = props => (
  <View style={{ backgroundColor: '#CCC', borderRadius: 25, marginRight: 15 }}>
    <StandardInput value={props.value} onChangeText={(e) => props.onChangeText(e)} style={{ height: 35 }} placeholder={props.placeholder} placeholderTextColor='#FFF' selectionColor='#FFF' />
  </View>
);

export const Profile = props => (
  <TouchableOpacity onPress={props.onPress}>
    <Image style={{ width: 48, height: 48, borderRadius: 24 }} source={props.source} resizeMode='cover' />
  </TouchableOpacity>
);

const ContainerHeader = styled.View`
  flex-direction: row;
  align-items: center;
  width: ${Dimensions.get('window').width};
  /* height: ${Dimensions.get('window').height - 535}; */
  padding: 5px;
  background-color: #FFF;
  border-bottom-width: 0.5px;
  border-bottom-color: #AAA;
  padding-left: 5px;
`;
export const Header = props => (
  <ContainerHeader>
    <Find placeholder='ID/Apelido' onChangeText={props.onChangeText} />
    <Profile onPress={props.onPress} source={props.source} />
  </ContainerHeader>
);


import EditIco from '../assets/EditDiaD.svg';

const ContainerComment = styled.View`
  width: ${Dimensions.get('window').width - 50};
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 0px;
  margin-left: 3px;
  padding: 10px;
  background-color: #E8E8E8;
  border-radius: 10px;
`;
export const ContainerHeaderComment = styled.View`
  width: ${Dimensions.get('window').width - 100};
  flex-direction: row;
`;
export const Comment = props => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    pagingEnabled={true}
    stickyHeaderIndices={true}
    style={{ width: Dimensions.get('window').width - 40, padding: 2 }}
    onMomentumScrollEnd={(e) => props.debug(e)}
    snapToAlignment='center'
    snapToInterval={Dimensions.get('window').width - 47}
  >
    {props.comments.map(comment => (
      <ContainerComment key={comment._id} >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ContainerHeaderComment>
            <TouchableOpacity>
              <Image style={{ width: 40, height: 40, borderRadius: 20 }} resizeMode='cover' source={{ uri: 'http://192.168.1.2:3333/comment.jpg' }} />
            </TouchableOpacity>
            <View style={{ marginLeft: 8 }}>
              <Text style={{ fontSize: 16 }} >Nome Sobrenome</Text>
              <Text style={{ fontSize: 12 }} >@ap3liDo</Text>
            </View>
          </ContainerHeaderComment>
          <TouchableOpacity>
            <EditIco width={32} height={32} />
          </TouchableOpacity>
        </View>
        <View style={{ margin: 10 }}>
          <Text>{comment.content}</Text>
        </View>
      </ContainerComment>
    ))}
  </ScrollView>
);
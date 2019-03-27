import React from 'react';
import { View } from 'react-native';

import styled from 'styled-components/native';
import { StandardInput, StandardButton } from './standard';

export const Continue = styled(StandardButton)`
  width: 150;
  background-color: #FFF;
  border: 0px;
`;

export const GoBack = styled(StandardButton)`
  width: 150;
  background-color: transparent;
  border-color: transparent;
`;

import React from 'react';
import { View } from 'react-native';

import styled from 'styled-components/native';
import { StandardButton, StandardInput } from './standard';

export const LogIn = styled(StandardButton)`
  background-color: transparent;
`;

export const Register = styled(StandardButton)`
  border-color: transparent;
  background-color: transparent;
  margin-top: 10px;
  width: 200px;
`;

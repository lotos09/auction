import { makeCollectionPath } from './general';
import React, { useEffect, useState } from 'react';

export const lotsUrl = makeCollectionPath('lots');

export const ThemeContext = React.createContext('light');

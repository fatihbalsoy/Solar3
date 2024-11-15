/*
 *   index.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 5/2/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppScene from './scene';
import { WebsiteTheme } from './theme';
import SearchBar from './interface/search';
import { CssBaseline, ThemeProvider } from '@mui/material';
import './style.css';
import './interface/stylesheets/main.scss';
import LowEndDeviceWarningScreen from './interface/low_end_warning';
import LoadingScreen from './interface/loading_screen';
import { deviceIsIOS } from './utils/utils';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <ThemeProvider theme={WebsiteTheme}>
        <CssBaseline />
        {
            deviceIsIOS()
                ? <LowEndDeviceWarningScreen />
                : <div>
                    <AppScene />
                    <SearchBar />
                    <LoadingScreen />
                </div>
        }
    </ThemeProvider>
);
/*
 *   index.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 5/2/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
// import './styles/generic.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import AppScene from './scene';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <div>
        <CssBaseline />
        <AppScene />
    </div>
);
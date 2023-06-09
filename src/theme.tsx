/*
 *   theme.tsx
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 5/2/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import createPalette from '@mui/material/styles/createPalette';
import createTheme from '@mui/material/styles/createTheme';

export const WebsiteTheme = createTheme({
    palette: createPalette({
        mode: 'dark',
        primary: {
            main: '#0687ff', // variation of blue[500]
            dark: '#043b9e' // variation of blue[800]
        },
    }),
    typography: {
        button: {
            textTransform: 'none',
            color: 'default'
        }
    }
});
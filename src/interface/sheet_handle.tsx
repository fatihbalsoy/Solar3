/*
 *   puller.tsx
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 18 Oct 2023
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { Box, styled } from "@mui/material";
import { grey } from "@mui/material/colors"

const SheetHandle = styled(Box)(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: grey[700],
    borderRadius: 3,
    position: "absolute",
    top: 8,
    left: "calc(50% - 15px)"
}));
export default SheetHandle
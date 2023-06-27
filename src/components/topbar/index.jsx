import React from "react";
import './topbar.css';

import { BedroomBaby,Search } from '@mui/icons-material';
import { TextField,InputAdornment } from '@mui/material';


function Topbar(){
    return(
        <div className="topbarBox">
            <div className="logo">
                <BedroomBaby sx={{ fontSize: 26 }}></BedroomBaby>
            </div>
            <div className="title">
                StuToolBox
            </div>
            <div className="middle">
            <TextField
                hiddenLabel
                sx={{width:'36%'}}
                variant="filled"
                size="small"
                type="search"
                placeholder="搜索"
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
            />
            </div>
        </div>
    )
}

export default Topbar;
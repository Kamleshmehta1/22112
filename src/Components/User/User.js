import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Page from './Page';

function User() {

    const [value, setValue] = useState("1");

    const handleClick = (value) => {
        setValue(value);
    }

    return (
        <div>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList sx={{ width: "20%", margin: "auto" }} aria-label="lab API tabs example">
                        <Tab label="Login" onClick={() => handleClick("1")} value="1" />
                        <Tab label="Sign Up" onClick={() => handleClick("2")} value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Page type="LOGIN" />
                </TabPanel>
                <TabPanel value="2" >
                    <Page type="SIGNUP" />
                </TabPanel>
            </TabContext>
        </div>
    )
}

export default User
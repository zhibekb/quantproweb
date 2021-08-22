import { useEffect, useState } from "react";

import BackendAPI from "../BackendAPI"
import { AppBar, Box, Tabs, Tab, Typography, Grid, LinearProgress} from '@material-ui/core';

import TabPanel from "./TabPanel"
import OptionDataTable from "./OptionDataTable"

import SwipeableViews from 'react-swipeable-views';

import Alert from '@material-ui/lab/Alert';

import { XAxis, YAxis, Legend, Tooltip, Line, LineChart, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function OptionCalculation(props) {

    const { enabled } = props;

    const [blkSData, setBlackScholesData] = useState(null);

    const [mCarloData, setMonteCarloData] = useState(null);

    const [isLoading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState(0);

    const [errors, setErrors] = useState([]);

    function a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const black_scholes_request = {
            "strikePrice": props.strikePrice,
            "tenor": props.tenor,
            "volatility": props.volatility,
            "dividendYield": props.dividendYield,
            "interestRate": props.interestRate,
            "underlyingPrice": props.underlyingPrice
        }

        const monte_carlo_request = {
            ...black_scholes_request,
            "timeSteps": props.timeSteps,
            "numSimulations": props.numSimulations,
            "deltaPrice": props.deltaPrice,
            "deltaVolatility": props.deltaVolatility,
            "deltaInterestRate": props.deltaInterestRate
        }

        const blkPromise = BackendAPI.calculateBlackScholesOption(black_scholes_request).then(res => {
            setBlackScholesData(res);
        }).catch(error => {
            error.then(data => {
                setErrors(data.message);
            });
        });

        const mcPromise = BackendAPI.calculateMonteCarloOption(monte_carlo_request).then(res => {
            setMonteCarloData(res);
        }).catch(error => {
            error.then(data => {
                setErrors(data.message);
            });
        });

        Promise.all([blkPromise, mcPromise]).then(() => {
            setLoading(false);
        });
    }, [props]);

    return (
        <div ref={props.elemRef}>
            {isLoading && <LinearProgress />}

                    <AppBar position="static" color="transparent" elevation={0}>
                        <Tabs
                            value={activeTab}
                            onChange={(e, tab) => setActiveTab(tab)}
                            indicatorColor="secondary"
                            textColor="primary"
                            variant="fullWidth"
                        >
                            <Tab label="Black-Scholes" {...a11yProps(0)} />
                            <Tab label="Monte-Carlo" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        axis="x"
                        index={activeTab}
                        onChangeIndex={setActiveTab}
                    >
                        <TabPanel value={activeTab} index={0}>
                            { blkSData &&
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={12}>
                                        {!isLoading &&
                                            <OptionDataTable
                                                putOptionData={blkSData.put}
                                                callOptionData={blkSData.call}
                                                rounding={props.rounding} />}
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        {!isLoading &&
                                            <ResponsiveContainer height={400} width='100%'>
                                                <LineChart
                                                    data={blkSData.plot_data}
                                                    margin={{ top: 5, right: 20, left: 10, bottom: 20 }}
                                                >
                                                    <XAxis dataKey="price" padding={{ bottom: 20 }} tickSize={5} label="Underlying Price" tickMargin={30} />
                                                    <YAxis padding={{ right: 10 }} tickSize={2} tickMargin={5} label={{ value: 'Option Value', angle: -90, position: 'insideLeft' }} />
                                                    <Legend verticalAlign="top" iconType="circle"/>
                                                    <Tooltip />
                                                    <Line type="monotone" name="Call Option" dataKey="call_price" stroke="#27ae60" strokeWidth={2} dot={false} legendType="line" />
                                                    <Line type="monotone" name="Put Option" dataKey="put_price" stroke="#e74c3c" strokeWidth={2} dot={false} legendType="line" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        }
                                    </Grid>
                                </Grid>
                            }
                        </TabPanel>
                        <TabPanel value={activeTab} index={1}>
                            <Alert severity="warning">Greeks calculations may be inaccurate if the step size is too big or too small</Alert>
                            { mCarloData &&
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={12}>
                                        {!isLoading &&
                                            <OptionDataTable
                                                putOptionData={mCarloData.put}
                                                callOptionData={mCarloData.call}
                                                rounding={props.rounding} />}
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        {!isLoading &&
                                            <ResponsiveContainer height={400} width='100%'>
                                                <LineChart
                                                    data={mCarloData.plot_data}
                                                    margin={{ top: 5, right: 20, left: 10, bottom: 20 }}
                                                >
                                                    <Legend verticalAlign="top" iconType="circle"/>
                                                    <XAxis dataKey="price" padding={{ bottom: 20 }} tickSize={2} label="Underlying Price" tickMargin={30} />
                                                    <YAxis padding={{ right: 10 }} tickSize={2} tickMargin={5} label={{ value: 'Option Value', angle: -90, position: 'insideLeft' }} />
                                                    <Tooltip />
                                                    <Line type="monotone" name="Call Option" dataKey="call_price" stroke="#27ae60" strokeWidth={2} dot={false} legendType="line" />
                                                    <Line type="monotone" name="Put Option" dataKey="put_price" stroke="#e74c3c" strokeWidth={2} dot={false} legendType="line" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        }
                                    </Grid>
                                </Grid>
                            }
                        </TabPanel>
                    </SwipeableViews >
        </div >
    );
}
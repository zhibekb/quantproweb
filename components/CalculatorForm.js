import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { AppBar, Button, Backdrop, Divider, Grid, LinearProgress, CircularProgress, Tabs, Tab, TextField, createStyles, makeStyles } from '@material-ui/core';

import { KeyboardDatePicker } from "@material-ui/pickers";
import { useState, useEffect, useRef } from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';

import BackendAPI from "../BackendAPI"
import OptionCalculation from './OptionCalculation';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';

import { roundDecimals } from "../lib/util"

import TabPanel from "./TabPanel"

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(3),
            },
        },
    }),
);

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function OptionPriceCalculator() {
    const classes = useStyles();

    const [symbol, setSymbol] = useState("");
    const [strikePrice, setStrikePrice] = useState("");
    const [expiryDate, setExpiryDate] = useState(Date.now());
    const [tenor, setTenor] = useState("");
    const [volatility, setVolatility] = useState("");
    const [price, setPrice] = useState("");
    const [symbols, setSymbols] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [interestRate, setInterestRate] = useState(true);
    const [dividendYield, setDividendYield] = useState("");
    const [symbolsLoaded, setSymbolsLoaded] = useState(true);
    const [rounding, setRounding] = useState(2);

    const [calculated, setCalculated] = useState(false);


    useEffect(() => {
        const tenorMillis = expiryDate - Date.now();

        const tenorYears = tenorMillis / (86400 * 365 * 1000);

        setTenor(roundDecimals(tenorYears, 3));
    }, [expiryDate]);

    useEffect(() => {
        BackendAPI.getSymbols().then(res => setSymbols(res));

        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

        setExpiryDate(oneYearFromNow);

        setLoading(false);
        setSymbolsLoaded(true);
    }, [symbolsLoaded]);

    useEffect(() => {
        if (symbol == "") {
            setPrice("");
            setDividendYield("")
            setVolatility("")
        } else {
            setLoading(true);
            BackendAPI.getTickerLastClose(symbol)
                .then(res => {
                    setPrice(roundDecimals(res.close, 2));
                    setDividendYield(roundDecimals(res.dividendYield * 100, 2));
                })
                .finally(() => setLoading(false));

            BackendAPI.getTickerVolatility(symbol).then(res => {
                setVolatility(roundDecimals(res.volatility * 100, 2));
            });
        }
    }, [symbol]);

    useEffect(() => {
        setCalculated(false);
    }, [expiryDate, symbol, price, dividendYield, strikePrice, tenor]);

    const resultRef = useRef(null);

    const [tab, setTab] = useState(0);

    return (
        <>
            <form className={classes.root} noValidate autoComplete="off">
                {isLoading &&
                    <LinearProgress />
                }

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                        <Autocomplete
                            id="symbol"
                            options={symbols}
                            getOptionLabel={(option) => option.symbol + " (" + option.name + ", " + option.currency + ")"}
                            fullWidth
                            onChange={(event, option) => {
                                if (option === null) {
                                    setSymbol("");
                                } else {
                                    setSymbol(option.symbol);
                                }
                            }}
                            renderInput={(params) => <TextField {...params} label="Symbol" placeholder="AAPL" variant="outlined" />}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Strike Price"
                            type="number"
                            variant="outlined"
                            helperText="Strike Price"
                            value={strikePrice}
                            onChange={(e) => setStrikePrice(e.target.value)}
                            fullWidth
                            required />

                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                autoOk
                                variant="inline"
                                inputVariant="outlined"
                                label="Expiry Date"
                                format="MM/dd/yyyy"
                                value={expiryDate}
                                fullWidth
                                InputAdornmentProps={{ position: "start" }}
                                onChange={setExpiryDate}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Time To Maturity"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={tenor}
                            onChange={(e) => setTenor(e.target.value)}
                            helperText="In years. This field is calculated automatically. You may still edit it manually."
                            required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Underlying Current Price"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            helperText="This field is calculated automatically. You may still edit it manually."
                            required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Interest Rate"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={interestRate}
                            onChange={(e) => setInterestRate(e.target.value)}
                            helperText="In percentage (%) out of 100%"
                            required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Dividend Yield"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={dividendYield}
                            onChange={(e) => setDividendYield(e.target.value)}
                            helperText="Calculated automatically. You may still change the value."
                            required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Volatility"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={volatility}
                            onChange={(e) => setVolatility(e.target.value)}
                            helperText="60 days volatility. Calculated automatically from reference data. You many still change the value."
                            required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Rounding"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={rounding}
                            InputProps={{
                                inputProps: {
                                    max: 30, min: 1
                                }
                            }}
                            onChange={(e) => setRounding(e.target.value)}
                            helperText="How many decimal points to use."
                            required />
                    </Grid>
                </Grid>
                <br />
                <br />
                <div align="center">
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setCalculated(true)}>Calculate</Button>
                </div>
            </form>

            { calculated && 
                <>
                    <AppBar position="static" color="transparent" width="100%">
                        <Tabs value={tab} onChange={(event, value) => setTab(value)} aria-label="simple tabs example">
                            <Tab label="Item One" {...a11yProps(0)} />
                            <Tab label="Item Two" {...a11yProps(1)} />
                            <Tab label="Item Three" {...a11yProps(2)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={tab} index={0}>
                        <OptionCalculation
                            elemRef={resultRef}
                            rounding={rounding}
                            strikePrice={strikePrice}
                            underlyingPrice={price}
                            volatility={volatility}
                            tenor={tenor}
                            dividendYield={dividendYield}
                            interestRate={interestRate} />
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        Item Two
                    </TabPanel>
                    <TabPanel value={tab} index={2}>
                        Item Three
                    </TabPanel>
                </>
            }
        </>
    )
}

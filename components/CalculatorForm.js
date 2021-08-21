import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { Button, Backdrop, LinearProgress, CircularProgress, TextField, createStyles, makeStyles } from '@material-ui/core';

import { KeyboardDatePicker } from "@material-ui/pickers";
import { useState, useEffect, useRef } from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';

import BackendAPI from "../BackendAPI"
import OptionCalculation from './OptionCalculation';

import { roundDecimals } from "../lib/util"

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(3),
            },
        },
    }),
);

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

    useEffect(() => {
        if (calculated && resultRef.current) {
            resultRef.current.scrollIntoView({
                behavior: "smooth",
            });
        }
    }, [calculated, resultRef.current]);

    return (
        <>
            <form className={classes.root} noValidate autoComplete="off">
                {isLoading &&
                    <LinearProgress />
                }

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
                <TextField
                    label="Strike Price"
                    type="number"
                    variant="outlined"
                    helperText="Strike Price"
                    value={strikePrice}
                    onChange={(e) => setStrikePrice(e.target.value)}
                    style={{ width: 300 }}
                    required />
                <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    label="Expiry Date"
                    format="MM/dd/yyyy"
                    value={expiryDate}
                    InputAdornmentProps={{ position: "start" }}
                    onChange={setExpiryDate}
                />
                <TextField
                    label="Time To Maturity"
                    type="number"
                    variant="outlined"
                    style={{ width: 300 }}
                    value={tenor}
                    onChange={(e) => setTenor(e.target.value)}
                    helperText="In years. This field is calculated automatically. You may still edit it manually."
                    required />
                <TextField
                    label="Underlying Current Price"
                    type="number"
                    variant="outlined"
                    style={{ width: 300 }}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    helperText="This field is calculated automatically. You may still edit it manually."
                    required />
                <TextField
                    label="Interest Rate"
                    type="number"
                    variant="outlined"
                    style={{ width: 300 }}
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    helperText="In percentage (%) out of 100%"
                    required />
                <TextField
                    label="Dividend Yield"
                    type="number"
                    variant="outlined"
                    style={{ width: 300 }}
                    value={dividendYield}
                    onChange={(e) => setDividendYield(e.target.value)}
                    helperText="Calculated automatically. You may still change the value."
                    required />
                <TextField
                    label="Volatility"
                    type="number"
                    variant="outlined"
                    style={{ width: 300 }}
                    value={volatility}
                    onChange={(e) => setVolatility(e.target.value)}
                    helperText="60 days volatility. Calculated automatically from reference data. You many still change the value."
                    required />
                <TextField
                    label="Rounding"
                    type="number"
                    variant="outlined"
                    style={{ width: 300 }}
                    value={rounding}
                    InputProps={{
                        inputProps: { 
                            max: 30, min: 1
                        }
                    }}
                    onChange={(e) => setRounding(e.target.value)}
                    helperText="How many decimal points to use."
                    required />

                <br />
                <br />
                <div align="center">
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setCalculated(true)}>Calculate</Button>
                </div>
            </form>

            <OptionCalculation
                ref={resultRef}
                rounding={rounding}
                calculated={calculated}
                strikePrice={strikePrice}
                underlyingPrice={price}
                volatility={volatility}
                tenor={tenor}
                dividendYield={dividendYield}
                interestRate={interestRate} />
        </>
    )
}

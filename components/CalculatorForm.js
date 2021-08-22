import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Divider,
    Grid,
    LinearProgress,
    TextField,
    Typography,
    FormHelperText,
    createStyles,
    makeStyles
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { KeyboardDatePicker } from "@material-ui/pickers";
import { useState, useEffect, useRef } from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';

import BackendAPI from "../BackendAPI"
import OptionCalculation from './OptionCalculation';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';

import { roundDecimals } from "../lib/util"

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(3),
            },
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
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

    const [timeSteps, setTimeSteps] = useState(100);

    const [numSimulations, setNumSimulations] = useState(1000);

    const [deltaPrice, setDeltaPrice] = useState(0.001);
    const [deltaVolatility, setDeltaVolatility] = useState(0.001);
    const [deltaInterestRate, setDeltaInterestRate] = useState(0.001);

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

            Promise.all(
                [
                    BackendAPI.getTickerLastClose(symbol)
                        .then(res => {
                            setPrice(roundDecimals(res.close, 2));
                            setDividendYield(roundDecimals(res.dividendYield * 100, 2));
                        }),
                    BackendAPI.getTickerVolatility(symbol).then(res => {
                        setVolatility(roundDecimals(res.volatility * 100, 2));
                    })
                ]
            ).then(() => setLoading(false));
        }
    }, [symbol]);

    const onSubmit = (event) => {
        console.log("Submit");
        setCalculated(true);
        event.preventDefault();
    };

    const resultRef = useRef(null);

    return (
        <>
            <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
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
                            helperText="Helper Text"
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
                    <Grid item xs={12} sm={12}>
                        <Divider />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <Accordion elevation={0}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="monte-carlo-params"
                            >
                                <Typography className={classes.heading}>Monte-Carlo Simulation Parameters</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Time Steps"
                                            type="number"
                                            variant="outlined"
                                            fullWidth
                                            value={timeSteps}
                                            InputProps={{
                                                inputProps: {
                                                    min: 10
                                                }
                                            }}
                                            onChange={(e) => setTimeSteps(e.target.value)}
                                            helperText="Time steps. Default is 100. Minimum is 10 steps."
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Number of Simulations"
                                            type="number"
                                            variant="outlined"
                                            fullWidth
                                            value={numSimulations}
                                            InputProps={{
                                                inputProps: {
                                                    min: 10,
                                                    max: 5000
                                                }
                                            }}
                                            onChange={(e) => setNumSimulations(e.target.value)}
                                            helperText="The number of simulations. By default 1000."
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Delta S"
                                            type="number"
                                            variant="outlined"
                                            fullWidth
                                            value={deltaPrice}
                                            InputProps={{
                                                inputProps: {
                                                    min: 0.000001
                                                }
                                            }}
                                            onChange={(e) => setDeltaPrice(e.target.value)}
                                            helperText="Underlying Stock Price Step Size. Default is 0.001."
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Delta Sigma"
                                            type="number"
                                            variant="outlined"
                                            fullWidth
                                            value={deltaVolatility}
                                            InputProps={{
                                                inputProps: {
                                                    min: 0.000001
                                                }
                                            }}
                                            onChange={(e) => setDeltaVolatility(e.target.value)}
                                            helperText="Volatility Step Size. Default is 0.001."
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Delta r (interest rate)"
                                            type="number"
                                            variant="outlined"
                                            fullWidth
                                            value={deltaInterestRate}
                                            InputProps={{
                                                inputProps: {
                                                    min: 0.000001
                                                }
                                            }}
                                            onChange={(e) => setDeltaInterestRate(e.target.value)}
                                            helperText="Interest Rate Step Size. Default is 0.001"
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>


                <br />
                <br />
                <div align="center">
                    <Button
                        variant="contained"
                        type="submit"
                        color="secondary">Calculate</Button>
                </div>
            </form>

            <br />
            <Divider />

            {calculated &&
                <OptionCalculation
                    elemRef={resultRef}
                    rounding={rounding}
                    strikePrice={strikePrice}
                    underlyingPrice={price}
                    volatility={volatility}
                    tenor={tenor}
                    dividendYield={dividendYield}
                    interestRate={interestRate}
                    timeSteps={timeSteps}
                    numSimulations={numSimulations}
                    deltaPrice={deltaPrice}
                    deltaVolatility={deltaVolatility}
                    deltaInterestRate={deltaInterestRate} />
            }
        </>
    )
}

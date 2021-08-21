import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';

import BackendAPI from "../BackendAPI"

import { roundDecimals } from "../lib/util"

import Table from '@material-ui/core/Table';
import Grid from '@material-ui/core/Grid';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


import { XAxis, YAxis, Legend, Tooltip, Line, LineChart, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function OptionCalculation(props) {

    const [putOptionData, setPutOptionData] = useState({});
    const [callOptionData, setCallOptionData] = useState({});
    const [blackScholesPlot, setBlackScholesPlot] = useState([])

    const { rounding } = props;

    useEffect(() => {
        const data = {
            "strikePrice": props.strikePrice,
            "tenor": props.tenor,
            "volatility": props.volatility,
            "dividendYield": props.dividendYield,
            "interestRate": props.interestRate,
            "underlyingPrice": props.underlyingPrice
        }

        BackendAPI.calculateBlackScholesOption(data).then(res => {
            setPutOptionData(res.put);
            setCallOptionData(res.call);
            setBlackScholesPlot(res.plot_data);
        });
    }, [props]);

    const useStyles = makeStyles({
        table: {
            minWidth: 200,
        },
    });

    const classes = useStyles();

    return (
        <div ref={props.elemRef}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TableContainer>
                            <Table className={classes.table} aria-label="Option Data Table" width={400}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={100}></TableCell>
                                        <TableCell align="right" width={100}><strong>CALL</strong></TableCell>
                                        <TableCell align="right" width={100}><strong>PUT</strong></TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    <TableRow key="option-price">
                                        <TableCell align="left"><strong>Option Price</strong></TableCell>
                                        <TableCell align="right">{roundDecimals(callOptionData.price, rounding)}</TableCell>
                                        <TableCell align="right">{roundDecimals(putOptionData.price, rounding)}</TableCell>
                                    </TableRow>
                                    <TableRow key="option-delta">
                                        <TableCell align="left"><strong>Delta</strong></TableCell>
                                        <TableCell align="right">{roundDecimals(callOptionData.delta, rounding)}</TableCell>
                                        <TableCell align="right">{roundDecimals(putOptionData.delta, rounding)}</TableCell>
                                    </TableRow>
                                    <TableRow key="option-gamma">
                                        <TableCell align="left"><strong>Gamma</strong></TableCell>
                                        <TableCell align="right">{roundDecimals(callOptionData.gamma, rounding)}</TableCell>
                                        <TableCell align="right">{roundDecimals(putOptionData.gamma, rounding)}</TableCell>
                                    </TableRow>
                                    <TableRow key="option-vega">
                                        <TableCell align="left"><strong>Vega</strong></TableCell>
                                        <TableCell align="right">{roundDecimals(callOptionData.vega, rounding)}</TableCell>
                                        <TableCell align="right">{roundDecimals(putOptionData.vega, rounding)}</TableCell>
                                    </TableRow>
                                    <TableRow key="option-theta">
                                        <TableCell align="left"><strong>Theta</strong></TableCell>
                                        <TableCell align="right">{roundDecimals(callOptionData.theta, rounding)}</TableCell>
                                        <TableCell align="right">{roundDecimals(putOptionData.theta, rounding)}</TableCell>
                                    </TableRow>
                                    <TableRow key="option-rho">
                                        <TableCell align="left"><strong>Rho</strong></TableCell>
                                        <TableCell align="right">{roundDecimals(callOptionData.rho, rounding)}</TableCell>
                                        <TableCell align="right">{roundDecimals(putOptionData.rho, rounding)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                            <LineChart
                                data={blackScholesPlot}
                                width={600}
                                height={400}
                                margin={{ top: 5, right: 20, left: 10, bottom: 20 }}
                            >
                                <XAxis dataKey="price" padding={{ bottom: 20 }} tickSize={5} label="Underlying Price" tickMargin={30} />
                                <YAxis padding={{ right: 10 }} tickSize={5} tickMargin={30} />
                                <Tooltip />
                                <Line type="monotone" dataKey="call_price" label="Call Option Fair Value" stroke="#27ae60" strokeWidth={2} dot={false} legendType="line" />
                                <Line type="monotone" dataKey="put_price" label="Put Option Fair Value" stroke="#e74c3c" strokeWidth={2} dot={false} legendType="line" />
                            </LineChart>
                    </Grid>
            </Grid>
        </div>
    );
}
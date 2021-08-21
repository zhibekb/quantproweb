import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';

import BackendAPI from "../BackendAPI"

import { roundDecimals } from "../lib/util"

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default function OptionCalculation(props) {

    const [putOptionData, setPutOptionData] = useState({});
    const [callOptionData, setCallOptionData] = useState(0);

    const { rounding } = props;

    useEffect(() => {
        if (props.calculated) {
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
            });
        }

    }, [props]);

    const useStyles = makeStyles({
        table: {
          minWidth: 800,
        },
    });

    const classes = useStyles();

    return (
        <div ref={props.ref}>
            {props.calculated && 
                <TableContainer>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="right"><strong>CALL</strong></TableCell>
                                <TableCell align="right"><strong>PUT</strong></TableCell>
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
                                <TableCell align="right">{callOptionData.delta}</TableCell>
                                <TableCell align="right">{putOptionData.delta}</TableCell>
                            </TableRow>
                            <TableRow key="option-gamma">
                                <TableCell align="left"><strong>Gamma</strong></TableCell>
                                <TableCell align="right">{callOptionData.gamma}</TableCell>
                                <TableCell align="right">{putOptionData.gamma}</TableCell>
                            </TableRow>
                            <TableRow key="option-vega">
                                <TableCell align="left"><strong>Vega</strong></TableCell>
                                <TableCell align="right">{callOptionData.vega}</TableCell>
                                <TableCell align="right">{putOptionData.vega}</TableCell>
                            </TableRow>
                            <TableRow key="option-theta">
                                <TableCell align="left"><strong>Theta</strong></TableCell>
                                <TableCell align="right">{callOptionData.theta}</TableCell>
                                <TableCell align="right">{putOptionData.theta}</TableCell>
                            </TableRow>
                            <TableRow key="option-rho">
                                <TableCell align="left"><strong>Rho</strong></TableCell>
                                <TableCell align="right">{callOptionData.rho}</TableCell>
                                <TableCell align="right">{putOptionData.rho}</TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </div>
    );
}
import { Table, TableCell, TableContainer, TableBody, TableHead, TableRow } from '@material-ui/core';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import { roundDecimals } from "../lib/util"

const OptionDataTable = ({ callOptionData, putOptionData, rounding }) => {

    const StyledTableCell = withStyles((theme) => ({
        head: {
          backgroundColor: "#2c3e50",
          color: theme.palette.common.white,
        },
        body: {
          fontSize: 14,
        },
    }))(TableCell);

    const useStyles = makeStyles({
        table: {
            minWidth: 200,
        }
    });

    const classes = useStyles();

    return (
        <TableContainer>
            <Table className={classes.table} aria-label="Option Data Table" width={400}>
                <TableHead>
                    <TableRow>
                        <StyledTableCell width={100}></StyledTableCell>
                        <StyledTableCell align="left" width={100}><strong>CALL</strong></StyledTableCell>
                        <StyledTableCell align="left" width={100}><strong>PUT</strong></StyledTableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    <TableRow key="option-price">
                        <TableCell align="left"><strong>Option Price</strong></TableCell>
                        <TableCell align="left">{roundDecimals(callOptionData.price, rounding)}</TableCell>
                        <TableCell align="left">{roundDecimals(putOptionData.price, rounding)}</TableCell>
                    </TableRow>
                    <TableRow key="option-delta">
                        <TableCell align="left"><strong>Delta</strong></TableCell>
                        <TableCell align="left">{roundDecimals(callOptionData.delta, rounding)}</TableCell>
                        <TableCell align="left">{roundDecimals(putOptionData.delta, rounding)}</TableCell>
                    </TableRow>
                    <TableRow key="option-gamma">
                        <TableCell align="left"><strong>Gamma</strong></TableCell>
                        <TableCell align="left">{roundDecimals(callOptionData.gamma, rounding)}</TableCell>
                        <TableCell align="left">{roundDecimals(putOptionData.gamma, rounding)}</TableCell>
                    </TableRow>
                    <TableRow key="option-vega">
                        <TableCell align="left"><strong>Vega</strong></TableCell>
                        <TableCell align="left">{roundDecimals(callOptionData.vega, rounding)}</TableCell>
                        <TableCell align="left">{roundDecimals(putOptionData.vega, rounding)}</TableCell>
                    </TableRow>
                    <TableRow key="option-theta">
                        <TableCell align="left"><strong>Theta</strong></TableCell>
                        <TableCell align="left">{roundDecimals(callOptionData.theta, rounding)}</TableCell>
                        <TableCell align="left">{roundDecimals(putOptionData.theta, rounding)}</TableCell>
                    </TableRow>
                    <TableRow key="option-rho">
                        <TableCell align="left"><strong>Rho</strong></TableCell>
                        <TableCell align="left">{roundDecimals(callOptionData.rho, rounding)}</TableCell>
                        <TableCell align="left">{roundDecimals(putOptionData.rho, rounding)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default OptionDataTable;
import React, { useEffect, useState } from "react";
import axios from "axios";
import queryString from "query-string";
import {
  Grid,
  Button,
  InputLabel,
  FormControl,
  Select,
  TextField,
  LinearProgress,
} from "@material-ui/core";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  container: {
    padding: "0 20px",
  },
  heading: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  filters: {
    marginBottom: "20px",
  },
  textField: {
    marginRight: "20px",
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "10px",
  },
  table: {
    backgroundColor: "#fff",
  },
});

function Categories(props) {
  const classes = useStyles();
  const [weeklyTransactions, setWeeklyTransactions] = useState([]);
  let today = moment()
  let endDate = today.format('YYYY-MM-DD')
  let startDate = moment(endDate,"YYYY-MM-DD").subtract(6,'days').format("YYYY-MM-DD")      
  const [query, setQuery] = useState({
    page: 0,
    limit: 40,
    sort: "Newest",
    start:moment().subtract(6,'days').format(),
    end:moment().format()
  });
  const handleQueryChange = (e) => {
    console.log(e.target.value)
    if(e.target.name === 'start' || e.target.name === 'end' ){
      let value = moment().format(e.target.value)
      console.log(value)
      setQuery({ ...query, [e.target.name]: value });
    }
    setQuery({ ...query, [e.target.name]: e.target.value });
    setWeeklyTransactions([])
  };
  useEffect(() => {
    axios(
      `${process.env.REACT_APP_BACKEND_API}transaction?${queryString.stringify(
        query
      )}`
    ).then((result) => setWeeklyTransactions(result.data.data.transactions));
     
  }, [query]);
  

  
  return (
    <div>
      <Grid className={classes.container} container xs={12}>
        <Grid className={classes.heading} item container xs={12}>
          <h2>Orders</h2>
        </Grid>
        <Grid className={classes.filters} container justifyContent="flex-end">

            <div className="d-flex flex-column">
              <label htmlFor="start_date">Start Date</label>
              <TextField onChange = {handleQueryChange}
                id="start_date"
                type="date"
                name = "start"
                defaultValue={startDate}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              
            </div>
            
            <div className="d-flex flex-column">

              <label htmlFor="start_date">End Date</label>
              <TextField 
                onChange = {handleQueryChange}
                id="end_date"
                type="date"
                name = 'end'
                defaultValue={today.format('YYYY-MM-DD')}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />

            </div>
            

            <div className = 'd-flex align-items-center'>
            
              
              <FormControl  variant="outlined" className={classes.formControl} onChange = {handleQueryChange}>
                <InputLabel htmlFor="outlined-age-native-simple">
                  Sort By
                </InputLabel>
                  <Select
                    
                    native
                    inputProps={{
                      name: "sort",
                      id: "outlined-age-native-simple",
                    }}
                  >
                    <option value="Newest">Newest</option>
                    <option value="Oldest">Oldest</option>
                  </Select>
                </FormControl>
            </div>
          
        </Grid>

        <Grid className={classes.table} container xs={12}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Reciept No</TableCell>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {weeklyTransactions.length ? (
                weeklyTransactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell component="th" scope="row">
                      {transaction._id}
                    </TableCell>
                    <TableCell align="right">
                      {moment(transaction.createdAt).format("llll")}
                    </TableCell>
                    <TableCell align="right">
                      {transaction.items.length}
                    </TableCell>
                    <TableCell align="right">{transaction.subtotal}</TableCell>
                  </TableRow>
                ))
              ) : (
                <Grid
                  container
                  style={{ width: "100%" }}
                  justifyContent="center"
                >
                  <LinearProgress style={{ height: "20px", width: "100%" }} />
                </Grid>
              )}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </div>
  );
}

export default Categories;

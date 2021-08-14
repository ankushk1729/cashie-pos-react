import { Button, Grid, Paper, TextField } from "@material-ui/core";
import {React,useEffect,useState,useRef} from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { SettingsContext } from "../App";
import { useContext } from "react";
import Swal from "sweetalert2";

const useStyles = makeStyles({
  container: {
    padding: "10px 20px",
  },
});


function Setting(props) {
  const classes = useStyles();
  

  const [formData, setFormData] = useState(useContext(SettingsContext))
  const [name, setname] = useState('')
  const [discount, setdiscount] = useState('')
  const [tax, settax] = useState('')
  const handleChange = (e) => {
      
      setFormData({...formData,[e.target.name]:e.target.value})
  }
  
  const handleSubmit = (e) => {
      e.preventDefault()
      console.log(e.target.Store_Name.value)
      axios({
        method:'put',
        url:`https://cashie-backend.herokuapp.com/api/setting/${formData._id}`,
        data:{
            "name":e.target.Store_Name.value,
            "discount":e.target.Discount.value,
            "tax":e.target.tax.value
    },
        headers: {
            "Content-type": "application/json",
        }
  }).then((result) => {
    if (result.data.status === "success") {
      Swal.fire(
        "Success",
        "Settings Updated successfully",
        "success",
      );
      props.history.goBack();
    } else {
      Swal.fire("Opps", "Something went wrong...", "error");
    }
  })
  .catch((err) => Swal.fire("Opps", "Something went wrong...", "error"));
}
  useEffect(()=>{
    setname(formData.name)
    setdiscount(formData.discount)
    settax(formData.tax)

  },[])
  return (
    <Grid className={classes.container} xs={12}>
      <Grid className = 'mb-4' xs={12}>
        <h2>Update Store Settings</h2>
      </Grid>
      <Grid xs={12}>
        <Paper>
          <form onChange = {handleChange} onSubmit = {handleSubmit}>
              <Grid className = {classes.container} container spacing = {2}>
              <Grid item xs = {12}>
                <label className = 'mb-2' htmlFor = 'store_name'>Store Name</label>
            <TextField
              name="Store_Name"
              id = "store_name"
              onChange = {(e)=>setname(e.target.value)}
              className = "gray-bg"
              required
              variant = "outlined"
              fullWidth
              InputLabelProps={{
                shrink: false,
              }}
              value  = {name}
            />
            </Grid>
            <Grid  item xs = {6}>
            <label className = 'mb-2' htmlFor = 'Discount'>Discount</label>
            <TextField
              className = "gray-bg"
              name="Discount"
              
              variant = "outlined"
              required
              fullWidth
              id="Discount"
              placeholder="Discount"
              onChange = {(e)=>setdiscount(e.target.value)}
              InputLabelProps={{
                shrink: false,
              }}
              value = {discount}
            />
            </Grid>
            <Grid item xs = {6}>
            <label className = 'mb-2' htmlFor = 'tax'>Tax</label>
            <TextField
            className = "gray-bg"
              name="Tax"
              onChange = {(e)=>settax(e.target.value)}
              variant="outlined"
              required
              fullWidth
              id="tax"
              InputLabelProps={{
                shrink: false,
              }}
              value = {tax}
            />
            </Grid>
            <Grid xs = {12} className = 'd-flex justify-content-end'>
            <Button type = 'submit' xs = {4} className = 'px-xl-4' variant="contained" color="secondary">
				Submit
			</Button>
            </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Setting;

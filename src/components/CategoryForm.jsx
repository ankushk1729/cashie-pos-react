import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { FormControl, InputLabel, Paper, Select } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Swal from "sweetalert2";
import axios from "axios";


const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(3),
		padding: "20px",
	},
}));

export default function ProductForm(props) {
	const classes = useStyles();
	const [category, setCategory] = useState('');
	const [method, setMethod] = useState("POST");


	useEffect(() => {
		let categoryId = props.match.params.id;

		categoryId &&
			axios(`${process.env.REACT_APP_BACKEND_API}category/${categoryId}`).then(
				(result) => {
					if (result.data.status === "success") {
                        
						setCategory(result.data.data.name)
						setMethod("PUT");
					}
				},
			);
	}, []);
	

	const handleChange = (e) => {
		setCategory(e.target.value);
	};
	const handleSubmit = (e) => {
		e.preventDefault()
		axios({
			method:method,
			url:`${process.env.REACT_APP_BACKEND_API}${
				method === "PUT" ? "category/" + props.match.params.id : "category"
			}`,
			data:{"name":category},
			headers: {
				"Content-type": "application/json",
			}
		}).then((result) => {
			if (result.data.status === "success") {
				Swal.fire(
					"Success",
					`Product ${
						method === "PUT" ? "updated" : "created"
					} successfully...`,
					"success",
				);
				props.history.goBack();
			} else {
				Swal.fire("Opps", "Something went wrong...", "error");
			}
		})
		.catch((err) => Swal.fire("Opps", "Something went wrong...", "error"));
	}

	return (
		<Container component="main" maxWidth="lg">
			<Typography component="h1" variant="h5">
				<Button variant="defult" onClick={() => props.history.goBack()}>
					<ArrowBackIcon />
				</Button>{" "}
				Form Category
			</Typography>

			<Paper>
				<div className={classes.paper}>
					<form
						onSubmit = {handleSubmit}
						onChange={handleChange}
						className={classes.form}
						noValidate>
						<Grid container xs = {12} >
							<Grid item xs={10}>
								<TextField 
									name="name"
									variant="outlined"
									required
									fullWidth
									placeholder="Category Name"
									InputLabelProps={{
										shrink: false,
									}}
									value={category}
								/>	
							</Grid>
						
						<Grid alignItems = 'center' item xs = {1} >
							{method === "POST" ? (
								<Button
									type="submit"
									variant="contained"
									size="large"
									color="primary"
									className="c-btn mt-5">
									Create
								</Button>
							) : (
								<Button
									type="submit"
									variant="contained"
									size="large"
									color="primary"
									className="c-btn mt-5">
									Update
								</Button>
							)}
						</Grid>
						</Grid>
					</form>
				</div>
			</Paper>
		</Container>
	);
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import queryString from "query-string";
import {
  InputAdornment,
  Grid,
  Button,
  InputLabel,
  FormControl,
  Select,
  OutlinedInput,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { Link } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Swal from "sweetalert2";

const useStyles = makeStyles({
  category: {
    padding: "20px 20px",
    backgroundColor: "#fff",
    marginBottom: "20px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
  },
  container: {
    padding: "0 20px",
  },
  heading: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
  },
  filters: {
    marginBottom: "20px",
  },
});

function Categories(props) {
  const classes = useStyles();
  const [categories, setCategories] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [query, setQuery] = useState({
    page: 0,
    limit: 20,
    sort: "Newest",
  });
  const handleQueryChange = (e) => {
    setQuery({ ...query, [e.target.name]: e.target.value });
  };
  const handleDelete = (id) => {
	Swal.fire({
		title: "Are you sure?",
		text: "You won't be able to revert this!",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Delete",
	}).then((result) => {
		if (result.isConfirmed) {
			axios
				.delete(`${process.env.REACT_APP_BACKEND_API}category/${id}`, {
					headers: {
						authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				})
				.then((response) => {
					if (response.data.status === "success") {
						Swal.fire("Deleted!", "Category has been deleted..", "success");
						setRefresh(!refresh);
					} else {
						Swal.fire("Opps!", "Somthing went wrong..", "error");
					}
				})

				.catch((err) => {
					Swal.fire("Opps!", "Somthing went wrong..", "error");
				});
		}
	});
};
  useEffect(() => {
    axios(
      `${process.env.REACT_APP_BACKEND_API}category?${queryString.stringify(
        query
      )}`
    ).then((result) => {
      setCategories(result.data.data.categories);
    });
  }, [query,refresh]);
  return (
    <Grid className={classes.container} container xs={12} lg = {12}>
      <Grid className={classes.heading} item container xs={12}>
        <h2>Category Lists</h2>
        <Link to={`${props.match.path}/new`}>
          <Button variant="contained" color="primary">
            + New Data
          </Button>
        </Link>
      </Grid>
      <Grid className={classes.filters} container justifyContent="flex-end">
        <form onChange={handleQueryChange}>
          <FormControl variant="outlined">
            <OutlinedInput
              id="outlined-adornment-password"
              name="keyword"
              placeholder="Search products..."
              endAdornment={
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              }
              labelWidth={70}
            />
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="outlined-age-native-simple">
              Sort By
            </InputLabel>
            <Select
              native
              value=""
              inputProps={{
                name: "sort",
                id: "outlined-age-native-simple",
              }}
            >
              <option aria-label="None" value="" />
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="Name">Name</option>
            </Select>
          </FormControl>
        </form>
      </Grid>
      {categories.map((category) => (
        <Grid alignItems = 'center' justifyContent = 'space-between' className={classes.category} xs={12} item>
          <p>{category.name}</p>
		  <div>
          <Link to={`${props.match.path}/update/${category._id}`}>
            <EditIcon />
          </Link>
          <DeleteIcon onClick={() => handleDelete(category._id)} />
		  </div>
        </Grid>
      ))}
    </Grid>
  );
}

export default Categories;

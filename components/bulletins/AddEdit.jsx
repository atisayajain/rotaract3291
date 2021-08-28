import React from 'react';
import { useEffect, useState } from 'react';
import { Paper, Container, TextField, Button, Grid, FormControl, InputLabel, Input, FormHelperText, Select, MenuItem, FormGroup, FormLabel, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import clubs from '../data/clubs.json';
import axios from 'axios';
//import PrimarySearchAppBar from './PrimarySearchAppBar';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
//import EnhancedTable from './EnhancedTableMeeting';
import { animateScroll as scroll } from 'react-scroll';
import { useRouter } from 'next/router';
import { MEMBERS_API } from '../urls';
import { handleImageUpload } from '../uploadFile';

const useStyles = makeStyles((theme) => ({
  container: {
	display: 'flex',
	flexWrap: 'wrap',
  },
  textField: {
	marginLeft: theme.spacing(1),
	marginRight: theme.spacing(1),
	width: 200,
  },
  formControl: {
	width: '100%',
	margin: '0.75rem 0'
  }
}));

export { AddEdit };

function AddEdit(props) {
	const bulletin = props?.data;
	const id = bulletin?.id;
	//debugger;
	const isAdd = !bulletin;
	console.log(bulletin);
  	const classes = useStyles();

	const router = useRouter();

	const [loading, setLoading] = useState(false);
	//debugger;

  	const [state, setState] = useState(
			isAdd ? {
				club: '',
				publication_date: '',
				bulletin_link: '',
			} : {
				club: bulletin.club,
				publication_date: bulletin.publication_date,
				bulletin_link: bulletin.bulletin_link,
			}
	);

	const [error, setError] = useState(null);
	const [submitError, setSubmitError] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);

	const handleChange = (evt) => {
		//debugger;
		const value = evt.target.value;
		setState({
			...state,
			[evt.target.name]: value,
		});
	}

	useEffect(() => console.log(state), [state])

  	const onSubmit = (event, state) => {
		console.log(state);
		event.preventDefault();
		const bulletin = {
			club: bulletin.club,
			publication_date: bulletin.publication_date,
			bulletin_link: bulletin.bulletin_link,
		};

		const url = MEMBERS_API + '/member';

		debugger;
		axios({
			method: isAdd ? 'POST' : 'PUT',
			url: isAdd ? url : url + '/' + id,
			data: bulletin
		}).then((response) => {
			//debugger;
			console.log(response.data);
			router.push('/members');
			//setSubmitLoading(false);
		}).catch((error) => {
				console.log(error);
		});
	}

  	return (
		<div style={{ overflowX: 'hidden' }} >
			<Container>
				<Grid container direction="column" justify="center" alignItems="center">
					<Grid container xs={12} sm={6}>
						<div className={classes.formControl} style={{textAlign: 'center'}}><h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{(bulletin) ? 'Edit' : 'Add'} Bulletin</h1></div>

						<Alert variant="outlined" severity="info" className={classes.formControl} 
						style={{ display: (submitLoading)?'':'none', margin: ' 1rem 0 1rem 0' }}>
						Please wait...
						</Alert>
						
						<Alert variant="outlined" severity="error" className={classes.formControl} 
						style={{ display: (submitError)?'':'none', margin: ' 1rem 0 1rem 0' }}>
						Some error occured, please try again later.
						</Alert>

						<Alert variant="outlined" severity="error" className={classes.formControl} 
						style={{ display: (error)?'':'none', margin: ' 1rem 0 1rem 0' }}>
						Kindly fix the errors below.
						</Alert>

						<FormControl className={classes.formControl}>
							<InputLabel id="demo-simple-select-label">Club Name</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								name="club"
								value={state.club}
								onChange={(event) => handleChange(event)}
								>
								{clubs.map((club) => {
									return (<MenuItem key={club.club_name} value={club.club_name}>
										{club.club_name}
									</MenuItem>);
								})}
							</Select>
						</FormControl>						

						<FormControl className={classes.formControl}>
							<InputLabel id="demo-simple-select-label">Bulletin Link</InputLabel>
							<Input id="bulletin_link" name="bulletin_link"
								value={state.bulletin_link}
								onChange={(event) => handleChange(event)}
							/>
						</FormControl>

						<FormControl className={classes.formControl}>
							<FormHelperText>Publication Date</FormHelperText>
							<TextField
								name="publication_date"
								id="publication_date"
								type="date"
								value={state.publication_date}
								onChange={handleChange} />
						</FormControl>

						<Button
							variant="contained" 
							onClick={(event) => onSubmit(event, state)} >
							Submit
						</Button>
					</Grid>
				</Grid>
			</Container>
		</div>
	);
}
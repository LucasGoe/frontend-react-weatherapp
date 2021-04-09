import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherDetail from "../../components/weatherDetail/WeatherDetail";
import getTimeString from "../../helpers/createTimeString";
import './TodayTab.css';

function TodayTab({coordinates}) {
	const [forecasts, setForecasts] = useState(null);
	const [error, setError] = useState(false);
	const [loading, toggleLoading]= useState(false);

	useEffect(() => {
		async function fetchData() {
			setError(false);
			toggleLoading(true);

			try {
				const result = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates?.lat}&lon=${coordinates?.lon}&exclude=minutely,current,daily&appid=${process.env.REACT_APP_API_KEY}&lang=nl`);
				setForecasts([
					result.data.hourly[3],
					result.data.hourly[5],
					result.data.hourly[7],
				]);
				console.log(result.data.hourly[3]);
			} catch (e) {
				console.error(e);
				setError(true);
			}
			toggleLoading(false);
		};
		if (coordinates) {
			fetchData();
		}

	}, [coordinates]);


	return(
		<div className="tab-wrapper">
			{forecasts &&
			<>
				<div className="chart">
					{forecasts.map((forecast) => {
						return <WeatherDetail
							key={forecast.dt}
							temp={forecast.temp}
							type={forecast.weather[0].main}
							description={forecast.weather[0].description}
						/>
					})}
				</div>
				<div className="legend">
					{forecasts.map((forecast) => {
						return <span key={forecast.dt}>{getTimeString(forecast.dt)}</span>
					})}
				</div>
			</>
			}
			{error && <span>Er is iets misgegaan met het ophalen van de data.</span>}
			{loading && (<span>Loading...</span>)}
			{/*<div className="chart">*/}
			{/*	Hier komt de chart!*/}
			{/*</div>*/}
			{/*<div className="legend">*/}
			{/*	<span>08:00 uur</span>*/}
			{/*	<span>12:00 uur</span>*/}
			{/*	<span>16:00 uur</span>*/}
			{/*</div>*/}
		</div>
  );
};

export default TodayTab;

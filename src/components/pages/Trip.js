import React, { useState, useEffect } from 'react';
import DriverMap from '../DriverMap';
import HistoryCard from '../HistoryCard';
import axios from '../../configs/axios';

import { useLoadScript } from '@react-google-maps/api';
const libraries = ['places'];

function Trip(props) {
  const [ tripData, setTripData ] = useState({});
  const [ driverInfo, setDriverInfo ] = useState({});
  const [ origin, setOrigin] = useState({lat: null, lng: null});
  const [ destination, setDestination] = useState({lat: null, lng: null});
  const [ isDriver, setIsDriver] = useState(false);

  // need useEffect because tripData state is changed
  useEffect(() => {
    try{
      // user can be passenger or driver
      const getCurrentTrip = async() => {
        console.log('try');
        let user = await axios.get('/driver/service/current');
        let currentTrip = user.data.currentTrip;
        setTripData(currentTrip);

        if(currentTrip) {
          setOrigin({lat: currentTrip.from_lat, lng: currentTrip.from_lng});
          setDestination({lat: currentTrip.to_lat, lng: currentTrip.to_lng});

          // set Driver Personal Info according to currentTrip data
          let result = await axios.get(`/user/get/${currentTrip.id}`); 
          setDriverInfo(result.data.userData);
          
          if(currentTrip.id === props.userInfo.id) {
            setIsDriver(true);
          }
        }
      }

      getCurrentTrip();
    } catch(err) {
      console.log(err.response);
    }
  }, []);

    // ------------- required google places setting -----------
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries,
    });
  
    if (loadError) return 'Error loading maps';
    if (!isLoaded) return 'Loading Maps';

  const checkBooked = () => {
    try{
      if(tripData.status === 'booked') {
        return(
          <div className='route__form' style={{display: 'flex', flexDirection: 'column'}}>
            <span style={{fontSize: '1.2rem'}}>
              <b>From: </b>{tripData.from}
            </span>
            <span style={{fontSize: '1.2rem'}}>
              <b>To: </b>{tripData.to}
            </span>
            <div>
              {console.log(origin)}
              {console.log(destination)}
              <DriverMap origin={origin} destination={destination} />
            </div>
            {console.log(driverInfo)}
            <HistoryCard
              id={driverInfo.id}
              firstName={driverInfo.first_name}
              lastName={driverInfo.last_name}
              profilePic={driverInfo.profile_pic}
              phoneNumber={driverInfo.phone_number}
              from={tripData.from}
              to={tripData.to}
              carColor={tripData.car_color}
              carModel={tripData.car_model}
              driverLicense={tripData.driver_license}
              seat={tripData.seating_capacity}
              price={tripData.price}
              dateTime={tripData.createdAt}
              status={tripData.status}
            />
            {(isDriver) ? null : <button className='App__button'>Pay Now</button>}
          </div>
        )
      } else {
        return <h1 style={{textAlign: 'center', margin: '2rem'}}>You have no current trip</h1>
      }
    } catch(err) {
      return <h1 style={{textAlign: 'center', margin: '2rem'}}>You have no current trip</h1>
    }
  }

  return (
    <div className='route'>
    <div className='App__heading'>
      <h2>Current Trip</h2>
    </div>
      {checkBooked()}
    </div>
  )
}

export default Trip;
import React, { useState } from 'react';
import DriverMap from '../DriverMap';
import PlaceSearch from '../PlaceSearch';
import axios from '../../configs/axios';
import './DriverRoute.css';

import { useLoadScript } from '@react-google-maps/api';
import {
  Form,
  DatePicker,
  TimePicker,
  Checkbox,
  InputNumber,
  Slider,
  Button,
} from 'antd';
import moment from 'moment';

const libraries = ['places'];

function DriverRoute() {
  const [origin, setOrigin] = useState('Origin');
  const [destination, setDestination] = useState('Destination');
  const [geocodeOrigin, setGeocodeOrigin] = useState({});
  const [geocodeDestination, setGeocodeDestination] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [luggage, setLuggage] = useState(false);
  const [seatingCapacity, setSeatingCapacity] = useState('1');
  const [price, setPrice] = useState([30, 500]);

  // ------------- required google places setting -----------
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  const getOrigin = ref => {
    console.log('ref origin', ref);
    if (ref) {
      setGeocodeOrigin(ref);
    }
  };

  const getDestination = ref => {
    console.log('ref Destination', ref);
    if (ref) {
      setGeocodeDestination(ref);
    }
  };

  // --------------  input function  --------------------------

  // antD slider mark
  const marks = {
    0: '฿0',
    1000: '฿1,000',
  };

  function onDateChange(date, dateString) {
    console.log(date, dateString);
    setDate(dateString);
  }

  function onTimeChange(time, timeString) {
    console.log(time, timeString);
    setTime(timeString);
  }

  function onLuggageChange(e) {
    console.log(`checked = ${e.target.checked}`);
    setLuggage(e.target.checked);
  }

  function onSeatingChange(value) {
    console.log('seating', value);
    setSeatingCapacity(value);
  }

  const onMinPriceChange = value => {
    if (isNaN(value)) {
      return;
    }
    if (value < price[1]) {
      setPrice([value, price[1]]);
    }
  };

  const onMaxPriceChange = value => {
    if (isNaN(value)) {
      return;
    }
    if (value > price[0]) {
      setPrice([price[0], value]);
    }
  };

  const onAfterPriceChange = value => {
    setPrice(value);
  };

  const getRoute = () => {
    if (origin !== '' && destination !== '') {
      setOrigin(origin);
      setDestination(destination);
    }
  };

  // --------- call API ----------------
  const findRoute = async () => {
    getRoute();

    const destinationLat = geocodeDestination.lat;
    const destinationLng = geocodeDestination.lng;

    try {
      let result = await axios.get(
        `/user/trip?destinationLat=${destinationLat}&destinationLng=${destinationLng}`
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='route'>
      <div className='route__heading'>
        <h2>Search Rider</h2>
      </div>
      <div className='route__form'>
        <PlaceSearch place={origin} setPlace={setOrigin} getPlace={getOrigin} />
        <PlaceSearch
          place={destination}
          setPlace={setDestination}
          getPlace={getDestination}
        />

        <div className='route__box--two'>
          <DatePicker
            onChange={onDateChange}
            format={'Do MMMM YYYY, dddd'}
            className='route__input--half'
          />
          <TimePicker
            onChange={onTimeChange}
            defaultValue={moment('00:00:00', 'HH:mm:ss')}
            className='route__input--half'
          />
        </div>

        <div>
          <span>Seating Capacity: </span>
          <InputNumber
            min={1}
            max={13}
            defaultValue={1}
            onChange={onSeatingChange}
            className='route__input--small'
          />
        </div>
        <Checkbox onChange={onLuggageChange} className='route__input'>
          Luggage
        </Checkbox>

        {/* Price Range Slider & inputNumber */}
        <div className='route__price'>
          <b>Price range</b>
          <Slider
            range
            marks={marks}
            defaultValue={[30, 500]}
            value={[
              typeof price[0] === 'number' ? price[0] : 0,
              typeof price[1] === 'number' ? price[1] : 0,
            ]}
            min={0}
            max={1000}
            onChange={onAfterPriceChange}
            className='route__input'
          />
          <br />
          <div className='route__box--two'>
            <InputNumber
              min={0}
              max={1000}
              step={10.0}
              value={price[0]}
              onChange={onMinPriceChange}
              formatter={value => `฿ ${value}`}
              className='route__input--half'
            />
            <InputNumber
              min={0}
              max={1000}
              step={10.0}
              value={price[1]}
              onChange={onMaxPriceChange}
              formatter={value => `฿ ${value}`}
              className='route__input--half'
            />
          </div>
        </div>

        <Button
          type='primary'
          size='large'
          onClick={getRoute}
          className='route__button'
        >
          Search
        </Button>
      </div>
    </div>
  );
}

export default DriverRoute;
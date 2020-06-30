import React from 'react';
import moment from 'moment';
import {
  CarOutlined,
  CalendarOutlined,
  PushpinOutlined,
  DollarOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import '../styles/HistoryCard.css';

function HistoryCard(props) {
  return (
    <div className='card'>
      <div className='card__content'>
        <div className='card__img-box'>
          <img
            src={props.profilePic}
            alt={`${props.firstname} ${props.lastname}`}
            className='card__profile-img'
          />
          {props.firstname}
          <div>{props.firstname}</div>
        </div>
        <div className='card__text'>
          <h3>{props.name}</h3>
          <span>
            <b>From</b> {props.from}
          </span>
          <br />
          <span>
            <PushpinOutlined />
            <b>To</b> {props.to}
          </span>
          <br />
          <span>
            <CalendarOutlined />
            {moment(props.dateTime).format('MMMM Do YYYY')}
          </span>
          <br />
          <span>
            <CarOutlined /> {props.carModel}
          </span>
          <br />
          <span>
            <PhoneOutlined /> {props.phoneNumber}
          </span>
          <br />
          <span className='card__price'>
            <DollarOutlined />
            Price {props.price} Baht
          </span>
        </div>
      </div>
      <div className='card__divider'>{/* horizontal line */}</div>
      <div className='card__footer'>{props.status}</div>
    </div>
  );
}

export default HistoryCard;

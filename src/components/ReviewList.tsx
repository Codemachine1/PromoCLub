import Avatar from 'react-avatar';
import React, { useState, useEffect } from 'react';

import type {IReview} from '../models/review';
import { Card, Columns,Rating } from 'bumbag';
interface ReviewListInput{
    reviews:Data
}
interface Data{
  data:IReview[]
}

export default function ReviewList(Reviews:ReviewListInput){
    return (<ul className="unstyled-list">
    {Reviews.reviews.data.map((userReview: IReview) => {
      console.log(userReview);
      return (
        <Card className="media">
          <Columns>
          <Columns.Column><Avatar name="Foo Bar" /></Columns.Column>
          <Columns.Column> <p>{userReview.text}</p></Columns.Column>
          
          </Columns>
        <Rating       isStatic
      onChange={()=>{}} value={userReview.rating} />
        </Card>
      );
    })}
  </ul>)
}
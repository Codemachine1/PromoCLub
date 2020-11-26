import Avatar from 'react-avatar';
import { Link } from 'wouter';
import React, { useState, useEffect } from 'react';
import AnimateOnScroll from './AnimateOnScroll';
import type { IReview } from '../models/review';
import { Card, Columns, Rating, Button } from 'bumbag';
import { GoThumbsup } from 'react-icons/go';
import {gql} from "graphql-request"
import { useRecoilState, useRecoilValue } from 'recoil';
import LoggedInUser from '../state/LoggedInUser';
import graphQLClient from "../utilities/client"
interface ReviewListInput {
  reviews: Data;
  callback:Callback
}
interface Callback{
  ():void
}
interface Data {
  data: IReview[];
}

export default function ReviewList(Reviews: ReviewListInput) {
  const [userDetails, setUserDetails] = useRecoilState(LoggedInUser);

  const uptick=async (review:IReview)=>{
    review.upticks++
    await graphQLClient.request(gql`
      mutation updateReview($id: ID!,$data:ReviewInput!){
        updateReview(id:$id,data:$data){
          _id
        }
      }
    `,{
      "id":review._id,
      "data":{upticks:review.upticks}
    })
    Reviews.callback()
  }

  return (
    <ul className="unstyled-list">
      {Reviews.reviews.data.map((userReview: IReview) => {
        console.log(userReview);
        return (
          <AnimateOnScroll>
            <Card className="media">
              <Columns>
                <Columns.Column>
                  <Avatar name={userReview.user.name}/>
                </Columns.Column>
                <Columns.Column>
                  <Link to={`/user/${userReview.user._id}`}>
                    <h2>{userReview.user.name}</h2>
                  </Link>
                  <p>{userReview.text}</p>
                </Columns.Column>
              </Columns>
              <Rating isStatic onChange={() => {}} value={userReview.rating} />
              <p>{userReview.upticks} people found this review helpful</p>
              <Button variant="primary" onClick={()=>uptick(userReview)}>
                <GoThumbsup />
              </Button>
            </Card>
          </AnimateOnScroll>
        );
      })}
    </ul>
  );
}

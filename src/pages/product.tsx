import React, { useState, useEffect } from 'react';

import Modal from 'react-modal';
import type { IProduct } from '../models/product';
import type { IReview } from '../models/review';
import { Container,Spinner, Col, Row, Button } from 'react-bootstrap';
import Avatar from 'react-avatar';
import { gql, request } from 'graphql-request';
import type urlParmeter from '../interfaces/urlParmeter';
import graphQLClient from '../utilities/client';
import ReviewList from '../components/ReviewList';
import { useAuth0 } from '@auth0/auth0-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import ReviewDialog from "../components/ReviewDialog"
import LoggedInUser from '../state/LoggedInUser';
interface response {
  findProductByID: IProduct;
}

interface state {
  product?: IProduct;
}
export default function Product(params: urlParmeter) {
  var [Product, updateProduct] = useState<state>({ product: null });
  const { isAuthenticated } = useAuth0();
  const [userDetails, setUserDetails] = useRecoilState(LoggedInUser);

  useEffect(() => {
    async function getProduct() {
      var data: response = await graphQLClient.request(
        gql`
          query findProductByID($id: ID!) {
            findProductByID(id: $id) {
              _id
              name
              creator {
                name
              }
              elevator
              reviews {
                data {
                  text
                  rating
                  user {
                    name
                  }
                }
              }
            }
          }
        `,
        { id: params.id },
      );
      updateProduct({ product: data.findProductByID });
    }
    getProduct();
  },[]);
  if (Product.product == null) {
    return(<div style={{"padding":"50%"}}>
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  </div>)
  } else {
    console.log(Product);
    return (
      <Container>
        <Row>
          <h1>{Product.product.name}</h1>
        </Row>
        <Row>
          <Col></Col>
          <Col>
            <p>{Product.product.description}</p>
          </Col>
        </Row>
        <Row>
          {
            isAuthenticated?(<ReviewDialog userid={userDetails._id} productid={Product.product._id}/>):(<></>)
          }
          
          <ul className="unstyled-list">
            {Product.product.reviews.data.map((userReview: IReview) => {
              console.log(userReview);
              return (
                <li className="media">
                  <Avatar name="Foo Bar" />
                  <div className="media-body">
                    <p>{userReview.text}</p>
                    <p>{userReview.rating}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Row>
      </Container>
    );
  }
}

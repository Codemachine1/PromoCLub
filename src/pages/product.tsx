import React, { useState, useEffect } from 'react';
import type { IProduct } from '../models/product';
import type { IReview } from '../models/review';
import { Container, Spinner, Col, Row, Button } from 'react-bootstrap';
import Avatar from 'react-avatar';
import { gql, request } from 'graphql-request';
import type urlParmeter from '../interfaces/urlParmeter';
import graphQLClient from '../utilities/client';
import ReviewList from '../components/ReviewList';
import { useAuth0 } from '@auth0/auth0-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import ReviewDialog from '../components/ReviewDialog';
import LoggedInUser from '../state/LoggedInUser';
import { Link } from 'wouter';

import {
  TwitterButton,
  FacebookLikeButton,
  FacebookShareButton,
  FacebookMessengerButton,
  GoogleButton,
  GoogleHangoutButton,
  PinterestButton,
  WhatsAppButton,
  RedditButton,
  EmailButton,
} from 'react-social-buttons';
import {ImArrowRight} from "react-icons/im"
import AnimateOnMouseOverTimed from "../components/AnimateOnMouseOverTimed"
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
  const [updateProductcal,setUpdateProduct]=useState(false)
  useEffect(() => {
    async function getProduct() {
      var data: response = await graphQLClient.request(
        gql`
          query findProductByID($id: ID!) {
            findProductByID(id: $id) {
              _id
              name
              url
              description
              creator {
                name
              }
              elevator
              reviews {
                data {
                  _id
                  text
                  rating
                  upticks
                  user {
                    _id
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
  }, [updateProductcal]);


  const callback=()=>{
    setUpdateProduct(true)
  }
  if (Product.product == null) {
    return (
      <div style={{ padding: '50%' }}>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  } else {
    console.log(Product);
    return (
      <Container>
        <Row>
          <h1>{Product.product.name}</h1>
        </Row>
        <Row>
          <h2>{Product.product.elevator}</h2>
        </Row>
        <Row>
          <Col>
            <FacebookLikeButton/>
            <TwitterButton />
            <WhatsAppButton />
          </Col>
          <Col>
            <p>{Product.product.description}</p>
          </Col>
        </Row>
        <Row>
          <a href={Product.product.url.toString()}>
            <AnimateOnMouseOverTimed timing={750}>
            <Button>Goto {Product.product.name} <ImArrowRight/></Button></AnimateOnMouseOverTimed>
          </a>
        </Row>
        <Row>
          <h2>Share</h2>
        </Row>
        <Row>
        </Row>
        <Row>
          <h1>Reviews</h1>      
          {isAuthenticated ? (
            <ReviewDialog
              userid={userDetails._id}
              productid={Product.product._id}
              product={Product.product}
              callback={(product:IProduct)=>{updateProduct({ product:product})}}
            />
          ) : (
            <></>
          )}
        </Row>
        <Row>
          <ReviewList callback={callback} reviews={Product.product.reviews}/>
        </Row>
      </Container>
    );
  }
}

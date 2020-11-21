import React, { useState, useEffect } from 'react';

import type { IReview } from '../models/review';
import { Container, Col, Row, Spinner } from 'react-bootstrap';
import Avatar from 'react-avatar';
import { gql } from 'graphql-request';
import graphQLClient from '../utilities/client';
import type urlParmeter from '../interfaces/urlParmeter';
import type { IUser } from 'src/models/user';
import ProductList from '../components/ProductList';

interface response {
  data: findUserById;
}

interface findUserById {
  findUserById: IUser;
}

export default function Profile(params: urlParmeter) {
  var u: IUser;
  var [User, updateUser] = useState(u);
  useEffect(() => {
    async function getProduct() {
      console.log(params);
      var data: findUserById = await graphQLClient.request(
        gql`
          # Write your query or mutation here
          query findUserByID($id: ID!) {
            findUserByID(id: $id) {
              _id
              name
              prom
              products {
                data {
                  name
                  _id
                  elevator
                }
              }
              reviews {
                data {
                  rating
                  text
                  _id
                }
              }
              promotedproducts {
                data {
                  name
                  _id
                  elevator
                }
              }
            }
          }
        `,
        { id: params.id },
      );
      console.log(data);
      updateUser(data.findUserById);
      console.log(User);
    }
    getProduct();
  }, []);
  console.log('response', User);
  if (User == null || User == undefined) {
    return (
      <div style={{ padding: '50%' }}>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  } else {
    return (
      <Container>
        <Row>
          <h1>{User.name}</h1>
        </Row>
        <Row>
          <Col>
            <Avatar />
          </Col>
          <Col>
            <p>{User.prom}</p>
          </Col>
        </Row>
        <Row>
          <h2>Your Products</h2>
        </Row>
        <Row>
          <ProductList products={User.products} />
        </Row>
        <Row>
          <h2>Products You Promoted</h2>
        </Row>
        <Row>
          <ProductList products={User.promotedproducts} />
        </Row>
        <Row>
          {User.reviews.data.map((userReview: IReview) => {
            return (
              <li className="media">
                <Avatar name="Foo Bar" />
                <div className="media-body">
                  <h5 className="mt-0 mb-1">{userReview.user.name}</h5>
                  <p>{userReview.text}</p>
                  <p>{userReview.rating}</p>
                </div>
              </li>
            );
          })}
        </Row>
      </Container>
    );
  }
}

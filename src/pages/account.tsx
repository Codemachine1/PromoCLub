import React, { useState, useEffect } from 'react';

import { Link, Route } from 'wouter';
import type { IUser } from '../models/user';
import Avatar from 'react-avatar';
import graphQLClient from '../utilities/client';
import { gql } from 'graphql-request';
import type urlParmeter from '../interfaces/urlParmeter';
import { Container, Col, Row } from 'react-bootstrap';
import ProductList from '../components/ProductList';
import ReviewList from '../components/ReviewList';
import { useAuth0 } from '@auth0/auth0-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import LoggedInUser from '../state/LoggedInUser';
import { Formik, Form, Field } from 'formik';
import { Textarea, TextareaField, Card, Columns } from 'bumbag';
interface response {
  findUserByID: IUser;
}
function Account() {
  const [userDetails, setUserDetails] = useRecoilState(LoggedInUser);
  const { name, picture, email } = useAuth0().user;
  const { isAuthenticated } = useAuth0();
  console.log(`user's id  ${userDetails._id}`);
  var u: IUser;
  var [User, updateUser] = useState(u);
  useEffect(() => {
    async function getProduct() {
      var response: response = await graphQLClient.request(
        gql`
          query FindUserByID($id: ID!) {
            findUserByID(id: $id) {
              _id
              name
              avatar
              products {
                data {
                  name
                  _id
                  elevator
                }
              }
              reviews {
                data {
                  text
                  rating
                  user {
                    _id
                    name
                  }
                }
              }
              cocreators {
                data{
                  _id
                  name
                  avatar
                  refid
                }

              }
              favoriteCreator {
                data{
                  _id
                  name
                  avatar
                  refid
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
        {
          id: userDetails._id,
        },
      );
      console.log(response.findUserByID);
      updateUser(response.findUserByID);
    }
    getProduct();
  });
  console.log('loading', isAuthenticated && User != undefined && User != null);
  if (isAuthenticated && User != undefined && User != null) {
    return (
      <Container>
        <Row>
          <h1>{User.name}</h1>
        </Row>
        <Row>
          <Col>
            <Avatar name={User.name.toString()} src={User.avatar.toString()} />
          </Col>
          <Col>
            <Formik
              initialValues={{ promo: User.prom }}
              onSubmit={(data) => {}}
            >
              <Form>
                <Field
                  name="promo"
                  label="your promotion"
                  components={TextareaField.Formik}
                />
              </Form>
            </Formik>
          </Col>
        </Row>
        <Row>
          <h2>Your Favorite Creators</h2>
        </Row>

        <Row>{
        User.favoriteCreator.data.length<1?(
          <ul className="unstyled-list">
            {User.favoriteCreator.data.map((user: IUser) => {
            console.log(user)
              return (
                <Link href={`/user/${user.refid}`}>
                  <li className="media">
                  <Avatar name={User.name.toString()} src={User.avatar.toString()} />
                    <div className="media-body">
                      <h5 className="mt-0 mb-1">{user.name}</h5>
                      {user.prom}
                    </div>
                  </li>
                </Link>
              );
            })}
          </ul>):(
            <p> you have not favorited any creators</p>
          )
        }
        </Row>

        <Row>
          <h2>Your Favorite CoCreators</h2>
        </Row>

        <Row>
          {
        User.cocreators.data.length<1?(
          <ul className="unstyled-list">
            {
            User.cocreators.data.map((user: IUser) => {
              console.log(user)
              return (
                <Link href={`/user/${user.refid}`}>
                  <li className="media">
                    <Avatar name={user.name} />
                    <div className="media-body">
                      <h5 className="mt-0 mb-1">{user.name}</h5>
                      {user.prom}
                    </div>
                  </li>
                </Link>
              );
            })
          }
          </ul>):(
            <p> you have no cocreators</p>
          )
        }
        </Row>

        <Row>
          <ReviewList reviews={User.reviews} />
        </Row>
        <Row>
          <h2>Your Reviews</h2>
        </Row>
        <Row>
          <ReviewList reviews={User.reviews} />
        </Row>
        <Row>
          <h2>Your Products</h2>
        </Row>
        <Row>
          <ProductList products={User.products.data} />
        </Row>
        <Row>
          <h2>Products You Promoted</h2>
        </Row>
        <Row>
          <ProductList products={User.promotedproducts.data} />
        </Row>
      </Container>
    );
  } else if (!isAuthenticated) {
    return <div> please login</div>;
  } else {
    return <div>loading</div>;
  }
}
export default Account;

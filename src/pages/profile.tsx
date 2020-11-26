import React, { useState, useEffect } from 'react';

import type { IReview } from '../models/review';
import { Container, Col, Row, Spinner } from 'react-bootstrap';
import Avatar from 'react-avatar';
import { gql } from 'graphql-request';
import graphQLClient from '../utilities/client';
import type urlParmeter from '../interfaces/urlParmeter';
import type { IUser, IListPerson } from 'src/models/user';
import ProductList from '../components/ProductList';
import { Level, Button } from 'bumbag';

import { useRecoilState, useRecoilValue } from 'recoil';
import LoggedInUser from '../state/LoggedInUser';
import { ToastContainer, toast } from 'react-toastify';
interface response {
  data: findUserById;
}

interface findUserById {
  findUserById: IUser;
}

export default function Profile(params: urlParmeter) {
  var u: IUser;

  const [userDetails, setUserDetails] = useRecoilState(LoggedInUser);

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
                  rating
                  text
                  _id
                  user {
                    _id
                    name
                  }
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
      updateUser(data.findUserByID);
      console.log(User);
    }
    getProduct();
  }, []);

  const favorite = async (loggedInUser: IUser, profile: IUser) => {
    try {
      var newLength: number = loggedInUser.favoriteCreator.data.length + 1;
      var profiles = new Array<IListPerson>(newLength);
      profiles.concat(loggedInUser.favoriteCreator.data);
      profiles.push({
        name: profile.name,
        prom: profile.prom,
        avatar: profile.avatar,
      });
      await graphQLClient.request(
        gql`
          mutation updateUser($id: ID!, $data: UserInput!) {
            updateUser(id: $id, data: $data) {
              _id
            }
          }
        `,
        {
          id: loggedInUser._id,
          data: {
            favoriteCreator: {
              create: profiles,
            },
          },
        },
      );
      toast(`${profile.name} added to favorites`);
    } catch (e) {
      console.error(e);

      toast(`error: ${profile.name} not added to favorites`);
    }
  };

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
        <ToastContainer />
        <Row>
          <Col>
            <h1>{User.name}</h1>
          </Col>
          <Col>
            {userDetails != null &&
            userDetails.favoriteCreator.data.indexOf({
              name: User.name,
              prom: User.prom,
              avatar: User.avatar,
            })>-1 ? (
              <Button
                onClick={() => {
                  favorite(userDetails, User);
                }}
              >
                favorite
              </Button>
            ) : (
              <></>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <Avatar name={User.name.toString()} src={User.avatar.toString()} />
          </Col>
          <Col>
            <p>{User.prom}</p>
          </Col>
        </Row>
        <Row>
          <h2>Around the web</h2>
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

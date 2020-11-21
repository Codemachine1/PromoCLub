import React, { useState, useEffect } from 'react';

import { Link, Route } from 'wouter';
import type { IUser } from 'src/models/user';
import { Container, Col, Row, Form, Spinner } from 'react-bootstrap';
import Avatar from 'react-avatar';
import { gql, request } from 'graphql-request';
interface response {
  allUsers: allUsers;
}

interface allUsers {
  data: IUser[];
}
import graphQLClient from '../utilities/client';
export default function products() {
  var u: IUser[] = [];
  var [users, setUsers] = useState(u);
  var [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    async function getProducts() {
      var response: response = await graphQLClient.request(gql`
        query {
          allUsers {
            data {
              _id
              name
              prom
              avatar
              products {
                data {
                  _id
                }
              }
            }
          }
        }
      `);
      console.log(response);
      if (searchTerm.length > 0) {
        var users = response.allUsers.data.filter((user) => {
          var regex = `.${searchTerm}.`;
          return (
            regex.match(user.name.toString()) ||
            regex.match(user.prom.toString())
          );
        });
      } else {
        users = response.allUsers.data;
      }
      console.log(users);
      setUsers(users);
    }
    getProducts();
  }, [searchTerm]);
  console.log("test",users)
  if (users == undefined && users == null) {
    console.log("loading")
    return (
      <div style={{ padding: '50%' }}>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  } else {
    console.log("showing content")
    return (
      <Container>
        <Row>
          <Form.Group controlId="searchbox">
            <Form.Label>search</Form.Label>
            <Form.Control
              type="text"
              placeholder="search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Row>
        <Row>
          <ul className="list-unstyled">
            {users.map((user: IUser) => {
              return (
                <Link href={`/user/${user._id}`}>
                  <li className="media">
                    <Avatar name="Foo Bar" />
                    <div className="media-body">
                      <h5 className="mt-0 mb-1">{user.name}</h5>
                      {user.prom}
                    </div>
                  </li>
                </Link>
              );
            })}
          </ul>
        </Row>
      </Container>
    );
  }
}

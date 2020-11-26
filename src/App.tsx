import React, { useState, useEffect } from 'react';
import graphQLClient from './utilities/client';
import { Router, Link, Route } from 'wouter';
import { TopNav } from 'bumbag';
import Index from './pages/index';
import Product from './pages/product';
import Create from './pages/create';
import Users from './pages/users';
import Products from './pages/products';
import Profile from './pages/profile';
import Account from './pages/account';
import { useRecoilState, useRecoilValue } from 'recoil';
import { gql } from 'graphql-request';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import LoggedInUser from './state/LoggedInUser';
interface AppProps {}

function App({}: AppProps) {
  console.log('starting app');
  var usersEmail = '';
  var usersPicture = '';
  var usersName = '';
  const [userDetails, setUserDetails] = useRecoilState(LoggedInUser);
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  if (isAuthenticated && userDetails == null) {
    const { name, picture, email } = useAuth0().user;
    console.log(picture)
    usersEmail = email;
    usersPicture = picture;
    usersName = name;
  }
  useEffect(() => {
    async function loadOrCreateUser() {
      var response = await graphQLClient.request(
        gql`
          query GetUserByEmail($email: String!) {
            getUserByEmail(email: $email) {
              _id
              name
              email
              favoriteCreator{
                data{
                  _id
                  name
                }
              }

            }
          }
        `,
        {
          email: usersEmail,
        },
      );
      console.log("response",response.getUserByEmail);
      if (response.getUserByEmail != null) {
        console.log("getting user");
        console.log(response.getUserByEmail);
        setUserDetails(response.getUserByEmail);
      } else {
        var response = await graphQLClient.request(
          gql`
            mutation createUser($data: UserInput!) {
              createUser(data: $data) {
                _id
                name
                email
              }
            }
          `,
          {
            data: {
              name: usersName,
              prom: 'Your promotion here',
              avatar: usersPicture,
              email: usersEmail,
              products: { create: [], connect: [], disconnect: [] },
              reviews: { create: [], connect: [], disconnect: [] },
              promotedproducts: { create: [], connect: [], disconnect: [] },
            },
          },
        );
        setUserDetails(response.createUser);
        console.log(userDetails);
      }
    }
    if (isAuthenticated && userDetails == null) {
      loadOrCreateUser();
    }
  });
  return (
    <div className="App">
      <header className="App-header">
        <TopNav>
          <TopNav.Item href="/">
            <h1>Promo Club</h1>
          </TopNav.Item>
          <TopNav.Section className="mr-auto">
            <Link href="/users">
              <TopNav.Item>Creators</TopNav.Item>
            </Link>
            <Link href="/products">
              <TopNav.Item href="/products">products</TopNav.Item>
            </Link>
            {isAuthenticated ? (
            <Link href="/new">
              <TopNav.Item href="/new">new</TopNav.Item>
            </Link>): (
              <></>)
            }
          </TopNav.Section>
          <TopNav.Section>
            {!isAuthenticated ? (
              <>
                <TopNav.Item onClick={() => loginWithRedirect()}>
                  login
                </TopNav.Item>
                <TopNav.Item
                  onClick={() =>
                    loginWithRedirect({
                      screen_hint: 'signup',
                    })
                  }
                >
                  Sign up
                </TopNav.Item>
              </>
            ) : (
              <>
                <Link href="/account">
                  <TopNav.Item href="/account">account</TopNav.Item>
                </Link>
                <TopNav.Item
                  onClick={() =>
                    logout({
                      returnTo: window.location.origin,
                    })
                  }
                >
                  logout
                </TopNav.Item>
              </>
            )}
          </TopNav.Section>
        </TopNav>
      </header>

      <Route path="/">
        <Index />
      </Route>
      <Route path="/product/:productid">
        {(params) => {
          return <Product id={params.productid} />;
        }}
      </Route>
      <Route path="/users">
        <Users />
      </Route>
      <Route path="/products">
        <Products />
      </Route>

      <Route path="/user/:userid">
        {(params) => {
          return <Profile id={params.userid} />;
        }}
      </Route>
      <Route path="/account">
        <Account />
      </Route>
      <Route path="/users">
        <Users />
      </Route>
      <Route path="/new">
        <Create />
      </Route>
    </div>
  );
}

export default App;

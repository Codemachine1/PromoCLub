import React, { useState, useEffect } from 'react';

import { Container } from 'bumbag';
import { gql } from 'graphql-request';
import { useLocation, Redirect } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import graphQLClient from '../utilities/client';
import { useAuth0 } from '@auth0/auth0-react';
import { InputField, Textarea, Button, TextareaField } from 'bumbag';
import { useRecoilState, useRecoilValue } from 'recoil';
import LoggedInUser from '../state/LoggedInUser';
function Product() {
  const location = useLocation();
  const [userDetails, setUserDetails] = useRecoilState(LoggedInUser);
  const [redirect, setRedirect] = useState(false);
  const { isAuthenticated } = useAuth0();
  // console.log(location)
  console.log(`user details ${userDetails._id}`);
  if (!isAuthenticated) {
    return (
      <div>
        return (<div>login</div>)
      </div>
    );
  } else if (redirect) {
    return <Redirect to="/" />;
  } else {
    return (
      <Container>
        <h1>New Creation</h1>
        <ToastContainer />
        <Formik
          initialValues={{ name: '', description: '',url:"", elevator: '' }}
          onSubmit={(values, { setSubmitting }) => {
            async function createProduct() {
              try {
                console.log(values);
                var response = await graphQLClient.request(
                  gql`
                    mutation CreateProduct($product: ProductInput!) {
                      createProduct(data: $product) {
                        _id
                        name
                        description
                      }
                    }
                  `,
                  {
                    product: {
                      name: values.name,
                      url:values.url,
                      description: values.description,
                      elevator: values.elevator,
                      reviews: {
                        create: [],
                        connect: [],
                        disconnect: [],
                      },
                      usersThatPromotedProduct: {
                        create: [],
                        connect: [],
                        disconnect: [],
                      },
                      creator: {
                        connect: userDetails._id,
                      },
                    },
                  },
                );
                console.log(response);
                setRedirect(true);
              } catch (e) {
                toast('Invalid input');
                console.log(e);
              }

              console.log();
              setSubmitting(false);
            }
            ('test');
            createProduct();
          }}
        >
          <Form>
            <Field
              name="name"
              label="product name"
              component={InputField.Formik}
            />
            <Field
              name="elevator"
              label="elevator pitch"
              component={TextareaField.Formik}
            />
            <Field
              name="url"
              label="Url to store page or product site"
              component={TextareaField.Formik}
            />
            <Field
              name="description"
              label="In depth description"
              component={TextareaField.Formik}
            />
            <Button palette="primary" type="submit">
              Submit{' '}
            </Button>
          </Form>
        </Formik>
      </Container>
    );
  }
}
export default Product;

import { Dialog, Modal, Button, Rating } from 'bumbag';
import React, { useState, useEffect } from 'react';
import { InputField, Textarea, TextareaField } from 'bumbag';
import { Formik, Form, Field } from 'formik';
import graphQLClient from '../utilities/client';
import { gql } from 'graphql-request';
import type {IProduct} from "../models/product"
interface ReviewProps {
  userid: String;
  productid: String;
  product:IProduct
  callback:Callback
}
interface Callback{
    (product:IProduct):void
}

export default function ReviewDialog(props: ReviewProps) {
  const [rating, setRating] = useState(0);
  return (
    <Modal.State>
      <Dialog.Modal showCloseButton baseId="" title="Review">
        <Formik
          initialValues={{ text: '' }}
          onSubmit={(values, { setSubmitting }) => {
            async function sendReview() {
              var response = await graphQLClient.request(
                gql`
                  mutation CreateReview($data: ReviewInput!) {
                    createReview(data: $data) {
                      rating
                      text
                      product {
                        _id
                      }
                    }
                  }
                `,
                {
                    "data": {
                      "text": values.text,
                      "rating": rating,
                      "user": {
                        "connect": props.userid
                      },
                      "product": {
                        "connect": props.productid
                      }
                    }
                  }
              );
              console.log(response);
              var data:IProduct=props.product
              data.reviews
              data.reviews.data.push(response.createReview)
              props.callback(data)
              setSubmitting(false);
              
            }
            sendReview();
          }}
        >
          <Form>
            <Field name="text" label="review" component={Textarea.Formik} />
            <Rating onChange={()=>{}} value={rating} />
            <Button palette="primary" type="submit">
              Submit{' '}
            </Button>
          </Form>
        </Formik>
      </Dialog.Modal>
      <Modal.Disclosure alignX="right" use={Button}>Review</Modal.Disclosure>
    </Modal.State>
  );
}

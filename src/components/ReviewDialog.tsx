import { Dialog, Modal, Button, Rating } from 'bumbag';
import React, { useState, useEffect } from 'react';
import { InputField, Textarea, TextareaField } from 'bumbag';
import { Formik, Form, Field } from 'formik';
import graphQLClient from '../utilities/client';
import { gql } from 'graphql-request';
import type {IReview} from "../models/review"
interface ReviewProps {
  userid: String;
  productid: String;
  reviews:IReview[]
  callback:Callback
}
interface Callback{
    (reviews:IReview[]):void
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
              var data=props.reviews
              data.push(response.createReview)
              props.callback(data)
              setSubmitting(false);
              
            }
            sendReview();
          }}
        >
          <Form>
            <Field name="text" label="review" component={Textarea.Formik} />
            <Rating onChange={(value) => setRating(value)} value={rating} />
            <Button palette="primary" type="submit">
              Submit{' '}
            </Button>
          </Form>
        </Formik>
      </Dialog.Modal>
      <Modal.Disclosure use={Button}>Review</Modal.Disclosure>
    </Modal.State>
  );
}

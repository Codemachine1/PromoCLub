import React, { useState, useEffect } from 'react';
import graphQLClient from '../utilities/client';
import { Link, Route } from 'wouter';
import { gql, request } from 'graphql-request';
import type { IProduct } from 'src/models/product';
import {
  Container,
  Spinner,
  Col,
  Row,
  Form,
  Pagination,
} from 'react-bootstrap';
import Avatar from 'react-avatar';
import ProductList from '../components/ProductList';
interface response {
  allProducts: allProducts;
}

interface allProducts {
  data: IProduct[];
  after: string;
  before: string;
}
export default function products() {
  var p: IProduct[] = [];
  var [products, setProducts] = useState(p);
  var [searchTerm, setSearchTerm] = useState('');
  var [afterCursor, setAfterCursor] = useState('');
  var [beforeCursor, setBeforeCursor] = useState('');
  var [cursor, setCursors] = useState('');
  var [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    async function getProducts() {
      var data: response = await graphQLClient.request(gql`
        query {
          allProducts(_size: 15) {
            data {
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
                }
              }
            }
            before
            after
          }
        }
      `);

      console.log(data);
      if (searchTerm.length > 0) {
        var products = data.allProducts.data.filter((product) => {
          var regex = `.${searchTerm}.`;
          return (
            regex.match(product.name) ||
            regex.match(product.elevator) ||
            regex.match(product.description)
          );
        });
      } else {
        products = data.allProducts.data;
      }
      console.log(products);
      setAfterCursor(data.allProducts.after);
      setBeforeCursor(data.allProducts.before);

      setProducts(products);
    }
    getProducts();
  }, [searchTerm]);
  const fetchPage = async (cursor: string) => {
    var data: response = await graphQLClient.request(
      gql`
        query AllProducts($cursor: string) {
          allProducts(_size: 15) {
            data {
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
                }
              }
            }
            before
            after
          }
        }
      `,
      {
        cursor: cursor,
      },
    );

    console.log(data);
    if (searchTerm.length > 0) {
      var products = data.allProducts.data.filter((product) => {
        var regex = `.${searchTerm}.`;
        return (
          regex.match(product.name) ||
          regex.match(product.elevator) ||
          regex.match(product.description)
        );
      });
    } else {
      products = data.allProducts.data;
    }
    console.log(products);
    setAfterCursor(data.allProducts.after);
    setBeforeCursor(data.allProducts.before);

    setProducts(products);
  };

  if (products == null) {
    return (
      <div style={{ padding: '50%' }}>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  } else if (products.length < 1) {
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
      </Container>
    );
  } else {
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
          <ProductList products={products} />
        </Row>
        <Row>
        <Pagination

          currentPage={currentPage}Pagin
          onChangePage={(page: number) => {
            if (page < currentPage) {
              fetchPage(beforeCursor);
            } else {
              fetchPage(afterCursor);
            }

            setCurrentPage(page);
          }}
          numberOfPages={10}
        />
        </Row>
      </Container>
    );
  }
}

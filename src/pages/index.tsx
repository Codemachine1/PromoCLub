import React, { useState, useEffect } from 'react';
import type product from '../models/product';
import type { IProduct } from '../models/product';
import { gql, request } from 'graphql-request';
import { Tabs, Spinner, Container } from 'bumbag';
import { Link, Route } from 'wouter';
import graphQLClient from '../utilities/client';
import Avatar from 'react-avatar';
import ProductList from '../components/ProductList';
import CenteredContent from '../components/CenteredContent';
interface index {
  hotProducts: IProduct[];
  newProducts: IProduct[];
}
interface response {
  allProducts: allProducts;
}

interface allProducts {
  data: IProduct[];
}
export default function index() {
  var [products, updateProducts] = useState({
    hotProducts: [],
    newProducts: [],
  });

  useEffect(() => {
    async function getProducts() {
      var data: response = await graphQLClient.request(
        gql`
          query {
            allProducts {
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
            }
          }
        `,
      );
      console.log(data);
      var AllProducts: IProduct[] = data.allProducts.data;
      var hotProducts = AllProducts.sort((a: IProduct, b: IProduct) => {
        return a.reviews.data.length - b.reviews.data.length;
      });
      var newProducts = AllProducts.sort((a: IProduct, b: IProduct) => {
        return a.reviews.data.length - b.reviews.data.length;
      });
      updateProducts({
        hotProducts: hotProducts,
        newProducts: newProducts,
      });
    }
    getProducts();
  }, []);
  if (products.hotProducts.length < 1 && products.newProducts.length < 1) {
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
        <Tabs selectedId="hot">
          <Tabs.List>
            <Tabs.Tab tabId="hot">hot</Tabs.Tab>
            <Tabs.Tab tabId="new">new</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel tabId="hot" title="hot">
            <ProductList products={products.hotProducts} />
          </Tabs.Panel>
          <Tabs.Panel tabId="new" title="new">
            <ProductList products={products.newProducts} />
          </Tabs.Panel>
        </Tabs>
      </Container>
    );
  }
}

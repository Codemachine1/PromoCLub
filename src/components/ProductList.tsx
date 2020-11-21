import Avatar from 'react-avatar';
import React, { useState, useEffect } from 'react';

import type { IProduct } from '../models/product';
import { Link } from 'wouter';
import { Card, Columns } from 'bumbag';
interface ProductListInput {
  products: IProduct[];
}

export default function ProductList(products: ProductListInput) {
  return (
    <ul className="list-unstyled">
      {products.products.map((product: IProduct) => {
        return (
          <Link href={`/product/${product._id}`}>
            <Card variant="shadowed">
  
              <Card.Header>
                <Card.Title>{product.name}</Card.Title>
              </Card.Header>
              <Columns>
                <Columns.Column><Avatar name="Foo Bar" /></Columns.Column>
                
                <Columns.Column><p>{product.elevator}</p></Columns.Column>
                
              </Columns>
            </Card>
          </Link>
        );
      })}
    </ul>
  );
}

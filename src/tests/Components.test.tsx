import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import type {IProduct} from "../models/product"
import ProductList from "../components/ProductList"
describe("product List",()=>{
    it("should display 0 elements when 0 products are passed as parameters",function(){
        var products:IProduct[]=[]
        const wrapper=shallow(<ProductList products={products}/>)
        expect(wrapper.find(ProductList)).to.have.lengthOf(0)
    })
})


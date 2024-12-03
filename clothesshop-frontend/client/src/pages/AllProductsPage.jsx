import React from 'react'
import ProductList from '../components/ProductList';
import SearchComponent from '../components/SearchComponent';
const AllProductsPage = () => {
  return (
    <div>
        <div style={{ marginTop: '30px' }}> 
        <SearchComponent />
      </div>
        <ProductList/>
    </div>
  )
}

export default AllProductsPage
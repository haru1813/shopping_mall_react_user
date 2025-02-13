import React, { useCallback } from 'react';
import {
  useNavigate,
} from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const move = useCallback((url) => {
    navigate(`${url}`);
  }, []);

  return <div className="container-fluid border-bottom border-1 border-secondary" style={{ height: '80px' }}>
  <div className="row h-100">
    <div className="col-2 d-flex justify-content-center align-items-center">
      <ul className="nav">
        <li className="nav-item">
          <a className="nav-link text-black" style={{cursor:'pointer'}} aria-current="page" href="/pages/login/login.php">LOGIN</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-black" style={{cursor:'pointer'}}>JOIN</a>
        </li>
      </ul>
    </div>
    <div className="col-8 d-flex justify-content-center align-items-center">
      <span className="display-5 text-primary fw-bold">
        <a className="text-decoration-none" style={{cursor:'pointer'}}onClick={() => {
          move("/")
        }}>HARU MARKET</a>
      </span>
    </div> 
    <div className="col-2 d-flex align-items-center">
      <div className="input-group m-3">
        <input type="text" className="form-control" placeholder="상품을 검색하세요." aria-label="Search" style={{ width: '80px' }} v-model="harumarket_product_name"/>
        <button className="btn btn-outline-secondary" type="button" id="haruMarket_productCategory_name_searchbtn">
          <i className="bi bi-search"></i>
        </button>
      </div>
    </div> 
  </div>
</div>;
}

/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useState } from 'react';
import {
  useNavigate,
} from "react-router-dom";
import { useSelector } from 'react-redux';
import type { AppState } from "../store/AppState";
import { useDispatch } from 'react-redux';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authorization = useSelector<AppState, String>((state) => state.dataStore.authorization);
  const [harumarket_product_name, setHarumarket_product_name] = useState('');

  const move = useCallback((url) => {
    navigate(`${url}`);
  }, [navigate]);

  useEffect(() => {
    console.log("현재 authorization:", authorization);
  }, [authorization]);

  const move2 = (path) => {
    navigate(path);
  };

  const handleProductNameChange = (event) => {
    setHarumarket_product_name(event.target.value);
  };

  const haruMarket_productCategory_name_search = () => {
    // 검색 로직 구현 (harumarket_product_name 사용)
    console.log("Search clicked", harumarket_product_name);
  };

  const logout = () => {
    dispatch({
        type: "setAuthorization",
        authorization: ''
    });
    navigate("/");
  };

  return (
    <div className="container-fluid border-bottom border-1 border-secondary" style={{ height: '80px' }}>
      {authorization === '' ? (
        <div className="row h-100">
          <div className="col-2 d-flex justify-content-center align-items-center">
            <ul className="nav">
              <li className="nav-item">
                <a className="nav-link text-black" style={{ cursor: 'pointer' }} aria-current="page" onClick={() => {
                  move("/login")
                }}>LOGIN</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-black" style={{ cursor: 'pointer' }} onClick={() => {
                move("/join1")
              }}>JOIN</a>
              </li>
            </ul>
          </div>
          <div className="col-8 d-flex justify-content-center align-items-center">
            <span className="display-5 text-primary fw-bold">
              <a className="text-decoration-none" style={{ cursor: 'pointer' }} onClick={() => {
                move("/")
              }}>HARU MARKET</a>
            </span>
          </div>
          <div className="col-2 d-flex align-items-center">
            <div className="input-group m-3">
              <input type="text" className="form-control" placeholder="상품을 검색하세요." aria-label="Search" style={{ width: '80px' }} v-model="harumarket_product_name" />
              <button className="btn btn-outline-secondary" type="button" id="haruMarket_productCategory_name_searchbtn">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="row h-100">
          <div className="col-2 d-flex justify-content-center align-items-center">
            <ul className="nav">
              <li className="nav-item">
                <a className="nav-link text-black" aria-current="page" style={{ cursor: 'pointer' }} onClick={logout}>
                  LOGOUT
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-black"
                  data-bs-toggle="dropdown" // Bootstrap dropdown
                  href="#"
                  style={{ cursor: 'pointer' }}
                  role="button"
                  aria-expanded="false"
                >
                  MY PAGE
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" style={{ cursor: 'pointer' }} onClick={() => move2('/change1')}>
                      회원 정보 수정
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" style={{ cursor: 'pointer' }} onClick={() => move2('/change2')}>
                      비밀번호 변경
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" style={{ cursor: 'pointer' }} onClick={() => move2('/basket')}>
                      장바구니
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" style={{ cursor: 'pointer' }} onClick={() => move2('/order')}>
                      주문 조회
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="col-8 d-flex justify-content-center align-items-center">
            <span className="display-5 text-primary fw-bold">
              <a className="text-decoration-none" style={{ cursor: 'pointer' }} onClick={() => move('/')}>
                HARU MARKET
              </a>
            </span>
          </div>
          <div className="col-2 d-flex align-items-center">
            <div className="input-group m-3">
              <input
                type="text"
                className="form-control"
                placeholder="상품을 검색하세요."
                aria-label="Search"
                style={{ width: 'auto' }} // width 수정
                value={harumarket_product_name} // 제어 컴포넌트
                onChange={handleProductNameChange} // input 변경 이벤트
                onKeyUp={(event) => { if (event.key === 'Enter') haruMarket_productCategory_name_search(); }} // Enter key event
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                id="haruMarket_productCategory_name_searchbtn"
                onClick={haruMarket_productCategory_name_search}
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

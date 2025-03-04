/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useState } from 'react';
import {
  useNavigate,
} from "react-router-dom";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { httpRequest } from '../tool.js';
import toastr from "toastr";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dataStores = useSelector((state) => state.dataStore);
  const authorization = useSelector((state) => state.dataStore.authorization);
  const [harumarket_product_name, setHarumarket_product_name] = useState('');

  const move = useCallback((url) => {
    navigate(`${url}`);
    //navigate(url, { replace: true, state: { t: Date.now() } });
  }, [navigate]);

  useEffect(() => {
    console.log("현재 authorization:", authorization);
  }, [authorization]);

  const move2 = async (url) => {
    let data = await httpRequest("POST", "http://localhost:8080/user/move2", null, dataStores.authorization);
    if (data.status != 200) {
      console.log("토큰 유효하지 않음");
      let data2 = await httpRequest("POST", "http://localhost:8080/common/token_refresh", null, dataStores.authorization);
      if (data2.status == 200) {
        console.log("토큰 재발급");
        dispatch({
            type: "setAuthorization",
            authorization: data2.data.token
        });
        data = await httpRequest("POST", "http://localhost:8080/user/move2", null, dataStores.authorization);
        navigate(`${url}`);
      }
      else {
        toastr.error("로그아웃 되었습니다.");
        dispatch({
            type: "setAuthorization",
            authorization: ""
        });
        navigate(`/`);
      }
    }
    else {
      console.log("토큰 유효");
      navigate(`${url}`);
    }
  };

  const handleProductNameChange = (event) => {
    setHarumarket_product_name(event.target.value);
  };

  const haruMarket_productCategory_name_search = () => {
    localStorage.setItem('harumarket_product_name', harumarket_product_name);
    navigate("/product_search");
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
                onKeyUp={(event) => { 
                  if (event.key==="Enter") {
                  haruMarket_productCategory_name_search();
                } }} // Enter key event
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

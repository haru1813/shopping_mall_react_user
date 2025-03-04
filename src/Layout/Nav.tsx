import React, { useCallback, useEffect, useState } from 'react';
import { ajax_send } from '../tool.js';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import type { AppState } from "../store/AppState";
import {
  useNavigate,
} from "react-router-dom";

export default function Nav() {
  const [categorys, setCategorys] = useState<any[]>([]);
  const haruMarket_productCategory_index = useSelector<AppState, Number>((state) => state.dataStore.haruMarket_productCategory_index);
  const navigate = useNavigate();

  const harumarket_productcategory = useCallback(() => {
    var formData = new FormData();
    const response = ajax_send(formData, "http://localhost:8080/common/category", "GET");
    setCategorys([...(response || [])]);
  }, []);

  useEffect(() => {
    harumarket_productcategory(); // useEffect 실행 시 호출됨
  }, []);

  const dispatch = useDispatch();

  const moveNav = useCallback((_haruMarket_productCategory_index) => {
    dispatch({
        type: "setCategory",
        haruMarket_productCategory_index: _haruMarket_productCategory_index
        // ,
        // harumarket_product_index: 0, // 필요한 다른 값들도 함께 전달해야 함
        // harumarket_product_name: "",
    });

    navigate("/product_list");
  }, []);

  useEffect(() => {
      //console.log("현재 haruMarket_productCategory_index:", haruMarket_productCategory_index);
  }, [haruMarket_productCategory_index]);

  return (
    <ul className="nav border-bottom border-1 border-secondary justify-content-center" id="harumarket_productcategory">
      <li className="nav-item" style={{cursor:'pointer'}}>
        <a className="nav-link text-black" aria-current="page" role="button"
        onClick={() => {
          moveNav(0)
        }}
        >전체상품</a>
      </li>
      {categorys.map(category => (
        <li className="nav-item" key={category.haruMarket_productCategory_index} style={{cursor:'pointer'}}>
          <a className="nav-link text-black" aria-current="page"
          onClick={() => {
            moveNav(category.haruMarket_productCategory_index)
          }}
          >
            {category.haruMarket_productCategory_name}
          </a>
        </li>
      ))}
    </ul>
  );
}

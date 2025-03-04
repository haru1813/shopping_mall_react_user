import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ajax_send, sendData, httpRequest } from '../../tool.js'
import "tui-grid/dist/tui-grid.css";
import Grid from "tui-grid";
import toastr from "toastr";
import { useDispatch } from 'react-redux';
import {
  useNavigate,
} from "react-router-dom";

function App() {
  const authorization = useSelector((state) => state.dataStore.authorization);
  const harumarket_product_index = useSelector((state) => state.dataStore.harumarket_product_index);
  let gridInstance = null;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [harumarket_product_colorView, setHarumarket_product_colorView] = useState(0);
  const [harumarket_product_sizeView, setHarumarket_product_sizeView] = useState(0);
  const [harumarket_product_name, setHarumarket_product_name] = useState("");
  const [harumarket_product_salePrice, setHarumarket_product_salePrice] = useState(0);

  useEffect(() => {
    if (gridInstance != null) return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    gridInstance = new Grid({
      el: gridRef.current,
      data: null,
      scrollX: false,
      scrollY: true,
      bodyHeight: 350,
      rowHeaders: ['checkbox'],
      columns: [
        {
          header: '상품 이름',
          name: 'harumarket_product_name',
          align: 'center',
        },
        {
          header: '상품 색상',
          name: 'harumarket_productColor_name',
          align: 'center',
        },
        {
          header: '상품 크기',
          name: 'harumarket_productSize_name',
          align: 'center',
        },
        {
          header: '상품 개수',
          name: 'harumarket_product_account',
          align: 'center'
        },
        {
          header: '삭제',
          name: 'delete',
          align: 'center',
          formatter: function (value) {
            console.log(value);
            console.log(value.row.rowKey);

            return `<button type="button" class="btn btn-danger btn-sm delete-btn" data-row-key="${value.row.rowKey}">삭제</button>`;
          }
        },
        {
          header: '상품 가격',
          name: 'harumarket_product_salePrice',
          align: 'center',
        },
      ]
    })

    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('delete-btn')) {
        const rowKey = event.target.dataset.rowKey;
        const gridInstances = gridRef.current.getInstance();
        gridInstances.removeRow(rowKey);
        total();
      }
    })

    gridRef.current.getInstance = () => gridInstance;

    return async () => {
      let res = ajax_send(null, `http://localhost:8080/common/product_view/${harumarket_product_index}`, "GET");

      setProductPicture(picture(res.harumarket_product_picture));
      setProductName(res.harumarket_product_name);
      setOriginPrice(res.harumarket_product_originPrice);
      setSalePrice(res.harumarket_product_salePrice);
      setProductContent(res.harumarket_product_content);
      setHarumarket_product_colorView(res.harumarket_product_colorView);
      setHarumarket_product_sizeView(res.harumarket_product_sizeView);
      setHarumarket_product_name(res.harumarket_product_name);
      setHarumarket_product_salePrice(res.harumarket_product_salePrice);
      if (res.harumarket_product_colorView === 1) {
        res = await harumarket_product_colorsf(res.harumarket_product_colorIndexs);
        setProductColors(res);
      }
      if (res.harumarket_product_sizeView === 1) {
        res = await harumarket_product_sizesf(res.harumarket_product_sizeIndexs);
        setSelectedColor(res);
      }
      console.log(harumarket_product_colorView);
      console.log(harumarket_product_sizeView);

      gridInstance.resetData([]);

      if (!gridRef.current) {
        gridInstance.destroy();
      }
    }
  }, [harumarket_product_index]);

  const picture = (harumarket_product_picture) => {
    const regex = /<img[^>]*src="([^"]*)"/g;
    const match = regex.exec(harumarket_product_picture);
    const srcValue = match[1];
    return srcValue;
  }

  const harumarket_product_colorsf = async function (harumarket_product_colorIndexs) {
    let fdata = {
      harumarket_product_optionIndexs: harumarket_product_colorIndexs.replace(/\{/g, "(").replace(/\}/g, ")"),
      table_name: "harumarket_productcolor",
      option_name: "harumarket_productColor_index",
    }

    let respondata = await optionSelect("http://localhost:8080/common/option_select", fdata, "POST");
    return respondata.data;
  }

  const harumarket_product_sizesf = async function (harumarket_product_sizeIndexs) {
    let fdata = {
      harumarket_product_optionIndexs: harumarket_product_sizeIndexs.replace(/\{/g, "(").replace(/\}/g, ")"),
      table_name: "harumarket_productcolor",
      option_name: "harumarket_productColor_index",
    }

    let respondata = await optionSelect("http://localhost:8080/common/option_select", fdata, "POST");
    return respondata.data;
  }

  const optionSelect = async function (url, body, method) {
    return await sendData(url, body, method);
  }

  const [productPicture, setProductPicture] = useState('');
  const [productName, setProductName] = useState('');
  const [originPrice, setOriginPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [productColors, setProductColors] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [productContent, setProductContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [totalQuantity, setTotalQuantity] = useState("0원 (0개)");
  const gridRef = useRef(null);
  const [optionName1, setOptionName1] = useState('');
  const [optionName2, setOptionName2] = useState('');

  const option_select = (e) => {
    if (e.target.name === "color") {
      setSelectedColor(e.target.value);
      const selectedOption = e.target.options[e.target.selectedIndex];
      setOptionName1(selectedOption.text);
    }
    else {
      setSelectedSize(e.target.value);
      const selectedOption = e.target.options[e.target.selectedIndex];
      setOptionName2(selectedOption.text);
    }
  };

  useEffect(() => {
    option_selectF();
  }, [selectedColor, selectedSize, optionName1, optionName2]);

  const option_selectF = () => {
    console.log(optionName1);
    console.log(optionName2);

    let newRowData = {
      harumarket_product_index: harumarket_product_index,
      harumarket_product_name: harumarket_product_name,
      harumarket_product_account: '1',
      delete: '삭제',
      harumarket_product_salePrice: harumarket_product_salePrice
    }

    if (harumarket_product_colorView === 1 && harumarket_product_sizeView === 1) {
      newRowData.harumarket_productColor_name = optionName1;
      newRowData.harumarket_productColor_index = selectedColor;
      newRowData.harumarket_productSize_name = optionName2;
      newRowData.harumarket_productSize_index = selectedSize;
    }
    if (harumarket_product_colorView === 1 && harumarket_product_sizeView === 0) {
      newRowData.harumarket_productColor_name = optionName1;
      newRowData.harumarket_productColor_index = selectedColor;
    }
    if (harumarket_product_colorView === 1 && harumarket_product_sizeView === 0) {
      newRowData.harumarket_productSize_name = optionName2;
      newRowData.harumarket_productSize_index = selectedSize;
    }

    console.log(newRowData);

    const gridInstances = gridRef.current.getInstance();
    const allData = gridInstances.getData();

    let dataadd = true;

    allData.forEach(function (data, index) {
      if (harumarket_product_colorView === 1 && harumarket_product_sizeView === 1) {
        if ((newRowData.harumarket_productColor_index === data.harumarket_productColor_index) &&
          (newRowData.harumarket_productSize_index === data.harumarket_productSize_index)) {
          toastr.error("이미 해당 옵션으로 선택되어 있습니다.");
          dataadd = false;
        }
      }
      if (harumarket_product_colorView === 1 && harumarket_product_sizeView === 0) {
        if ((newRowData.harumarket_productColor_index === data.harumarket_productColor_index)) {
          toastr.error("이미 해당 옵션으로 선택되어 있습니다.");
          dataadd = false;
        }
      }
      if (harumarket_product_colorView === 0 && harumarket_product_sizeView === 1) {
        if ((newRowData.harumarket_productSize_index === data.harumarket_productSize_index)) {
          toastr.error("이미 해당 옵션으로 선택되어 있습니다.");
          dataadd = false;
        }
      }
    })
    if (dataadd) {
      gridInstances.appendRow(newRowData);
    }

    setTimeout(() => {
      total();
    }, 100);
  }

  const total = function () {
    const gridInstances = gridRef.current.getInstance();
    const allData = gridInstances.getData();
    if (allData.length === 0) {
      setTotalQuantity("0원 (0개)");
    }
    else {
      let total_count = 0;
      let total_price = 0;

      allData.forEach(function (data, index) {
        let harumarket_product_account = Number(data.harumarket_product_account);
        total_count += harumarket_product_account;
        let harumarket_product_salePrice = Number(data.harumarket_product_salePrice.replace(/,/g, '').replace(/원/g, ''));
        total_price += harumarket_product_salePrice;
      });

      setTotalQuantity(`${total_price.toLocaleString('ko-KR')}원 (${total_count}개)`);
    }
  }

  const buyF = () => {
    if (authorization === "") {
      toastr.error("로그인 후에 해당 기능을 이용하여 주십시오.");
      return;
    }

    const gridInstance = gridRef.current.getInstance();

    let allData = gridInstance.getData();

    if (allData.length == 0) {
      toastr.error("상품 옵션을 선택하여 주십시오.");
    }
    else {
      const harumarket_userBuy = [];

      allData.forEach(function (data, index) {
        const harumarket_userBuyItem = {};
        harumarket_userBuyItem["harumarket_product_index"] = Number(data.harumarket_product_index);
        harumarket_userBuyItem["harumarket_productColor_index"] = data.harumarket_productColor_index !== "" ? Number(data.harumarket_productColor_index) : 0;
        harumarket_userBuyItem["harumarket_productSize_index"] = data.harumarket_productSize_index !== "" ? Number(data.harumarket_productSize_index) : 0;
        harumarket_userBuyItem["harumarket_product_count"] = Number(data.harumarket_product_account);
        harumarket_userBuy.push(harumarket_userBuyItem);
      });

      dispatch({
          type: "setBuy",
          harumarket_userBasket_indexs: [],
          harumarket_userBuy: harumarket_userBuy,
          haruMarket_buy_ready: true
      });

      navigate(`/buy`);
    }
  };

  const basket = async () => {
    if (authorization === "") {
      toastr.error("로그인 후에 해당 기능을 이용하여 주십시오.");
      return;
    }

    const gridInstance = gridRef.current.getInstance();

    let allData = gridInstance.getData();

    if (allData.length === 0) {
      toastr.error("상품 옵션을 선택하여 주십시오.");
    }
    else {
      let harumarket_userBusket_Inserts = [];

      allData.forEach(function (data, index) {
        let harumarket_userBusket_Insert = {
          harumarket_product_index: harumarket_product_index,
          harumarket_productColor_index: data.harumarket_productColor_index !== "" ? data.harumarket_productColor_index : 0,
          harumarket_productSize_index: data.harumarket_productSize_index !== "" ? data.harumarket_productSize_index : 0,
          harumarket_userBasket_account: data.harumarket_product_account
        }
        harumarket_userBusket_Inserts.push(harumarket_userBusket_Insert);
      });

      let data = await httpRequest("POST", "http://localhost:8080/user/busket_insert", harumarket_userBusket_Inserts, authorization);
      console.log(data.status);
      if (data.status === 500) {
        toastr.error("장바구니는 10개까지만 등록 가능합니다.");
      }
      if (data.status !== 200) {
        let data2 = await httpRequest("POST", "http://localhost:8080/common/token_refresh", null, authorization);
        if (data2.status === 200) {
          dispatch({
            type: "setAuthorization",
            authorization: data2.data.token
          });
          data = await httpRequest("POST", "http://localhost:8080/user/busket_insert", harumarket_userBusket_Inserts, authorization);
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
      if (data.status === 200) {
        toastr.success("장바구니를 등록하였습니다.");
      }
    }
  };

  const impl_up = () => {
    //setTotalQuantity(totalQuantity + 1);
    const gridInstance = gridRef.current.getInstance();
    const checkedRowKeys = gridInstance.getCheckedRowKeys();
    if (checkedRowKeys.length === 0) {
      toastr.error('개수를 증가할 상품을 선택하여 주십시오.');
      return;
    }

    checkedRowKeys.forEach(rowKey => {
      const row = gridInstance.getRow(rowKey);
      let harumarket_product_account = Number(row.harumarket_product_account);

      if (harumarket_product_account >= 1) {
        harumarket_product_account += 1;
        gridInstance.setValue(rowKey, 'harumarket_product_account', harumarket_product_account);

        let price = Number(harumarket_product_salePrice.replace(/,/g, '').replace(/원/g, '')) * harumarket_product_account;
        const currency = '원';
        const formattedPrice = price.toLocaleString('ko-KR') + currency;
        gridInstance.setValue(rowKey, 'harumarket_product_salePrice', formattedPrice);
      }
    });

    total();
  };

  const impl_down = () => {
    //setTotalQuantity(Math.max(0, totalQuantity - 1));
    const gridInstance = gridRef.current.getInstance();
    const checkedRowKeys = gridInstance.getCheckedRowKeys();
    if (checkedRowKeys.length === 0) {
      toastr.error('개수를 감소할 상품을 선택하여 주십시오.');
      return;
    }

    checkedRowKeys.forEach(rowKey => {
      const row = gridInstance.getRow(rowKey);
      let harumarket_product_account = Number(row.harumarket_product_account);

      if (harumarket_product_account > 1) {
        harumarket_product_account -= 1;
        gridInstance.setValue(rowKey, 'harumarket_product_account', harumarket_product_account);

        let price = Number(harumarket_product_salePrice.replace(/,/g, '').replace(/원/g, '')) * harumarket_product_account;
        const currency = '원';
        const formattedPrice = price.toLocaleString('ko-KR') + currency;
        gridInstance.setValue(rowKey, 'harumarket_product_salePrice', formattedPrice);
      }
    });

    total();
  };

  const impl_alldelete = () => {
    //setTotalQuantity(0);
    const gridInstance = gridRef.current.getInstance();
    gridInstance.clear();
    toastr.error('선택한 상품을 전체 삭제하였습니다.');
    total();
  };

  return (
    <div className="container-fluid ps-4 pt-5 pb-5" style={{ paddingRight: '2.6rem' }}>
      <div className="row">
        <div className="col-12 d-flex justify-content-center align-items-center">
          <div className="card w-100">
            <div className="row">
              <div className="col-4 p-0" id="harumarket_product_picture">
                <img src={productPicture} className="img-fluid rounded-start" alt="Product" />
              </div>
              <div className="col-8 p-0 pt-2 ps-2 pe-3">
                <div className="card-body p-0 h-100">
                  <p className="card-title fs-3">{productName}</p>
                  <span
                    className="badge rounded-pill text-bg-secondary"
                    style={{ textDecoration: 'line-through' }}
                    id="harumarket_product_originPrice"
                  >
                    {originPrice}
                  </span>
                  <span className="badge rounded-pill text-bg-primary" id="harumarket_product_salePrice">
                    {salePrice}
                  </span>
                  <br />
                  <span className="badge rounded-pill text-bg-success">무료배송</span>

                  <p className="card-body mb-0" id="harumarket_options">
                    {productColors.length > 0 && (
                      <select
                        className="form-select mt-2"
                        aria-label="Default select example"
                        value={selectedColor}
                        onChange={option_select}
                        name="color"
                      >
                        <option value="" disabled>
                          [필수] 색상 옵션을 선택해주세요.
                        </option>
                        {productColors.map((color, index) => (
                          <option key={index} value={color.harumarket_productColor_index}>
                            {color.harumarket_productColor_name}
                          </option>
                        ))}
                      </select>
                    )}

                    {productSizes.length > 0 && (
                      <select
                        className="form-select mt-2"
                        aria-label="Default select example"
                        value={selectedSize}
                        onChange={option_select}
                        name="size"
                      >
                        <option value="" disabled>
                          [필수] 크기 옵션을 선택해주세요.
                        </option>
                        {productSizes.map((size, index) => (
                          <option key={index} value={size.harumarket_productSize_index}>
                            {size.harumarket_productSize_name}
                          </option>
                        ))}
                      </select>
                    )}
                  </p>

                  <div className="d-grid gap-2 d-md-block mt-2">
                    <button className="btn btn-success btn-sm me-1" type="button" onClick={buyF}>
                      구매하기
                    </button>
                    <button className="btn btn-primary btn-sm" type="button" onClick={basket}>
                      장바구니 담기
                    </button>
                  </div>

                  <span className="badge bg-info text-dark fs-6 mt-2 me-1">TOTAL(수량)</span>
                  <span className="badge bg-info text-dark fs-6">{totalQuantity}</span>
                  <div className="d-grid gap-2 d-md-block mt-2">
                    <button className="btn btn-secondary btn-sm me-1" type="button" onClick={impl_up}>
                      상품 개수 증가
                    </button>
                    <button className="btn btn-secondary btn-sm me-1" type="button" onClick={impl_down}>
                      상품 개수 감소
                    </button>
                    <button className="btn btn-secondary btn-sm" type="button" onClick={impl_alldelete}>
                      상품 전체 삭제
                    </button>
                  </div>
                  <div className="mt-2" ref={gridRef}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 pt-2 text-center" dangerouslySetInnerHTML={{ __html: productContent }}></div>
      </div>
    </div>
  );
}

export default App;

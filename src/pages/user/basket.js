import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    useNavigate,
} from "react-router-dom";
import { httpRequest } from "../../tool";
import { useDispatch } from 'react-redux';
import toastr from "toastr";
import "tui-grid/dist/tui-grid.css";
import Grid from "tui-grid";

function App() {
    const dataStores = useSelector((state) => state.dataStore);
    const authorization = useSelector((state) => state.dataStore.authorization);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [totaln, setTotaln] = useState("0원 (0개)");

    const gridRef = useRef(null);
    //const containerRef = useRef(null);

    const basket_select = async function () {
        let responData = await httpRequest("POST", "http://localhost:8080/user/basket_select", null, dataStores.authorization);
        if (responData.status !== 200) {
            responData = await httpRequest("POST", "http://localhost:8080/common/token_refresh", null, dataStores.authorization);
            if (responData.status === 200) {
                dispatch({
                    type: "setAuthorization",
                    authorization: responData.data.token
                });
                responData = await httpRequest("POST", "http://localhost:8080/user/basket_select", null, dataStores.authorization);
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
        return responData;
    }

    let gridInstance = null;

    useEffect(() => {
        if (authorization === "") {
            navigate("/");
        }

        if (gridInstance != null) return;

        // eslint-disable-next-line react-hooks/exhaustive-deps
        gridInstance = new Grid({
            el: gridRef.current,
            data: null,
            scrollX: false,
            scrollY: true,
            bodyHeight: 560,
            rowHeaders: ['checkbox'],
            rowHeight: 140,
            columns: [
                {
                    header: '이미지',
                    name: 'harumarket_product_picture',
                    align: 'center',
                    width: 120,
                    formatter: function (val) {
                        const regex = /<img[^>]*src="([^"]*)"/g; // 정규 표현식
                        const match = regex.exec(val.value);
                        const srcValue = match[1];

                        return `<img src="${srcValue}" width="100" style="cursor:pointer" class="img-thumbnail img-link" data-row-key="${val.row.rowKey}"></img>`;
                    }
                },
                {
                    header: '상품 이름',
                    name: 'harumarket_product_name',
                    align: 'center',
                    formatter: function (val) {
                        return `<span style="cursor:pointer" class="span-link" data-row-key="${val.row.rowKey}">${val.value}</span>`;
                    }
                },
                {
                    header: '상품 색상',
                    name: 'harumarket_productColor_name',
                    align: 'center',
                    width: 100,
                },
                {
                    header: '상품 크기',
                    name: 'harumarket_productSize_name',
                    align: 'center',
                    width: 100,
                },
                {
                    header: '상품 개수',
                    name: 'harumarket_userBasket_account',
                    align: 'center',
                    width: 100,
                },
                {
                    header: '상품 가격',
                    name: 'harumarket_product_salePrice',
                    align: 'center',
                    width: 100,
                    formatter: function (val) {
                        return `<span>${val.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</span>`;
                    }
                }
            ]
        })
        gridRef.current.getInstance = () => gridInstance;

        return async () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            if (gridRef.current) {
                let responData = await basket_select();
                gridInstance.resetData(responData.data);
                total();
            }
            else {
                gridInstance.destroy();
            }
        }
    }, []);

    // document.addEventListener('click', (event) => {
    //     if (event.target.classList.contains('img-link') || event.target.classList.contains('span-link')) {
    //         const rowKey = event.target.dataset.rowKey;
    //         console.log(gridRef.current);
    //     }
    // });

    const total = function () {
        const gridInstance = gridRef.current.getInstance();
        let allData = gridInstance.getData();
        if (allData.length === 0) {
            setTotaln("0원 (0개)");
        }
        else {
            let total_count = 0;
            let total_price = 0;

            allData.forEach(function (data, index) {
                let harumarket_product_account = data.harumarket_userBasket_account;
                total_count += harumarket_product_account;
                let harumarket_product_salePrice = data.harumarket_product_salePrice;
                total_price += harumarket_product_salePrice;
            });

            setTotaln(`${total_price.toLocaleString('ko-KR')}원 (${total_count}개)`);
        }
    }

    const deleteF = async () => {
        const gridInstance = gridRef.current.getInstance();
        const checkedRowKeys = gridInstance.getCheckedRowKeys();
        console.log(gridInstance);
        console.log(checkedRowKeys);

        if (checkedRowKeys.length === 0) {
            toastr.error('삭제할 상품을 선택하여 주십시오.');
            return;
        }

        let reqData = [];

        checkedRowKeys.forEach(rowKey => {
            const gridInstance = gridRef.current.getInstance();
            const row = gridInstance.getRow(rowKey);

            let req = {
                harumarket_userBasket_index: row.harumarket_userBasket_index
            }

            reqData.push(req);
        });

        let responData = await httpRequest("POST", "http://localhost:8080/user/basket_delete", reqData, dataStores.authorization);
        if (responData.status !== 200) {
            responData = await httpRequest("POST", "http://localhost:8080/common/token_refresh", reqData, dataStores.authorization);
            if (responData.status === 200) {
                dispatch({
                    type: "setAuthorization",
                    authorization: responData.data.token
                });
                responData = await httpRequest("POST", "http://localhost:8080/user/basket_delete", reqData, dataStores.authorization);
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
        let data = responData.data;
        toastr.success(data.msg);

        responData = await basket_select();
        gridInstance.resetData(responData.data);
        total();
    };

    const order = () => {
        const gridInstance = gridRef.current.getInstance();
        const checkedRowKeys = gridInstance.getCheckedRowKeys();

        if (checkedRowKeys.length === 0) {
            toastr.error('주문할 상품을 선택하여 주십시오.');
            return;
        }

        const harumarket_userBasket_indexs = [];
        const harumarket_userBuy = [];

        checkedRowKeys.forEach(rowKey => {
            const gridInstance = gridRef.current.getInstance();
            const row = gridInstance.getRow(rowKey);

            const harumarket_userBasket_index = {
                "harumarket_userBasket_index": row.harumarket_userBasket_index
            };

            harumarket_userBasket_indexs.push(harumarket_userBasket_index);

            const harumarket_userBuyItem = {};
            harumarket_userBuyItem["harumarket_product_index"] = Number(row.harumarket_product_index);
            harumarket_userBuyItem["harumarket_productColor_index"] = Number(row.harumarket_productColor_index);
            harumarket_userBuyItem["harumarket_productSize_index"] = Number(row.harumarket_productSize_index);
            harumarket_userBuyItem["harumarket_product_count"] = Number(row.harumarket_userBasket_account);

            harumarket_userBuy.push(harumarket_userBuyItem);
        })

        dispatch({
            type: "setBuy",
            harumarket_userBasket_indexs: harumarket_userBasket_indexs,
            harumarket_userBuy: harumarket_userBuy,
            haruMarket_buy_ready: true
        });

        navigate(`/buy`);
    };

    const rowClick = (event) => {
        if (event.target.classList.contains('img-link') || event.target.classList.contains('span-link')){
            const rowKey = event.target.dataset.rowKey;

            const gridInstance = gridRef.current.getInstance();
            const row = gridInstance.getRow(rowKey);
            dispatch({
                type: "setProduct",
                harumarket_product_index: row.harumarket_product_index
            })
            navigate(`/product_detail`);
        }
    }

    return (
        <div className="container-fluid ps-4 pt-5 pb-5" style={{ paddingRight: '2.6rem !important' }}>
            <div className="row">
                <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: '80px' }}>
                    <span className="display-5 text-dark fw-bold">장바구니</span>
                </div>
                <div className="col-12" style={{ height: '700px' }}>
                    <div className="card h-100 w-100">
                        <div className="card-body d-flex justify-content-center align-items-center m-0 p-0">
                            <div ref={gridRef} className="h-100 w-100" onClick={rowClick}></div>
                        </div>
                        <div className="m-0 p-1">
                            <span className="badge bg-info text-dark fs-6 me-1">TOTAL(수량)</span>
                            <span className="badge bg-info text-dark fs-6" id="total">
                                {totaln}
                            </span>
                        </div>
                        <div className="card-footer">
                            <button type="button" className="btn btn-danger me-1" onClick={deleteF}>
                                삭제
                            </button>
                            <button type="button" className="btn btn-primary" onClick={order}>
                                주문
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;
import React, { useState, useLayoutEffect, useRef } from 'react';
import {
    useNavigate,
} from "react-router-dom";
import toastr from "toastr";
import { httpRequest } from "../../tool";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const PaymentComplete = () => {
    const authorization = useSelector((state) => state.dataStore.authorization);
    const buy = useSelector((state) => state.buy);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        if (authorization === "") {
            navigate("/");
        }
        if (!buy.haruMarket_buy_ready) {
            navigate("/");
        }

        return async () => {
            let product_informations = await product_information_view();
            if (product_informations.length > 0) {
                setProductInformations(product_informations);

                let harumarket_product_totalPriceValue = 0;

                product_informations.forEach((product) => {
                    harumarket_product_totalPriceValue += Number(product.harumarket_product_salePrice);
                });

                setHarumarketProductTotalPrice(`최종 결제 금액 : ${harumarket_product_totalPriceValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`);
            }

            dispatch({
                type: "setBuy",
                harumarket_userBasket_indexs: buy.harumarket_userBasket_indexs,
                harumarket_userBuy: buy.harumarket_userBuy,
                haruMarket_buy_ready: false
            });
        }
    },[]);

    const product_information_view = async function () {
        let responData = await httpRequest("POST", "http://localhost:8080/user/product_information_view", buy.harumarket_userBuy, authorization);
        if (responData.status !== 200) {
            responData = await httpRequest("POST", "http://localhost:8080/common/token_refresh", null, authorization);
            if (responData.status === 200) {
                dispatch({
                    type: "setAuthorization",
                    authorization: responData.data.token
                });
                responData = await httpRequest("POST", "http://localhost:8080/user/product_information_view", buy.harumarket_userBuy, authorization);
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
        return responData.data;
    }

    const [productInformations, setProductInformations] = useState([]); // 빈 배열로 초기화
    const [harumarketProductTotalPrice, setHarumarketProductTotalPrice] = useState(0); // 0으로 초기화

    const srcExport = (harumarket_product_picture) => {
        const regex = /<img[^>]*src="([^"]*)"/g;
        const match = regex.exec(harumarket_product_picture);
        const srcValue = match[1];
        return srcValue;
    };

    const productDetail = (harumarket_product_index) => {
        dispatch({
            type: "setBuy",
            harumarket_userBasket_indexs: [],
            harumarket_userBuy: [],
            haruMarket_buy_ready: false
        });
        dispatch({
            type: "setProduct",
            harumarket_product_index: harumarket_product_index
        })
        navigate(`/product_detail`);
    };

    const move = (path) => {
        dispatch({
            type: "setBuy",
            harumarket_userBasket_indexs: [],
            harumarket_userBuy: [],
            haruMarket_buy_ready: false
        });
        navigate(`${path}`);
    };

    return (
        <div className="container-fluid ps-4 pt-5 pb-5" style={{ paddingRight: '2.6rem' }}>
            <div className="row">
                <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: '80px' }}>
                    <span className="display-5 text-dark fw-bold">결제 완료</span>
                </div>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">주문 상품</h5>
                            <div className="container-fluid" id="order_products">
                                {productInformations.map((product_information, index) => (
                                    <div className="row border border-dark rounded mb-2" key={index}>
                                        <div className="col-2 d-flex justify-content-center align-items-center">
                                            <img
                                                src={srcExport(product_information.harumarket_product_picture)}
                                                style={{ cursor: 'pointer' }}
                                                width="100"
                                                className="img-thumbnail img-link"
                                                onClick={() => productDetail(product_information.harumarket_product_index)}
                                                alt="Product"
                                            />
                                        </div>
                                        <div className="col-10">
                                            <p className="text-dark" style={{ cursor: 'pointer' }} onClick={() => productDetail(product_information.harumarket_product_index)}>
                                                {product_information.harumarket_product_name}
                                            </p>
                                            <p className="text-secondary mb-0">
                                                [옵션: {product_information.harumarket_productColor_name === null ? '' : product_information.harumarket_productColor_name}{' '}
                                                {product_information.haruMarket_productCategory_name === null ? '' : product_information.haruMarket_productCategory_name}]
                                            </p>
                                            <p className="text-secondary">수량: {product_information.harumarket_product_count}개</p>
                                            <p className="text-dark mb-0">
                                                {product_information.harumarket_product_salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="card-footer" id="harumarket_product_totalPrice">
                            {harumarketProductTotalPrice}
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <button type="button" className="btn btn-primary" onClick={() => move('/order')}>
                                주문 조회로 이동
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentComplete;
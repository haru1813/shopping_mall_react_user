import React, { useState, useLayoutEffect, useRef } from 'react';
import {
    useNavigate,
} from "react-router-dom";
import toastr from "toastr";
import { httpRequest } from "../../tool";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

function Buy() {
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
            let res = await product_information_view();
            setProduct_informations(res);

            let inform = await information_find();
            setHaruMarketUserName(inform.haruMarket_user_name);
            setHaruMarketPostCode(inform.haruMarket_user_postCode);
            setHaruMarketBasicAddress(inform.haruMarket_user_basicAddress);
            setHaruMarketDetailAddress(inform.haruMarket_user_detailAddress);
        }
    }, []);

    const [haruMarket_user_name, setHaruMarketUserName] = useState("");
    const [haruMarket_user_postCode, setHaruMarketPostCode] = useState("");
    const [haruMarket_user_basicAddress, setHaruMarketBasicAddress] = useState("");
    const [haruMarket_user_detailAddress, setHaruMarketDetailAddress] = useState("");
    const [informationRadio, setInformationRadio] = useState(1);
    const [product_informations, setProduct_informations] = useState([]);
    const [harumarket_product_totalPrice, setHarumarket_product_totalPrice] = useState("")

    const information_setting = async (event) => {
        setInformationRadio(Number(event.target.value));

        if (Number(event.target.value) === 0) {
            setHaruMarketUserName("");
            setHaruMarketPostCode("");
            setHaruMarketBasicAddress("");
            setHaruMarketDetailAddress("");
        }
        else {
            let inform = await information_find();
            setHaruMarketUserName(inform.haruMarket_user_name);
            setHaruMarketPostCode(inform.haruMarket_user_postCode);
            setHaruMarketBasicAddress(inform.haruMarket_user_basicAddress);
            setHaruMarketDetailAddress(inform.haruMarket_user_detailAddress);
        }
    };

    const addressFind = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                var roadAddr = data.roadAddress; // 도로명 주소 변수
                var jibunAddress = data.jibunAddress; // 지번 주소 변수
                var extraRoadAddr = ''; // 참고 항목 변수

                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraRoadAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if (extraRoadAddr !== '') {
                    extraRoadAddr = ' (' + extraRoadAddr + ')';
                }

                //haruMarket_user_postCode.current.value = data.zonecode;
                //haruMarket_user_basicAddress.current.value = jibunAddress;

                setHaruMarketBasicAddress(data.zonecode);
                setHaruMarketDetailAddress(jibunAddress);
            }
        }).open();
    };

    const purchase = async (pay_method_value) => {
        if (haruMarket_user_name === "") {
            toastr.error('받는 사람 이름이 입력되지 않았습니다.');
            return;
        }
        if (haruMarket_user_name.length > 20) {
            toastr.error('이름은 20자를 넘지 않도록 입력하여 주십시오.');
            return;
        }
        if (haruMarket_user_postCode === "" || haruMarket_user_basicAddress === "") {
            toastr.error('우편번호 버튼을 클릭하여 주소를 검색하여 주십시오.');
            return;
        }
        if (haruMarket_user_detailAddress === "") {
            toastr.error('상세 주소가 입력되지 않았습니다.');
            return;
        }
        if (haruMarket_user_detailAddress.length > 30) {
            toastr.error('상세 주소는 30자를 넘지 않도록 입력하여 주십시오.');
            return;
        }

        let responData = await httpRequest("POST", "http://localhost:8080/user/product_buy_try", buy.harumarket_userBuy, authorization);
        if (responData.status !== 200) {
            responData = await httpRequest("POST", "http://localhost:8080/common/token_refresh", null, authorization);
            if (responData.status === 200) {
                dispatch({
                    type: "setAuthorization",
                    authorization: responData.data.token
                });
                responData = await httpRequest("POST", "http://localhost:8080/user/product_buy_try", buy.harumarket_userBuy, authorization);
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
            const { IMP } = window;
            IMP.init("imp43126142");
            IMP.request_pay(
                {
                    pg: "html5_inicis", // PG사 코드표에서 선택
                    pay_method: pay_method_value, // 결제 방식
                    merchant_uid: `harumarket_${responData.data.haruMarket_user_phone}_${merchant_uid_output()}`, // 결제 고유 번호
                    name: `harumarket_${responData.data.haruMarket_user_phone}_${merchant_uid_output()}`, // 제품명
                    amount: responData.data.harumarket_product_salePrice, // 가격
                    //구매자 정보 ↓
                    buyer_email: "",
                    buyer_name: haruMarket_user_name,
                    buyer_tel: responData.data.haruMarket_user_phone,
                    buyer_addr: `${haruMarket_user_basicAddress} ${haruMarket_user_detailAddress}`,
                    buyer_postcode: responData.data.haruMarket_user_phone,
                },
                async function (rsp) {
                    if (rsp.success) {
                        let requestData = {
                            haruMarket_BuyMaster_order: rsp.merchant_uid,
                            haruMarket_BuyMaster_buyerName: rsp.buyer_name,
                            haruMarket_BuyMaster_buyerPostcode: rsp.buyer_postcode,
                            haruMarket_BuyMaster_buyerAddr: rsp.buyer_addr,
                            haruMarket_BuyMaster_buyerMethod: rsp.pay_method,
                            haruMarket_BuyMaster_amount: rsp.paid_amount
                        }

                        let responData = await httpRequest("POST", "http://localhost:8080/user/product_buy_master", requestData, authorization);
                        if (responData.status !== 200) {
                            responData = await httpRequest("POST", "http://localhost:8080/common/token_refresh", null, authorization);
                            if (responData.status === 200) {
                                dispatch({
                                    type: "setAuthorization",
                                    authorization: responData.data.token
                                });
                                responData = await httpRequest("POST", "http://localhost:8080/user/product_buy_master", requestData, authorization);
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

                        let tharumarket_userBuy = [...buy.harumarket_userBuy];

                        tharumarket_userBuy = tharumarket_userBuy.map(product_information => {
                            return {
                                ...product_information, // 기존 프로퍼티 복사
                                haruMarket_BuyMaster_order: rsp.merchant_uid, // 새로운 프로퍼티 추가
                            };
                        });

                        responData = await httpRequest("POST", "http://localhost:8080/user/product_buy_detail", tharumarket_userBuy, authorization);
                        if (responData.status !== 200) {
                            responData = await httpRequest("POST", "http://localhost:8080/common/token_refresh", null, authorization);
                            if (responData.status === 200) {
                                dispatch({
                                    type: "setAuthorization",
                                    authorization: responData.data.token
                                });
                                responData = await httpRequest("POST", "http://localhost:8080/user/product_buy_detail", tharumarket_userBuy, authorization);
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

                        let tharumarket_userBasket_indexs = [...buy.harumarket_userBasket_indexs];

                        if (tharumarket_userBasket_indexs.length > 0) {
                            responData = await httpRequest("POST", "http://localhost:8080/user/userBasket_delete", tharumarket_userBasket_indexs, authorization);
                            if (responData.status !== 200) {
                                responData = await httpRequest("POST", "http://localhost:8080/common/token_refresh", null, authorization);
                                if (responData.status === 200) {
                                    dispatch({
                                        type: "setAuthorization",
                                        authorization: responData.data.token
                                    });
                                    responData = await httpRequest("POST", "http://localhost:8080/user/userBasket_delete", tharumarket_userBasket_indexs, authorization);
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
                        }

                        navigate(`/buy_complete`);
                    }
                }
            );
        }
    };

    const merchant_uid_output = function () {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고, 2자리로 맞춤
        const day = String(today.getDate()).padStart(2, '0'); // 2자리로 맞춤
        const hours = String(today.getHours()).padStart(2, '0'); // 2자리로 맞춤
        const minutes = String(today.getMinutes()).padStart(2, '0'); // 2자리로 맞춤

        const formattedDate = `${year}${month}${day}${hours}${minutes}`;

        return formattedDate;
    }

    const srcExport = function (harumarket_product_picture) {
        const regex = /<img[^>]*src="([^"]*)"/g;
        const match = regex.exec(harumarket_product_picture);
        const srcValue = match[1];
        return srcValue;
    }

    const product_detail = function (harumarket_product_index) {
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
    }

    const product_information_view = async function () {
        let responData = await httpRequest("POST", "http://localhost:8080/user/product_information_view", buy.harumarket_userBuy, authorization);
        if (responData.status !== 200) {
            responData = await httpRequest("POST", "http://localhost:8080/common/token_refresh", null, authorization);
            if (responData.status === 200) {
                dispatch({
                    type: "setAuthorization",
                    authorization: responData.data.token
                });
                responData = await httpRequest("POST", "http://localhost:8080/user/basket_delete", buy.harumarket_userBuy, authorization);
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

    const information_find = async function () {
        let responData = await httpRequest("POST", "http://localhost:8080/user/information_find", null, authorization);
        if (responData.status !== 200) {
            responData = await httpRequest("POST", "http://localhost:8080/common/token_refresh", null, authorization);
            if (responData.status === 200) {
                dispatch({
                    type: "setAuthorization",
                    authorization: responData.data.token
                });
                responData = await httpRequest("POST", "http://localhost:8080/user/information_find", null, authorization);
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

    return (
        <div className="container-fluid ps-4 pt-5 pb-5" style={{ paddingRight: '2.6rem !important' }}>
            <div className="row">
                <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: '80px' }}>
                    <span className="display-5 text-dark fw-bold">주문/결제</span>
                </div>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">배송지</h5>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="informationRadio"
                                    value={1}
                                    checked={informationRadio === 1}
                                    onChange={information_setting}
                                />
                                <label className="form-check-label" htmlFor="inlineRadio1">
                                    회원정보와 동일
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="informationRadio"
                                    value={0}
                                    checked={informationRadio === 0}
                                    onChange={information_setting}
                                />
                                <label className="form-check-label" htmlFor="inlineRadio2">
                                    새로운 배송지
                                </label>
                            </div>
                            <div className="mt-3">
                                <label htmlFor="haruMarket_user_name" className="form-label">
                                    * 받는 사람 이름
                                </label>
                                <input type="text" className="form-control" value={haruMarket_user_name} placeholder="이름 입력"
                                    onChange={(e) => {
                                        setHaruMarketUserName(e.target.value)
                                    }} />
                            </div>
                            <label className="form-label mt-3 mb-0">* 주소</label>
                            <div id="haruMarket_user_address_msg" className="form-text">
                                우편번호를 클릭하여 주소를 입력하여 주십시오.
                            </div>
                            <div className="row g-3 align-items-center mb-1">
                                <div className="col-auto">
                                    <input
                                        type="text"
                                        value={haruMarket_user_postCode}
                                        className="form-control"
                                        placeholder="우편번호"
                                        disabled
                                        readOnly
                                    />
                                </div>
                                <div className="col-auto">
                                    <button type="button" className="btn btn-primary" onClick={addressFind}>
                                        우편번호
                                    </button>
                                </div>
                            </div>
                            <input
                                type="text"
                                value={haruMarket_user_basicAddress}
                                className="form-control mb-1"
                                placeholder="기본 주소"
                                disabled
                                readOnly
                            />
                            <input
                                type="text"
                                value={haruMarket_user_detailAddress}
                                className="form-control"
                                placeholder="상세 주소"
                                onChange={(e) => {
                                    setHaruMarketDetailAddress(e.target.value)
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">주문 상품</h5>
                            <div className="container-fluid" id="order_products">
                                {product_informations.map((product_information, index) => (
                                    <div className="row border border-dark rounded mb-2" key={index}>
                                        <div className="col-2 d-flex justify-content-center align-items-center">
                                            <img
                                                src={srcExport(product_information.harumarket_product_picture)}
                                                style={{ cursor: 'pointer' }}
                                                width="100"
                                                className="img-thumbnail img-link"
                                                onClick={() => product_detail(product_information.harumarket_product_index)}
                                                alt="product"
                                            />
                                        </div>
                                        <div className="col-10">
                                            <p
                                                className="text-dark"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => product_detail(product_information.harumarket_product_index)}
                                            >
                                                {product_information.harumarket_product_name}
                                            </p>
                                            <p className="text-secondary mb-0">
                                                [옵션:
                                                {product_information.harumarket_productColor_name === null
                                                    ? ''
                                                    : product_information.harumarket_productColor_name}
                                                {product_information.haruMarket_productCategory_name === null
                                                    ? ''
                                                    : product_information.haruMarket_productCategory_name}
                                                ]
                                            </p>
                                            <p className="text-secondary">수량: {product_information.harumarket_product_count}개</p>
                                            <p className="text-dark mb-0">
                                                {product_information.harumarket_product_salePrice
                                                    .toString()
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                원
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="card-footer">{harumarket_product_totalPrice}</div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <button type="button" className="btn btn-primary me-1" onClick={() => purchase('card')}>
                                카드 결제
                            </button>
                            <button type="button" className="btn btn-primary me-1" onClick={() => purchase('phone')}>
                                휴대폰 소액 결제
                            </button>
                            <button type="button" className="btn btn-primary me-1" onClick={() => purchase('naverpay')}>
                                네이버페이 결제
                            </button>
                            <button type="button" className="btn btn-primary me-1" onClick={() => purchase('kakaopay')}>
                                카카오페이 결제
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Buy;
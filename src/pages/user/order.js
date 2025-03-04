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

const OrderInquiry = () => {
    const authorization = useSelector((state) => state.dataStore.authorization);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const gridRef = useRef(null);
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
            bodyHeight: 650,
            // rowHeaders: ['checkbox'],
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
                    header: '결제 정보',
                    name: 'harumarket_product_name',
                    align: 'center',
                    formatter: function (val) {
                        console.log(val.row);
                        return `
                <span style="cursor:pointer" class="span-link" data-row-key="${val.row.rowKey}">${val.value}</span><br/><br/>
                <p>주문자 성함 : ${val.row.haruMarket_BuyMaster_buyerName}</p>
                <p>주문자 우편번호 : ${val.row.haruMarket_BuyMaster_buyerPostcode}</p>
                <p>주문자 주소 : ${val.row.haruMarket_BuyMaster_buyerAddr}</p>
                <p>주문 날짜 : ${val.row.haruMarket_BuyMaster_insertTime}</p>
              `;
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
                    name: 'harumarket_buyDetail_account',
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
                },
                {
                    header: '주문 상태',
                    name: 'haruMarket_BuyMaster_status',
                    align: 'center',
                    width: 100,
                },
            ],
        })

        return async () =>{
            if (!gridRef.current) {
                gridInstance.destroy();
            }

            if (gridRef.current){
                let responData = await order_select();
                gridInstance.resetData(responData.data);
            }
        }
    });

    const rowClick = (event) => {
        if (event.target.classList.contains('img-link') || event.target.classList.contains('span-link')){
            const rowKey = event.target.dataset.rowKey;
            
            const row = gridInstance.getRow(rowKey);
            dispatch({
                type: "setProduct",
                harumarket_product_index: row.harumarket_product_index
            })
            navigate(`/product_detail`);
        }
    }

    const order_select = async function(){
        let responData = await httpRequest("POST","http://localhost:8080/user/order_select",null,authorization);
        if(responData.status !== 200){
            responData = await httpRequest("POST","http://localhost:8080/common/token_refresh",null,authorization);
            if(responData.status === 200){
                dispatch({
                    type: "setAuthorization",
                    authorization: responData.data.token
                });
                responData = await httpRequest("POST","http://localhost:8080/user/order_select",null,authorization);
            }
            else{
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

    return (
        <div className="container-fluid ps-4 pt-5 pb-5" style={{ paddingRight: '2.6rem' }}>
            <div className="row">
                <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: '80px' }}>
                    <span className="display-5 text-dark fw-bold">주문 조회</span>
                </div>
                <div className="col-12">
                    <div className="card h-100 w-100">
                        <div className="card-body d-flex justify-content-center align-items-center m-0 p-0">
                            <div ref={gridRef} className="h-100 w-100" onClick={rowClick}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderInquiry;
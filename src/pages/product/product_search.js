import React, { useState, useEffect } from 'react';
import {
    useNavigate,
} from "react-router-dom";
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ajax_send } from "../../tool";

const ProductSearch = () => {
    const navigate = useNavigate();

    const [categorys, setCategorys] = useState([]); // 빈 배열로 초기화
    const [page_views, setPage_views] = useState([]); // 빈 배열로 초기화
    const [haruMarket_productCategory_index, setHaruMarket_productCategory_index] = useState(0);
    const [harumarket_product_name, setHarumarket_product_name] = useState('');
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        category_select();
        setHarumarket_product_name(localStorage.getItem("harumarket_product_name"));
        total_page();
        search();
    }, [harumarket_product_name]);

    const category_select = function(){
        var formData = new FormData();
        let data = ajax_send(formData,`http://localhost:8080/common/category_select`,"GET");
        setCategorys(data);
    }

    const total_page = function () {
        var formData = new FormData();
        let fdata = {
            haruMarket_productCategory_index: parseInt(haruMarket_productCategory_index),
            harumarket_product_name: harumarket_product_name,
            page: 0
        }
        
        var data = ajax_send(formData, `http://localhost:8080/common/total_page2/${JSON.stringify(fdata)}`, "GET");
        setPageCount(data.totalPages);
    }

    const srcExport = (harumarket_product_picture) => {
        const regex = /<img[^>]*src="([^"]*)"/g;
        const match = regex.exec(harumarket_product_picture);
        const srcValue = match[1];
        return srcValue;
    };

    const page_view2 = ({ selected }) => {
        var formData = new FormData();
        let fdata = {
            haruMarket_productCategory_index: parseInt(haruMarket_productCategory_index.value),
            harumarket_product_name: harumarket_product_name.value,
            page: selected
        }
        let data = ajax_send(formData, `http://localhost:8080/common/page_view2/${JSON.stringify(fdata)}`,"GET");
        setPage_views(data);
    }

    const search = () => {
        var formData = new FormData();
        let fdata = {
            haruMarket_productCategory_index: parseInt(haruMarket_productCategory_index),
            harumarket_product_name: harumarket_product_name,
            page: 0
        }
        let data = ajax_send(formData, `http://localhost:8080/common/page_view2/${JSON.stringify(fdata)}`,"GET");
        setPage_views(data);
    }

    return (
        <div className="container-fluid ps-4 pt-5 pb-5" style={{ paddingRight: '2.6rem' }}>
            <div className="row">
                <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: '80px' }}>
                    <span className="display-6 text-dark fw-bold">상품 검색</span>
                </div>
                <div className="col-12 d-flex justify-content-center align-items-center pb-2">
                    <div className="w-100 rounded border border-dark p-5">
                        <div className="input-group mb-2">
                            <span className="input-group-text">상품 카테고리</span>
                            <select
                                value={haruMarket_productCategory_index}
                                onChange={(e) => setHaruMarket_productCategory_index(parseInt(e.target.value))}
                                className="form-select"
                                aria-label="Default select example"
                                id="harumarket_productcategory_select"
                            >
                                <option value={0}>상품 카테고리 선택</option>
                                {categorys.map((category) => (
                                    <option
                                        key={category.haruMarket_productCategory_index}
                                        value={category.haruMarket_productCategory_index}
                                    >
                                        {category.haruMarket_productCategory_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group mb-2">
                            <span className="input-group-text">상품 이름</span>
                            <input
                                type="text"
                                aria-label="First name"
                                className="form-control"
                                value={harumarket_product_name}
                                onChange={(e) => setHarumarket_product_name(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-primary" type="button" onClick={() => search()}>
                            검색
                        </button>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        {page_views.map((new_products_item, index) => (
                            <div className="col-2 pb-3" key={index}>
                                <div className="card" style={{ width: '18rem' }}>
                                    <img
                                        src={srcExport(new_products_item.harumarket_product_picture)}
                                        style={{ cursor: 'pointer' }}
                                        className="img-thumbnail img-link"
                                        alt="Product"
                                    />
                                    <div className="card-body">
                                        <p
                                            className="card-title fs-6"
                                            style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {new_products_item.harumarket_product_name}
                                        </p>
                                        <span
                                            className="badge rounded-pill text-bg-secondary"
                                            style={{ textDecoration: 'line-through' }}
                                        >
                                            {new_products_item.harumarket_product_originPrice}원
                                        </span>
                                        <span className="badge rounded-pill text-bg-primary">
                                            {new_products_item.harumarket_product_salePrice}원
                                        </span>
                                        <br />
                                        <span className="badge rounded-pill text-bg-success">무료배송</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <ReactPaginate
                previousLabel={'이전'}
                nextLabel={'다음'}
                pageCount={pageCount}
                onPageChange={page_view2}
                containerClassName={'pagination justify-content-center'} // 부트스트랩 클래스 추가
                pageClassName={'page-item'} // 부트스트랩 클래스 추가
                pageLinkClassName={'page-link'} // 부트스트랩 클래스 추가
                previousClassName={'page-item'} // 부트스트랩 클래스 추가
                previousLinkClassName={'page-link'} // 부트스트랩 클래스 추가
                nextClassName={'page-item'} // 부트스트랩 클래스 추가
                nextLinkClassName={'page-link'} // 부트스트랩 클래스 추가
                activeClassName={'active'} // 부트스트랩 클래스 추가
                disabledClassName={'disabled'} // 부트스트랩 클래스 추가
            />
        </div>
    );
};

export default ProductSearch;
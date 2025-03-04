import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ajax_send } from "../../tool";
import { useDispatch } from 'react-redux';
import {
  useNavigate,
} from "react-router-dom";

function App() {
  const haruMarket_productCategory_index = useSelector((state) => state.dataStore.haruMarket_productCategory_index);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    total_page();
    page_view2(1);
    haruMarket_productCategory_name_view();
  }, [haruMarket_productCategory_index]);

  const total_page = function(){
    var formData = new FormData();
    var data = ajax_send(formData,`http://localhost:8080/common/total_page/${haruMarket_productCategory_index}`,"GET");
    setPageCount(data.totalPages);
  }

  const [haruMarket_productCategory_name, setHaruMarket_productCategory_name] = useState('카테고리 이름');
  const [page_views, setPage_views] = useState([]); // 빈 배열로 초기화
  const [pageCount, setPageCount] = useState(0);

  const srcExport = (harumarket_product_picture) => {
    const regex = /<img[^>]*src="([^"]*)"/g;
    const match = regex.exec(harumarket_product_picture);
    const srcValue = match[1];
    return srcValue;
  };

  const product_detail = (index) => {
    dispatch({
      type: "setProduct",
      harumarket_product_index: index
    })
    navigate(`/product_detail`);
  };

  const page_view = ({ selected }) => {
    var formData = new FormData();
    let data = ajax_send(formData,`http://localhost:8080/common/page_view/${haruMarket_productCategory_index}/${selected}`,"GET");
    setPage_views(data);
  }

  const page_view2 = (selected) => {
    var formData = new FormData();
    let data = ajax_send(formData,`http://localhost:8080/common/page_view/${haruMarket_productCategory_index}/${selected}`,"GET");
    setPage_views(data);
  }

  const haruMarket_productCategory_name_view = function(){
    var formData = new FormData();
    var data = ajax_send(formData,`http://localhost:8080/common/haruMarket_productCategory_name/${haruMarket_productCategory_index}`,"GET");
    setHaruMarket_productCategory_name(data.haruMarket_productCategory_name);
  }

  return (
    <div className="container-fluid ps-4 pt-5 pb-5" style={{ paddingRight: '2.6rem' }}>
      <div className="row">
        <div className="col-12 d-flex justify-content-center align-items-center">
          <span className="display-6 text-dark fw-bold">
            {haruMarket_productCategory_name}
          </span>
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
                  onClick={() =>
                    product_detail(new_products_item.harumarket_product_index)
                  }
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
                    onClick={() =>
                      product_detail(new_products_item.harumarket_product_index)
                    }
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
                  <span className="badge rounded-pill text-bg-success">
                    무료배송
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ReactPaginate
          previousLabel={'이전'}
          nextLabel={'다음'}
          pageCount={pageCount}
          onPageChange={page_view}
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
}

export default App;

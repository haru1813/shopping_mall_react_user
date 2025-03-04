import React, { useState, useCallback, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
//import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Navigation, Autoplay } from 'swiper/modules';
import { ajax_send } from './tool.js';
import { useDispatch } from 'react-redux';
import {
  useNavigate,
} from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [advertise_items, setAdvertiseItems] = useState<any[]>([]);
  const [new_products_items, setProductsItems] = useState<any[]>([]);

  const advertise_view = useCallback(() => {
    var formData = new FormData();
    let response = ajax_send(formData, "http://localhost:8080/common/advertise", "GET");
    setAdvertiseItems([...(response || [])]);
  }, []);

  const new_products_view = useCallback(() => {
    var formData = new FormData();
    let response = ajax_send(formData, "http://localhost:8080/common/new_products", "GET");
    setProductsItems([...(response || [])]);
  }, []);

  useEffect(() => {
    advertise_view();
    new_products_view();
  }, []);

  const srcExport = (harumarket_product_picture) => {
    const regex = /<img[^>]*src="([^"]*)"/g;
    const match = regex.exec(harumarket_product_picture);
    const srcValue = match ? match[1] : '';
    return srcValue;
  };

  const product_detail = (index) => {
    dispatch({
      type: "setProduct",
      harumarket_product_index: index
    })
    navigate(`product_detail`);
  };

  return (
    <div className="container-fluid ps-4 pt-5 pb-5" style={{ paddingRight: '2.6rem !important' }}>
      <div className="row">
        <div className="col-12 d-flex justify-content-center align-items-center">
          <span className="display-6 text-dark fw-bold">WEEKLY BEST</span><br />
        </div>
        <div className="col-12 d-flex justify-content-center align-items-center">
          <span className="text-secondary fw-bold">지금 가장 사랑받는 상품입니다 :)</span>
        </div>
        <div className="col-12">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={10} // 슬라이드 간 간격
            slidesPerView={6}  // 한 번에 보여줄 슬라이드 수
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
          >
            {advertise_items.map(advertise_item => (
              <SwiperSlide key={advertise_item.harumarket_product_index}>
                <div className="card" style={{ width: '18rem' }}>
                  <img
                    src={srcExport(advertise_item.harumarket_product_picture)}
                    style={{ cursor: 'pointer' }}
                    className="img-thumbnail img-link"
                    onClick={() => product_detail(advertise_item.harumarket_product_index)}
                    alt={advertise_item.harumarket_product_name || "Product Image"} // Important: Add alt text!
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
                      onClick={() => product_detail(advertise_item.harumarket_product_index)}
                    >
                      {advertise_item.harumarket_product_name}
                    </p>
                    <span className="badge rounded-pill text-bg-secondary" style={{ textDecoration: 'line-through' }}>
                      {advertise_item.harumarket_product_originPrice}원
                    </span>
                    <span className="badge rounded-pill text-bg-primary">
                      {advertise_item.harumarket_product_salePrice}원
                    </span><br />
                    <span className="badge rounded-pill text-bg-success">무료배송</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="row">
        <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: '80px' }}>
          <span className="display-6 text-dark fw-bold">NEW ARRIVALS</span>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          {new_products_items.map(new_products_item => (
            <div className="col-2 pb-3" key={new_products_item.harumarket_product_index}>
              <div className="card" style={{ width: '18rem' }}>
                <img
                  src={srcExport(new_products_item.harumarket_product_picture)}
                  style={{ cursor: 'pointer' }}
                  className="img-thumbnail img-link"
                  onClick={() => product_detail(new_products_item.harumarket_product_index)}
                  alt={new_products_item.harumarket_product_name || "Product Image"} // Important: Add alt text!
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
                    onClick={() => product_detail(new_products_item.harumarket_product_index)}
                  >
                    {new_products_item.harumarket_product_name}
                  </p>
                  <span className="badge rounded-pill text-bg-secondary" style={{ textDecoration: 'line-through' }}>
                    {new_products_item.harumarket_product_originPrice}원
                  </span>
                  <span className="badge rounded-pill text-bg-primary">
                    {new_products_item.harumarket_product_salePrice}원
                  </span><br />
                  <span className="badge rounded-pill text-bg-success">무료배송</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

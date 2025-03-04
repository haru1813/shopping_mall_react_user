import React, { useEffect } from 'react';
import {
    useNavigate,
} from "react-router-dom";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

function App() {
    const authorization = useSelector((state) => state.dataStore.authorization);
    const join = useSelector((state) => state.join);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (authorization !== "") {
            navigate("/");
        }
        if (join.haruMarket_join_certification === false) {
            console.log("인증 비완료");
            navigate("/");
        }
        else{
            dispatch({
                type: "ok",
                haruMarket_join_certification : false
            });
        }
    }, [authorization, navigate]);

    const ok = () => {
        navigate("/");
    };

    return (
        <div className="container-fluid ps-4 pt-5 pb-5" style={{ paddingRight: '2.6rem !important' }}>
            <div className="row">
                <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: '80px' }}>
                    <span className="display-5 text-dark fw-bold">JOIN</span>
                </div>
                <div className="col-12" style={{ height: '700px' }}>
                    <div className="card h-100 w-100">
                        <div className="card-header">회원가입 완료</div>
                        <div className="card-body d-flex justify-content-center align-items-center">
                            <h5 className="card-title">
                                <p className="fs-5 text-dark fw-bold">
                                    반갑습니다. 회원가입이 완료 되었습니다.<br />
                                    저희 쇼핑몰을 이용해 주셔서 감사합니다.
                                </p>
                            </h5>
                        </div>
                        <div className="card-footer">
                            <button type="button" className="btn btn-primary" onClick={ok}>
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;
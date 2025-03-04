import React, { useRef,useEffect  } from 'react';
import toastr from "toastr";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {
    useNavigate,
} from "react-router-dom";
import { useSelector } from 'react-redux';
import type { AppState } from "../../store/AppState";

function App() {
    const haruMarket_user_id = useRef<HTMLInputElement | null>(null);
    const haruMarket_user_pw = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authorization = useSelector<AppState, String>((state) => state.dataStore.authorization);

    useEffect(()=>{
        if(authorization!==""){
            navigate("/");
        }
    },[authorization, navigate]);

    const login = (event) => {
        event.preventDefault();

        let haruMarket_user_id_value = haruMarket_user_id.current?.value ?? "";
        if (haruMarket_user_id_value == "") {
            toastr.error('아이디를 입력하여 주십시오.');
            haruMarket_user_id.current?.focus();
            return;
        }
        let haruMarket_user_pw_value = haruMarket_user_pw.current?.value ?? "";
        if (haruMarket_user_pw_value == "") {
            toastr.error('비밀번호를 입력하여 주십시오.');
            haruMarket_user_pw.current?.focus();
            return;
        }

        const params = new URLSearchParams();
        params.append('haruMarket_user_id', haruMarket_user_id.current?.value ?? "");
        params.append('haruMarket_user_pw', haruMarket_user_pw.current?.value ?? "");

        axios.post('http://localhost:8080/login', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => {
            dispatch({
                type: "setAuthorization",
                authorization: response.headers.authorization
            });
            navigate("/");
        })
        .catch(error => {
            toastr.error("로그인을 실패하였습니다.");
        });
    };

    const move = (url) => {
        navigate(`${url}`);
    };
    return (
        <div className="container-fluid ps-4 pt-5 pb-5" style={{ paddingRight: '2.6rem !important' }}>
            <div className="row">
                <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: '80px' }}>
                    <span className="display-5 text-dark fw-bold">
                        LOGIN
                    </span>
                </div>
                <div className="col-12" style={{ height: '700px' }}>
                    <div className="card h-100 w-100">
                        <div className="card-header">
                            로그인
                        </div>
                        <div className="card-body d-flex justify-content-center align-items-center">
                            <h5 className="card-title">
                                <label htmlFor="haruMarket_user_id" className="form-label">아이디</label>
                                <input type="text" ref={haruMarket_user_id} className="form-control mb-2" id="haruMarket_user_id" /> {/* Added id */}
                                <label htmlFor="haruMarket_user_pw" className="form-label">비밀번호</label>
                                <input type="password" ref={haruMarket_user_pw} className="form-control" id="haruMarket_user_pw" /> {/* Added id */}
                            </h5>
                        </div>
                        <div className="card-footer">
                            <button type="button" className="btn btn-primary me-1" onClick={login}>로그인</button>
                            <button type="button" className="btn btn-primary me-1" onClick={() => move('/join1')}>회원가입</button>
                            <button type="button" className="btn btn-primary me-1" onClick={() => move('/id_find')}>아이디 찾기</button>
                            <button type="button" className="btn btn-primary me-1" onClick={() => move('/pw_find')}>비밀번호 찾기</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;
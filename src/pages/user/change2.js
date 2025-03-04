import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    useNavigate,
} from "react-router-dom";
import { httpRequest } from "../../tool";
import { useDispatch } from 'react-redux';
import toastr from "toastr";

function App() {
    const dataStores = useSelector((state) => state.dataStore);
    const authorization = useSelector((state) => state.dataStore.authorization);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [pw, setPw] = useState("")

    const init = async function () {
        let responData = await httpRequest("POST", "http://localhost:8080/user/id_find", null, dataStores.authorization);
        if (responData.status != 200) {
            responData = await httpRequest("POST", "http://localhost:8080/common/token_refresh", null, dataStores.authorization);
            if (responData.status == 200) {
                dispatch({
                    type: "setAuthorization",
                    authorization: responData.data.token
                });
                responData = await httpRequest("POST", "http://localhost:8080/user/id_find", null, dataStores.authorization);
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
        if (responData.status === 200) {
            let requestData = responData.data;
            setPw(requestData.haruMarket_user_pw);
        }
    }

    useEffect(() => {
        if (authorization === "") {
            navigate("/");
        }
        return async () => {
            await init();
        }
    }, [authorization, navigate]);

    const haruMarket_user_pw = useRef(null);
    const haruMarket_user_changePw1 = useRef(null);
    const haruMarket_user_changePw2 = useRef(null);

    const validataTest = function(text){
        const regex = /^[a-z0-9]{1,20}$/;
        return regex.test(text);
    }

    const change2 = async () => {
        if(haruMarket_user_pw.current.value===""){
            toastr.error('비밀번호를 입력하여 주십시오.');
            haruMarket_user_pw.current.focus();
            return;
        }
        if(haruMarket_user_changePw1.current.value===""){
            toastr.error('비밀번호를 입력하여 주십시오.');
            haruMarket_user_changePw1.current.focus();
            return;
        }
        if(!validataTest(haruMarket_user_changePw1.current.value)){
            toastr.error('바꿀 비밀번호는 영소문자 또는 숫자만 포함하여 4~20자(20자) 입력하여주십시오.');
            haruMarket_user_changePw1.current.focus();
            return;
        }
        if(haruMarket_user_changePw1.current.value !== haruMarket_user_changePw2.current.value){
            toastr.error('바꿀 비밀번호와 바꿀 비밀번호 확인 값이 서로 다릅니다.');
            haruMarket_user_changePw1.current.focus();
            return;
        }
        let reqData = {
            haruMarket_user_pw : pw,
            check_haruMarket_user_pw : haruMarket_user_pw.current.value,
            change_haruMarket_user_pw : haruMarket_user_changePw1.current.value
        }

        let responData = await httpRequest("POST", "http://localhost:8080/user/change2", reqData, dataStores.authorization);
        if (responData.status != 200) {
            responData = await httpRequest("POST", "http://localhost:8080/common/token_refresh", null, dataStores.authorization);
            if (responData.status == 200) {
                dispatch({
                    type: "setAuthorization",
                    authorization: responData.data.token
                });
                responData = await httpRequest("POST", "http://localhost:8080/user/change2", reqData, dataStores.authorization);
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
        if(responData.status === 200){
            let data = responData.data;
            if(data.code==="200"){
                toastr.success(data.msg);
            }
            else{
                toastr.error(data.msg);
            }
        }
    };

    return (
        <div className="container-fluid ps-4 pt-5 pb-5" style={{ paddingRight: '2.6rem !important' }}>
            <div className="row">
                <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: '80px' }}>
                    <span className="display-5 text-dark fw-bold">비밀번호 변경</span>
                </div>
                <div className="col-12" style={{ height: '700px' }}>
                    <div className="card h-100 w-100">
                        <div className="card-header">비밀번호 변경</div>
                        <div className="card-body d-flex justify-content-center align-items-center">
                            <h5 className="card-title">
                                <label htmlFor="haruMarket_user_pw" className="form-label">
                                    현재 비밀번호
                                </label>
                                <input type="password" ref={haruMarket_user_pw} className="form-control mb-2" />
                                <label htmlFor="haruMarket_user_changePw1" className="form-label">
                                    * 바꿀 비밀번호
                                </label>
                                <input
                                    type="password"
                                    ref={haruMarket_user_changePw1}
                                    className="form-control"
                                    aria-describedby="haruMarket_user_changePw1_msg"
                                />
                                <div id="haruMarket_user_changePw1_msg" className="form-text mb-2">
                                    영소문자 또는 숫자만 포함하여 4~20자(20자) 입력하여주십시오.
                                </div>
                                <label htmlFor="haruMarket_user_changePw2" className="form-label">
                                    * 바꿀 비밀번호 확인
                                </label>
                                <input
                                    type="password"
                                    ref={haruMarket_user_changePw2}
                                    className="form-control"
                                    aria-describedby="haruMarket_user_changePw2_msg"
                                />
                                <div id="haruMarket_user_changePw2_msg" className="form-text mb-2">
                                    입력하신 비밀번호를 한번 더 입력하여 주십시오.
                                </div>
                            </h5>
                        </div>
                        <div className="card-footer">
                            <button type="button" className="btn btn-primary" onClick={change2}>
                                수정
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;
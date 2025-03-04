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
            if(haruMarket_user_id.current !== null)
            {
                haruMarket_user_id.current.value = requestData.haruMarket_user_id;
                haruMarket_user_postCode.current.value = requestData.haruMarket_user_postCode;
                haruMarket_user_basicAddress.current.value = requestData.haruMarket_user_basicAddress;
                haruMarket_user_detailAddress.current.value = requestData.haruMarket_user_detailAddress;
                setPw(requestData.haruMarket_user_pw);
            }
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

    const haruMarket_user_id = useRef(null);
    const haruMarket_user_pw = useRef(null);
    const haruMarket_user_postCode = useRef(null);
    const haruMarket_user_basicAddress = useRef(null);
    const haruMarket_user_detailAddress = useRef(null);

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

                haruMarket_user_postCode.current.value = data.zonecode;
                haruMarket_user_basicAddress.current.value = jibunAddress;
            }
        }).open();
    };

    const change1 = async () => {
        if (haruMarket_user_pw.current.value === "") {
            toastr.error('비밀번호를 입력하여 주십시오.');
            haruMarket_user_pw.current.focus();
            return;
        }
        if (haruMarket_user_postCode.current.value === "" || haruMarket_user_basicAddress.current.value === "") {
            toastr.error('우편번호 버튼을 클릭하여 주소를 검색하여 주십시오.');
            return;
        }
        if (haruMarket_user_detailAddress.current.value === "") {
            toastr.error('상세 주소가 입력되지 않았습니다.');
            haruMarket_user_detailAddress.current.focus();
            return;
        }
        if (haruMarket_user_detailAddress.current.value.length > 30) {
            toastr.error('상세 주소는 30자를 넘지 않도록 입력하여 주십시오.');
            haruMarket_user_detailAddress.current.focus();
            return;
        }

        let reqData = {
            haruMarket_user_pw: pw,
            check_haruMarket_user_pw: haruMarket_user_pw.current.value,
            haruMarket_user_postCode: haruMarket_user_postCode.current.value,
            haruMarket_user_basicAddress: haruMarket_user_basicAddress.current.value,
            haruMarket_user_detailAddress: haruMarket_user_detailAddress.current.value,
        }

        let responData = await httpRequest("POST", "http://localhost:8080/user/change1", reqData, dataStores.authorization);
        if (responData.status !== 200) {
            responData = await httpRequest("POST", "http://localhost:8080/common/token_refresh", null, dataStores.authorization);
            if (responData.status === 200) {
                dataStores.authorization = responData.data.token;
                responData = await httpRequest("POST", "http://localhost:8080/user/change1", reqData, dataStores.authorization);
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
            let data = responData.data;
            if (data.code === "200") {
                toastr.success(data.msg);
            }
            else {
                toastr.error(data.msg);
            }
        }
    };

    return (
        <div className="container-fluid ps-4 pt-5 pb-5" style={{ paddingRight: '2.6rem !important' }}>
            <div className="row">
                <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: '80px' }}>
                    <span className="display-5 text-dark fw-bold">회원 정보 수정</span>
                </div>
                <div className="col-12" style={{ height: '700px' }}>
                    <div className="card h-100 w-100">
                        <div className="card-header">회원 정보 수정</div>
                        <div className="card-body d-flex justify-content-center align-items-center">
                            <h5 className="card-title">
                                <label htmlFor="haruMarket_user_id" className="form-label">
                                    아이디
                                </label>
                                <input
                                    type="text"
                                    ref={haruMarket_user_id}
                                    className="form-control"
                                    disabled
                                    readOnly
                                />
                                <label htmlFor="haruMarket_user_pw" className="form-label">
                                    비밀번호
                                </label>
                                <input type="password" ref={haruMarket_user_pw} className="form-control" />
                                <label className="form-label">주소</label>
                                <div id="haruMarket_user_address_msg" className="form-text mb-2">
                                    우편번호를 클릭하여 주소를 입력하여 주십시오.
                                </div>
                                <div className="row g-3 align-items-center mb-1">
                                    <div className="col-auto">
                                        <input
                                            type="text"
                                            ref={haruMarket_user_postCode}
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
                                    ref={haruMarket_user_basicAddress}
                                    className="form-control mb-1"
                                    placeholder="기본 주소"
                                    disabled
                                    readOnly
                                />
                                <input
                                    type="text"
                                    ref={haruMarket_user_detailAddress}
                                    className="form-control"
                                    placeholder="상세 주소"
                                />
                            </h5>
                        </div>
                        <div className="card-footer">
                            <button type="button" className="btn btn-primary" onClick={change1}>
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
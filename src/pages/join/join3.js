import React, { useEffect, useRef } from 'react';
import {
    useNavigate,
} from "react-router-dom";
import { useSelector } from 'react-redux';
import toastr from "toastr";
import { ajax_send } from "../../tool";
import { useDispatch } from 'react-redux';
import axios from 'axios';

function App() {
    const authorization = useSelector((state) => state.dataStore.authorization);
    const join = useSelector((state) => state.join);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const haruMarket_user_id = useRef(null);
    const haruMarket_user_pw = useRef(null);
    const haruMarket_user_pwCheck = useRef(null);
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

    const validataTest = function (text) {
        const regex = /^[a-z0-9]{1,20}$/;
        return regex.test(text);
    }

    const joinf = () => {
        // 회원가입 로직 구현
        console.log('회원가입');
        console.log('아이디:', haruMarket_user_id.current.value);
        console.log('비밀번호:', haruMarket_user_pw.current.value);
        console.log('비밀번호 확인:', haruMarket_user_pwCheck.current.value);
        console.log('우편번호:', haruMarket_user_postCode.current.value);
        console.log('기본 주소:', haruMarket_user_basicAddress.current.value);
        console.log('상세 주소:', haruMarket_user_detailAddress.current.value);

        if (haruMarket_user_id.current.value === "") {
            toastr.error('아이디를 입력하여 주십시오.');
            haruMarket_user_id.current.focus();
            return;
        }
        if (!validataTest(haruMarket_user_id.current.value)) {
            toastr.error('아이디는 영소문자 또는 숫자만 포함하여 4~20자(20자) 입력하여주십시오.');
            haruMarket_user_id.current.focus();
            return;
        }
        if (haruMarket_user_pw.current.value === "") {
            toastr.error('비밀번호를 입력하여 주십시오.');
            haruMarket_user_pw.current.focus();
            return;
        }
        if (!validataTest(haruMarket_user_pw.current.value)) {
            toastr.error('비밀번호는 영소문자 또는 숫자만 포함하여 4~20자(20자) 입력하여주십시오.');
            haruMarket_user_pw.current.focus();
            return;
        }
        if (haruMarket_user_pw.current.value !== haruMarket_user_pwCheck.current.value) {
            toastr.error('비밀번호와 비밀번호 확인 값이 서로 다릅니다.');
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

        let fdata = {
            haruMarket_user_id: haruMarket_user_id.current.value,
            haruMarket_user_pw: haruMarket_user_pw.current.value,
            haruMarket_user_postCode: haruMarket_user_postCode.current.value,
            haruMarket_user_basicAddress: haruMarket_user_basicAddress.current.value,
            haruMarket_user_detailAddress: haruMarket_user_detailAddress.current.value,
            haruMarket_user_birthday: join.haruMarket_user_birthday,
            haruMarket_user_gender: join.haruMarket_user_gender,
            haruMarket_user_name: join.haruMarket_user_name,
            haruMarket_user_phone: join.haruMarket_user_phone,
            haruMarket_user_uniqueKey: join.haruMarket_user_uniqueKey,
        }

        const sendData = async () => {
            try {
                const response = await axios.post('http://localhost:8080/common/join', JSON.stringify(fdata), {
                headers: {
                    'Content-Type': 'application/json'
                }
                });
                console.log('응답 데이터:', response.data);
                navigate("/join4");
            } catch (error) {
                console.error('에러 발생:', error);
                toastr.error("이미 존재하는 아이디입니다. 다른 아이디를 입력하여 주십시오.");
            }
        };
        sendData();
    };

    useEffect(() => {
        if (authorization !== "") {
            navigate("/");
        }
        if (join.haruMarket_join_certification === false) {
            console.log("인증 비완료");
            navigate("/");
        }
    }, [authorization, navigate]);

    return (
        <div className="container-fluid ps-4 pt-5 pb-5" style={{ paddingRight: '2.6rem !important' }}>
            <div className="row">
                <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: '80px' }}>
                    <span className="display-5 text-dark fw-bold">JOIN</span>
                </div>
                <div className="col-12" style={{ height: '700px' }}>
                    <div className="card h-100 w-100">
                        <div className="card-header">회원가입 (3/3) 회원정보 입력</div>
                        <div className="card-body d-flex justify-content-center align-items-center">
                            <h5 className="card-title">
                                <label htmlFor="haruMarket_user_id" className="form-label">
                                    * 아이디
                                </label>
                                <input
                                    type="text"
                                    ref={haruMarket_user_id}
                                    id="haruMarket_user_id"
                                    className="form-control"
                                    aria-describedby="haruMarket_user_id_msg"
                                />
                                <div id="haruMarket_user_id_msg" className="form-text mb-2">
                                    영소문자 또는 숫자만 포함하여 4~20자(20자) 입력하여주십시오.
                                </div>
                                <label htmlFor="haruMarket_user_pw" className="form-label">
                                    * 비밀번호
                                </label>
                                <input
                                    type="password"
                                    ref={haruMarket_user_pw}
                                    id="haruMarket_user_pw"
                                    className="form-control"
                                    aria-describedby="haruMarket_user_pw_msg"
                                />
                                <div id="haruMarket_user_pw_msg" className="form-text mb-2">
                                    영소문자 또는 숫자만 포함하여 4~20자(20자) 입력하여주십시오.
                                </div>
                                <label htmlFor="haruMarket_user_pwCheck" className="form-label">
                                    * 비밀번호 확인
                                </label>
                                <input
                                    type="password"
                                    ref={haruMarket_user_pwCheck}
                                    id="haruMarket_user_pwCheck"
                                    className="form-control"
                                    aria-describedby="haruMarket_user_pwCheck_msg"
                                />
                                <div id="haruMarket_user_pwCheck_msg" className="form-text mb-2">
                                    입력하신 비밀번호를 한번 더 입력하여 주십시오.
                                </div>
                                <label className="form-label">* 주소</label>
                                <div id="haruMarket_user_address_msg" className="form-text mb-2">
                                    우편번호를 클릭하여 주소를 입력하여 주십시오.
                                </div>
                                <div className="row g-3 align-items-center mb-1">
                                    <div className="col-auto">
                                        <input
                                            type="text"
                                            ref={haruMarket_user_postCode}
                                            id="haruMarket_user_postCode"
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
                                    id="haruMarket_user_basicAddress"
                                    className="form-control mb-1"
                                    placeholder="기본 주소"
                                    disabled
                                    readOnly
                                />
                                <input
                                    type="text"
                                    ref={haruMarket_user_detailAddress}
                                    id="haruMarket_user_detailAddress"
                                    className="form-control"
                                    placeholder="상세 주소"
                                />
                            </h5 >
                        </div>
                        <div className="card-footer">
                            <button type="button" className="btn btn-primary" onClick={joinf}>
                                회원가입
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;
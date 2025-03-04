import React, { useState, useEffect, useRef } from 'react';
import {
    useNavigate,
} from "react-router-dom";
import toastr from "toastr";
import { sendData } from "../../tool";
import { useSelector } from 'react-redux';

function FindPw() {
    const authorization = useSelector((state) => state.dataStore.authorization);
    const navigate = useNavigate();

    useEffect(() => {
        if (authorization !== "") {
            navigate("/");
        }
    }, [authorization, navigate]);

    const haruMarket_user_id = useRef(null);
    const [msg, setMsg] = useState('');

    const getYmd10 = function () {
        var d = new Date();
        return d.getFullYear() + "-" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "-" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());
    }

    const identity = () => {
        if(haruMarket_user_id.current.value === ""){
            toastr.error('아이디를 입력하여 주십시오.');
            haruMarket_user_id.current.focus();
            return;
        }

        const { IMP } = window;
        IMP.init("imp43126142");

        // 본인인증
        IMP.certification({ // param
            pg: 'inicis.{MIIiasTest}',
            merchant_uid: "harubarter " + getYmd10(), // 주문 번호 개인적으로 설정 가능 
            popup: false
        }, async function (rsp) { // callback
            console.log(rsp);
            if (rsp.success) {
                rsp.haruMarket_user_id = haruMarket_user_id.current.value;
            
                let data = await sendData(`http://localhost:8080/common/pw_find`, rsp, "post");
                if (data.status == 400) {
                    setMsg("아직 회원가입을 진행하지 않으시거나<br/>아이디를 잘못 입력하셨습니다.");
                }
                else {
                    setMsg(`고객님의 임시 비밀번호는 ${data.data.haruMarket_user_pw} 입니다.`);
                }
            } else {
                // 인증 실패 시 로직
                toastr.error('인증을 실패하였습니다.');
            }
        });
    };

    return (
        <div className="container-fluid ps-4 pt-5 pb-5" style={{ paddingRight: '2.6rem !important' }}>
            <div className="row">
                <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: '80px' }}>
                    <span className="display-5 text-dark fw-bold">FIND PASSWORD</span>
                </div>
                <div className="col-12" style={{ height: '700px' }}>
                    <div className="card h-100 w-100">
                        <div className="card-header">비밀번호 찾기</div>
                        <div className="card-body d-flex justify-content-center align-items-center">
                            <h5 className="card-title">
                                <label htmlFor="haruMarket_user_id" className="form-label">
                                    아이디
                                </label>
                                <input type="text" ref={haruMarket_user_id} className="form-control mb-3" />
                                <p className="fs-5 text-dark fw-bold">
                                    비밀번호를 찾기 위하여 아이디를 입력 후<br />
                                    아래의 본인인증하기 버튼을 눌러서<br />
                                    본인인증을 진행하여 주시기 바랍니다.
                                </p>
                                <p className="fs-5 text-danger fw-bold" dangerouslySetInnerHTML={{ __html: msg }}></p>
                            </h5>
                        </div>
                        <div className="card-footer">
                            <button type="button" className="btn btn-primary" onClick={identity}>
                                본인인증 하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FindPw;
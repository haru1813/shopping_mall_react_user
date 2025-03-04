import React, { useState, useEffect } from 'react';
import {
    useNavigate,
} from "react-router-dom";
import toastr from "toastr";
import { sendData } from "../../tool";
import { useSelector } from 'react-redux';

function FindId() {
    const [msg, setMsg] = useState('');
    const authorization = useSelector((state) => state.dataStore.authorization);
    const navigate = useNavigate();

    useEffect(() => {
        if (authorization !== "") {
            navigate("/");
        }
    }, [authorization, navigate]);

    const getYmd10 = function () {
        var d = new Date();
        return d.getFullYear() + "-" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "-" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());
    }

    const identity = () => {
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
                let data = await sendData(`http://localhost:8080/common/id_find`, rsp, "post");
                if (data.status == 400) {
                    setMsg("고객님의 명의로 가입된 계정이 없습니다.");
                }
                else {
                    setMsg(`고객님의 아이디는 ${data.data.haruMarket_user_id} 입니다.`);
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
                    <span className="display-5 text-dark fw-bold">FIND ID</span>
                </div>
                <div className="col-12" style={{ height: '700px' }}>
                    <div className="card h-100 w-100">
                        <div className="card-header">아이디 찾기</div>
                        <div className="card-body d-flex justify-content-center align-items-center">
                            <h5 className="card-title">
                                <p className="fs-5 text-dark fw-bold">
                                    아이디를 찾기 위하여<br />
                                    아래의 본인인증하기 버튼을 눌러서<br />
                                    본인인증을 진행하여 주시기 바랍니다.
                                </p>
                                <p className="fs-5 text-danger fw-bold">{msg}</p>
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

export default FindId;
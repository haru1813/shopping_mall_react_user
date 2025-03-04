import React, { useEffect, useCallback } from 'react';
import {
    useNavigate,
} from "react-router-dom";
import { useSelector } from 'react-redux';
import toastr from "toastr";
import {ajax_send} from "../../tool";
import { useDispatch } from 'react-redux';

function App() {
    const authorization = useSelector((state) => state.dataStore.authorization);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getYmd10 = function(){
        var d = new Date();
        return d.getFullYear() + "-" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "-" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());
    }

    const identity = useCallback(() => {
        const { IMP } = window;
        IMP.init("imp43126142");

        // 본인인증
        IMP.certification({ // param
            pg: 'inicis.{MIIiasTest}',
            merchant_uid: "harubarter " + getYmd10(), // 주문 번호 개인적으로 설정 가능 
            popup: false
        }, function (rsp) { // callback
            console.log(rsp);
            if (rsp.success) {
                var formData = new FormData();
                const data = ajax_send(formData, `http://localhost:8080/common/join_informationExport/${JSON.stringify(rsp)}`, "GET");
                dispatch({
                    type: "join",
                    haruMarket_user_birthday : data.birthday,
                    haruMarket_user_gender : data.gender,
                    haruMarket_user_name : data.name,
                    haruMarket_user_phone : data.phone,
                    haruMarket_user_uniqueKey : data.unique_key,
                    haruMarket_join_certification : true
                });
                navigate("/join3");
            } else {
                // 인증 실패 시 로직
                toastr.error('인증을 실패하였습니다.');
            }
        });
    }, []);

    useEffect(() => {
        if (authorization !== "") {
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
                        <div className="card-header">회원가입 (2/3) 본인인증</div>
                        <div className="card-body d-flex justify-content-center align-items-center">
                            <h5 className="card-title">
                                <p className="fs-5 text-dark fw-bold">
                                    회원가입을 위하여<br />
                                    아래의 본인인증하기 버튼을 눌러서<br />
                                    본인인증을 진행하여 주시기 바랍니다.
                                </p>
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
    )
}

export default App;
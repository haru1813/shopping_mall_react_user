import React from 'react';

function App() {
    return (
        <div className="container-fluid ps-4 pt-5 pb-5" style={{ paddingRight: '2.6rem !important' }}>
            <div className="row">
                <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: '80px' }}>
                    <span className="display-5 text-dark fw-bold">404</span>
                </div>
                <div className="col-12" style={{ height: '700px' }}>
                    <div className="card h-100 w-100">
                        <div className="card-header">존재하지 않는 페이지 입니다.</div>
                        <div className="card-body d-flex justify-content-center align-items-center">
                            <h5 className="card-title">
                                <p className="fs-5 text-dark fw-bold">경로를 다시 한번 확인하여 주십시오.</p>
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;
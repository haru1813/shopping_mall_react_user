import React from 'react';

const Footer = () => {
  return (
    <nav className="navbar border-top border-1 border-secondary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/"> {/* Added href for accessibility */}
          <p className="display-5 text-primary fw-bold">
            HARU MARKET
          </p>
          <p className="display-7 text-dark">
            COMPANY : ㈜ 하루 컴퍼니 OWNER : 박하루 ADDRESS : 경기도 안양시<br />
            BUSINESS LICENSE : 000-00-00000
          </p>
        </a>
      </div>
    </nav>
  );
};

export default Footer;
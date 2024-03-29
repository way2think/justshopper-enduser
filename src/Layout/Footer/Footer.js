import React from "react";
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";
import "./Footer.css";

export default function Footer() {
  return (
    <MDBFooter
      bgColor="black"
      className="text-center text-lg-start text-muted p-4"
    >
      {/* <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div className="me-5 d-none d-lg-block">
          <span>Get connected with us on social networks:</span>
        </div>

        <div>
          <a href="" className="me-4 text-reset">
            <MDBIcon fab icon="facebook-f" />
          </a>
          <a href="" className="me-4 text-reset">
            <MDBIcon fab icon="twitter" />
          </a>
          <a href="" className="me-4 text-reset">
            <MDBIcon fab icon="google" />
          </a>
          <a href="" className="me-4 text-reset">
            <MDBIcon fab icon="instagram" />
          </a>
          <a href="" className="me-4 text-reset">
            <MDBIcon fab icon="linkedin" />
          </a>
          <a href="" className="me-4 text-reset">
            <MDBIcon fab icon="github" />
          </a>
        </div>
      </section> */}

      <section className="">
        <MDBContainer className="text-center text-md-start mt-5">
          <MDBRow className="mt-3">
            <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4 companylogo">
              {/* <h6 className="text-uppercase fw-bold mb-4">
                <MDBIcon icon="gem" className="me-3" />
                Company name
              </h6> */}
              <img src="../images/JS logo png.png" alt="" className="jslogo" />
              <p className="companydesc">
                Here you can use rows and columns to organize your footer
                content. Lorem ipsum dolor sit amet, consectetur adipisicing
                elit.
              </p>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4 producthead">
                Products
              </h6>
              <p className="linkcontent">
                <a href="#!" className="text-reset">
                  Home
                </a>
              </p>
              <p className="linkcontent">
                <a href="#!" className="text-reset">
                  Shop by Category
                </a>
              </p>
              <p className="linkcontent">
                <a href="#!" className="text-reset">
                  Contact Us
                </a>
              </p>
              {/* <p className="linkcontent">
                <a href="#!" className="text-reset">
                  Laravel
                </a>
              </p> */}
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4 producthead">
                Useful links
              </h6>
              <p className="linkcontent">
                <a href="#!" className="text-reset ">
                  Cart
                </a>
              </p>
              <p className="linkcontent">
                <a href="#!" className="text-reset">
                  Wishlist
                </a>
              </p>
              <p className="linkcontent">
                <a href="#!" className="text-reset">
                  Privacy Policy
                </a>
              </p>
              <p className="linkcontent">
                <a href="#!" className="text-reset">
                  Terms & Condition
                </a>
              </p>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4 producthead">
                Contact
              </h6>
              <p className="linkcontent">
                <MDBIcon icon="home" className="me-2" />
                Chennai
              </p>
              <p className="linkcontent">
                <MDBIcon icon="envelope" className="me-3" />
                <a
                  className="linkcontent"
                  href="mailto:justshopperofficial@gmail.com"
                >
                  {" "}
                  justshopperofficial@gmail.com
                </a>
              </p>
              <p className="linkcontent">
                <MDBIcon icon="phone" className="me-3" />{" "}
                <a href="tel:+91 7760888801" className="linkcontent">
                  +91 77608 88801
                </a>
              </p>
              {/* <p>
                <MDBIcon icon="print" className="me-3" /> + 01 234 567 89
              </p> */}
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
      <section className="d-flex justify-content-center justify-content-lg-between p-4 align-items-center rights">
        <div className="text-center p-4  copy">
          © 2024 Copyright JustShopper
          {/* <a className="text-reset fw-bold " href="https://mdbootstrap.com/">
           
          </a> */}
        </div>
        <div className="socialflex d-flex">
          <a href="" className="  socialicon">
            {/* <MDBIcon fab icon="facebook-f" /> */}
            <img src="../images/Facebook F.png" alt="" className="sociallink"  />
          </a>
          <a href="" className=" socialicon">
            {/* <MDBIcon fab icon="twitter" /> */}
            <img src="../images/YouTube.png" alt="" className="sociallink"  />
          </a>
          {/* <a href="" className=" socialicon">
            <MDBIcon fab icon="google" />
            <img src="../images/TwitterX.png" alt="" className="sociallink"  />
          </a> */}
          <a href="" className=" socialicon">
            {/* <MDBIcon fab icon="instagram" /> */}
            <img src="../images/Instagram.png" alt="" className="sociallink"  />
          </a>
          <a href="" className=" socialicon">
            {/* <MDBIcon fab icon="linkedin" /> */}
            {/* <img src="../images/LinkedIn.png" alt="" className="sociallink"  /> */}
          </a>
          <a href="" className=" socialicon">
            {/* <MDBIcon fab icon="github" /> */}
          </a>
        </div>
      </section>
    </MDBFooter>
  );
}

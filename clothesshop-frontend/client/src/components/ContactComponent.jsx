import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import '../styles/Contact.css';

const ContactComponent = () => {
  return (
    <Container className="contact-container py-5">
      <Row className="mb-5">
        <Col className="text-center">
          <h1 className="contact-title">Liên Hệ Với Chúng Tôi</h1>
          <p className="contact-subtitle">Chúng tôi luôn sẵn sàng hỗ trợ bạn!</p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={4} className="contact-info-item">
          <div className="text-center">
            <FaPhone className="contact-icon" />
            <h3>Điện thoại</h3>
            <p>+84 123 456 789</p>
            <p>+84 987 654 321</p>
          </div>
        </Col>
        <Col md={4} className="contact-info-item">
          <div className="text-center">
            <FaEnvelope className="contact-icon" />
            <h3>Email</h3>
            <p>support@clothesshop.com</p>
            <p>info@clothesshop.com</p>
          </div>
        </Col>
        <Col md={4} className="contact-info-item">
          <div className="text-center">
            <FaMapMarkerAlt className="contact-icon" />
            <h3>Địa chỉ cửa hàng</h3>
            <p>18A đường Cộng Hòa, Phường 02, Quận Tân Bình</p>
            <p>TP. Hồ Chí Minh, Việt Nam</p>
          </div>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col className="text-center">
          <h2 className="social-title">Theo dõi chúng tôi</h2>
          <p className="social-subtitle">Cập nhật những xu hướng thời trang mới nhất</p>
        </Col>
      </Row>

      <Row className="social-links">
        <Col md={3} className="social-item">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="social-icon facebook" />
            <span>Facebook</span>
          </a>
        </Col>
        <Col md={3} className="social-item">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="social-icon instagram" />
            <span>Instagram</span>
          </a>
        </Col>
        <Col md={3} className="social-item">
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
            <FaTiktok className="social-icon tiktok" />
            <span>TikTok</span>
          </a>
        </Col>
        <Col md={3} className="social-item">
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <FaYoutube className="social-icon youtube" />
            <span>YouTube</span>
          </a>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col className="text-center shop-info">
          <h2 className="mb-4">Giờ mở cửa</h2>
          <p>Thứ 2 - Thứ 6: 9:00 - 21:00</p>
          <p>Thứ 7 - Chủ nhật: 9:00 - 22:00</p>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactComponent;

// src/components/FooterComponent.js

import React from 'react';
import '../styles/Footer.css';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const FooterComponent = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">ClothesShop</div>
        <div className="footer-socials">
          <a href="https://facebook.com" className="footer-icon" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://instagram.com" className="footer-icon" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://twitter.com" className="footer-icon" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
        </div>
        <p>&copy; 2024 ClothesShop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default FooterComponent;

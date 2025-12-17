// src/components/About.jsx

import React from 'react';

const About = () => {
  return (
    <div style={{ padding: '10px 5px', color: '#4a4a4a', lineHeight: '1.8' }}>
      
      {/* --- ヘッダー部分 --- */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ color: '#0066cc', marginBottom: '10px' }}>Uni-Port</h2>
        <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
          学生と地域をつなぐ、<br />温かい『港（ポート）』へようこそ。
        </p>
      </div>

      {/* --- Mission --- */}
      <section style={sectionStyle}>
        <h3 style={headingStyle}>⚓ 私たちのミッション</h3>
        <p>
          <strong>「誰もが羽を休められる、第3の居場所をつくる」</strong><br />
          UniPort（ユニポート）は、University（大学）とPort（港）を掛け合わせた造語です。
          学校や家庭、職場で頑張る皆さんが、ふと立ち寄ってエネルギーをチャージできる。そんな「港」のような場所を目指しています。
        </p>
      </section>

      {/* --- Activities --- */}
      <section style={sectionStyle}>
        <h3 style={headingStyle}>📝 主な活動内容</h3>
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>☕ 学生カフェの運営</h4>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            地域の方々と学生がフラットに交流できる場として、定期的にカフェをオープンしています。
          </p>
        </div>
        <div>
          <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>🏫 フリースクール支援</h4>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            「自由室みちの」と連携し、不登校の子どもたちの学習支援や居場所づくりを行っています。大学生だからこそできる「ナナメの関係」を大切にしています。
          </p>
        </div>
      </section>

      {/* --- Footer / Link --- */}
      <div style={{ textAlign: 'center', marginTop: '40px', padding: '20px', borderTop: '1px solid #eee' }}>
        <p style={{ fontWeight: 'bold' }}>＼ 活動の様子を発信中！ ／</p>
        <a 
          href="https://www.instagram.com/uni_port_ibaraki?igsh=MXZtdDRuZTh0bDRiaA%3D%3D&utm_source=qr" 
          target="_blank" 
          rel="noopener noreferrer"
          style={instagramButtonStyle}
        >
          Instagramを見る
        </a>
        <p style={{ fontSize: '0.8rem', marginTop: '20px', color: '#888' }}>
          メンバーも募集中です。<br/>興味のある方はスタッフまで！
        </p>
      </div>

    </div>
  );
};

// --- スタイル定義 ---
const sectionStyle = {
  marginBottom: '40px',
  textAlign: 'left',
};

const headingStyle = {
  borderBottom: '2px solid #FF9800',
  paddingBottom: '5px',
  marginBottom: '15px',
  fontSize: '1.2rem',
  color: '#333'
};

const instagramButtonStyle = {
  display: 'inline-block',
  backgroundColor: '#E1306C',
  color: 'white',
  padding: '12px 30px',
  borderRadius: '30px',
  textDecoration: 'none',
  fontWeight: 'bold',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  marginTop: '10px'
};

export default About;
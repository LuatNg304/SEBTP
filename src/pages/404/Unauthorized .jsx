import React from "react";

const Unauthorized = () => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Ảnh động chó lườm hoặc chặn cửa */}
        <img 
          src="https://media.giphy.com/media/3ohs4qw8hkPShGeanS/giphy.gif" 
          alt="Naughty Dog" 
          style={styles.img}
        />
        
        <h1 style={styles.headline}>Suỵt! Khu vực riêng tư</h1>
        <p style={styles.desc}>
          Xin lỗi nha, nhưng chú chó bảo vệ nói rằng bạn không có tên trong danh sách khách mời.
        </p>
        
        <p style={styles.code}>Error Code: 403</p>

        <a href="/" style={styles.link}>
          Mang tôi về nơi an toàn
        </a>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#ffecd2", // Màu pastel nhẹ
    fontFamily: "'Verdana', sans-serif",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
    maxWidth: "450px",
  },
  img: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "25px",
  },
  headline: {
    color: "#4a4a4a",
    fontSize: "26px",
    margin: "0 0 15px 0",
  },
  desc: {
    color: "#7a7a7a",
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "10px",
  },
  code: {
    fontSize: "14px",
    color: "#ccc",
    marginBottom: "30px",
    fontWeight: "bold",
  },
  link: {
    display: "inline-block",
    backgroundColor: "#ff6b6b",
    color: "white",
    textDecoration: "none",
    padding: "12px 30px",
    borderRadius: "50px",
    fontSize: "16px",
    fontWeight: "600",
    boxShadow: "0 5px 15px rgba(255, 107, 107, 0.4)",
    transition: "transform 0.2s",
  }
};

export default Unauthorized;
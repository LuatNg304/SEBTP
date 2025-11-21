import React from "react";

const NotFound = () => {
  return (
    <div style={{...styles.container, backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div style={styles.overlay}>
        <h1 style={styles.bigText}>404</h1>
        <h2 style={styles.subText}>OOP, chúng ta có vấn đề rồi!</h2>
        <p style={styles.paragraph}>Đi đâu vậy sai đường về đi.</p>
        
        <button 
            style={styles.btn}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            onClick={() => window.location.href = '/'}
        >
           Ê bậy rồi nha, đi về thâu!!!!!!
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Arial', sans-serif",
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "40px 60px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    maxWidth: "500px",
  },
  bigText: {
    fontSize: "100px",
    margin: 0,
    color: "#333",
    lineHeight: "1",
  },
  subText: {
    fontSize: "22px",
    marginTop: "10px",
    color: "#e74c3c",
  },
  paragraph: {
    color: "#666",
    marginBottom: "30px",
  },
  btn: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "15px 30px",
    border: "none",
    borderRadius: "50px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "transform 0.2s ease",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
  }
};

export default NotFound;
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Navigation from "./Navigation/Nav";
import Products from "./Products/Products";
import products from "./db/data";
import Recommended from "./Recommended/Recommended";
import Sidebar from "./Sidebar/Sidebar";
import Card from "./components/Card";
import "./index.css";

function App() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState("");

  // Handle input search
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const filteredItems = products.filter(
    (product) => product.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
  );

  // Handle category filter change
  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Handle button filtering
  const handleClick = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Filter products based on input and category
  function filteredData(products, selected, query) {
    let filteredProducts = products;

    if (query) {
      filteredProducts = filteredItems;
    }

    if (selected) {
      filteredProducts = filteredProducts.filter(
        ({ category, color, company, newPrice, title }) =>
          category === selected ||
          color === selected ||
          company === selected ||
          newPrice === selected ||
          title === selected
      );
    }

    return filteredProducts.map(
      ({ img, title, star, reviews, prevPrice, newPrice }) => (
        <Card
          key={Math.random()}
          img={img}
          title={title}
          star={star}
          reviews={reviews}
          prevPrice={prevPrice}
          newPrice={newPrice}
        />
      )
    );
  }

  const result = filteredData(products, selectedCategory, query);

  // --------------- LOGIN PAGE ---------------
  if (!isAuthenticated) {
    return (
      <div style={loginPageContainer}>
        <div style={loginCard}>
        <img
          src="https://i.pinimg.com/736x/c3/b3/14/c3b3146e35033a66d563dbce4e53a0b7.jpg"
          alt="Logo"
          style={logoStyle}
        />
          <h2 style={loginTitle}>WELCOME    </h2>
          <p style={loginSubtitle}>Sign in to your account</p>

          <button onClick={() => loginWithRedirect()} style={loginButton}>
            Login
          </button>
        </div>
      </div>
    );
  }

  // --------------- MAIN APP PAGE ---------------
  return (
    <>
      <Navigation query={query} handleInputChange={handleInputChange} />

      {/* Logout Button */}
      <div style={{ textAlign: "right", padding: "10px" }}>
        <span>Welcome, {user.name}</span>
        <button onClick={() => logout({ returnTo: window.location.origin })} style={logoutButtonStyle}>
          Logout
        </button>
      </div>

      <Sidebar handleChange={handleChange} />
      <Recommended handleClick={handleClick} />
      <Products result={result} />
    </>
  );
}

// Styles
const loginPageContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/002/006/967/non_2x/young-women-takes-a-shopping-cart-and-enjoy-online-shopping-through-smartphones-choose-to-buy-gifts-valentine-s-day-concepts-website-or-mobile-phone-application-flat-design-illustration-vector.jpg')",
  backgroundSize: "100% 100%",
  backgroundPosition: "center",
  position: "relative",
  
};

const overlay = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay for better contrast
};

const loginCard = {
  width: "400px",
  padding: "30px",
  backgroundColor: "white",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
};

const logoStyle = {
  width: "350px",
  height: "250px",
};

const loginTitle = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "10px",
  color: "#333",
};

const loginSubtitle = {
  fontSize: "14px",
  color: "#777",
  marginBottom: "20px",
};

const loginButton = {
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  width: "100%",
  marginBottom: "10px",
};

const signupText = {
  fontSize: "14px",
  color: "#555",
};

const signupLink = {
  color: "#007bff",
  textDecoration: "none",
  fontWeight: "bold",
};

const logoutButtonStyle = {
  padding: "5px 10px",
  marginLeft: "10px",
  cursor: "pointer",
  backgroundColor: "red",
  color: "white",
  border: "none",
  borderRadius: "5px",
};

export default App;
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
      <div style={loginPageStyle}>
        <h1>Welcome to Our Store</h1>
        <p>Please login to continue</p>
        <button onClick={() => loginWithRedirect()} style={buttonStyle}>
          Login / Signup
        </button>
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
const loginPageStyle = {
  textAlign: "center",
  marginTop: "100px",
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
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

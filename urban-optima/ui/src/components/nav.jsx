import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";

function BasicNavbar({ scrollToSection, refs }) {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (ref) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        scrollToSection(ref);
      }, 150); // Adjust as needed
    } else {
      scrollToSection(ref);
    }
  };

  return (
    <Navbar
      expand="lg"
      fixed="top" // ✅ Use Bootstrap's fixed positioning
      className={`z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="font-semibold font-Limelight mt-2">
          <h4 className={` bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900 text-transparent bg-clip-text `}>
            UrbanOptima
          </h4>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => handleNavClick(refs.homeRef)}>Home</Nav.Link>
            <Nav.Link onClick={() => handleNavClick(refs.dashRef)}>Dashboard</Nav.Link>
            <Nav.Link onClick={() => handleNavClick(refs.aboutRef)}>About Us</Nav.Link>
            <Nav.Link onClick={() => handleNavClick(refs.teamRef)}>Team</Nav.Link>
            <NavDropdown title="Services" id="basic-nav-dropdown">
              <NavDropdown.Item href="#prediction">Prediction</NavDropdown.Item>
              <NavDropdown.Item href="#chatbot">ChatBot</NavDropdown.Item>
              <NavDropdown.Item href="#results">Results</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#contact">Contact Us</Nav.Link>
            <Nav.Link as={Link} to="/signin">Signin</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicNavbar;

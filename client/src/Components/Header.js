import { Navbar, Nav, NavItem } from "reactstrap";
import logo from "../Images/logo-t.png";
import { Link } from "react-router-dom";

const Header = () => {
 
  return (
    <>
      <Navbar className="header">
        <Nav>
          <NavItem>
            <Link>
              <img src={logo} className="logo" alt=""/>
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/">Home</Link>
          </NavItem>
          <NavItem>
            <Link to="/profile">Profile</Link>
          </NavItem>
          <NavItem>
            <Link>Logout</Link>
          </NavItem>
        </Nav>
      </Navbar>
    </>
  );
};

export default Header;

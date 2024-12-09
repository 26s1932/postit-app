import { Button, Container, Row, Col } from "reactstrap";
import { useEffect, useState } from "react";
import { loginSchemaValidation } from "../Validations/LoginValidation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Features/UserSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // Retrieve the current value of the state and assign it to a variable.
  const { user, msg, isSuccess, isLogin } = useSelector((state) => state.users);
  
  const dispatch = useDispatch();
  const navigate = useNavigate(); // declares a constant variable named navigate and assigns it the value returned by the useNavigate() hook

  // For form validation using react-hook-form
  const {
    register,
    handleSubmit, // Submit the form when this is called
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchemaValidation), // Associate your Yup validation schema using the resolver
  });

  // Handle form submission
  const onSubmit = (data) => {
    // No need to manually extract email and password, react-hook-form gives it directly
    const userData = {
      email: data.email,
      password: data.password,
    };
    dispatch(login(userData));
  };

  useEffect(() => {
    if (isLogin) {
      navigate("/"); // If logged in, navigate to the home page
    } else {
      navigate("/login"); // Otherwise stay on login page
    }
  }, [user, isLogin, navigate]);

  return (
    <Container fluid>
      <Row>
        <Col lg="6">
          {/* Execute first the submitForm function and if validation is good execute the handleSubmit function */}
          <form className="div-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="appTitle"></div>
            <section>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email..."
                  {...register("email")} // react-hook-form handles the value directly
                />
                <p className="error">{errors.email?.message}</p>
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password..."
                  {...register("password")} // react-hook-form handles the value directly
                />
                <p className="error">{errors.password?.message}</p>
              </div>

              <button type="submit" color="primary" className="button">
                Login
              </button>
            </section>
          </form>
        </Col>
        <Col className="columndiv2" lg="6"></Col>
      </Row>

      <Row>
        <div>
          <h3>Server Response</h3>
          <h4>{msg}</h4>
          <h4>{user?.email}</h4>
        </div>
      </Row>
    </Container>
  );
};

export default Login;

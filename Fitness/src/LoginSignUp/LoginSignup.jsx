import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";

const LoginSignup = ({ setIsLoggedIn, setUsername }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [passwordRules, setPasswordRules] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasUppercase: false,
  });
  const [username, setUsernameInput] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage("");
    setOtpSent(false);
    setIsVerified(false);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    checkPasswordStrength(value);
  };

  const checkPasswordStrength = (password) => {
    const rules = {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
    };
    setPasswordRules(rules);

    const strength = Object.values(rules).filter(Boolean).length;

    if (strength === 0) setStrength("");
    else if (strength < 2) setStrength("Weak");
    else if (strength < 4) setStrength("Medium");
    else setStrength("Strong");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:9000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        setMessage("OTP has been sent to your email.");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error signing up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:9000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (data.success) {
        setIsVerified(true);
        setIsLogin(true);
        setMessage("OTP verified! You can now log in.");
        setOtp("");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:9000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success) {
        const token = data.token || "default_token"; 
        const username = data.user.username || "Guest"; 
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("email", data.user.email);
        setUsername(username);
        setMessage("Logged in successfully! Redirecting..");
        setIsLoggedIn(true);
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1000);
      } else {
        setMessage(data.message);
      }
      const event = new Event('cartUpdated');
      window.dispatchEvent(event);
    } catch (error) {
      setMessage("Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-signup-wrapper">
      <div className="login-signup-container">
        <img src="/Main-logo2.png" alt="Logo" className="logo-sign" /> {/* Add your logo here */}
        <div className={`form-container ${isLogin ? "login" : "signup"}`}>
          <h1>{isLogin ? "Login" : "Sign Up"}</h1>
          <form
            className="form"
            onSubmit={isLogin ? handleLogin : handleSignup}
            autoComplete="off"
          >
            {!isLogin && (
              <div className="input-group">
                <User size={20} />
                <input
                  type="text"
                  placeholder="Username"
                  required
                  className="input-field"
                  value={username}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  autoComplete="username"
                  id="username"
                />
                <label htmlFor="username">Username</label>
              </div>
            )}
            <div className="input-group">
              <Mail size={20} />
              <input
                type="email"
                placeholder="Email"
                required
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                id="email"
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="input-group">
              <Lock size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
                className="input-field"
                autoComplete="new-password"
                id="password"
              />
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {!isLogin && !otpSent && (
              <>
                <div className={`password-strength ${strength ? "show" : ""}`}>
                  Password Strength: {strength}
                  <div className="strength-bar">
                    <div
                      className={`strength-progress ${strength.toLowerCase()}`}
                      style={{
                        width: `${
                          (Object.values(passwordRules).filter(Boolean).length /
                            4) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <ul className="password-rules">
                  {Object.entries(passwordRules).map(([rule, isValid]) => (
                    <li key={rule} className={isValid ? "valid" : ""}>
                      <CheckCircle
                        size={16}
                        className={isValid ? "check-icon" : "check-icon hidden"}
                      />
                      {rule === "minLength" && "At least 8 characters"}
                      {rule === "hasNumber" && "At least 1 number"}
                      {rule === "hasSpecialChar" &&
                        "At least 1 special character (!@#$%^&*)"}
                      {rule === "hasUppercase" && "At least 1 uppercase letter"}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {otpSent && !isLogin && !isVerified && (
              <div className="input-group">
                <Lock size={20} />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  required
                  className="input-field"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  autoComplete="off"
                  id="otp"
                />
                <label htmlFor="otp">Enter OTP</label>
              </div>
            )}
            {otpSent && !isLogin && !isVerified ? (
              <button
                onClick={handleOtpVerification}
                className="submit-btn"
                disabled={loading}
              >
                {loading ? <span className="loader" /> : "Verify OTP"}
              </button>
            ) : (
              <button className="submit-btn" disabled={loading}>
                {loading ? (
                  <span className="loader" />
                ) : isLogin ? (
                  "Login"
                ) : (
                  "Sign Up"
                )}
              </button>
            )}
          </form>
          <p onClick={toggleForm} className="toggle-link">
            {isLogin
              ? "Don't have an account? Sign Up here"
              : "Already have an account? Login here"}
          </p>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;

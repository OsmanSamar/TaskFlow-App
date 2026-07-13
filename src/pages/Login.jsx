
import "./Login.css";
const Login = ({ loginData, setLoginData, handleLogin }) => {
  return (
    <div className="login-container">
      <h1>Login Page</h1>
      <div>
        <input
          type="text"
          className="e-mail"
          value={loginData.email}
          onChange={(e) => {
            setLoginData({ ...loginData, email: e.target.value });
          }}
        />
        <input
          type="password"
          className="password"
          value={loginData.password}
          onChange={(e) => {
            setLoginData({ ...loginData, password: e.target.value });
          }}
        />

        <div>Remember me Forgot password?</div>

        <button type="button" className="sign-btn"
        onClick={handleLogin}
        >
          Login
        </button>
        <div>Dont have an account? Register</div>
      </div>
    </div>
  );
};

export default Login;

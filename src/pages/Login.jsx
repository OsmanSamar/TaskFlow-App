const Login = ({ eMail, setEmail, passWord, setPassWord }) => {
  return (
    <div className="login-container">
      <h1>Login Page</h1>
      <div>
        <input
          type="text"
          className="e-mail"
          value={eMail}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="text"
          className="password"
          value={passWord}
          onChange={(e) => {
            setPassWord(e.target.value);
          }}
        />

        <div>
          Remember me 
          Forgot password?
        </div>

        <button type="button" className="sign-btn">
          Login
        </button>
        <div>
          Dont have an account? Register
        </div>
      </div>
    </div>
  );
};

export default Login;


// TODO later
const SpinnerLoad = () => {
  return (
    <div>SpinnerLoad</div>
  )
}

export default SpinnerLoad

// const [loading, setLoading] = useState(false);

// const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     setLoading(true);
  
//     try {
//       await login(formData);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };
// Then disable the button while the request is in progress:


//  <button disabled={loading}>
//   {loading ? "Signing in..." : "Sign In"}
//   </button>
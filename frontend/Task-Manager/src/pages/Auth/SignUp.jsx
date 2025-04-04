import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from "../../utils/apiPaths"; 
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadimage';


function SignUp() {

  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminInviteToken, setAdminInviteToken] = useState('');

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let ProfileImageUrl=""

    if (!fullName) {
      setError("Please enter full name.");
      return;
    }
  
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
  
    setError(null); // Clear previous errors
    console.log('Logging in with:', email, password);
  
    // Proceed with API call

    try {

      //Upload image if present
      if(profilePic){
        const imgUploadRes=await uploadImage(profilePic)
        ProfileImageUrl=imgUploadRes.imageUrl||""
      }
      const response=await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        name:fullName,
        email,
        password,
        ProfileImageUrl,
        adminInviteToken
      })

      const {token,role}=response.data
      if(token){
        localStorage.setItem("token",token)
        updateUser(response.data)

        if(role==="admin"){
          navigate("/admin/dashboard"); 
        }else{
          navigate("/user/dashboard");
        }
      }

    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong. Please try again later.");
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-full h-auto md:h-full mt-10 md:mt-0 flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below.
        </p>
        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input value={fullName} 
              onChange={({target})=>setFullName(target.value)}
              label="Full Name"
              placeholder="John"
              type="text"
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="text"
              label="Email"
              className="w-full p-3 bg-gray-200 rounded-[12px] mb-3 focus:outline-none"
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-200 rounded-[12px] focus:outline-none mb-2"
              required
            />
             <Input
              type="text"
              placeholder="6 Digit code"
              value={adminInviteToken}
              label="Admin invite token"
              onChange={(e) => setAdminInviteToken(e.target.value)}
              className="w-full p-3 bg-gray-200 rounded-[12px] focus:outline-none mb-2"
              required
            />

          </div>
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="w-full text-sm font-medium text-white bg-blue-500 shadow-purple-600/5 p-2 rounded-md my-1 hover:bg-blue-300 hover:text-blue-800 cursor-pointer">
            SignUp
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already an account?{" "}
            <Link to="/login" className="font-medium text-primary underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp;



/////]

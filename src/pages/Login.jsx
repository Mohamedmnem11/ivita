import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginWhatsApp, setPhone, clearError } from '../redux/slices/authSlice';
import { FaWhatsapp } from 'react-icons/fa';
import ivitaImg from '../assets/images/ivita.png';
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, phone } = useSelector((state) => state.auth);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (phone) navigate('/verify-whatsapp');
  }, [phone, navigate]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
    setPhoneError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber) {
      setPhoneError('Phone number is required');
      return;
    }

    if (!/^\d{12}$/.test(phoneNumber)) {
      setPhoneError('Phone must be exactly 12 digits (e.g., 201011111111)');
      return;
    }

    try {
      await dispatch(loginWhatsApp({ phone: phoneNumber })).unwrap();
      dispatch(setPhone(phoneNumber));
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--secondary-color)] px-4">
      <div className="w-full max-w-md bg-[var(--color-bg-base)] rounded-xl shadow-lg p-6 border border-[var(--color-primary)]">

         <div className="flex justify-center mb-4">
                   <img src={ivitaImg} alt="Register" className="h-24" />
                 </div>
         
                 <h2 className="text-xl font-bold text-center text-[var(--color-text)] mb-1">
                   Welcome Back
                 </h2>
               
      
        <div className="flex justify-center mb-4">
          <FaWhatsapp className="text-6xl text-green-500 shadow-lg rounded-full p-2" />
        </div>

        
        <h2 className="text-2xl font-bold text-center text-[var(--color-primary)]">
          Login with WhatsApp
        </h2>
        <p className="text-center text-sm text-gray-500 mt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-[var(--color-primary)] hover:underline">
            Create one
          </Link>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {/* Phone Input */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">
              <FaWhatsapp size={16} />
            </span>
            <input
              type="text"
              value={phoneNumber}
              onChange={handleChange}
              maxLength="12"
              placeholder="201011111111"
              className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
                ${phoneError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
              `}
            />
            {phoneError && (
              <p className="text-xs text-red-500 mt-1">{phoneError}</p>
            )}
          </div>

          <p className="text-xs text-gray-500 text-center">
            We'll send you a verification code via WhatsApp
          </p>

          {/* API Error */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-2 rounded-md text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md text-white text-sm font-semibold
            bg-[var(--color-primary)] hover:opacity-90 transition"
          >
            {loading ? 'Sending Code...' : 'Send WhatsApp Code'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

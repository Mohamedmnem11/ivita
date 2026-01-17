import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyWhatsAppOTP, clearError } from '../redux/slices/authSlice';
import { FaWhatsapp } from 'react-icons/fa';

const VerifyWhatsApp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, phone, isAuthenticated } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const inputsRef = useRef([]);

  useEffect(() => {
    if (!phone) navigate('/login');
  }, [phone, navigate]);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setOtpError('OTP must be 6 digits');
      return;
    }

    try {
      await dispatch(verifyWhatsAppOTP({ phone, otp: otpValue })).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--secondary-color)] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-[var(--color-primary)]">

        <div className="flex justify-center mb-4">
          <FaWhatsapp className="text-6xl text-green-500 shadow-lg rounded-full p-2" />
        </div>

      <h2 className="text-2xl font-bold text-center text-[var(--color-primary)]">
          Verify WhatsApp Code
        </h2>
        <p className="text-center text-sm text-gray-500 mt-2">
          Enter the 6-digit code sent to <span className="font-medium">{phone}</span>
        </p>

        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-12 h-14 text-center text-2xl font-bold border rounded-lg
                  focus:outline-none focus:ring-2
                  ${otpError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-[var(--color-primary)]'}
                `}
              />
            ))}
          </div>

     
          {otpError && (
            <p className="text-sm text-center text-red-500">{otpError}</p>
          )}

         
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md text-center">
              {error}
            </div>
          )}

        
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md text-white font-semibold
              bg-[var(--color-primary)] hover:opacity-90 transition"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyWhatsApp;

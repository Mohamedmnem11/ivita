import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate ,Link} from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
} from 'react-icons/fa';
import InputWrapper from '../components/InputWrapper';

import ivitaImg from '../assets/images/ivita.png';
import { registerUser, setUserId, clearError } from '../redux/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, userId } = useSelector((state) => state.auth);

  /* ================== STATE ================== */
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    terms: false,
  });

  const [formErrors, setFormErrors] = useState({});

  /* ================== EFFECTS ================== */
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (userId) navigate('/verify');
  }, [userId, navigate]);

  /* ================== VALIDATION ================== */
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'first_name':
      case 'last_name':
        if (!value.trim()) error = 'Required';
        break;

      case 'email':
        if (!value.trim()) error = 'Required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = 'Invalid email';
        break;

      case 'phone':
        if (!value.trim()) error = 'Required';
        else if (!/^\d{12}$/.test(value))
          error = 'Must be 12 digits';
        break;

      case 'password':
        if (!value) error = 'Required';
        else if (value.length < 8)
          error = 'Min 8 characters';
        break;

      case 'confirm_password':
        if (value !== formData.password)
          error = 'Passwords do not match';
        break;

      case 'terms':
        if (!value) error = 'You must accept terms';
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const errors = {};

    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) errors[key] = err;
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ================== HANDLERS ================== */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    const error = validateField(name, fieldValue);
    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(registerUser(formData)).unwrap();
      if (result?.user_id) {
        dispatch(setUserId(result.user_id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--secondary-color)] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-[var(--color-primary)]">

        {/* IMAGE */}
        <div className="flex justify-center mb-4">
          <img src={ivitaImg} alt="Register" className="h-24" />
        </div>

        <h2 className="text-xl font-bold text-center text-[var(--color-primary)] mb-1">
          Join Us
        </h2>
        <p className="text-sm text-center text-gray-500 mb-4">
          Create an account to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* First + Last */}
          <div className="grid grid-cols-2 gap-3">
            <InputWrapper
              icon={FaUser}
              name="first_name"
              placeholder="First name"
              value={formData.first_name}
              onChange={handleChange}
              error={formErrors.first_name}
            />
            <InputWrapper
              icon={FaUser}
              name="last_name"
              placeholder="Last name"
              value={formData.last_name}
              onChange={handleChange}
              error={formErrors.last_name}
            />
          </div>

          <InputWrapper
            icon={FaEnvelope}
            name="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
          />

          <InputWrapper
            icon={FaPhone}
            name="phone"
            placeholder="201011111111"
            value={formData.phone}
            onChange={handleChange}
            maxLength="12"
            error={formErrors.phone}
          />

          <InputWrapper
            icon={FaLock}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
          />

          <InputWrapper
            icon={FaLock}
            type="password"
            name="confirm_password"
            placeholder="Confirm password"
            value={formData.confirm_password}
            onChange={handleChange}
            error={formErrors.confirm_password}
          />

          {/* TERMS */}
          <div>
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={handleChange}
                className="h-4 w-4 text-[var(--color-primary)]"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the Terms & Privacy Policy
              </label>
            </div>
            {formErrors.terms && (
              <p className="text-xs text-red-500 mt-1">
                {formErrors.terms}
              </p>
            )}
          </div>

          {/* API ERROR */}
          {error && (
            <div className="bg-red-50 p-2 rounded text-xs text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md text-white text-sm font-semibold
            bg-[var(--color-primary)] hover:opacity-90 transition"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
           <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary ">
              Sign in
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
};

export default Register;

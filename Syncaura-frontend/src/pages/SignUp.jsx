import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../redux/features/authThunks'
import { UserRound, Mail, LockKeyhole, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaFacebookF } from 'react-icons/fa'
import leftArt from "../assets/left-art.png";
import "./style9.css";

import api from "../config/axios.js";
import { useNavigate } from "react-router-dom";

function PasswordField({
    label,
    value,
    onChange,
    onFocus,
    onBlur
  }) {
  const [visible, setVisible] = useState(false)
return (
  <label className="field">
    <LockKeyhole size={19} strokeWidth={1.8} />

    <input
      type={visible ? "text" : "password"}
      placeholder={label}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      required
    />

    <button
      type="button"
      className="reveal"
      aria-label={`Show ${label}`}
      onClick={() => setVisible(!visible)}
    >
      {visible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </label>
)
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const { isLoading: reduxLoading, error: reduxError } = useSelector((state) => state.auth || {})

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [message, setMessage] = useState('')
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showStrength, setShowStrength] = useState(false);
  const update = key => event => setForm({ ...form, [key]: event.target.value })

  const checkPasswordStrength = (password) => {
  if (!password.trim()) {
    setPasswordStrength("");
    setShowStrength(false);
    return;
  }

  let score = 0;

  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$#!%*?&]/.test(password)) score++;

  if (score <= 2) {
    setPasswordStrength("Weak");
    setShowStrength(true);
  } else if (score <= 4) {
    setPasswordStrength("Medium");
    setShowStrength(true);
  } else {
    setPasswordStrength("Strong");
    setShowStrength(true);
  }
};

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setNameError("");
    setEmailError("");
    setPasswordError("");
    // Validate required fields
    // if (!form.name) {
    if (!form.name.trim()) {
      setNameError("Name is required.");
      return;
    }
	// if (!form.email) {
  if (!form.email.trim()) {
		setEmailError("Email is required.");
		return;
	}
	// Validate email format
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	// if (!emailRegex.test(form.email)) {
  if (!emailRegex.test(form.email.trim())) {
		setEmailError("Invalid email address.");
		return;
	}
    // if (!form.password) {
    if (!form.password.trim()) {
      setPasswordError("Password is required.");
      return;
    }
    // if (!form.confirm) {
    if (!form.confirm.trim()) {
      setPasswordError("Confirm password is required.");
      return;
    }
    // Check password match
    // if (form.password !== form.confirm) {
    if (form.password.trim() !== form.confirm.trim()) {
      setPasswordError("Passwords do not match.");
      return;
    }

    //Validate password strength
    const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&]).{8,}$/;

if (!passwordRegex.test(form.password.trim())) {
  setPasswordError(
    "Password must be at least 8 Characters and include Uppercase Letter, Lowercase Letter, Digit, and Special Character."
  );
  return;
}
   

    setIsLoading(true);
    setMessage("");

    try {
      const data = await dispatch(
        registerUser({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password.trim(),
        })
      ).unwrap()

      console.log("Register success:", data);

      setMessage(t('auth_signup_success'));

      setTimeout(() => {
        const userRole = data?.user?.role || 'user'
        const roleHome = userRole === 'admin' ? '/admin' : userRole === 'co-admin' ? '/co-admin' : '/user-dashboard'
        navigate(roleHome)
      }, 1000)

    } catch (error) {
      console.log("Register error:", error.response?.data);
      // Show specific server error if available, otherwise generic message
      const serverMsg = error.response?.data?.message;
      if (serverMsg) {
        setMessage(serverMsg);
      } else {
        setMessage(t('auth_signup_error'));
      }
    }
    finally {
      setIsLoading(false);
    }
  }

  return <main className="page"><section className="auth-card">
    <aside className="art" aria-hidden="true"><img src={leftArt} alt="" /></aside>
    <div className="form-pane"><form onSubmit={handleSubmit}>
      <p className="eyebrow">{t('auth_signup_eyebrow').toUpperCase()}</p>
      <h1>{t('createAccount')} <em>{t('account_emphasis')}</em></h1>
      <p className="lead">{t('auth_signup_lead')}</p>
      <div className="fields">
<input
  placeholder={t('fullName')}
  value={form.name}
  onChange={update('name')}
  required
/>
{nameError && (
  <p className="field-error">{nameError}</p>
)}

<input
  type="email"
  placeholder={t('emailAddress')}
  value={form.email}
  onChange={update('email')}
  required
/>
{emailError && (
  <p className="field-error">{emailError}</p>
)}

<PasswordField
  label={t('password')}
  value={form.password}
  onFocus={() => {
    if (form.password.trim() !== "") {
      setShowStrength(true);
    }
  }}
  onBlur={() => {
    setShowStrength(false);
  }}
  onChange={(e) => {
    update("password")(e);
    checkPasswordStrength(e.target.value);
  }}
/>

{showStrength && (
  <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
    Password Strength: {passwordStrength}
  </p>
)}

{showStrength && (
  <div className="strength-bar">
    <div className={`strength-fill ${passwordStrength.toLowerCase()}`}>
    </div>
  </div>
)}

{passwordError && (
  <p className="field-error">{passwordError}</p>
)}

<PasswordField
  label={t('confirmPassword')}
  value={form.confirm}
  onChange={update("confirm")}
/>
      </div>
      <label className="check"><input type="checkbox" required /><span>{t('auth_terms_intro')} <a href="#terms">{t('footer_termsOfService')}</a> {t('auth_terms_and')} <a href="#privacy">{t('footer_privacyPolicy')}</a>.</span></label>

      <button className="submit" type="submit" disabled={isLoading}>
        {isLoading ? t('auth_creating_account') : t('createAccount')}
      </button>

      {message && <p className="message" role="status">{message}</p>}
      <div className="divider"><span>{t('orContinueWith').toUpperCase()}</span></div>
      <div className="socials">
        <button type="button" aria-label={t('continue_with_google')}><FcGoogle size={23} /></button>
        <button type="button" aria-label={t('continue_with_github')}><FaGithub size={22} /></button>
        <button type="button" className="facebook" aria-label={t('continue_with_facebook')}><FaFacebookF size={19} /></button>
      </div>
      <p className="switch">{t('alreadyHaveAccount')} <a href="/signin">{t('login')}</a></p>
    </form></div>
  </section></main>
} 

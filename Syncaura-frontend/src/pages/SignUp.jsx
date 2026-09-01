import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../redux/features/authThunks'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { UserRound, Mail, LockKeyhole, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaFacebookF } from 'react-icons/fa'
import leftArt from "../assets/left-art.png";
import "./style9.css";
import RoleSelector from "../components/roles/RoleSelector";
import api from "../config/axios.js";
import Spinner from "../components/Spinner"

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
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading: reduxLoading, error: reduxError } = useSelector((state) => state.auth || {})
  const [selectedRole, setSelectedRole] = useState("User");
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const update = key => event => setForm({ ...form, [key]: event.target.value })
  const [showStrength, setShowStrength] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const { t } = useTranslation();

  const handleGoogleLogin = () => {
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
    window.location.href = `${apiBase}/api/auth/google`;
  };

  const handleGithubLogin = () => {
    const state = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("github_oauth_state", state);
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || "dummygithubclientid";
    const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI || "http://localhost:5173/auth/github/callback";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email&state=${state}`;
  };


  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      setMessage("Name is required.")
      return
    }
    if (!form.email.trim()) {
      setMessage("Email is required.")
      return
    }
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email.trim())) {
      setMessage("Invalid email address.")
      return
    }
    if (!form.password.trim()) {
      setMessage("Password is required.")
      return
    }
    if (!form.confirm.trim()) {
      setMessage("Confirm password is required.")
      return
    }
    if (form.password.trim() !== form.confirm.trim()) {
      setMessage("Passwords do not match.")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const data = await dispatch(
        registerUser({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password.trim(),
          role: selectedRole,
        })
      ).unwrap()

      setMessage("Account created successfully!")

      setTimeout(() => {
        const userRole = data?.user?.role || 'user'
        const roleHome = userRole === 'admin' ? '/admin' : userRole === 'co-admin' ? '/co-admin' : '/user-dashboard'
        navigate(roleHome)
      }, 1000)

    } catch (err) {
      const serverMsg = typeof err === "string" ? err : err?.message || reduxError || "Registration failed."
      setMessage(serverMsg)
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadingState = isLoading || reduxLoading

  return (
    <main className="page">
      <section className="auth-card">
        <aside className="art" aria-hidden="true">
          <img src={leftArt} alt="" />
        </aside>
        <div className="form-pane">
          <form onSubmit={handleSubmit}>
            <p className="eyebrow">{t('auth_signup_eyebrow').toUpperCase()}</p>
            <h1>{t('createAccount')} </h1>
            <p className="lead">{t('auth_signup_lead')}</p>
            
            <div className="fields">
              {/* Full Name Input Box Container */}
              <label className="field">
                <UserRound size={19} strokeWidth={1.8} />
                <input
                  type="text"
                  placeholder={t('fullName')}
                  value={form.name}
                  onChange={update('name')}
                  required
                />
              </label>
              {/* {nameError && <p className="field-error">{nameError}</p>} */}

              {/* Email Address Input Box Container */}
              <label className="field">
                <Mail size={19} strokeWidth={1.8} />
                <input
                  type="email"
                  placeholder={t('emailAddress')}
                  value={form.email}
                  onChange={update('email')}
                  required
                />
              </label>
              {/* {emailError && <p className="field-error">{emailError}</p>} */}

              {/* Password Component */}
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
                // onChange={(e) => {
                //   update("password")(e);
                //   checkPasswordStrength(e.target.value);
                // }}
                onChange={update("password")}
              />

              {/* {showStrength && (
                <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
                  Password Strength: {passwordStrength}
                </p>
              )}

              {showStrength && (
                <div className="strength-bar">
                  <div className={`strength-fill ${passwordStrength.toLowerCase()}`}></div>
                </div>
              )}

              {passwordError && <p className="field-error">{passwordError}</p>} */}

              {/* Confirm Password Component */}
              <PasswordField
                label={t('confirmPassword')}
                value={form.confirm}
                onChange={update("confirm")}
              />

              {/* Role based logic registration */}
              <div className="w-full mt-4 text-white">
                <RoleSelector 
                  selectedRole={selectedRole} 
                  onRoleChange={setSelectedRole} 
                />
              </div>
            </div>

            <label className="check">
              <input type="checkbox" required />
              <span>
                {t('auth_terms_intro')}{" "}
                <a href="#terms">{t('footer_termsOfService')}</a>{" "}
                {t('auth_terms_and')}{" "}
                <a href="#privacy">{t('footer_privacyPolicy')}</a>.
              </span>
            </label>

            <button className="submit" type="submit" disabled={loadingState}>
              {loadingState ? (
                <>
                  <Spinner /> <span>{t('auth_creating_account')}</span>
                </>
              ) : (
                <>
                  {t('createAccount')} <ArrowRight size={20} />
                </>
              )}
            </button>

            {message && <p className="message" role="status">{message}</p>}
            
            <div className="divider"><span>{t('orContinueWith').toUpperCase()}</span></div>
            <div className="socials">
              <button type="button" aria-label={t('continue_with_google')} onClick={handleGoogleLogin}><FcGoogle size={23} /></button>
              <button type="button" aria-label={t('continue_with_github')} onClick={handleGithubLogin}><FaGithub size={22} /></button>
              <button type="button" className="facebook" aria-label={t('continue_with_facebook')} onClick={() => toast.info("Facebook registration is not implemented yet. Please use the form above to register.")}><FaFacebookF size={19} /></button>
            </div>
            
            <p className="switch">
              {t('alreadyHaveAccount')}{" "}
              <button type="button" onClick={() => navigate("/signin")}>
                {t('login')}
              </button>
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}

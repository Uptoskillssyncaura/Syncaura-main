import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../redux/features/authThunks'
import { toast } from 'react-toastify'
import { Mail, LockKeyhole, Eye, EyeOff } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaFacebookF } from 'react-icons/fa'
import leftArt from '../assets/left-art.png'
import './style9.css'
import Spinner from '../components/Spinner'

export default function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { isLoading: reduxLoading } = useSelector(
    (state) => state.auth || {}
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const searchParams = new URLSearchParams(location.search)
  const selectedRole = (searchParams.get('role') || 'employee').toLowerCase()

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

  const getLeadText = () => {
    if (selectedRole === 'admin') {
      return 'Enter your admin credentials to continue.'
    }

    if (selectedRole === 'co-admin') {
      return 'Enter your co-admin credentials to continue.'
    }

    return 'Login to continue your journey.'
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!email.trim()) {
      setMessage(t('auth_email_required'))
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email.trim())) {
      setMessage(t('auth_invalid_email'))
      return
    }

    if (!password.trim()) {
      setMessage(t('auth_password_required'))
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const data = await dispatch(
        loginUser({
          email: email.trim(),
          password: password.trim(),
        })
      ).unwrap()

      if (data?.tokens?.accessToken) {
        localStorage.setItem('accessToken', data.tokens.accessToken)
      }

      if (data?.tokens?.refreshToken) {
        localStorage.setItem('refreshToken', data.tokens.refreshToken)
      }

      setMessage(t('auth_login_success'))

      const userRole = data?.user?.role || 'user'

      const roleHome =
        userRole === 'admin'
          ? '/admin'
          : userRole === 'co-admin'
            ? '/co-admin'
            : '/user-dashboard'

      navigate(roleHome)
    } catch (error) {
      setMessage(
        typeof error === 'string'
          ? error
          : error?.message || t('auth_login_error')
      )

      console.log(error)
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
            <h1>
              {selectedRole === 'employee' ? (
                <>
                  {t('welcomeBack')}
                </>
              ) : selectedRole === 'admin' ? (
                'Admin Sign In'
              ) : (
                'Co-Admin Sign In'
              )}
            </h1>

            <p className="lead">
              {selectedRole === 'employee'
                ? t('auth_signin_lead', 'Login to continue your journey.')
                : getLeadText()}
            </p>

            <div className="fields">
              <label className="field">
                <Mail size={19} strokeWidth={1.8} />

                <input
                  type="email"
                  placeholder={t('emailAddress')}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>

              <label className="field">
                <LockKeyhole size={19} strokeWidth={1.8} />

                <input
                  type={visible ? 'text' : 'password'}
                  placeholder={t('password')}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />

                <button
                  type="button"
                  className="reveal"
                  aria-label={t('show_password')}
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </label>
            </div>

            <div className="options">
              <label className="check">
                <input type="checkbox" defaultChecked />
                <span>{t('remember_me')}</span>
              </label>

              <a href="#forgot">{t('forgotPassword')}</a>
            </div>

            <button
              className="submit"
              type="submit"
              disabled={loadingState}
            >
              {loadingState ? (
                <>
                  <Spinner />
                  <span>{t('auth_logging_in')}</span>
                </>
              ) : (
                t('login')
              )}
            </button>

            {message && (
              <p className="message" role="status">
                {message}
              </p>
            )}

            <div className="divider">
              <span>{t('orContinueWith').toUpperCase()}</span>
            </div>

            <div className="socials">
              <button
                type="button"
                aria-label={t('continue_with_google')}
                onClick={handleGoogleLogin}
              >
                <FcGoogle size={23} />
              </button>

              <button
                type="button"
                aria-label={t('continue_with_github')}
                onClick={handleGithubLogin}
              >
                <FaGithub size={22} />
              </button>

              <button
                type="button"
                className="facebook"
                aria-label={t('continue_with_facebook')}
                onClick={() => toast.info("Facebook login is not implemented yet. Please use the form above to log in.")}
              >
                <FaFacebookF size={19} />
              </button>
            </div>

            <p className="switch">
              {t('dontHaveAccount')}{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
              >
                {t('signUp')}
              </button>
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}
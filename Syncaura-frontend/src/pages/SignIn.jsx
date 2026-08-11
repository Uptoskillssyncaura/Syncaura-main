import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../redux/features/authThunks'
import { Mail, LockKeyhole, Eye, EyeOff } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaFacebookF } from 'react-icons/fa'
import leftArt from "../assets/left-art.png"
import "./style9.css"
import Spinner from "../components/Spinner"

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isLoading: reduxLoading } = useSelector(
    (state) => state.auth || {}
  );

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setPasswordError("");

    if (!email.trim()) {
      setMessage(t('auth_email_required'));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setMessage(t('auth_invalid_email'));
      return;
    }
    if (!password.trim()) {
      setMessage(t('auth_password_required'));
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const data = await dispatch(
        loginUser({
          email: email.trim(),
          password: password.trim(),
        })
      ).unwrap();

      if (data?.tokens?.accessToken) {
        localStorage.setItem("accessToken", data.tokens.accessToken);
      }
      if (data?.tokens?.refreshToken) {
        localStorage.setItem("refreshToken", data.tokens.refreshToken);
      }

      setMessage(t('auth_login_success'));
      const userRole = data?.user?.role || 'user';
      const roleHome = userRole === 'admin' ? '/admin' : userRole === 'co-admin' ? '/co-admin' : '/user-dashboard';
      navigate(roleHome);
    } catch (error) {
      setMessage(
        typeof error === "string"
          ? error
          : error?.message || t("auth_login_error")
      );
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return <main className="page"><section className="auth-card">
    <aside className="art" aria-hidden="true"><img src={leftArt} alt="" /></aside>
    <div className="form-pane"><form onSubmit={handleSubmit}>
      <h1>{t('welcomeBack')} <em>{t('welcomeBackEmphasis')}</em></h1>
      <p className="lead">{t('auth_signin_lead')}</p>
      <div className="fields">
        <label className="field"><Mail size={19} strokeWidth={1.8} /><input type="email" placeholder={t('emailAddress')} value={email} onChange={event => setEmail(event.target.value)} required /></label>
        <label className="field"><LockKeyhole size={19} strokeWidth={1.8} /><input type={visible ? 'text' : 'password'} placeholder={t('password')} value={password} onChange={event => setPassword(event.target.value)} required /><button type="button" className="reveal" aria-label={t('show_password')} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></label>
      </div>
      <div className="options"><label className="check"><input type="checkbox" defaultChecked /><span>{t('remember_me')}</span></label><a href="#forgot">{t('forgotPassword')}</a></div>

      <button
        className="submit"
        type="submit"
        disabled={isLoading || reduxLoading}
      >
        {isLoading || reduxLoading ? <><Spinner /> <span>{t('auth_logging_in')}</span></> : t('login')}
      </button>

      {message && <p className="message" role="status">{message}</p>}
      <div className="divider"><span>{t('orContinueWith').toUpperCase()}</span></div>
      <div className="socials"><button type="button" aria-label={t('continue_with_google')}><FcGoogle size={23} /></button><button type="button" aria-label={t('continue_with_github')}><FaGithub size={22} /></button><button type="button" className="facebook" aria-label={t('continue_with_facebook')}><FaFacebookF size={19} /></button></div>

      <p className="switch">
        {t('dontHaveAccount')}{" "}
        <button
          type="button"
          onClick={() => navigate("/signup")}
        >
          {t('signUp')}
        </button>
      </p>
    </form></div>
  </section></main>
}

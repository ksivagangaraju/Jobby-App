import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const {history} = props
  const clickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="header-container">
      <Link to="/" className="nav-link">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website-logo"
        />
      </Link>
      <div className="menu-logout-container">
        <ul className="menus-container">
          <li className="menu">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="menu">
            <Link to="/jobs" className="nav-link">
              Jobs
            </Link>
          </li>
          <li className="menu-logout">
            <button type="button" className="logout-btn" onClick={clickLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
      <div className="mobile-menus-container">
        <Link to="/" className="nav-link">
          <AiFillHome className="menu-icon" />
        </Link>
        <Link to="/jobs" className="nav-link">
          <BsFillBriefcaseFill className="menu-icon" />
        </Link>
        <FiLogOut type="button" className="logout-icon" onClick={clickLogout} />
      </div>
    </nav>
  )
}

export default withRouter(Header)

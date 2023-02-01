import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <div className="home-bg-container">
    <Header />
    <div className="home-container">
      <div className="home">
        <h1 className="home-heading">Find The Job That Fits Your Life</h1>
        <p className="home-description">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job the fits your abilities and potential.
        </p>
        <Link to="/jobs" className="nav-link">
          <button type="button" className="jobs-btn">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </div>
)

export default Home

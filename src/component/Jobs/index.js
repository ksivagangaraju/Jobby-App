import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch, BsStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN PROGRESS',
}

export default class Jobs extends Component {
  state = {
    apiStatusProfile: apiStatusConstant.initial,
    apiStatusJobs: apiStatusConstant.initial,
    employmentType: [],
    minPackage: '',
    searchJob: '',
    profileData: {},
    jobsData: [],
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({apiStatusProfile: apiStatusConstant.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedProfileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        apiStatusProfile: apiStatusConstant.success,
        profileData: updatedProfileData,
      })
    }
  }

  getJobsData = async () => {
    this.setState({apiStatusJobs: apiStatusConstant.inProgress})
    const {employmentType, minPackage, searchJob} = this.state
    const empType = employmentType.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${empType}&minimum_package=${minPackage}&search=${searchJob}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        apiStatusJobs: apiStatusConstant.success,
        searchJob: '',
        jobsData: updatedData,
      })
    } else {
      this.setState({apiStatusJobs: apiStatusConstant.failure})
    }
  }

  renderProfileSuccessView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <div className="profile-background">
      <button
        type="button"
        className="failure-btn"
        onClick={this.getProfileData}
      >
        Retry
      </button>
    </div>
  )

  renderProfileInProgressView = () => (
    <div className="profile-background" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfile = () => {
    const {apiStatusProfile} = this.state
    switch (apiStatusProfile) {
      case 'SUCCESS':
        return this.renderProfileSuccessView()
      case 'FAILURE':
        return this.renderProfileFailureView()
      case 'IN PROGRESS':
        return this.renderProfileInProgressView()
      default:
        return null
    }
  }

  addEmploymentType = value => {
    const {employmentType} = this.state
    if (!employmentType.includes(value)) {
      this.setState(
        {employmentType: [...employmentType, value]},
        this.getJobsData,
      )
    }
  }

  removeEmploymentType = value => {
    const {employmentType} = this.state
    const filteredEmpType = employmentType.filter(
      eachType => eachType !== value,
    )
    this.setState({employmentType: filteredEmpType}, this.getJobsData)
  }

  renderFilterEmploymentType = () => (
    <ul className="filter-container">
      <h1 className="filter-title">Type of Employment</h1>
      {employmentTypesList.map(eachItem => {
        const checked = event => {
          if (event.target.checked) {
            this.addEmploymentType(event.target.value)
          } else {
            this.removeEmploymentType(event.target.value)
          }
        }
        return (
          <li key={eachItem.employmentTypeId} className="option-container">
            <input
              type="checkbox"
              id={eachItem.employmentTypeId}
              value={eachItem.employmentTypeId}
              onChange={checked}
            />
            <label htmlFor={eachItem.employmentTypeId} className="option">
              {eachItem.label}
            </label>
          </li>
        )
      })}
    </ul>
  )

  changeSalaryOption = value => {
    this.setState({minPackage: value}, this.getJobsData)
  }

  renderFilterSalaryRanges = () => (
    <ul className="filter-container">
      <h1 className="filter-title">Salary range</h1>
      {salaryRangesList.map(eachItem => {
        const clickOption = event => {
          this.changeSalaryOption(event.target.value)
        }
        return (
          <li key={eachItem.salaryRangeId} className="option-container">
            <input
              type="radio"
              name="salary"
              id={eachItem.salaryRangeId}
              value={eachItem.salaryRangeId}
              onChange={clickOption}
            />
            <label htmlFor={eachItem.salaryRangeId} className="option">
              {eachItem.label}
            </label>
          </li>
        )
      })}
    </ul>
  )

  onChangeSearchInput = event => {
    this.setState({searchJob: event.target.value})
  }

  renderMobileSearchInput = () => {
    const {searchJob} = this.state
    return (
      <div className="mobile-search-input-container">
        <input
          type="search"
          placeholder="Search"
          className="search-input"
          value={searchJob}
          onChange={this.onChangeSearchInput}
        />
        <div className="search-button-container">
          <button
            type="button"
            className="search-btn"
            data-testid="searchButton"
            onClick={this.getJobsData}
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
      </div>
    )
  }

  renderDesktopSearchInput = () => {
    const {searchJob} = this.state
    return (
      <div className="desktop-search-input-container">
        <input
          type="search"
          placeholder="Search"
          className="search-input"
          value={searchJob}
          onChange={this.onChangeSearchInput}
        />
        <div className="search-button-container">
          <button
            type="button"
            className="search-btn"
            data-testid="searchButton"
            onClick={this.getJobsData}
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
      </div>
    )
  }

  renderJobsSuccessView = () => {
    const {jobsData} = this.state
    return (
      <>
        {jobsData.length !== 0 ? (
          <ul className="job-items-container">
            {jobsData.map(eachItem => (
              <li key={eachItem.id} className="job-item-container">
                <Link to={`jobs/${eachItem.id}`} className="nav-link">
                  <div>
                    <div className="company-job-role-container">
                      <img
                        src={eachItem.companyLogoUrl}
                        alt="company logo"
                        className="company-logo-img"
                      />
                      <div className="job-role-rating-container">
                        <h1 className="job-role">{eachItem.title}</h1>
                        <div className="star-rating-container">
                          <BsStarFill className="star-icon" />
                          <p className="rating">{eachItem.rating}</p>
                        </div>
                      </div>
                    </div>
                    <div className="location-emp-type-package-container">
                      <div className="location-emp-type-container">
                        <div className="icon-title-container">
                          <MdLocationOn className="job-icon" />
                          <p className="job-location">{eachItem.location}</p>
                        </div>
                        <div className="icon-title-container">
                          <BsFillBriefcaseFill className="job-icon" />
                          <p className="job-location">
                            {eachItem.employmentType}
                          </p>
                        </div>
                      </div>
                      <p className="package">{eachItem.packagePerAnnum}</p>
                    </div>
                    <hr className="hr-line" />
                    <h1 className="description-heading">Description</h1>
                    <p className="job-description">{eachItem.jobDescription}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          this.renderNoJobs()
        )}
      </>
    )
  }

  renderJobsFailureView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="no-jobs-img"
      />
      <h1 className="no-jobs-heading">Oops! Something Went Wrong</h1>
      <p className="no-jobs-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="failure-btn" onClick={this.getJobsData}>
        Retry
      </button>
    </div>
  )

  renderJobsInProgressView = () => (
    <div className="profile-background loader" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobs = () => {
    const {apiStatusJobs} = this.state
    switch (apiStatusJobs) {
      case 'SUCCESS':
        return this.renderJobsSuccessView()
      case 'FAILURE':
        return this.renderJobsFailureView()
      case 'IN PROGRESS':
        return this.renderJobsInProgressView()
      default:
        return null
    }
  }

  renderNoJobs = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-img"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  render() {
    return (
      <div className="jobs-bg-container">
        <Header />
        <div className="jobs-container">
          <div className="profile-filter-container">
            {this.renderMobileSearchInput()}
            {this.renderProfile()}
            <hr className="hr-line" />
            {this.renderFilterEmploymentType()}
            <hr className="hr-line" />
            {this.renderFilterSalaryRanges()}
          </div>
          <div className="jd-container">
            {this.renderDesktopSearchInput()}
            {this.renderJobs()}
          </div>
        </div>
      </div>
    )
  }
}

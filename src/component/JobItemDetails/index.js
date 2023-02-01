import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FiExternalLink} from 'react-icons/fi'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN PROGRESS',
}

export default class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstant.initial,
    jobDetails: {},
    skills: [],
    lifeAtCompany: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobItemDetailsData()
  }

  getJobItemDetailsData = async () => {
    this.setState({apiStatus: apiStatusConstant.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedJobDetailsData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }
      const updatedSkillsData = data.job_details.skills.map(eachItem => ({
        imageUrl: eachItem.image_url,
        name: eachItem.name,
      }))
      const updatedLifeAtCompanyData = {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      }
      const updatedSimilarJobsData = data.similar_jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        apiStatus: apiStatusConstant.success,
        jobDetails: updatedJobDetailsData,
        skills: updatedSkillsData,
        lifeAtCompany: updatedLifeAtCompanyData,
        similarJobs: updatedSimilarJobsData,
      })
    }
  }

  renderJobItemDetailsSuccessView = () => {
    const {jobDetails, skills, lifeAtCompany, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="job-details-container">
        <div className="job-item-details-container">
          <div className="job-item-details-company-job-role-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-item-details-company-logo-img"
            />
            <div className="job-item-details-role-rating-container">
              <h1 className="job-item-details-role">{title}</h1>
              <div className="job-item-details-star-rating-container">
                <BsStarFill className="job-item-details-star-icon" />
                <p className="job-item-details-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-item-details-location-emp-type-package-container">
            <div className="job-item-details-location-emp-type-container">
              <div className="job-item-details-icon-title-container">
                <MdLocationOn className="job-item-details-icon" />
                <p className="job-item-details-location">{location}</p>
              </div>
              <div className="job-item-details-icon-title-container">
                <BsFillBriefcaseFill className="job-item-details-icon" />
                <p className="job-item-details-location">{employmentType}</p>
              </div>
            </div>
            <p className="job-item-details-package">{packagePerAnnum}</p>
          </div>
          <hr className="job-item-details-hr-line" />
          <div className="job-item-details-description-link-container">
            <h1 className="job-item-details-description-heading">
              Description
            </h1>
            <a
              href={companyWebsiteUrl}
              className="job-item-details-company-link"
            >
              <p className="job-item-details-visit">Visit</p>
              <FiExternalLink className="job-item-details-external-link-icon" />
            </a>
          </div>
          <p className="job-item-details-description">{jobDescription}</p>
          <h1 className="job-item-details-skills-heading">Skills</h1>
          <ul className="job-item-details-skills-container">
            {skills.map(eachItem => (
              <li key={eachItem.name} className="job-item-details-skills">
                <img
                  src={eachItem.imageUrl}
                  alt={eachItem.name}
                  className="job-item-details-skills-image"
                />
                <p className="job-item-details-skills-name">{eachItem.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="job-item-details-skills-heading">Life at Company</h1>
          <div className="job-item-details-life-company-container">
            <p className="job-item-details-life-company-description">
              {description}
            </p>
            <img
              src={imageUrl}
              alt="life at company"
              className="job-item-details-life-company-image"
            />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-job-items-container">
          {similarJobs.map(eachItem => (
            <li key={eachItem.id} className="similar-job-item-container">
              <div>
                <div className="similar-company-job-role-container">
                  <img
                    src={eachItem.companyLogoUrl}
                    alt="similar job company logo"
                    className="similar-company-logo-img"
                  />
                  <div className="similar-job-role-rating-container">
                    <h1 className="similar-job-role">{eachItem.title}</h1>
                    <div className="similar-star-rating-container">
                      <BsStarFill className="similar-star-icon" />
                      <p className="similar-rating">{eachItem.rating}</p>
                    </div>
                  </div>
                </div>
                <h1 className="similar-description-heading">Description</h1>
                <p className="similar-job-description">
                  {eachItem.jobDescription}
                </p>
                <div className="similar-location-emp-type-container">
                  <div className="similar-icon-title-container">
                    <MdLocationOn className="similar-job-icon" />
                    <p className="similar-job-location">{eachItem.location}</p>
                  </div>
                  <div className="similar-icon-title-container">
                    <BsFillBriefcaseFill className="similar-job-icon" />
                    <p className="similar-job-location">
                      {eachItem.employmentType}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderJobItemDetailsFailureView = () => (
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
      <button
        type="button"
        className="failure-btn"
        onClick={this.getJobItemDetailsData}
      >
        Retry
      </button>
    </div>
  )

  renderJobItemDetailsInProgressView = () => (
    <div className="profile-background loader" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'SUCCESS':
        return this.renderJobItemDetailsSuccessView()
      case 'FAILURE':
        return this.renderJobItemDetailsFailureView()
      case 'IN PROGRESS':
        return this.renderJobItemDetailsInProgressView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-item-details-bg-container">
        <Header />
        {this.renderJobItemDetails()}
      </div>
    )
  }
}

import React from 'react'

const NewsBar = () => {
  return (
    <div className="news-bar ">
  <div className="news-label">Latest News</div>
  <div className="news-content">
    <div className="news-item">
      <i className="bi bi-play-fill news-icon" />
      <span className="news-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </span>
      <span className="news-badge">NEW</span>
    </div>
    <div className="news-item">
      <i className="bi bi-play-fill news-icon" />
      <span className="news-text">
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </span>
      <span className="news-badge">NEW</span>
    </div>
    <div className="news-item">
      <i className="bi bi-play-fill news-icon" />
      <span className="news-text">
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
      </span>
      <span className="news-badge">NEW</span>
    </div>
  </div>
</div>

  )
}

export default NewsBar
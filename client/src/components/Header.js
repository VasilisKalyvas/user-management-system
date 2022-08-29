import React from 'react'
import './css/Header.css'

const Header = () => {
    return (
        <div>
            <div className="nav">
              <input type="checkbox" id="nav-check"/>
                  <div className="nav-header">
                      <div className="nav-title">
                          User Management
                      </div>
                  </div>
                  <div className="nav-btn">
                      <label htmlFor="nav-check">
                          <span></span>
                          <span></span>
                          <span></span>
                     </label>
            </div>
        </div>
    </div>
    )
}

export default Header

const Sidebar = React.memo(({ currentPage, navigateTo, unreadAppointments, unreadPharmacy }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileSidebar = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileMenuOpen(false);
  };

  // Desktop toggle functionality
  const [isMinimized, setIsMinimized] = useState(false);
  const toggleDesktopSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Mobile Menu Trigger */}
      <button 
        id="mobileMenuTrigger"
        className="mobileMenuActivator"
        onClick={toggleMobileSidebar}
        aria-label="Toggle mobile navigation"
      >
        <span className="menuLineOne"></span>
        <span className="menuLineTwo"></span>
        <span className="menuLineThree"></span>
      </button>

      {/* Primary Navigation Wrapper */}
      <nav className={`globalNavWrapper ${isMobileMenuOpen ? 'mobileMenuActive' : ''}`}>
        <aside className={`mainNavPanel ${isMinimized ? 'panelMinimized' : ''}`}>
          {/* Navigation Top Bar */}
          <header className="navControlBar">
            <div className="brandDisplayArea">
              <div className="coreLogoContainer">
                <i className="fas fa-heartbeat logoBeatEffect"></i>
              </div>
              {!isMinimized && (
                <div className="corporateBranding">
                  <span className="primaryBrandName">MediCare</span>
                  <span className="secondaryBrandTag">Dashboard</span>
                </div>
              )}
            </div>
            
            {/* Desktop Panel Controller */}
            <button 
              id="desktopPanelController"
              className="panelCollapseBtn"
              onClick={toggleDesktopSidebar}
              aria-label={isMinimized ? "Expand navigation panel" : "Minimize navigation panel"}
            >
              <i className={`fas ${isMinimized ? 'fa-arrow-right panelArrowIcon' : 'fa-arrow-left panelArrowIcon'}`}></i>
            </button>
          </header>

          {/* Main Navigation Links */}
          <nav className="coreNavigationLinks">
            <MenuLink 
              icon="fas fa-home"
              linkText="Dashboard"
              isCurrent={currentPage === 'dashboard'}
              handleClick={() => { navigateTo('dashboard'); closeMobileSidebar(); }}
              isMinimized={isMinimized}
            />

            <MenuLink 
              icon="fas fa-user-injured"
              linkText="Patients"
              isCurrent={currentPage === 'patients'}
              handleClick={() => { navigateTo('patients'); closeMobileSidebar(); }}
              isMinimized={isMinimized}
            />

            <MenuLink 
              icon="fas fa-stethoscope"
              linkText="Doctors"
              isCurrent={currentPage === 'doctors'}
              handleClick={() => { navigateTo('doctors'); closeMobileSidebar(); }}
              isMinimized={isMinimized}
            />

            <MenuLink 
              icon="fas fa-calendar-check"
              linkText="Appointments"
              isCurrent={currentPage === 'appointments'}
              handleClick={() => { navigateTo('appointments'); closeMobileSidebar(); }}
              notificationCount={unreadAppointments}
              isMinimized={isMinimized}
            />

            <MenuLink 
              icon="fas fa-pills"
              linkText="Pharmacy"
              isCurrent={currentPage === 'pharmacy'}
              handleClick={() => { navigateTo('pharmacy'); closeMobileSidebar(); }}
              notificationCount={unreadPharmacy}
              isMinimized={isMinimized}
            />

            <MenuLink 
              icon="fas fa-file-medical"
              linkText="Medical Records"
              isCurrent={currentPage === 'records'}
              handleClick={() => { navigateTo('records'); closeMobileSidebar(); }}
              isMinimized={isMinimized}
            />

            <MenuLink 
              icon="fas fa-heartbeat"
              linkText="Health Programs"
              isCurrent={currentPage === 'programs'}
              handleClick={() => { navigateTo('programs'); closeMobileSidebar(); }}
              isMinimized={isMinimized}
            />

            <MenuLink 
              icon="fas fa-chart-line"
              linkText="Analytics"
              isCurrent={currentPage === 'analytics'}
              handleClick={() => { navigateTo('analytics'); closeMobileSidebar(); }}
              isMinimized={isMinimized}
            />
          </nav>

          {/* Navigation Bottom Section */}
          <footer className="navUtilitySection">
            <MenuLink 
              icon="fas fa-cog"
              linkText="Settings"
              isCurrent={false}
              handleClick={() => { navigateTo('settings'); closeMobileSidebar(); }}
              isMinimized={isMinimized}
            />
            
            {!isMinimized && (
              <div className="accountInfoPanel">
                <div className="avatarDisplay">DR</div>
                <div className="userIdentityInfo">
                  <div className="fullNameDisplay">Dr. Smith</div>
                  <div className="roleDesignation">Administrator</div>
                </div>
              </div>
            )}
          </footer>
        </aside>

        {/* Mobile Backdrop */}
        {isMobileMenuOpen && (
          <div 
            id="mobileBackdropLayer"
            className="screenOverlayLayer"
            onClick={closeMobileSidebar}
          ></div>
        )}
      </nav>
    </>
  );
});

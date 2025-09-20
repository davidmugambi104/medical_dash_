// const Sidebar = React.memo(({ currentPage, navigateTo, unreadAppointments, unreadPharmacy }) => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
//   const toggleMobileSidebar = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const closeMobileSidebar = () => {
//     setIsMobileMenuOpen(false);
//   };

//   // Desktop toggle functionality
//   const [isMinimized, setIsMinimized] = useState(false);
//   const toggleDesktopSidebar = () => {
//     setIsMinimized(!isMinimized);
//   };

//   return (
//     <>
//       {/* Mobile Menu Trigger */}
//       <button 
//         id="mobileMenuTrigger"
//         className="mobileMenuActivator"
//         onClick={toggleMobileSidebar}
//         aria-label="Toggle mobile navigation"
//       >
//         <span className="menuLineOne"></span>
//         <span className="menuLineTwo"></span>
//         <span className="menuLineThree"></span>
//       </button>

//       {/* Primary Navigation Wrapper */}
//       <nav className={`globalNavWrapper ${isMobileMenuOpen ? 'mobileMenuActive' : ''}`}>
//         <aside className={`mainNavPanel ${isMinimized ? 'panelMinimized' : ''}`}>
//           {/* Navigation Top Bar */}
//           <header className="navControlBar">
//             <div className="brandDisplayArea">
//               <div className="coreLogoContainer">
//                 <i className="fas fa-heartbeat logoBeatEffect"></i>
//               </div>
//               {!isMinimized && (
//                 <div className="corporateBranding">
//                   <span className="primaryBrandName">MediCare</span>
//                   <span className="secondaryBrandTag">Dashboard</span>
//                 </div>
//               )}
//             </div>
            
//             {/* Desktop Panel Controller */}
//             <button 
//               id="desktopPanelController"
//               className="panelCollapseBtn"
//               onClick={toggleDesktopSidebar}
//               aria-label={isMinimized ? "Expand navigation panel" : "Minimize navigation panel"}
//             >
//               <i className={`fas ${isMinimized ? 'fa-arrow-right panelArrowIcon' : 'fa-arrow-left panelArrowIcon'}`}></i>
//             </button>
//           </header>

//           {/* Main Navigation Links */}
//           <nav className="coreNavigationLinks">
//             <MenuLink 
//               icon="fas fa-home"
//               linkText="Dashboard"
//               isCurrent={currentPage === 'dashboard'}
//               handleClick={() => { navigateTo('dashboard'); closeMobileSidebar(); }}
//               isMinimized={isMinimized}
//             />

//             <MenuLink 
//               icon="fas fa-user-injured"
//               linkText="Patients"
//               isCurrent={currentPage === 'patients'}
//               handleClick={() => { navigateTo('patients'); closeMobileSidebar(); }}
//               isMinimized={isMinimized}
//             />

//             <MenuLink 
//               icon="fas fa-stethoscope"
//               linkText="Doctors"
//               isCurrent={currentPage === 'doctors'}
//               handleClick={() => { navigateTo('doctors'); closeMobileSidebar(); }}
//               isMinimized={isMinimized}
//             />

//             <MenuLink 
//               icon="fas fa-calendar-check"
//               linkText="Appointments"
//               isCurrent={currentPage === 'appointments'}
//               handleClick={() => { navigateTo('appointments'); closeMobileSidebar(); }}
//               notificationCount={unreadAppointments}
//               isMinimized={isMinimized}
//             />

//             <MenuLink 
//               icon="fas fa-pills"
//               linkText="Pharmacy"
//               isCurrent={currentPage === 'pharmacy'}
//               handleClick={() => { navigateTo('pharmacy'); closeMobileSidebar(); }}
//               notificationCount={unreadPharmacy}
//               isMinimized={isMinimized}
//             />

//             <MenuLink 
//               icon="fas fa-file-medical"
//               linkText="Medical Records"
//               isCurrent={currentPage === 'records'}
//               handleClick={() => { navigateTo('records'); closeMobileSidebar(); }}
//               isMinimized={isMinimized}
//             />

//             <MenuLink 
//               icon="fas fa-heartbeat"
//               linkText="Health Programs"
//               isCurrent={currentPage === 'programs'}
//               handleClick={() => { navigateTo('programs'); closeMobileSidebar(); }}
//               isMinimized={isMinimized}
//             />

//             <MenuLink 
//               icon="fas fa-chart-line"
//               linkText="Analytics"
//               isCurrent={currentPage === 'analytics'}
//               handleClick={() => { navigateTo('analytics'); closeMobileSidebar(); }}
//               isMinimized={isMinimized}
//             />
//           </nav>

//           {/* Navigation Bottom Section */}
//           <footer className="navUtilitySection">
//             <MenuLink 
//               icon="fas fa-cog"
//               linkText="Settings"
//               isCurrent={false}
//               handleClick={() => { navigateTo('settings'); closeMobileSidebar(); }}
//               isMinimized={isMinimized}
//             />
            
//             {!isMinimized && (
//               <div className="accountInfoPanel">
//                 <div className="avatarDisplay">DR</div>
//                 <div className="userIdentityInfo">
//                   <div className="fullNameDisplay">Dr. Smith</div>
//                   <div className="roleDesignation">Administrator</div>
//                 </div>
//               </div>
//             )}
//           </footer>
//         </aside>

//         {/* Mobile Backdrop */}
//         {isMobileMenuOpen && (
//           <div 
//             id="mobileBackdropLayer"
//             className="screenOverlayLayer"
//             onClick={closeMobileSidebar}
//           ></div>
//         )}
//       </nav>
//     </>
//   );
// });
import React, { useState, useEffect, useCallback } from 'react';
import './sidebar.css';

const Sidebar = React.memo(({ currentPage, navigateTo, unreadAppointments, unreadPharmacy }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);
  
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleDesktopSidebar = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);

  const menuItems = [
    { icon: "fas fa-home", text: "Dashboard", page: "dashboard" },
    { icon: "fas fa-user-injured", text: "Patients", page: "patients" },
    { icon: "fas fa-stethoscope", text: "Doctors", page: "doctors" },
    { 
      icon: "fas fa-calendar-check", 
      text: "Appointments", 
      page: "appointments", 
      notification: unreadAppointments 
    },
    { 
      icon: "fas fa-pills", 
      text: "Pharmacy", 
      page: "pharmacy", 
      notification: unreadPharmacy 
    },
    { icon: "fas fa-file-medical", text: "Medical Records", page: "records" },
    { icon: "fas fa-heartbeat", text: "Health Programs", page: "programs" },
    { icon: "fas fa-chart-line", text: "Analytics", page: "analytics" },
  ];

  const settingsItem = { icon: "fas fa-cog", text: "Settings", page: "settings" };

  return (
    <>
      <button 
        id="mobileMenuTrigger"
        className={`mobileMenuActivator ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileSidebar}
        aria-label="Toggle mobile navigation"
        aria-expanded={isMobileMenuOpen}
      >
        <span className="menuLine"></span>
        <span className="menuLine"></span>
        <span className="menuLine"></span>
      </button>

      <nav 
        className={`globalNavWrapper ${isMobileMenuOpen ? 'mobileMenuActive' : ''}`}
        aria-label="Main navigation"
      >
        <aside 
          className={`mainNavPanel ${isMinimized ? 'panelMinimized' : ''} ${isHovered ? 'panelHovered' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <header className="navControlBar">
            <div className="brandDisplayArea">
              <div className="coreLogoContainer">
                <i className="fas fa-heartbeat logoBeatEffect"></i>
              </div>
              {(!isMinimized || isHovered) && (
                <div className="corporateBranding">
                  <span className="primaryBrandName">MediCare</span>
                  <span className="secondaryBrandTag">Dashboard</span>
                </div>
              )}
            </div>
            <button 
              id="desktopPanelController"
              className="panelCollapseBtn"
              onClick={toggleDesktopSidebar}
              aria-label={isMinimized ? "Expand navigation panel" : "Minimize navigation panel"}
            >
              <i className={`fas ${isMinimized ? 'fa-arrow-right panelArrowIcon' : 'fa-arrow-left panelArrowIcon'}`}></i>
            </button>
          </header>

          <nav className="coreNavigationLinks">
            {menuItems.map(item => (
              <MenuLink 
                key={item.page}
                icon={item.icon}
                linkText={item.text}
                isCurrent={currentPage === item.page}
                handleClick={() => { 
                  navigateTo(item.page); 
                  closeMobileSidebar(); 
                }}
                notificationCount={item.notification}
                isMinimized={isMinimized}
                isHovered={isHovered}
              />
            ))}
          </nav>

          <footer className="navUtilitySection">
            <MenuLink 
              icon={settingsItem.icon}
              linkText={settingsItem.text}
              isCurrent={currentPage === settingsItem.page}
              handleClick={() => { 
                navigateTo(settingsItem.page); 
                closeMobileSidebar(); 
              }}
              isMinimized={isMinimized}
              isHovered={isHovered}
            />
            {(!isMinimized || isHovered) && (
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

        {isMobileMenuOpen && (
          <div 
            id="mobileBackdropLayer"
            className="screenOverlayLayer"
            onClick={closeMobileSidebar}
            aria-hidden="true"
          ></div>
        )}
      </nav>
    </>
  );
});

const MenuLink = React.memo(({ 
  icon, 
  linkText, 
  isCurrent, 
  handleClick, 
  notificationCount, 
  isMinimized, 
  isHovered 
}) => {
  return (
    <button
      className={`navLinkItem ${isCurrent ? 'activeNavLink' : ''}`}
      onClick={handleClick}
      aria-current={isCurrent ? 'page' : undefined}
      aria-label={isMinimized && !isHovered ? linkText : undefined}
    >
      <i className={`${icon} navItemIcon`}></i>
      {(!isMinimized || isHovered) && (
        <span className="navItemText">{linkText}</span>
      )}
      {notificationCount > 0 && (
        <span className="notificationBadge">{notificationCount}</span>
      )}
      {isMinimized && !isHovered && isCurrent && (
        <span className="activeIndicator"></span>
      )}
    </button>
  );
});

export default Sidebar;

import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../utils/GlobalContext';
import Dropdown from 'react-bootstrap/Dropdown';
import PreviewModal from './PreviewModal';


const links = [
  { name: 'CV Title', path: '/editor' },
  { name: 'Basic Info', path: 'basic-info' },
  { name: 'Skills', path: 'skills' },
  { name: 'Experience', path: 'experience' },
  { name: 'Education', path: 'education' },
  { name: 'Other', path: 'other' },
];

export const EditorSideBar = (props) => {
  const navigate = useNavigate();
  const { saveCV, userData, saveStagingCV, initializeStagingCV } = useGlobalContext();
  const [activeElement, setActiveElement] = useState(null)
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    setActiveElement('basic-info')
  }, [])



  const handleSaveCV = () => {
    saveCV();
    // setCurrentRouteIndex(0);
    navigate('/myCVs');
  }

  const handleSaveProgress = () => {
    saveStagingCV();
    // setCurrentRouteIndex(0);
    navigate('/myCVs');
  }

  function updateActiveLink(e) {
    const { name } = e.target;
    setActiveElement(name);
  }

  const navElements = links.map((link, index) => {
    return (
      <li key={`link-${index}`} className="nav-item">
        <Link name={link.name} onClick={(e) => updateActiveLink(e)} to={link.path} className={`nav-link p-0 ${activeElement === link.name ? 'active' : ''}`}>{link.name}</Link>
      </li>
    )
  })



  
  return (
    <aside className='editor-sideBar d-none d-md-flex flex-column justify-content-between m-0 p-0 col-2'>
      <PreviewModal showModal={showModal} handleClose={handleClose} />
      <button variant="primary" onClick={handleShow} className="btn btn-primary">PREVIEW</button>
        <ul className='navbar-nav align-items-center justify-content-evenly'>
          {navElements}
          <button onClick={handleSaveProgress} className="btn btn-primary save-cv-btn">Save Progress</button>
        </ul>
      <button onClick={handleSaveCV} className="btn btn-primary save-cv-btn">SAVE CV</button>
    </aside>
  );
};

// Adopded from 'react-bootstrap' and modified
// https://getbootstrap.com/docs/4.0/components/dropdowns/
export const EditorSideBtn = () => {
  const navigate = useNavigate();
  const [activeElement, setActiveElement] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  function updateActiveLink(name) {
    setActiveElement(name);
  }

  function handleLinkClick(path) {
    updateActiveLink(path);
    navigate(path); // Use the navigate function from react-router-dom to programmatically navigate
  }

  return (
    <div className='d-block d-md-none'>
    <PreviewModal showModal={showModal} handleClose={handleClose} />
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        SECTION
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {links.map((link) => (
          <Dropdown.Item
            key={link.path}
            onClick={() => handleLinkClick(link.path)}
            className={activeElement === link.name ? 'active' : ''}
          >
            {link.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>

      <button onClick={handleShow} className="btn btn-primary save-cv-btn">
        PREVIEW
      </button>
    </Dropdown>
    </div>
  );
};

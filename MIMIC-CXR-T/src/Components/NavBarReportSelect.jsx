import React, { useState, useContext } from 'react';
import { Navbar, Nav, Button, Modal } from 'react-bootstrap';
import LogoutButton from '../profile/Logout';
import ModalDictionary  from '../Components/ModalDictionary';
import ModalUploadReport from '../Components/ModalUploadReport';


const NavBarReportSelection = () => {


  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
      <Navbar.Brand href="/">MIMIC-CXR</Navbar.Brand>
      <ModalUploadReport/>
      <ModalDictionary/>
      <LogoutButton />
    </Navbar>
  );
};

export default NavBarReportSelection;

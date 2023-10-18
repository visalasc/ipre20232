import React, { useState, useContext } from 'react';
import { Navbar, Nav, Button, Modal, NavLink } from 'react-bootstrap';
import LogoutButton from '../profile/Logout';
import ModalDictionary  from '../Components/ModalDictionary';
import ModalUploadReport from '../Components/ModalUploadReport';


const NavBarReportSelection = () => {


  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
      <Navbar.Brand >MIMIC-CXR</Navbar.Brand>
      <Nav.Link href="/reportselection">Seleccionar Reportes</Nav.Link>
      <ModalUploadReport/>
      <ModalDictionary/>
      <LogoutButton />
    </Navbar>
  );
};

export default NavBarReportSelection;

import React, { useEffect, useState, useContext} from 'react';
import NavBarReportSelection from '../Components/NavBarReportSelect';
import LeftViewer from '../Components/LeftViewer';
import RightViewer from '../Components/RightViewer';
import './translator.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

function Translator() {
  const { token } = useContext(AuthContext);
  const { groupId } = useParams();  
  console.log('groupId:', groupId);
  const [reports, setReports] = useState(null);

  useEffect(() => {
    const fetchReportsForGroup = async () => {
      try {
          if (!token) {
            console.error('Token not available.');
            return;
          }
  
          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/reportgroupreports/${groupId}`, config);
       
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (groupId) {
      fetchReportsForGroup();
    }

  }, [groupId]);
  console.log('reports:', reports);
  return (
    <>
      <div>
        <NavBarReportSelection />
      </div>
      <div className="app-container">
        <div className="leftviewer-container">
          <LeftViewer reports={reports} />
        </div>
        <div className="rightviewer-container">
          <RightViewer />
        </div>
      </div>
    </>
  );
}

export default Translator;

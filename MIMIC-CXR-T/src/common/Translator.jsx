import React, { useEffect, useState } from 'react';
import MyNavBar from '../Components/NavApp';
import LeftViewer from '../Components/LeftViewer';
import RightViewer from '../Components/RightViewer';
import './translator.css';
import axios from 'axios';

function Translator({ match }) {
  const { groupId } = match.params; // Extract groupId from the URL
  const [groupData, setGroupData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/data/${groupId}`
        );
        setGroupData(response.data); // Assuming response.data contains the group data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [groupId]);

  return (
    <>
      <div>
        <MyNavBar />
      </div>
      <div className="app-container">
        <div className="leftviewer-container">
          <LeftViewer groupData={groupData} />
        </div>
        <div className="rightviewer-container">
          <RightViewer />
        </div>
      </div>
    </>
  );
}

export default Translator;

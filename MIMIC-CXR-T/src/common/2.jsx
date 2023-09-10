import React , { useState }from 'react'
import LeftViewer from '../Components/LeftViewer';
import RightViewer from '../Components/RightViewer';
import MyNavBar from '../Components/NavApp';

export default function Home() {
  return (
    <div>
    <MyNavBar/>
     <LeftViewer/>
     <RightViewer/>
    </div>
  );
}

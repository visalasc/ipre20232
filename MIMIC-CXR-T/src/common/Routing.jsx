import {BrowserRouter, Routes, Route} from 'react-router-dom' 
import UserWelcome from '..profile/UserWelcome'
import Translator from '..translator/Translator'
import OtherFeature from '../other_feature'
import App from './App'

function Routing() {
    <BrowserRouter>
        <Routes>
            <Route path={'/translator'} element={<Translator/>}/>
            <Route path={'/otherfeature'} element={<OtherFeature/>}/>
            <Route path={'/welcome'} element={<UserWelcome/>}/>
            <Route path={'/'} element={<App/>}/>
        </Routes>
    </BrowserRouter>
}

export default Routing
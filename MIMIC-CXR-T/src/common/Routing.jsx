import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from '../common/App'
import Translator from '../common/Translator'
import UserWelcome from '../profile/UserWelcome'
import ModalLogin from '../profile/ModalLogin'
import Signup from '../profile/Signup'
import AdminCheck from '../protected/AdminCheck'
import UserCheck from '../protected/UserCheck'

import Home from '../common/Home'
function Routing() {
    return(
    <BrowserRouter>
        <Routes>
            <Route path={"/"} element={<App />}/>
            <Route path={"/home"} element={<Home />}/>
            <Route path={'/translator'} element={<Translator/>}/>
            <Route path={"/welcome"} element={<UserWelcome />}/>
            <Route path={"/login"} element={<ModalLogin />}/>
            <Route path={"/signup"} element={<Signup />}/>
            <Route path={"/admincheck"} element={<AdminCheck />}/>
            <Route path={"/usercheck"} element={<UserCheck />}/>
        </Routes>
    </BrowserRouter>)
}

export default Routing;
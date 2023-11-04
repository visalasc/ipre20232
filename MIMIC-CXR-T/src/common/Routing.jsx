import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from '../common/App'
import Translator from '../common/Translator'
import ModalLogin from '../profile/ModalLogin'
import Signup from '../profile/Signup'
import AdminCheck from '../protected/AdminCheck'
import UserCheck from '../protected/UserCheck'
import ReportGroupSelection from '../common/ReportGroupSelection'; 

function Routing() {
    return(
    <BrowserRouter>
        <Routes>
            <Route path={"/"} element={<App />}/>
            <Route path={'/translator/:groupId'} element={<Translator/>}/>
            <Route path={"/login"} element={<ModalLogin />}/>
            <Route path={"/signup"} element={<Signup />}/>
            <Route path={"/admincheck"} element={<AdminCheck />}/>
            <Route path={"/usercheck"} element={<UserCheck />}/>
            <Route path={"/reportselection"} element={<ReportGroupSelection />}/>

        </Routes>
    </BrowserRouter>)
}

export default Routing;
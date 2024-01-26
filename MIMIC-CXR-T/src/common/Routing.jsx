import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from '../common/App'
import Translator from '../common/Translator2'
import ModalLogin from '../profile/ModalLogin'
import Signup from '../profile/Signup'
import ReportGroupSelection from '../common/ReportGroupSelection'; 
import Admin from '../common/Admin';
import TableUserDisplayReportGroup from '../Components/TableUserDisplayReportGroup'

function Routing() {
    return(
    <BrowserRouter>
        <Routes>
            <Route path={"/"} element={<App />}/>
            <Route path={'/translator/:groupId/'} element={<Translator/>}/>
            <Route path={'/tablereportgroup/:groupId'} element={<TableUserDisplayReportGroup/>}/>
            <Route path={"/login"} element={<ModalLogin />}/>
            <Route path={"/signup"} element={<Signup />}/>
            <Route path={"/reportselection"} element={<ReportGroupSelection />} />
            <Route path={"/admin"} element={<Admin />}/>
            
        </Routes>
    </BrowserRouter>)
}

export default Routing;
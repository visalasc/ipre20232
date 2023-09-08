import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from '../common/App'
import Translator from '../common/Translator'

import Home from '../common/Home'
function Routing() {
    return(
    <BrowserRouter>
        <Routes>
            <Route path={"/"} element={<App />}/>
            <Route path={"/home"} element={<Home />}/>
            <Route path={'/translator'} element={<Translator/>}/>
        </Routes>
    </BrowserRouter>)
}

export default Routing;
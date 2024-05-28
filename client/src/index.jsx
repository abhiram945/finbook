import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../src/index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/header';
import { SignIn } from './components/signin';
import { Nav } from './components/nav';
import { Main } from './components/main';
import {ProtectedRoutes} from './utils/protected';
const context = createContext();
const root = ReactDOM.createRoot(document.getElementById('root'));

const Finbook = () => {
    const [completeUserData, setCompleteUserData] = useState(null);
    const [isNewUser, setIsNewUser] = useState(false);
    const [somethingChanged, setSomethingChanged] = useState(0);
    return <context.Provider value={{ completeUserData, setCompleteUserData, isNewUser, setIsNewUser, somethingChanged, setSomethingChanged }}>
        <BrowserRouter>
            <Header />
            <Routes>
                <Route exact path='/signin' element={<SignIn />} />
                <Route element={<ProtectedRoutes />}>
                    <Route exact path='/' element={<Nav />} />
                    <Route exact path='/:day/:village' element={<><Nav /><Main /></>} />
                </Route>
            </Routes>
        </BrowserRouter>
    </context.Provider>
}
root.render(<Finbook />);
export { context };
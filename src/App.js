import './App.css';
import { Route, Routes } from "react-router-dom";
import InstructionPage from './page/InstructionPage';
import HomePage from './page/Home';
import NotFound from './page/NotFoundPage';
import TrialPage from './page/TrialPage';
import ResultPage from "./page/ResultPage";
import AdminLoginPage from "./page/AdminLoginPage";
import AdminDashboardPage from "./page/AdminDashboardPage";
import AdminRedirectPage from './page/AdminRedirectPage';

function App() {
  return (
    <div className="App">
    <Routes>
      <Route path="/" element = {<HomePage/>} />
      <Route path='/instruction' element = {<InstructionPage/>} />
      <Route path='*' element={<NotFound/>}/>
      <Route exact path='/trial' element = {<TrialPage/>} />
      <Route exact path=':id/result' element = {<ResultPage/>} />
      <Route exact path='/admin/*' element = {<AdminRedirectPage/>} />
      <Route path={'/admin/login'} element={<AdminLoginPage/>}/>
      <Route path={'/admin/dashboard'} element={<AdminDashboardPage/>}/>
    </Routes>
    </div>
  );
}

export default App;

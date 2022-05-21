import './App.css';
import { Route, Routes } from "react-router-dom";
import InstructionPage from './page/InstructionPage';
import HomePage from './page/Home';
import NotFound from './page/NotFoundPage';
import TrialPage from './page/TrialPage';
import ResultPage from "./page/ResultPage";

function App() {
  return (
    <div className="App">
    <Routes>
      <Route path="/" element = {<HomePage/>} />
      <Route path='/instruction' element = {<InstructionPage/>} />
      <Route path='*' element={<NotFound/>}/>
      <Route exact path='/trial' element = {<TrialPage/>} />
      <Route exact path=':id/result' element = {<ResultPage/>} />
    </Routes>
    </div>
  );
}

export default App;

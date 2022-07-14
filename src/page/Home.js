import Toolbar from "../component/Toolbar";
import Select from "react-select";
import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import UserDataService from '../service/UserDataService.js';

const testModeList = [
    {label: "Normal", value: "normal"},
    {label: "ADHD", value: "adhd"},
    {label: "Other", value: "other"}
]


const getDiagonalSize = () => {
    const {innerHeight, innerWidth} = window;
    const diagonal = Math.sqrt(Math.pow(innerHeight, 2) + Math.pow(innerWidth, 2));
    return Math.round(diagonal);
}

function HomePage() {
    const navigate = useNavigate();
    const [subjectName, setSubjectName] = useState();
    const [subjectId, setSubjectId] = useState(1);
    const [sessionNumber, setSessionNumber] = useState(1);
    const [subjectAge, setSubjectAge] = useState(1);
    const [subjectGender, setSubjectGender] = useState('');
    const [testMode, setTestMode] = useState("normal");
    const [windowSize, setWindowSize] = useState(getDiagonalSize());
    const [distanceEyesAndScreen, setDistanceEyesAndScreen] = useState('0.00');
    const [token, setToken] = useState('');

    const setName = ({value}) => {
        setSubjectName(value);
    }

    const setId = ({value}) => {
        setSubjectId(value);
    }
    const setSession = ({value}) => {
        setSessionNumber(value);
    }

    const setAge = ({value}) => {
        setSubjectAge(value);
    }

    const setGender = ({value}, label) => {
        console.log(value)
        console.log(label)
        if (value === 'on') {
            setSubjectGender(label);
        }
    }

    const setMode = ({value}) => {
        setTestMode(value);
    }

    useEffect(() => {
        if(token!== "" && token){
            navigate('/instruction',{state: {token: token}});
        }
    }, [token])

    useEffect(() => {
        setToken(localStorage["token"])
        const handleEvent = () => {
            setWindowSize(getDiagonalSize());
        }
        window.addEventListener('resize', handleEvent);
        return () => window.removeEventListener('resize', handleEvent);
    }, [])

    useEffect(() => {
        const distance = (Math.round((parseInt(windowSize) * 2.32) * 100) / 100).toFixed(2);
        setDistanceEyesAndScreen(distance);
    }, [windowSize])

    const handleLogin = e => {
        e.preventDefault()

        const user = {
            id: subjectId,
            name: subjectName,
            session: sessionNumber,
            age: subjectAge,
            sex: subjectGender,
            category: testMode,
            windowSize: windowSize
        }

        UserDataService.save(user).then(response => {
            const data = response.data;
            if (data.status === 'success') {
                localStorage['token'] = data.token;
                navigate('/instruction', {state: {token: data.token}});
            } else alert(data.message)
        }).catch(error => {
            try {
                alert(error.response.data.message)
            } catch (e) {
                alert(error.message)
            }
        });
    }

    return (
        <div>
            <Toolbar/>
            <form className='card' onSubmit={e => handleLogin(e)}>
                <div className='form flex-container' style={{alignItems: 'stretch'}}>
                    <div className='row'>
                        <p className='flex-item'>Subject Name</p>
                        <input className="text-number-input flex-width" type='text'
                               onChange={e => setName(e.target)} value={subjectName}></input>
                    </div>
                    <div className='row'>
                        <p className='flex-item'>Subject Id</p>
                        <input className="text-number-input flex-width" type='number' min={1} value={subjectId}
                               onChange={e => setId(e.target)}></input>
                    </div>
                    <div className='row'>
                        <p className='flex-item'>Session Number</p>
                        <input className="text-number-input flex-width" type='number' min={1} value={sessionNumber}
                               onChange={e => setSession(e.target)}></input>
                    </div>
                    <div className='row'>
                        <p className='flex-item'>Subject Age</p>
                        <input className="text-number-input flex-width" type='number' min={1} value={subjectAge}
                               onChange={e => setAge(e.target)}></input>
                    </div>
                    <div className='row'>
                        <p className='flex-item'>Sex</p>
                        <div className='radio-group flex-width'>
                            <label className='radio'>
                                <input type='radio' name='sex' onChange={e => setGender(e.target, "male")}/>
                                Male
                            </label>
                            <label>
                                <input type='radio' name='sex' onChange={e => setGender(e.target, "female")}/>
                                Female
                            </label>
                        </div>
                    </div>
                    <div className='row'>
                        <p className='flex-item'>Test Category</p>
                        <Select className='flex-width' options={testModeList} isSearchable={false}
                                placeholder={testModeList[0].label} onChange={e => setMode(e)}/>
                    </div>
                    <div className='row'>
                        <p className='flex-item'>Diagonal Window Size</p>
                        <input className="text-number-input" type='number' min={0} readOnly={true} value={windowSize}></input>
                    </div>
                    <div className='row'>
                        <div className='flex-item multiline-text'>
                            Distance between
                            eyes and screen
                        </div>
                        <input className="text-number-input" type='number' min={0} placeholder={distanceEyesAndScreen}
                               readOnly></input>
                    </div>
                    <div className='row'>
                        <div className='flex-item'>
                            <button className='button-white' type='reset'>Reset</button>
                        </div>
                        <div className='flex-item'>
                            <button className='button-blue' type='submit'>Continue</button>
                        </div>
                    </div>
                </div>
            </form>

            <footer>
                <p>Version 1.0</p>
            </footer>
        </div>
    );
}

export default HomePage;
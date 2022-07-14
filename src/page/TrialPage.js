import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import Toolbar from "../component/Toolbar";
import Loading from "../component/Loading";
import TrialDataService from "../service/TrialDataService";
import MessageLayout from "../component/MessageLayout";

const styleAdult = {
    height: '100vh',
    backgroundColor: 'lightgrey',
    position: 'relative',
}

const styleChild = {
    height: '100vh',
    backgroundColor: 'cyan',
    position: 'relative',
}

let data = [];
let assetUrl = '', uid = '';
let image = '';

let firstFixationImage = '';
let secondFixationImage = '';
let lastFixationImage = '';

let targetImage = '';
let currentImage = '';

let keyReleaseFlag = false, beginTimeOnFlag = false;

let responseKey = '';
let reactionTime = 0;
let feedbackOnFlag = false;
let targetLocation = '';
let cueLocation = -2;
let position = -1


function TrialPage() {
    const uri = process.env.REACT_APP_BACKEND_URI
    const navigate = useNavigate();
    const {state} = useLocation();

    const [type, setType] = useState('')
    const [loaded, setLoaded] = useState(false);
    const [messageLayout, setMessageLayout] = useState(true);
    const [message, setMessage] = useState('');
    const [timer, setTimer] = useState({});

    const [buttonCallback, setButtonCallback] = useState(() => () => {console.log('button callback invoked')});

    const focusRef = useRef(null)

    const [upperImage, setUpperImage] = useState('');
    const [centerImage, setCenterImage] = useState('');
    const [lowerImage, setLowerImage] = useState('');
    const [targetTop, setTargetTop] = useState(false);
    const [targetCenter, setTargetCenter] = useState(false);
    const [targetBottom, setTargetBottom] = useState(false);

    const feedbackDelay = 1000

    useEffect(()=>{
        console.log(data[position])
    }, [position])

    useEffect(() => {
        try {
            TrialDataService.getTrialData(state.token).then(response => {
                data = response.data;
                uid = state.token
                setType(state.type)
                image = state.images
                assetUrl = state.assetsUrl
                setLoaded(true)
                window.addEventListener('keydown', handleKeyDown);
                focusRef.current && focusRef.current.focus()
        
                setMessageToLayout("Are You Ready?", () => {
                    setMessageLayout(false)
                    document.getElementById("container").focus()
                })
            }).catch(error => {
                try {
                    setMessageToLayout(error.response.data.message, () => navigate("../"))
                } catch (e) {
                    setMessageToLayout(error.message, () => navigate("../"))
                }
            })
        } catch (e) {
            setLoaded(true)
            setMessageToLayout("Please enter your data first", () => {
                navigate("../")
            })
        }
    }, []);

    useEffect(() => {
        if (!messageLayout) InitComponent()
    }, [messageLayout])

    useEffect(() => {
        const timeout = setTimeout(() => { timeoutCallback(timer.source) }, timer.duration);
        return () => clearTimeout(timeout);
    }, [timer])

    const InitComponent = () => {
        firstFixationImage = image.fixationImage;
        secondFixationImage = image.fixationImage;
        lastFixationImage = image.fixationImage;
        currentImage = image.fixationImage;

        if (data.length > position) {
            position += 1
            if (data[position].cueLocation === 'nocue') {
                cueLocation = 0;
            } else if (data[position].cueLocation === 'centercue') {
                cueLocation = 0;
            } else if (data[position].cueLocation === 'doublecue') {
                cueLocation = 1;
            } else if (data[position].cueLocation === 'invalidcue') {
                if (data[position].targetLocation === 'up') {
                    cueLocation = 1;
                } else if (data[position].targetLocation === 'down') {
                    cueLocation = -1;
                }
            } else if (data[position].cueLocation === 'spatialcue') {
                if (data[position].targetLocation === 'up') {
                    cueLocation = -1;
                } else if (data[position].targetLocation === 'down') {
                    cueLocation = 1;
                }
            } else cueLocation = 0;

            if (data[position].targetLocation === 'up') {
                targetLocation = -1;
            } else if (data[position].targetLocation === 'down') {
                targetLocation = 1;
            } else targetLocation = 0;

            if (data[position].targetDirection === 'left') {
                if (data[position].targetCongruency === 'congruent') {
                    targetImage = image.targetLllllImage;
                } else if (data[position].targetCongruency === 'incongruent') {
                    targetImage = image.targetRrlrrImage;
                } else targetImage = image.targetOolooImage;
            } else if (data[position].targetDirection === 'right') {
                if (data[position].targetCongruency === 'congruent') {
                    targetImage = image.targetRrrrrImage;
                } else if (data[position].targetCongruency === 'incongruent') {
                    targetImage = image.targetLlrllImage;
                } else targetImage = image.targetOorooImage;
            }
        }

        keyReleaseFlag = true;
        data[position].beginTime = Date.now()
        setTimerWithCheck({
            source: 'firstFixationTimer',
            duration: data[position].firstFixationDelay
        })

        feedbackOnFlag = false;
    }

    const timeoutCallback = source => {
        if (source === 'firstFixationTimer') {
            currentImage = image.cueImage;
            setTimerWithCheck({
                source: 'cueTimer',
                duration: data[position].cueDelay
            })
        } else if (source === 'cueTimer') {
            currentImage = secondFixationImage;
            setTimerWithCheck({
                source: 'secondFixationTimer',
                duration: data[position].secondFixationDelay
            })
        } else if (source === 'secondFixationTimer') {
            currentImage = targetImage;
            setTimerWithCheck({
                source: 'targetTimer',
                duration: data[position].targetDelay
            })
            data[position].targetOnTime = Date.now();
            responseKey = "none";
            reactionTime = 0;
            beginTimeOnFlag = true;
        } else if (source === 'targetTimer') {
            console.log(data[position])
            if (data[position].correct === -1 && data[position].blockNumber === 0) {
                setTimerWithCheck({
                    source: 'feedbackTimer',
                    duration: feedbackDelay
                })
                displayFeedback()
            } else if (data[position].subject.age <= 12) {
                setTimerWithCheck({
                    source: 'feedbackTimer',
                    duration: feedbackDelay
                })
                displayFeedback()
            } else {
                currentImage = lastFixationImage;
                setTimerWithCheck({
                    source: 'lastFixationTimer',
                    duration: data[position].lastFixationDelay
                })
            }
        } else if (source === 'feedbackTimer') {
            if (data[position].subject.age <= 12) {
                setMessageToLayout("Child function not yet implemented", () => { navigate('../')});
            } else {
                currentImage = lastFixationImage;
                setTimerWithCheck({
                    source: 'lastFixationTimer',
                    duration: data[position].lastFixationDelay
                })
            }
        } else if (source === 'lastFixationTimer') {
            if (data.length > 0) {
                if (data[position].blockNumber !== data[position + 1].blockNumber) {
                    takeBreak(() => {
                        InitComponent();
                        setImageToLayout();
                        setMessageLayout(false)
                    })
                    return;
                }
                InitComponent()
            } else {
                takeBreak(() => {
                    stopDisplay()
                    setImageToLayout()
                    setMessageLayout(false)
                })
                return;
            }
        }

        setImageToLayout()
    }

    const displayFeedback = () => {
        if (feedbackOnFlag) {
            return;
        }
        feedbackOnFlag = true;
        if (data[position].subject.age <= 12) {
            setMessageToLayout("Child method not available", () => { navigate('../')});
        } else {
            displayAdultFeedback();
        }
    }

    const setTimerWithCheck = (object) => {
        if (object.source !== timer.source){
            setTimer(object);
        }
    }

    const displayAdultFeedback = () => {
        if (data[position].blockNumber !== 0) {
            currentImage = lastFixationImage;
        } else {
            clearTimeout()
            setTimerWithCheck({
                source: 'feedbackTimer',
                duration: feedbackDelay
            })
            if (data[position].correct === 1) {
                currentImage = image.correctImage;
            } else if (data[position].correct === 0) {
                currentImage = image.incorrectImage;
            } else currentImage = image.noresponseImage;
        }

        setImageToLayout()
    }

    const setImageToLayout = () => {
        console.log(`currentImage: ${currentImage} ${currentImage === image.correctImage} ${currentImage === image.incorrectImage} ${currentImage === image.noresponseImage}`)
        if (currentImage === image.cueImage) {
            if (data[position].cueLocation !== "nocue") {
                if (data[position].cueLocation === 'centercue') {
                    setImagetoState(currentImage, ['center']);
                    return;
                } else if (data[position].cueLocation === 'doublecue') {
                    setImagetoState(currentImage, ['upper', 'lower']);
                    return;
                } else if (data[position].cueLocation === 'invalidcue') {
                    let tmpCueLocation = []
                    if (cueLocation === -1) {
                        tmpCueLocation = ['lower']
                    } else if (cueLocation === 1) {
                        tmpCueLocation = ['upper']
                    }
                    setImagetoState(currentImage, tmpCueLocation);
                    return;
                } else if (data[position].cueLocation === 'spatialcue') {
                    let tmpCueLocation = [];
                    if (cueLocation === -1) {
                        tmpCueLocation = ['upper']
                    } else if (cueLocation === 1) {
                        tmpCueLocation = ['lower']
                    }
                    setImagetoState(currentImage, tmpCueLocation)
                    return;
                }
            }
        } else if (currentImage === targetImage) {
            let tmpTargetLocation;
            if (targetLocation === -1) {
                tmpTargetLocation = ['upper']
            } else if (targetLocation === 1) {
                tmpTargetLocation = ['lower']
            } else tmpTargetLocation = ['center']
            setImagetoState(currentImage, tmpTargetLocation)
            return;
        }

        if (currentImage === image.correctImage || currentImage === image.incorrectImage || currentImage === image.noresponseImage) {
            setImagetoState(currentImage, ['center'])
        } else {
             setImagetoState('',[])
        }
    }

    const setImagetoState = (image, positions) => {
        setCenterImage('')
        setTargetCenter(false);
        setUpperImage('');
        setTargetTop(false);
        setLowerImage('');
        setTargetBottom(false);
        if (positions.includes('center')) {
            setCenterImage(image);
            setTargetCenter(true)
        }
        if (positions.includes('upper')) {
            setUpperImage(image);
            setTargetTop(true);
        }
        if (positions.includes('lower')) {
            setLowerImage(image);
            setTargetBottom(true);
        }
    }

    const stopDisplay = () => {
        clearTimeout()
        saveData();
    }

    const setMessageToLayout = (message, callback) => {
        setMessageLayout(true);
        setMessage(message);

        setButtonCallback(() => callback);
    }


    const takeBreak = (callback) => {
        let message = '';
        if (data[position].blockNumber === 0) {
            message = "You have finished the pratice block. Click Ok to start the test."
        } else if (data[position].blockNumber === 1) {
            message = "You have finished the first block out of three test blocks. Take a break! click Ok to continue the test."
        } else if (data[position].blockNumber === 2) {
            message = "You have finished the second block out of three test blocks. Take a break! Press ENTER or click CONTINUE to continue the test.";
        } else if (data[position].blockNumber === 3) {
            message = "You have finished the last block out of three test blocks. Click CONTINUE to see the result.";
        }
        setMessageToLayout(message, callback)
    }

    const saveData = () => {
        setLoaded(false);
        TrialDataService.saveTrialData(data).then(() => {
            navigate(`/${uid}/result`)
        }).catch(e => {
            setLoaded(false)
            let message;
            try{
                message = e.response.data.message;
            }catch (e) {
                message = e.message;
            }
            setMessageToLayout(message, () =>{
                saveData();
            })
        })
    }

    const recordReactionTime = (responseDirection) => {
        let endTime = Date.now();
        let response = '';
        if (beginTimeOnFlag && keyReleaseFlag) {
            reactionTime = endTime - data[position].beginTime;
            beginTimeOnFlag = false;
            keyReleaseFlag = false;
            if (responseDirection === 'ArrowLeft') {
                response = 'left';
            } else if (responseDirection === 'ArrowRight') {
                response = 'right';
            }
        } else {
            keyReleaseFlag = false;
        }
        data[position].rt = reactionTime;
        if (data[position].correctResponse === response) {
            data[position].correct = 1;
        } else {
            data[position].correct = 0;
        }
        displayFeedback()
    }

    const handleKeyDown = (e) => {
        if (messageLayout) {
            if (e.key === 'Enter' && uid !== '') {
                setMessageLayout(false);
                setMessage('');
            }else navigate('../')
        } else if(timer.source === 'targetTimer'){
            if (e.key === 'ArrowLeft') {
                recordReactionTime(e.key)
            } else if (e.key === 'ArrowRight') {
                recordReactionTime(e.key)
            } else if (e.key === 'Escape') {
                stopDisplay()
            }
        }
    }

    return (
        (loaded ?
            <div style={(type === 'child' ? styleChild : styleAdult)}  tabIndex={0} ref={focusRef} onFocus={() => console.log("Focus succes")}>
                <Toolbar/>
                <div className={'uid'}><p>UID: {uid}</p></div>
                {(messageLayout ?
                    <MessageLayout message={message} onButtonClick={buttonCallback}/>
                    :
                    <div className='flex-container' style={{
                        height: 'fit-content',
                        width: '50%',
                        margin: 'auto',
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        right: '0',
                        bottom: '0'
                    }}>
                        <img className='image-width-50' style={{height: '48px', width: 'auto', margin: '4px 0px'}}
                             alt='' src={targetTop ? uri + assetUrl.image + upperImage + ".gif" : undefined}/>
                        <div className={'frame-container image-width-50'} style={{height: '48px', margin: '4px 0px'}}>
                            <img className={'frame-item image-width-50'} alt=''
                                 src={uri + assetUrl.image + image.fixationImage + ".gif"}/>
                            {targetCenter && <img className={'frame-item image-width-50'} alt=''
                                 src={uri + assetUrl.image + centerImage + ".gif"}/>}
                        </div>
                        <img className='image-width-50' style={{height: '48px', width: 'auto', margin: '4px 0px'}}
                             alt='' src={(targetBottom) ? uri + assetUrl.image + lowerImage + ".gif" : undefined}/>
                    </div>)}
            </div>
            :
            <div>
                <Toolbar/>
                <Loading/>
            </div>)

    )
}

export default TrialPage;
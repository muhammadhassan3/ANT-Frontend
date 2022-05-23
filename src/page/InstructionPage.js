import React, {useEffect, useState} from 'react';
import Toolbar from '../component/Toolbar';
import {useNavigate, useLocation} from 'react-router-dom';
import UserDataService from '../service/UserDataService';
import Loading from "../component/Loading";

function InstructionPage() {

  const uri = process.env.REACT_APP_BACKEND_URI
  const navigate = useNavigate();
  const {state} = useLocation();

  const [loaded, setLoaded] = useState(false)
  const [data, setData] = useState({
    type: "",
    message: {
      instruction1: "",
      instruction2: "",
      instruction3: ""
    },
    assets: {
      images: [],
      sounds: []
    },
    assetsUrl: {
      image: "",
      sound: ""
    }
  });

  useEffect(() => {
    if(!state){
      alert("Please enter your data first")
      navigate('../')
    }else{
      UserDataService.getInstructionData(state.token).then(response => {
        setData(response.data)
        setLoaded(true)
      }).catch(error => {
        if(error.response.data.message !== undefined){
          alert(error.response.data.message)
        }else alert(error.message)
      })
    }
  }, []);

  const handleClick = () => {
    const image = () => {
      if(data.type === 'child'){
        return {
          fixationImage: 'fixationpoint',
          cueImage: 'centralcue',
          targetLllllImage: 'lllll',
          targetRrlrrImage: 'rrlrr',
          targetOolooImage: 'ooloo',
          targetRrrrrImage: 'rrrrr',
          targetLlrllImage: 'llrll',
          targetOorooImage: 'ooroo',
          targetLllll1Image: 'lllll1',
          targetRrlrr1Image: 'rrlrr1',
          targetOoloo1Image: 'ooloo1',
          targetRrrrr1Image: 'rrrrr1',
          targetLlrll1Image: 'llrll1',
          targetOoroo1Image: 'ooroo1',
          blankImage: 'blank',
        }
      }else{
        return {
          fixationImage: 'fixationpoint',
          cueImage: 'centralcue',
          targetLllllImage: 'lllll',
          targetRrlrrImage: 'rrlrr',
          targetOolooImage: 'ooloo',
          targetRrrrrImage: 'rrrrr',
          targetLlrllImage: 'llrll',
          targetOorooImage: 'ooroo',
          correctImage: 'correct',
          incorrectImage: 'incorrect',
          noresponseImage: 'noresponse',
        }
      }
    }
    navigate("../trial", {
      state: {
        token: state.token,
        type: data.type,
        images: image(),
        assetsUrl: data.assetsUrl,
      }
    })
  }
  
  return (
    <div>
      <Toolbar/>
      <p className='uid'>UID: {state.token}</p>
      {loaded ?
      <div className='card flex-container'>
        <h4>Instruction</h4>
        <hr className='separator-solid'></hr>
        <p className='row flex-item'>{data.message.instruction1}</p>
        <img src={uri+data.assetsUrl.image+(data.type === "child" ? "ooloo" : "sample")+".gif"} className={'image-width-50 row'} alt={(data.type === "child" ? "ooloo" : "sample")}/>
        <p className='row flex-item'>{data.message.instruction2}</p>
        <img src={uri+data.assetsUrl.image+"rrlrr.gif"} className={'image-width-50 row'} alt="rrlrr.gif"/>
        {data.message.instruction3 !== "" ? <p className='row flex-item'>{data.message.instruction3}</p> : null}
        <div className='row' style={{alignSelf: 'flex-end'}}>
          <button type='button' className='button-blue' onClick={handleClick}>Continue</button>
        </div>
      </div>
      : <Loading/>}
    </div>
  );
}

export default InstructionPage;
import React, {useEffect, useState} from "react";
import Toolbar from "../component/Toolbar";
import {useParams} from "react-router-dom";
import TrialDataService from "../service/TrialDataService";
import Loading from "../component/Loading";
import MessageLayout from "../component/MessageLayout";
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import {Button} from "@mui/material";
import axios from "axios";

function ResultPage() {
    const [data, setData] = useState({});
    const [message, setMessage] = useState("");
    const [buttonCallback, setButtonCallback] = useState(() => () => console.log('buttonAction'));
    const [loaded, setLoaded] = useState(false);
    const [messageLayout, setMessageLayout] = useState(false);
    const {id} = useParams();

    useEffect(() => {
        setLoaded(false)
        TrialDataService.getTrialResult(id).then(response => {
            setData(response.data);
            setLoaded(true);
        }).catch(error => {
            console.log(error)
            setLoaded(true)
            let message;
            try {
                message = error.response.data.message;
            } catch (e) {
                message = error.message;
            }
            setMessage(message);
            setMessageToLayout(message, () => window.location.reload(false));
        });
    }, [id]);

    const setMessageToLayout = (message, callback) => {
        setMessageLayout(true);
        setMessage(message);

        setButtonCallback(() => callback);
    }

    const onDownloadButtonClick = () => {
        axios({
            url: `${process.env.REACT_APP_BACKEND_URI}/api/v1/trial/${id}/result/download`,
            method: 'GET',
            responseType: 'blob',
        }).then(response => {
            console.log(response)
            const blob = new Blob([response.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = response.headers['content-disposition'].split('=')[1];
            a.click();
            window.URL.revokeObjectURL(url);
        }).catch(error => {
            console.log(error)
        });
    }

    return (

        <div>
            <Toolbar/>
            {(loaded ? (
                <>
                    {(messageLayout ? <MessageLayout message={message} onButtonClick={buttonCallback}/> :
                            <div>
                                <p className={'uid'}>UID: {id}</p>
                                <div className={'flex-container card'} style={{alignItems: 'stretch', width: '40%'}}>
                                    <div className={'row'} style={{justifyContent: 'center', margin: '0 0 8px 0'}}>
                                        <h3>Result</h3>
                                    </div>
                                    <hr className='separator-solid'></hr>
                                    <div className={'row'}>
                                        <p className={'flex-item'}>Alerting effect (ms)</p>
                                        <p className={'flex-item'}><b>{data.alert}</b></p>
                                    </div>
                                    <div className={'row'}>
                                        <p className={'flex-item'}>Orienting effect (ms)</p>
                                        <p className={'flex-item'}><b>{data.orient}</b></p>
                                    </div>
                                    <div className={'row'}>
                                        <p className={'flex-item'}>Conflict effect (ms)</p>
                                        <p className={'flex-item'}><b>{data.conflict}</b></p>
                                    </div>
                                    <div className={'row'}>
                                        <p className={'flex-item'}>Mean RT for correct trials (ms)</p>
                                        <p className={'flex-item'}><b>{data.meanrt}</b></p>
                                    </div>
                                    <div className={'row'}>
                                        <p className={'flex-item'}>Mean accuracy (%)</p>
                                        <p className={'flex-item'}><b>{data.accuracy}</b></p>
                                    </div>
                                    <div className={'row'} style={{alignSelf: 'center', alignItems: 'center'}}>
                                        <Button variant={"outlined"} title={'Download result'}
                                                onClick={onDownloadButtonClick}><DownloadRoundedIcon/></Button>
                                    </div>
                                </div>
                            </div>
                    )}
                </>
            ) : (
                <Loading/>
            ))}
        </div>

    )
}

export default ResultPage;
import React, {useState} from "react"
import {useNavigate} from "react-router-dom";
import {
    Button,
    FilledInput,
    FormControl, FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    TextField
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Loading from "../component/Loading";
import Toolbar from "../component/Toolbar";
import AdminDataServices from "../service/AdminDataServices";


function AdminLoginPage() {
    const [username, setUsername] = useState({value: '', errorMessage: '', error: false});
    const [password, setPassword] = useState({value: '', errorMessage: '', error: false, showPassword: false});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChangeUsername = (event) => {
        setUsername({value: event.target.value, errorMessage: '', error: false})
    }
    const handlePasswordChange = (event) => {
        setPassword(prevState => ({ ...prevState, value: event.target.value, errorMessage: '', error: false}));
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }

    const handleClickShowPassword = () => {
        setPassword(prevState => ({ ...prevState, showPassword: !prevState.showPassword }));
    }

    const handleButtonLogin = () => {
        let isFormFilled = true;
        if (!username.value) {
            setUsername(prevState => ({...prevState, errorMessage: 'Username is required', error: true}));
            isFormFilled = false;
        }
        if(!password.value) {
            setPassword(prevState => ({...prevState, errorMessage: 'Password is required', error: true}));
            isFormFilled = false;
        }
        if(isFormFilled) {
            setLoading(true);
            AdminDataServices.adminLogin({username: username.value, password: password.value}).then(response => {
                setLoading(false);
                const token = response.data.token;
                localStorage['admin-token'] = token;
                navigate("/admin/dashboard",{state: {token: token}})
            }).catch(error => {
                console.log(error)
                setLoading(false);
                let message;
                try{
                    message = error.response.data.message;
                }catch (e){
                    message = error.message;
                }
                alert(message);
            })
        }
    }

    return (
        <div>
            <Toolbar title='Admin Login Page'/>
            {loading ? <Loading/> : <><div className={"card flex-container"}>
                <TextField sx={{m: 1, width: '25ch'}} variant='filled' label='Username'
                           value={username.value} onChange={handleChangeUsername} error={username.error}
                           helperText={username.errorMessage} autoFocus/>
                <FormControl sx={{m: 1, width: '25ch'}} variant="filled">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <FilledInput
                        id="outlined-adornment-password"
                        type={password.showPassword ? 'text' : 'password'}
                        value={password.value}
                        onChange={handlePasswordChange}
                        error={password.error}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={password.showPassword ? 'Hide password' : 'Show password'}
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {password.showPassword ? <VisibilityOff/> : <Visibility/>}
                                </IconButton>
                            </InputAdornment>
                        }

                        label="Password"
                    />
                    <FormHelperText error={password.error} >{password.errorMessage}</FormHelperText>
                </FormControl>
                <Button variant={'contained'} color={'warning'} sx={{m: 1}} onClick={handleButtonLogin}>Login</Button>
            </div></>}

        </div>
    )
}

export default AdminLoginPage
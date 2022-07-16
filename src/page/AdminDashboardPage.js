import React, {useState, useEffect} from 'react';
import {
    AppBar,
    Box,
    Button,
    Grid,
    IconButton,
    Menu,
    MenuItem, Paper,
    styled,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import {useNavigate, useLocation} from "react-router-dom";
import {AccountCircle, DownloadRounded} from "@mui/icons-material";
import AdminDataServices from "../service/AdminDataServices";
import axios from "axios";


function AdminDashboardPage() {
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = useState('');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const {state} = useLocation();
    const [downloadButton, setDownloadButton] = useState({clickable: true});

    useEffect(() => {
        document.title = 'Admin Dashboard'
    }, [])

    useEffect(() => {
        if(state.token){
            AdminDataServices.getAllUsers(state.token).then(response => {
                setData(response.data.data)
                setLoading(false)
            }).catch(err => {
                setLoading(false)
                let message;
                try{
                    message = err.response.data.message
                }catch (e){
                    message = err.message
                }
                alert(message)
                if(err.response.status === 401){
                    localStorage.
                    navigate('/admin/login')
                }
            })
        }else navigate('/admin/login')
    },[])

    const menus = [
        {
            title: "Dashboard",
            urlTarget: '../admin/dashboard'
        },
        {
            title: "Trial List",
            urlTarget: '../admin/trial-list'
        }
    ]

    const handleMenuClick = (url) => {
        if(url === '../admin/trial-list'){
            alert("This section is under construction")
        }else navigate(url);
    }

    const handleOpenAccountMenu = (e) => {
        setAnchorElUser(e.currentTarget)
    }

    const handleCloseAccountMenu = () => {
        setAnchorElUser('')
    }

    const handleLogout = () => {
        setAnchorElUser('')
        localStorage.removeItem('admin-token');
        navigate('../admin/login');
    }
    window.title = "Admin Dashboard";

    const handleDownloadButton = (id) => {
        setDownloadButton({clickable: false})
        axios({
            url: `${process.env.REACT_APP_BACKEND_URI}/api/v1/trial/${id}/result/download`,
            method: 'GET',
            responseType: 'blob',
        }).then(response => {
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
          <AppBar position={'static'} sx={{mb: 2}}>
              <Toolbar>
                  <Typography fontFamily={'inherit'} sx={{fontWeight: 'bold'}}>Admin Panel</Typography>
                  <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'flex-end', mr:2}}>
                      {menus.map((menu) => (
                          <Button key={menu.title} sx={{my: 2, color: 'white', display: 'block'}} onClick={e => handleMenuClick(menu.urlTarget)}>
                              {menu.title}
                          </Button>
                      ))}
                  </Box>
                  <Box sx={{flexGrow: 0}}>
                      <Tooltip title={"Account Settings"} >
                          <IconButton onClick={handleOpenAccountMenu} sx={{p: 0}}>
                              <AccountCircle/>
                          </IconButton>
                      </Tooltip>
                      <Menu sx={{mt: '45px'}} anchorEl={anchorElUser} anchorOrigin={{vertical: 'top', horizontal: 'right'}} keepMounted open={Boolean(anchorElUser)} onClose={handleCloseAccountMenu}>
                          <MenuItem key={'Logout'} onClick={handleLogout}>
                              <Typography textAlign={'center'}>Logout</Typography>
                          </MenuItem>
                      </Menu>
                  </Box>
              </Toolbar>
          </AppBar>
          <Box sx={{width: '100%'}} flexGrow={1}>
              <div className={'row'} style={{margin: "8 auto"}}>
                  {!loading && data.map((user) => (
                      <div className={'card flex-item flex-container'} style={{width:'30%', alignItems: 'stretch'}} key={user._id}>
                          <div className={'row'}>
                              <Typography variant={'h6'} className={'flex-item'}>User Id</Typography>
                              <Typography className={'flex-item'}>{user.userId}</Typography>
                          </div>
                          <div className={'row'}>
                              <Typography variant={'h6'} className={'flex-item'}>Nama</Typography>
                              <Typography className={'flex-item'}>{user.subjectName}</Typography>
                          </div>
                          <div className={'row'}>
                              <Typography variant={'h6'} className={'flex-item'}>Sesion Number</Typography>
                              <Typography className={'flex-item'}>{user.sessionNumber}</Typography>
                          </div>
                          <div className={'row'}>
                              <Typography variant={'h6'} className={'flex-item'}>Age</Typography>
                              <Typography className={'flex-item'}>{user.age}</Typography>
                          </div>
                          <div className={'row'}>
                              <Typography variant={'h6'} className={'flex-item'}>Gender</Typography>
                              <Typography className={'flex-item'}>{user.sex}</Typography>
                          </div>
                          <div className={'row'}>
                              <Typography variant={'h6'} className={'flex-item'}>Trial Category</Typography>
                              <Typography className={'flex-item'}>{user.trialCategory}</Typography>
                          </div>
                          <div className={'row'}>
                              <Typography variant={'h6'} className={'flex-item'}>Diagonal Window Size</Typography>
                              <Typography className={'flex-item'}>{user.diagonalWindowSize}</Typography>
                          </div>
                          <div className={'row'}>
                              <Typography variant={'h6'} className={'flex-item'}>Distance Eyes And Screen</Typography>
                              <Typography className={'flex-item'}>{user.distanceEyesAndScreen}</Typography>
                          </div>
                          <div className={'row'}>
                              <Button className={'flex-item'} variant={'outlined'} sx={{m: 1}} onClick={() => alert("This section is under construction")}>Show Trial Records</Button>
                              <Tooltip title={"Download excel file"}><IconButton onClick={downloadButton.clickable && (e => handleDownloadButton(user._id))}><DownloadRounded/></IconButton></Tooltip>
                          </div>
                      </div>
                  ))}
              </div>
          </Box>
      </div>
    );
}

export default AdminDashboardPage;
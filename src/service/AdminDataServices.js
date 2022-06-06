import http from "../helper/common-http";


class AdminDataServices{
    adminLogin(data){
        return http.post('/user/admin/login', data)
    }

    getAllUsers(token){
        return http.get('/user/all',{headers: {'Authorization': `Bearer ${token}`}})
    }
}

export default new AdminDataServices()
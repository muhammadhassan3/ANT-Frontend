import http from '../helper/common-http';

class UserDataService{
    save(data){
        return http.post("/user/save", data)
    }

    getInstructionData(uid){
        console.log(uid)
        return http.get("/user/instructions", {params: {id: uid}})
    }
}

export default new UserDataService();
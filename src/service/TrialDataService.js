import http from "../helper/common-http.js";

class TrialDataService{
    getTrialData(uid){
        return http.get("/trial/?id="+uid);
    }

    saveTrialData(data){
        return http.post("/trial/save",data);
    }

    getTrialResult(uid){
        return http.get(`/trial/${uid}/result`);
    }

    downloadData(uid){
        return http.get(`/trial/${uid}/result/download`);
    }
}

export default new TrialDataService();
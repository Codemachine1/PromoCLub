import {atom} from "recoil"

const LoggedInUser=atom({
    key:"LoggedInUser",
    default:null
})
export default LoggedInUser
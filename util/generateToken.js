import EmployeeProfile from "../models/EmployeeProfile";
import User from "../models/User";

export const generateToken = async(empId)=>{
    const user = await EmployeeProfile.findById(empId);
    if(!user){
        return false
    }
        const token = jwt.sign({_id:user._id, role:user.role, email:user.email}, process.env.JWT_SECRET, { 
          expiresIn: '5h' 
        });
return {acessToke:token}
    }

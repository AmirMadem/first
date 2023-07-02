import {postData} from './db-commands.js' 


const usersData = {

  getUsers: async function(fbID) {
		const queryResult = await postData("/getUsers");
        return queryResult;
	},
  getUserByEmail: async function(email){
    const queryResult = await postData("/getUserByEmail",{email:email});
    return queryResult;
  },
  createNewUser : async function(user){
    console.log("createNewUser")
    console.log(user)
    console.log("createNewUser")

    if(!!user.email && !!user.name){
      const queryResult = await postData("/createUser",{user});
      return queryResult;
    }
  }

}

export default usersData;
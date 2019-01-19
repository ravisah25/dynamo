'use strict'
const jwtDecode = require('jwt-decode');
var len = require('object-length');
const dynamoDb = require('./index')

const getLogin = async (req) => {


  var decoded = jwtDecode(req.headers.authorization);
  console.log("decoded", decoded);
  const params = {
    TableName: "user",
    Key: { user_id: decoded.sub }
  }

  try {
    var dataVal = await dynamoDb.get(params).promise();
    console.log("dataVal", dataVal);
    if (len(dataVal) === 0) {
      console.log("True");
      const paramInsert = {
        TableName: "user",
        Item: {
          "user_id": decoded.sub,
          "user_info": decoded
        }
      }
      await dynamoDb.put(paramInsert).promise()
    }
    else {
      return "success"
    }

  } catch (ex) {
    console.error(ex)
    throw ex
  }
}



const getUserData = async (req) => {
  var decoded = jwtDecode(req.headers.authorization);

  const params = {
    TableName: "user",
    Key: { user_id: decoded.sub }
  }
  return await dynamoDb.get(params).promise()
}




/////////////////////profile///////////////
const UserProfile = async (req) => {
  var decoded = jwtDecode(req.headers.authorization);
  const params = {
    TableName: "user",
    Key: { user_id: decoded.sub }
  }
  var profileData = req.body;
  console.log("update", profileData);
  const params1 = {
    TableName: 'user',
    Key: { user_id: decoded.sub },
    UpdateExpression: 'set #user_info = :user_info',
    ExpressionAttributeNames: {
      '#user_info': 'user_info'
    },
    ExpressionAttributeValues: {
      ':user_info': profileData
    }
  }

  await dynamoDb.update(params1).promise()
  return
}




const createUserRecord = async (req) => {
  var packageDetails = req.body;
  console.log("packageDetails", packageDetails);
  var decoded = jwtDecode(req.headers.authorization);

  const params = {
    TableName: 'user',
    Key: { user_id: decoded.sub },
    UpdateExpression: 'set #packageDetails = list_append(if_not_exists(#packageDetails, :empty_list), :packageDetails)',
    ExpressionAttributeNames: {
      '#packageDetails': 'packageDetails'
    },
    ExpressionAttributeValues: {
      ':packageDetails': [packageDetails],
      ':empty_list': []
    }
  }

  try {
    await dynamoDb.update(params).promise()
  } catch (ex) {
    console.error(ex)
    throw ex
  }

}


const contentFunc = async (req) => {
  var data = req.body;
  var decoded = jwtDecode(req.headers.authorization);
  var paramArray = [];
  var updateParams;
  var condition = "false"
  const params = {
    TableName: "user",
    Key: { user_id: decoded.sub }
  }
 
  var allContent = await dynamoDb.get(params).promise()

  const appendParams = {
    TableName: 'user',
    Key: { user_id: decoded.sub },
    UpdateExpression: 'set #contentDetails = list_append(if_not_exists(#contentDetails, :empty_list), :contentDetails)',
    ExpressionAttributeNames: {
      '#contentDetails': 'contentDetails'
    },
    ExpressionAttributeValues: {
      ':contentDetails': [data],
      ':empty_list': []
    }
  }


  console.log("content", len(allContent.Item.contentDetails));
  if (len(allContent.Item.contentDetails) === undefined) {
    await dynamoDb.update(appendParams).promise()
    return await dynamoDb.get(params).promise()
  }
  else {
    allContent.Item.contentDetails.forEach(function (element) {
      paramArray.push(element);
      if (element.content_Id == data.content_Id) {
        condition = "true"
        paramArray.pop();
        paramArray.push(data);

        updateParams  = {
          TableName: 'user',
          Key: { user_id: decoded.sub },
          UpdateExpression: 'set #contentDetails = :contentDetails',
          ExpressionAttributeNames: {
            '#contentDetails': 'contentDetails'
          },
          ExpressionAttributeValues: {
            ':contentDetails': paramArray
          }
        }        
      }

    });
    if (condition == "false") {
      
      await dynamoDb.update(appendParams).promise()
      return await dynamoDb.get(params).promise()
    }
  
    await dynamoDb.update(updateParams).promise()
    return await dynamoDb.get(params).promise()

  }
  
}


module.exports = {
  getLogin,
  createUserRecord,
  getUserData,
  UserProfile,
  contentFunc
}

const AWS = require('aws-sdk');
const config = require('./config.js');
const uuidv1 = require('uuid/v1');


const addLogArchive = function () {
   
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const Item = {
        Id: uuidv1(),
        User: 'Cinthinhagata',
        Log: 'Testando 14:00'
     };

    const params = {
        TableName: config.aws_table_name,
        Item: Item
    };

    // Call DynamoDB to add the item to the table
    docClient.put(params, function (err, data) {
        if (err) {
          console.log("deu erro", err, data)
        } else {
            console.log("deu bom", data)
        }
    });
}


addMovie()
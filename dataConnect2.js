// Runs the mlFunciton with the data from the dataQuery and resultQuery.
function queryDB(mysql, dataQuery, resultQuery, mlFunction){

    var connection = mysql.createConnection({
          host     : 'sql4.freemysqlhosting.net',
          user     : 'sql478053',
          password : 'lM3*bZ2%',
          database : 'sql478053'
    });

    connection.connect();

    // Get the data to use in the tree
    connection.query(dataQuery, [resultQuery, mlFunction], function(err, rows, fields) {
        if (!err){
            mlData = [];
            
           // turn the data into an array 
            Object.keys(rows).forEach(function(key) {
                rowData = [];
                var row = rows[key];
                Object.keys(row).forEach(function(key) {
                    rowData.push(row[key]);
                });
                mlData.push(rowData);
            });

            //Get the data about the results
            connection.query(resultQuery, [mlData, mlFunction], function(err, rows, fields) {
                if (!err){
                    var result = [];
                    Object.keys(rows).forEach(function(key) {
                        var row = rows[key];
                        var val = row[Object.keys(row)[0]]; 
                        result.push(val);
                    });
                    //console.log(mlData); 
                    //console.log(result);

                    // run the machine learning function
                    mlFunction(mlData, result);
                } 
                else{
                    console.log(err)
                }
            });
        }
        else
            console.log('Error while performing Query.');
    });

    //connection.end();

}

function getUniqueFromAr(ar){
    ar.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    return ar;
}

function foodShelterPredictor()
{
    // Convert to single value, instead of array
    console.log(decisionData);
    formatData = [];
    for(var i =0; i < decisionData.length; i++) {
        console.log(decisionData[i]);
        formatData.push(decisionData[i][0]);
    }

    console.log(formatData);
    months = getUniqueFromAr(formatData); 
    console.log(months);

    predeictions = [];
    Object.keys(months).forEach(function(month) {
        predict = [month, decisionTree.classify([month])];
//        console.log(predict);
    });

    //console.log( "Classify : ", decisionTree.classify( ["Mar"] ) 
	return data; 
);
}


function getDataAndBuildDecisionTree(queryResultData,
                                     queryTestData, callback, callbackRender )
{
    //var ml = require('machine_learning');

    var mlFunct = function(mlData, resultData){
        
        // Formatting of data  
        for(i = 0; i < mlData.length; ++i )
        {
           var month = mlData[i].toString();
           month = month.slice(4,7);

           mlData[i] = [month]; 
        }
        
        decisionData = deepcopy(mlData);
        
    	var dt = new ml.DecisionTree({
    	    data : mlData,
    	    result : resultData
    	});
     
    	dt.build();
     
    	//dt.print();
        //dt.prune(1.0); // 1.0 : mingain.
            
        decisionTree = dt;
        console.log(decisionData );
        
        var data = null;
        if( callback != null )
            data = callback();
                
        if( callbackRender != null )
            callbackRender( data );
    }
    
    //
    //exports.world('select Sex, AgeGroup, WorksInArea from HouseholdMembers limit 5',
    //              'select Age from HouseholdMembers limit 5',
    //               mlFunct); 
    
    /*
    SELECT * FROM sql478053.FoodDonations;
     */
     
     // Data: Month, Pounds
     // Test: DonorID
    queryDB(mysql, queryResultData, queryTestData,
                   mlFunct); 
}


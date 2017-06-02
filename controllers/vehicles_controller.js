exports.index=function (req, res) {
	// validations
	// year
	req.checkParams('year', 'Model year is empty').notEmpty();
	req.checkParams('year', 'Model year is not an integer').isInt();
	req.checkParams('year', 'Model year is wrong').isLength({min: 4, max: 4});
	// manufacturer
	req.checkParams('manufacturer', 'Manufacturer is empty').notEmpty();
	req.checkParams('manufacturer', 'manufacturer is wrong').isLength({min: 1, max: 100});
	// manufacturer
	req.checkParams('model', 'Model is empty').notEmpty();
	req.checkParams('model', 'Model is wrong').isLength({min: 1, max: 100});
	// check validations
	req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      res.status(400).send('Errors: ' + util.inspect(result.array()));
      return;
    }
    try{

    
	    client.get(api_url+'/modelyear/'+req.params.year+'/make/'+req.params.manufacturer+'/model/'+req.params.model+'?format.json', function (data, response) {
	    // parsed response body as js object
	    	console.log(data);
	    	if(!data.Message){
	    		res.send({count: 0, results:[]});
	    		return;
	    	} 
		    // raw response 
		    
		    var filterData=[];
		    // filtering data
		    async.eachSeries(data.Results,function(value,callback){
		    	if(req.query.withRating=='true'){
		    		client.get(api_url+'/VehicleId/'+value.VehicleId+'?format.json', function (ratingData, ratingResponse) {
		    			filterData.push({'Description': value.VehicleDescription,'VehicleId': value.VehicleId , withRating: ratingData.Results[0].OverallRating});
		    			callback();	
		    		});
		    	}
		    	else{
		    		filterData.push({'Description': value.VehicleDescription,'VehicleId': value.VehicleId});
		    		callback();	
		    	}
		    
		    }, function done() {
		    		// removing message 
				    delete(data.Message);
				    // pushing filtered Results
				    data.Results=filterData;
				    res.type('application/json');
				  	res.send(data); 
				});
			});
		}
    catch(e){
    	console.log(e);
    	res.send({count: 0,results:[]});	
    }
	  
  });

}
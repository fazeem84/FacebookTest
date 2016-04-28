		var selectedGroups=[];
		var groupArray=[];
		/*feed A post to my FaceBook */
		function feedToMyFaceBook(){
		   var msg=document.getElementById("msgTxt").value;
		   FB.login(function(){
			  
			  FB.api('/me/feed', 'post', {message: msg});
			}, {scope: 'publish_actions'});
		
		}
		/**search Facebook Groups based on search string*/
		function searchFacebookGroups(){
			clearSelectedGroups();
			var groupName=document.getElementById("groupTxt").value;
			FB.login(function(response) {
				if (response.authResponse) {
					 console.log('Welcome!  Fetching Group information.... ');
					 FB.api('/search',
						 {
							"type": "group",
							"q": groupName,
							"fields": "id,name"
						}, function(response) {
						   //console.log('GotGroups, ' + JSON.stringify(response) + '.');
						   var data=response.data;
						   if(data== undefined || data.length==0){
								alert("No Data Returned");
						   } else{
								groupArray=data;
								//populate check box group from Result
								data.forEach(function(entry) {
									var sp  = $('<label>').text(entry.name);
									var chk = $('<input>').attr('type', 'checkbox').attr('value', entry.id);//.attr('attr', group);
									chk.bind('change', function(){
										var groupId=$(this).val();
										isChecked=$(this).is(':checked');
										updateSelectedGroups(groupId,isChecked);
									});
									
									$('#checkDiv').append($('<div>').append(chk).append(sp));
								  }, this);
						   
						   }
						   
						 });
				} else {
				 console.log('User cancelled login or did not fully authorize.');
				}
			});
		}
		function updateSelectedGroups(groupId,isChecked){
		    console.log(groupId+','+isChecked)
			if(isChecked){
			    console.log('adding '+groupId);
				selectedGroups.push(groupId);
			}else{
				console.log('deleting '+groupId);
				
				var index=selectedGroups.indexOf(groupId);
				if(index>-1){
						selectedGroups.splice( index, 1 );
				}
			}
		
		}
		function postPhotosToFacebookGroups(){
				
				var file=$('#file')[0].files[0];
				if(file==undefined){
					alert("Please Select the Image !!!!!!!!!!");
					return;
				}
				var message = prompt("Please enter picture Message", "");
				console.log(message);
				//clearSelectedGroups();
				FB.login(function(){
				
					
		
					var documentData = new FormData();
					documentData.append('source',file);
					documentData.append('message',message);
					for(i=0;i<selectedGroups.length;i++){
						sendImageToFaceBookServer(documentData,selectedGroups[i]);
					}
					
					
				}, {scope: 'publish_actions'});
		
		}
		function sendImageToFaceBookServer(documentData,groupID){
				$.ajax({
						url: 'https://graph.facebook.com/'+groupID+'/photos?access_token=' + FB.getAccessToken(),
						type: 'POST',
						data: documentData,
						cache: false,
						contentType: false,
						processData: false,
						//dataType:'jsonp',
						//crossDomain :true,
						success: function (response) {
							alert("Document uploaded successfully."+JSON.stringify(response));
							groupArray.forEach(function(entry){
							 if(entry.id==groupID){
								$('#uploadResults').append($('<div>').append('Uploaded to '+entry.name));
							 }
							},this);
							
						}
					});
		
		}
		window.onload = function() {
			var input = document.getElementById('file');
			input.addEventListener('change', handleFiles);
			clearSelectedGroups();
		}
		function clearSelectedGroups(){
			selectedGroups=[];
		}

		/*to Update the canvasImage   */
		function handleFiles(e) {
			 var ctx = document.getElementById('canvas').getContext('2d');
				var url = URL.createObjectURL(e.target.files[0]);
				var img = new Image();
				img.onload = function() {
					ctx.drawImage(img, 0, 0,400,500);    
				}
				img.src = url;   
		}
		
		
		
	    
	
		
		

		
		
		
		function getMyGroups(){
				clearSelectedGroups();
				
				FB.login(function(response) {
					if (response.authResponse) {
						 console.log('Welcome!  Fetching MyGroup information.... ');
						 FB.api('/me',function(response) {
								console.log('MyDetails, ' + JSON.stringify(response) + '.');
								getGroupsByID(response.id);
								});
						 
						 
					} else {
					 console.log('User cancelled login or did not fully authorize.');
					}
				});
	
		
		}
		function getGroupsByID(id){
		
			FB.api('/'+id+'/groups',
			  function(response) {
			   //console.log('GotGroups, ' + JSON.stringify(response) + '.');
			   var data=response.data;
			   if(data== undefined || data.length==0){
					alert("No Data Returned");
			   }
			   else{
					groupArray=data;
					data.forEach(function(entry) {
						var sp  = $('<label>').text(entry.name);
						var chk = $('<input>').attr('type', 'checkbox').attr('value', entry.id);//.attr('attr', group);
						chk.bind('change', function(){
							var groupId=$(this).val();
							isChecked=$(this).is(':checked');
							updateSelectedGroups(groupId,isChecked);
						});
						
						$('#checkDiv').append($('<div>').append(chk).append(sp));
					  }, this);
			   
			   }
			   
			 });
		}
		
var XMLHttpRequest=require("xmlhttprequest").XMLHttpRequest;
var xml2js=require("xml2js");
var parser=new xml2js.Parser();


exports.home=function(req,res){
	res.render('home',{title:'Book Store'})
};

exports.post_handler=function(req,res){
	var bname=req.body.book_name;
	if(bname===null){
		alert("Enter Book Name");
	}
	var xhr=new XMLHttpRequest();
	var len;
	var title={};
	xhr.onreadystatechange=function(){
		console.log("State:"+this.readyState);

		if(this.readyState==4){
			parser.parseString(this.responseText,function(err,result){
				var data=result;
				len=data.ISBNdb.BookList[0].BookData.length;
				console.log("Length "+len);
				for(var i=0;i<len;i++){
					title[i]=data.ISBNdb.BookList[0].BookData[i];
					
				}
				console.log(title);
				
		    	res.render('result',{title:bname, data:title, length:len});
			});
		}
	};


	xhr.open("GET","http://isbndb.com/api/books.xml?access_key=QMMEUNJB&index1=full&value1="+bname, true);
	xhr.setRequestHeader('Content-type', 'text/xml');
	xhr.send();
};

exports.detail_handler=function(req,res){

	var isbn=req.params.isbn;

	var xhr=new XMLHttpRequest();
	var xhr1=new XMLHttpRequest();

	xhr.onreadystatechange=function(){
		console.log("State_Detail:"+this.readyState);

		if(this.readyState==4){
			parser.parseString(this.responseText,function(err,result){
				var data=result.ISBNdb.BookList[0].BookData[0];
				var prices=data.Prices[0].Price;
				var title=data.Title[0];
				/*var store_url=prices[0].$.store_url;
				var store_id=prices[0].$.store_id;
				var price=prices[0].$.price;
				var length=prices.length;
				console.log("Url"+store_url+"\nid"+store_id+"\nprice"+price);
				console.log(data);
				console.log(prices);
				console.log("length:"+length)*/

				xhr1.onreadystatechange=function(){
					console.log("State_Detail xhr1:"+this.readyState);

					if(this.readyState==4){
							parser.parseString(this.responseText,function(err,result){
							var data1=result.ISBNdb.BookList[0].BookData[0];
							console.log(data1);
							res.render('detail',{title:title,data:data,prices:prices,data1:data1});
						});
					}
				}
	

				xhr1.open("GET","http://isbndb.com/api/books.xml?access_key=QMMEUNJB&results=texts&index1=isbn&value1="+isbn,true);
				xhr1.setRequestHeader('Content-type','text/xml');
				xhr1.send();
				

			});
		}
	}

	

	xhr.open("GET","http://isbndb.com/api/books.xml?access_key=QMMEUNJB&results=prices&index1=isbn&value1="+isbn,true);
	xhr.setRequestHeader('Content-type','text/xml');
	xhr.send();

	
};
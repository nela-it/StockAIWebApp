import 'dart:convert';
import 'dart:io';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/material.dart';

class Productinfo extends StatefulWidget {
  @override
  _ProductinfoScreenState createState() {
  return _ProductinfoScreenState();
  }
} 
class _ProductinfoScreenState extends State<Productinfo> {
  var loading = true;

  var current_path = ["Home", "Product Info"];

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_)=>_getProductInfo());
  }
  List productInfo;
  _getProductInfo() async {
          SharedPreferences storage = await SharedPreferences.getInstance();
          var user = storage.getString('userData');
          var userData = jsonDecode(user);
          //print(userData["token"]);
          HttpClient client = new HttpClient();
          //client.badCertificateCallback = ((X509Certificate cert, String host, int port) => true);
          String url ='https://api.stockzed.com/api/product/getProductInfo';
          HttpClientRequest request = await client.getUrl(Uri.parse(url));
          request.headers.set('authorization', userData["token"]);
          HttpClientResponse response = await request.close();
           if(response.statusCode == 200){
            String reply = await response.transform(utf8.decoder).join();
              var data = json.decode(reply);
              //print(data["data"]);
              setState(() {
                productInfo = data["data"];
                loading = false;
              });
           }
           else{
              print("get Data");
           }
  }
  _productInfo(Map data){
    return Container(
      padding: EdgeInsets.only(top: 20),
      width: MediaQuery.of(context).size.width / 1.35,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Container(
            margin: EdgeInsets.symmetric(vertical: 5),
            child:Text(data["question"],style: TextStyle(fontSize: 16,color: Colors.black),),
          ),
          Container(
            margin: EdgeInsets.symmetric(vertical: 5),
            child: Text(data["answer"],style:TextStyle(color: Colors.black,fontSize: 10)),
          ), 
          Container(
            width: MediaQuery.of(context).size.width / 1.35,
            margin:EdgeInsets.symmetric(vertical: 5),
            child: Text(data["description"],style: TextStyle(color: Color(0xffa8a8a8),fontSize: 10),),
          )
        ],
      ),
    );
  }
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    if(loading){
      return Expanded(
        child:Center(
        child: CircularProgressIndicator(
          backgroundColor: Colors.transparent,
          strokeWidth: 2,
          valueColor: new AlwaysStoppedAnimation(Color(0xff7b67f0)),
        )
        )
      );
    }
    else{
    return Expanded(
      child: Container(
          padding: EdgeInsets.only(left: 25),
          width: MediaQuery.of(context).size.width,
          decoration: BoxDecoration(
              color: Colors.white,
              ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: RichText(
                  text: new TextSpan(
                    style: new TextStyle(
                      color: Colors.black,
                    ),
                    children: <TextSpan>[
                      new TextSpan(
                          text: current_path[0],
                          style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Color(0xff7b67f0))),
                      new TextSpan(
                          text: " > ", style: TextStyle(color: Colors.grey)),
                      new TextSpan(
                          text: current_path[1],
                          style: TextStyle(color: Colors.grey))
                    ],
                  ),
                ),
              ),
              Expanded(
                child: ListView.builder(
                  itemCount: productInfo.length,
                  itemBuilder: (context,index) {
                    return _productInfo(productInfo[index]);
                  },
                ),
              ),
            ],
          ),
          alignment: Alignment.topLeft,
      )
    );
  }
  }
}
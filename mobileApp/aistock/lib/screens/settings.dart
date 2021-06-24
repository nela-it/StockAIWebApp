import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_icons/flutter_icons.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Settings extends StatefulWidget {
  @override
  _SettingsScreenState createState() {
    return _SettingsScreenState();
  }
}

class _SettingsScreenState extends State<Settings> {
  String dropDownValue1 = 'All Stock Groups', dropDownValue2 = 'Last 30 Days';
  Map userDetails;
  bool loading = true;

  var current_path = ["Home", "Settings"];

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    _getUserData();
  }

  _getUserData() async {
    SharedPreferences storage = await SharedPreferences.getInstance();
    var user = storage.getString('userData');
    var userData = jsonDecode(user);
    HttpClient client = new HttpClient();
    //client.badCertificateCallback=((X509Certificate cert, String host, int port) => true);
    String url = 'https://api.stockzed.com/api/user/userInfo';
    HttpClientRequest request = await client.getUrl(Uri.parse(url));
    request.headers.set('authorization', userData['token']);
    HttpClientResponse response = await request.close();
    if (response.statusCode == 200) {
      String res = await response.transform(utf8.decoder).join();
      var result = json.decode(res);
      print(result);
      setState(() {
        userDetails = result["data"];
        loading = false;
      });
    } else {
      String res = await response.transform(utf8.decoder).join();
      var result = json.decode(res);
      print(result);
      setState(() {
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    print(userDetails);
    if (loading) {
      return Expanded(
          child: Center(
              child: CircularProgressIndicator(
        backgroundColor: Colors.transparent,
        strokeWidth: 2,
        valueColor: new AlwaysStoppedAnimation(Color(0xff7b67f0)),
      )));
    } else {
      return Expanded(
        child: Container(
          color: Color(0xfff5f5f5),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                  itemCount: 1,
                  itemBuilder: (context,index) {
                    return Container(
                      alignment: Alignment.bottomCenter,
                      //color: Color(0xfff5f5f5),
                      //height: double.infinity,
                      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Container(
                            width: MediaQuery.of(context).size.width,
                            margin: EdgeInsets.only(top: 10),
                            //color: Colors.red,
                            child: Text("Settings",
                                style: TextStyle(fontSize: 16, color: Colors.black)),
                          ),
                          Container(
                            padding: EdgeInsets.symmetric(vertical: 10),
                            width: MediaQuery.of(context).size.width,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                Text(
                                  "Name",
                                  style: TextStyle(
                                      color: Color(0xffa8a8a8), fontSize: 12),
                                ),
                                Text(userDetails["username"] ?? '',
                                    style: TextStyle(
                                        fontSize: 16,
                                        color: Colors.black,
                                        fontWeight: FontWeight.w600))
                              ],
                            ),
                          ),
                          Container(
                            padding: EdgeInsets.symmetric(vertical: 10),
                            width: MediaQuery.of(context).size.width,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                Text(
                                  "Phone",
                                  style: TextStyle(
                                      color: Color(0xffa8a8a8), fontSize: 12),
                                ),
                                Text(userDetails["contact_no"] ?? '',
                                    style: TextStyle(
                                        fontSize: 16,
                                        color: Colors.black,
                                        fontWeight: FontWeight.w600))
                              ],
                            ),
                          ),
                          Container(
                            padding: EdgeInsets.symmetric(vertical: 10),
                            width: MediaQuery.of(context).size.width,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                Text(
                                  "Email",
                                  style: TextStyle(
                                      color: Color(0xffa8a8a8), fontSize: 12),
                                ),
                                Text(userDetails["email"] ?? '',
                                    style: TextStyle(
                                        fontSize: 16,
                                        color: Colors.black,
                                        fontWeight: FontWeight.w600))
                              ],
                            ),
                          ),
                          Container(
                            padding: EdgeInsets.symmetric(vertical: 10),
                            width: MediaQuery.of(context).size.width / 1.5,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                Text(
                                  "Address",
                                  style: TextStyle(
                                      color: Color(0xffa8a8a8), fontSize: 12),
                                ),
                                Text(userDetails["address"] ?? '',
                                    style: TextStyle(
                                        fontSize: 16,
                                        color: Colors.black,
                                        fontWeight: FontWeight.w600))
                              ],
                            ),
                          ),
                          Container(
                            padding: EdgeInsets.symmetric(vertical: 10),
                            width: MediaQuery.of(context).size.width,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                Text(
                                  "Subscription Plan",
                                  style: TextStyle(
                                      color: Color(0xffa8a8a8), fontSize: 12),
                                ),
                                Text("Enterprise Plan",
                                    style: TextStyle(
                                        fontSize: 16,
                                        color: Colors.black,
                                        fontWeight: FontWeight.w600))
                              ],
                            ),
                          )
                        ],
                      ),
                    );
                  },
                ),
              ),
              Stack(
                alignment: Alignment.topCenter,
                children: <Widget>[
                  Container(
                    height: 80,
                    width: 80,
                    padding: EdgeInsets.only(top: 10),
                    alignment: Alignment.topCenter,
                    decoration: BoxDecoration(
                        color: Color(0xff5946a8),
                        borderRadius: BorderRadius.circular(40)),
                    child: Icon(
                      Octicons.getIconData("pencil"),
                      color: Colors.white,
                      size: 14,
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 25),
                    padding: EdgeInsets.symmetric(vertical: 5),
                    width: MediaQuery.of(context).size.width,
                    alignment: Alignment.bottomCenter,
                    decoration: BoxDecoration(
                      color: Color(0xff5946a8),
                    ),
                    child: MaterialButton(
                      height: 50,
                      minWidth: MediaQuery.of(context).size.width,
                      onPressed: () {},
                      child: Text(
                        "Change Settings",
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ),
                ],
              )
            ],
          ),
        ),
      );
    }
  }
}

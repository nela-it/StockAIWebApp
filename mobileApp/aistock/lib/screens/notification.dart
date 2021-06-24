import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class notification extends StatefulWidget {
  @override
  _notificationState createState() => _notificationState();
}

class _notificationState extends State<notification> {
  bool loading = true;

  List notificationData = [];

  @override
  void initState() {
    _getNotification();
  }

  var current_path = ["Home", "Notifications"];

  _getNotification() async {
    SharedPreferences storage = await SharedPreferences.getInstance();
    var user = storage.getString('userData');
    var userData = jsonDecode(user);
    HttpClient client = new HttpClient();
    String url = 'https://api.stockzed.com/api/user/getAlertNotify';
    HttpClientRequest request = await client.getUrl(Uri.parse(url));
    request.headers.set('authorization', userData["token"]);
    HttpClientResponse response = await request.close();
    if (response.statusCode == 200) {
      String res = await response.transform(utf8.decoder).join();
      var result = json.decode(res);
      print(result);
      setState(() {
        notificationData = result["data"];
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
    return Expanded(
      child: Container(
        padding: EdgeInsets.all(10),
        child: Column(
          children: <Widget>[
            Row(
              children: <Widget>[
                RichText(
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
                          style: TextStyle(
                              color: Color(0xff7b67f0), fontSize: 13)),
                    ],
                  ),
                ),
              ],
            ),
            Padding(padding: EdgeInsets.only(top: 10)),
            Expanded(
              child: loading
                  ? Center(
                      child: CircularProgressIndicator(
                      backgroundColor: Colors.transparent,
                      strokeWidth: 2,
                      valueColor: new AlwaysStoppedAnimation(Color(0xff7b67f0)),
                    ))
                  : notificationData.length > 0 && notificationData != null
                      ? Container(
                          height: MediaQuery.of(context).size.height,
                          color: Color(0xfff5f5f5),
                          child: ListView.builder(
                            itemCount: notificationData.length,
                            itemBuilder: (BuildContext context, int index) {
                              return Card(
                                child: Container(
                                  width: MediaQuery.of(context).size.width,
                                  padding: EdgeInsets.all(8),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: <Widget>[
                                      Text(
                                          "${notificationData[index]["message"]}",
                                          style: TextStyle(fontSize: 16)),
                                      Text(
                                          "${notificationData[index]["messageType"]}",
                                          style: TextStyle(
                                              color: Colors.grey[600])),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        )
                      : Text("No Notification Available"),
            )
          ],
        ),
      ),
    );
  }
}

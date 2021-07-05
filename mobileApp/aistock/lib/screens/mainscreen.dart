import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_icons/flutter_icons.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart';

// OLD main screen
/*import 'package:shared_preferences/shared_preferences.dart';

class MainScreen extends StatefulWidget {
  @override
  _MainScreenState createState() {
    return _MainScreenState();
  }
}

class _MainScreenState extends State<MainScreen> {
  final List list = [
    {
      "title": "Group",
      "subtitle": "Lion Stocks",
      "image": "lib/assets/images/lion.png"
    },
    {
      "title": "Group",
      "subtitle": "Tiger Stocks",
      "image": "lib/assets/images/tiger.png"
    },
    {
      "title": "Group",
      "subtitle": "Elephant Stocks",
      "image": "lib/assets/images/elephant.png"
    },
    {
      "title": "Group",
      "subtitle": "Wolf Stocks",
      "image": "lib/assets/images/wolf.png"
    },
    {
      "title": "Group",
      "subtitle": "Snake Stocks",
      "image": "lib/assets/images/snack.png"
    },
    {
      "title": "Group",
      "subtitle": "Shark Stocks",
      "image": "lib/assets/images/shark.png"
    },
    {
      "title": "Group",
      "subtitle": "Eagle Stocks",
      "image": "lib/assets/images/eagle.png"
    },
    {
      "title": "Group",
      "subtitle": "Monkey Stocks",
      "image": "lib/assets/images/monkey.png"
    },
    {
      "title": "Group",
      "subtitle": "Whale Stocks",
      "image": "lib/assets/images/whale.png"
    },
    {
      "title": "Group",
      "subtitle": "Pigeon Stocks",
      "image": "lib/assets/images/pigeon.png"
    },
    {
      "title": "Group",
      "subtitle": "Eagle Stocks",
      "image": "lib/assets/images/eagle.png"
    },
    {
      "title": "Group",
      "subtitle": "Monkey Stocks",
      "image": "lib/assets/images/monkey.png"
    },
    {
      "title": "Group",
      "subtitle": "Whale Stocks",
      "image": "lib/assets/images/whale.png"
    },
    {
      "title": "Group",
      "subtitle": "Pigeon Stocks",
      "image": "lib/assets/images/pigeon.png"
    },
  ];

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Expanded(
        child: Container(
            decoration: BoxDecoration(color: Color(0xfff5f5f5)),
            child: GridView.builder(
              //crossAxisCount: 2,
              gridDelegate: new SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 2.0,
              ),
              itemCount: list.length,
              //padding: new EdgeInsets.all(8.0),
              itemBuilder: (BuildContext context, int index) {
                return Container(
                    //color: Colors.red,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.all(Radius.circular(5)),
                      color: Colors.white,
                    ),
                    margin: EdgeInsets.all(5),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: <Widget>[
                        Container(
                          margin: EdgeInsets.only(left: 10),
                          child: Image.asset(
                            list[index]["image"],
                            height: 30,
                            width: 30,
                          ),
                        ),
                        Container(
                          width: 90,
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              Text(
                                list[index]["title"],
                                style: TextStyle(fontSize: 12),
                              ),
                              Text(list[index]["subtitle"],
                                  style: TextStyle(
                                      fontSize: 12, color: Color(0xff5946a8)))
                            ],
                          ),
                        ),
                        GestureDetector(
                          onTap: () {},
                          child: Container(
                            width: 35,
                            height: double.infinity,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.only(
                                  topRight: Radius.circular(5),
                                  bottomRight: Radius.circular(5)),
                              color: Color(0xff5946a8),
                            ),
                            child: Icon(
                              MaterialCommunityIcons.getIconData("plus"),
                              size: 18,
                              color: Colors.white,
                            ),
                          ),
                        )
                      ],
                    ));
              },
            )) //alignment: Alignment.topCenter,
        );
  }
}*/

class MainScreen extends StatefulWidget {
  @override
  _MainScreenState createState() {
    return _MainScreenState();
  }
}

class _MainScreenState extends State<MainScreen> {
  //  List list = [
  //   {"title":"Group","subtitle" : "Lion Stocks","image":"lib/assets/images/lion.png"},
  //   {"title":"Group","subtitle" : "Tiger Stocks","image":"lib/assets/images/tiger.png"},
  //   {"title":"Group","subtitle" : "Elephant Stocks","image":"lib/assets/images/elephant.png"},
  //   {"title":"Group","subtitle" : "Wolf Stocks","image":"lib/assets/images/wolf.png"},
  //   {"title":"Group","subtitle" : "Snake Stocks","image":"lib/assets/images/snack.png"},
  //   {"title":"Group","subtitle" : "Shark Stocks","image":"lib/assets/images/shark.png"},
  //   {"title":"Group","subtitle" : "Eagle Stocks","image":"lib/assets/images/eagle.png"},
  //   {"title":"Group","subtitle" : "Monkey Stocks","image":"lib/assets/images/monkey.png"},
  //   {"title":"Group","subtitle" : "Whale Stocks","image":"lib/assets/images/whale.png"},
  //   {"title":"Group","subtitle" : "Pigeon Stocks","image":"lib/assets/images/pigeon.png"},
  //   ];
  List stockListData = [];
  List algorithms = [];
  var details = false, stockList = false, loading = true, algorithm = false;
  var dropDownValue1 = 'Large Cap',
      dropDownValue2 = 'Health Care',
      dropDownValue3 = 'Up',
      groupName = '';
  List stockData;

  Map stockDetails;
  var current_path = ["Home", "Prediction Group", "Stock"];

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    _getGroups();
  }

  _getGroups() async {
    SharedPreferences storage = await SharedPreferences.getInstance();
    var user = storage.getString('userData');
    var userData = jsonDecode(user);
    HttpClient client = new HttpClient();
    //client.badCertificateCallback = ((X509Certificate cert, String host, int port) => true);
    String url = 'https://api.stockzed.com/api/prediction_group/getGroups';
    HttpClientRequest request = await client.getUrl(Uri.parse(url));
    request.headers.set('authorization', userData["token"]);
    HttpClientResponse response = await request.close();
    if (response.statusCode == 200) {
      String res = await response.transform(utf8.decoder).join();
      var result = json.decode(res);
      print(result);
      setState(() {
        stockData = result["data"];
        loading = false;
        for(int i=0; i<stockData.length ;i++){
          print(stockData[i]["imagePath"]);
        }
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

  _exploreGroups(stock) async {
    setState(() {
      loading = true;
    });
    print(stock);
    var id = stock["id"];
    var bytesInLatin1 = latin1.encode(id.toString());
    var base64encoded = base64.encode(bytesInLatin1);

    var reqBody = {"group_id": base64encoded};
    //print(reqBody);
    SharedPreferences storage = await SharedPreferences.getInstance();
    var user = storage.getString('userData');
    var userData = jsonDecode(user);
    HttpClient client = new HttpClient();
    //client.badCertificateCallback = ((X509Certificate cert, String host, int port) => true);
    String url = 'https://api.stockzed.com/api/prediction_group/exploreGroups';
    HttpClientRequest request = await client.postUrl(Uri.parse(url));
    request.headers.set('authorization', userData["token"]);
    request.headers.set('content-type', 'application/json');
    request.add(utf8.encode(json.encode(reqBody)));
    HttpClientResponse response = await request.close();
    if (response.statusCode == 200) {
      String reply = await response.transform(utf8.decoder).join();
      Map data = json.decode(reply);
      print("explore Group" + data.toString());
      setState(() {
        stockList = true;
        stockListData = data["data"];
        groupName = stock["group_name"];
        loading = false;
      });
    } else {
      String reply = await response.transform(utf8.decoder).join();
      Map data = json.decode(reply);
      print(data["message"]);
      setState(() {
        loading = false;
      });
    }
  }

  _getAlgorithm(stock) async {
    print("Algorithm Stock==============$stock");
    var reqBody = {
      "groupId": stock["group_id"].toString(),
    };
    SharedPreferences storage = await SharedPreferences.getInstance();
    var user = storage.getString('userData');
    var userData = jsonDecode(user);
    HttpClient client = new HttpClient();
    //client.badCertificateCallback = ((X509Certificate cert, String host, int port) => true);
    String url = 'https://api.stockzed.com/api/algorithm/getAlgorithm';
    HttpClientRequest request = await client.postUrl(Uri.parse(url));
    request.headers.set('authorization', userData["token"]);
    request.headers.set('content-type', 'application/json');
    request.add(utf8.encode(json.encode(reqBody)));
    HttpClientResponse response = await request.close();
    if (response.statusCode == 200) {
      String reply = await response.transform(utf8.decoder).join();
      Map data = json.decode(reply);
      print("Algorithms============ $data");
      setState(() {
        algorithms = data["data"];
      });
    } else {
      String reply = await response.transform(utf8.decoder).join();
      Map data = json.decode(reply);
      print(data["message"]);
    }
  }

  _getStockInfo(stock) async {
    setState(() {
      loading = true;
    });
    var reqBody = {
      "realId": stock["real_time_price"]["id"].toString(),
      "stockId": stock["id"].toString()
    };
    print("->>" + reqBody.toString());
    SharedPreferences storage = await SharedPreferences.getInstance();
    var user = storage.getString('userData');
    var userData = jsonDecode(user);
    HttpClient client = new HttpClient();
    //client.badCertificateCallback = ((X509Certificate cert, String host, int port) => true);
    String url = 'https://api.stockzed.com/api/stocks/getStockInfo';
    HttpClientRequest request = await client.postUrl(Uri.parse(url));
    request.headers.set('authorization', userData["token"]);
    request.headers.set('content-type', 'application/json');
    request.add(utf8.encode(json.encode(reqBody)));
    HttpClientResponse response = await request.close();
    if (response.statusCode == 200) {
      String reply = await response.transform(utf8.decoder).join();
      Map data = json.decode(reply);
      //print(data);
      setState(() {
        details = true;
        stockList = false;
        loading = false;
        stockDetails = data["data"];
      });
      _getAlgorithm(stock);
    } else {
      String reply = await response.transform(utf8.decoder).join();
      Map data = json.decode(reply);
      print(data["message"]);
      setState(() {
        loading = false;
      });
    }
  }

  _addToPortfolio(stock) async {
    var snackbarMessage;
    var reqBody = {
      "realId": stock["real_time_price"]["id"].toString(),
      "stockId": stock["id"].toString()
    };
    SharedPreferences storage = await SharedPreferences.getInstance();
    var user = storage.getString('userData');
    var userData = jsonDecode(user);
    HttpClient client = new HttpClient();
    //client.badCertificateCallback = ((X509Certificate cert, String host, int port) => true);
    String url = 'https://api.stockzed.com/api/portfolio/addPortfolio';
    HttpClientRequest request = await client.postUrl(Uri.parse(url));
    request.headers.set('authorization', userData["token"]);
    request.headers.set('content-type', 'application/json');
    request.add(utf8.encode(json.encode(reqBody)));
    HttpClientResponse response = await request.close();
    if (response.statusCode == 200) {
      String reply = await response.transform(utf8.decoder).join();
      Map data = json.decode(reply);
      print(data["message"]);
      snackbarMessage = data["message"];
    } else {
      String reply = await response.transform(utf8.decoder).join();
      Map data = json.decode(reply);
      print(data["message"]);
      snackbarMessage = data["message"];
    }
    var snackBar = SnackBar(
      backgroundColor: Color(0xff7b67ef),
      content: Text(snackbarMessage),
    );
    Scaffold.of(context).showSnackBar(snackBar);
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    if (loading) {
      return Expanded(
          child: Center(
              child: CircularProgressIndicator(
                backgroundColor: Colors.transparent,
                strokeWidth: 2,
                valueColor: new AlwaysStoppedAnimation(Color(0xff7b67f0)),
              )));
    } else {
      if (stockList) {
        return (Expanded(
            child: Container(
              child: Column(children: <Widget>[
                Row(
                  children: <Widget>[
                    Container(
                      //width: MediaQuery.of(context).size.width,
                        alignment: Alignment.centerLeft,
                        child: MaterialButton(
                          minWidth: 10,
                          onPressed: () {
                            setState(() {
                              stockList = false;
                            });
                          },
                          child: Icon(MaterialIcons.getIconData("arrow-back"),
                              color: Color(0xff5946a8)),
                        )),
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
                          new TextSpan(
                              text: " > ", style: TextStyle(color: Colors.grey)),
                          new TextSpan(
                              text: "$groupName Stocks",
                              style: TextStyle(color: Colors.grey, fontSize: 13))
                        ],
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: EdgeInsets.only(top: 20, left: 20),
                  color: Color(0xfff5f5f5),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Text(
                        "$groupName Stocks",
                        style: TextStyle(
                            color: Colors.black,
                            fontWeight: FontWeight.w600,
                            fontSize: 16),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: EdgeInsets.only(top: 5, bottom: 5),
                  color: Color(0xfff5f5f5),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: <Widget>[
                      Container(
                          height: 30,
                          margin: EdgeInsets.symmetric(horizontal: 5),
                          padding: EdgeInsets.symmetric(horizontal: 5),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(5),
                            border: Border.all(
                                color: Color(0xff5946a8),
                                style: BorderStyle.solid,
                                width: 1),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              items: <String>['Large Cap', 'Mid Cap', 'Small Cap']
                                  .map((String value) {
                                return DropdownMenuItem(
                                  value: value,
                                  child: Text(value),
                                );
                              }).toList(),
                              hint: Text("Market Cap"),
                              onChanged: (value) {
                                setState(() {
                                  dropDownValue1 = value;
                                });
                              },
                              icon: Icon(
                                  MaterialIcons.getIconData("keyboard-arrow-down"),
                                  color: Color(0xff5946a8),
                                  size: 22),
                              style:
                              TextStyle(fontSize: 10, color: Color(0xff5946a8)),
                              value: dropDownValue1,
                            ),
                          )),
                      Container(
                          height: 30,
                          margin: EdgeInsets.symmetric(horizontal: 5),
                          padding: EdgeInsets.symmetric(horizontal: 5),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(5),
                            border: Border.all(
                                color: Color(0xff5946a8),
                                style: BorderStyle.solid,
                                width: 1),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              items: <String>[
                                'Health Care',
                                'Tech',
                                'Retail',
                                'Banking & Finance'
                              ].map((String value) {
                                return DropdownMenuItem(
                                  value: value,
                                  child: Text(value),
                                );
                              }).toList(),
                              onChanged: (value) {
                                setState(() {
                                  dropDownValue2 = value;
                                });
                              },
                              icon: Icon(
                                  MaterialIcons.getIconData("keyboard-arrow-down"),
                                  color: Color(0xff5946a8),
                                  size: 22),
                              style:
                              TextStyle(fontSize: 10, color: Color(0xff5946a8)),
                              value: dropDownValue2,
                            ),
                          )),
                      Container(
                          height: 30,
                          margin: EdgeInsets.symmetric(horizontal: 5),
                          padding: EdgeInsets.symmetric(horizontal: 5),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(5),
                            border: Border.all(
                                color: Color(0xff5946a8),
                                style: BorderStyle.solid,
                                width: 1),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              items: <String>[
                                'Up',
                                'Down',
                              ].map((String value) {
                                return DropdownMenuItem(
                                  value: value,
                                  child: Text(value),
                                );
                              }).toList(),
                              onChanged: (value) {
                                setState(() {
                                  dropDownValue3 = value;
                                });
                              },
                              icon: Icon(
                                  MaterialIcons.getIconData("keyboard-arrow-down"),
                                  color: Color(0xff5946a8),
                                  size: 22),
                              style:
                              TextStyle(fontSize: 10, color: Color(0xff5946a8)),
                              value: dropDownValue3,
                            ),
                          ))
                    ],
                  ),
                ),
                Expanded(
                  child: Container(
                    color: Color(0xfff5f5f5),
                    child: ListView.builder(
                      itemCount: stockListData.length,
                      itemBuilder: (BuildContext context, int index) {
                        return (GestureDetector(
                            onTap: () {
                              _getStockInfo(stockListData[index]);
                            },
                            child: Container(
                                height: 180,
                                margin: EdgeInsets.symmetric(
                                    horizontal: 25, vertical: 5),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius:
                                  BorderRadius.all(Radius.circular(10)),
                                ),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.only(
                                      bottomRight: Radius.circular(10)),
                                  child: Stack(
                                    alignment: Alignment.bottomRight,
                                    children: <Widget>[
                                      Container(
                                        padding:
                                        EdgeInsets.symmetric(horizontal: 15),
                                        child: Column(
                                          crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                          mainAxisAlignment:
                                          MainAxisAlignment.center,
                                          children: <Widget>[
                                            Row(
                                              mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                              children: <Widget>[
                                                Row(
                                                  children: <Widget>[
                                                    Image.network(
                                                      "${stockListData[index]["ticker_image"]}",
                                                      height: 40,
                                                      width: 40,
                                                    ),
                                                    Container(
                                                        padding: EdgeInsets.only(
                                                            left: 5, top: 10),
                                                        alignment:
                                                        Alignment.bottomCenter,
                                                        child: Column(
                                                          mainAxisAlignment:
                                                          MainAxisAlignment.end,
                                                          crossAxisAlignment:
                                                          CrossAxisAlignment
                                                              .start,
                                                          children: <Widget>[
                                                            Text(
                                                              "Stock Name",
                                                              style: TextStyle(
                                                                  fontSize: 10,
                                                                  fontWeight:
                                                                  FontWeight
                                                                      .w300),
                                                            ),
                                                            Text(
                                                              stockListData[index]
                                                              ["stock_name"],
                                                              style: TextStyle(
                                                                  fontSize: 16,
                                                                  color:
                                                                  Colors.black,
                                                                  fontWeight:
                                                                  FontWeight
                                                                      .w500),
                                                            )
                                                          ],
                                                        ))
                                                  ],
                                                ),
                                                Row(
                                                  children: <Widget>[
                                                    Text(
                                                      double.parse(stockListData[
                                                      index][
                                                      "real_time_price"]
                                                      ["current_price"])
                                                          .toStringAsFixed(2),
                                                      style: TextStyle(
                                                          color: Color(0xffb2a5f2),
                                                          fontSize: 24),
                                                    ),
                                                    Icon(
                                                      MaterialIcons.getIconData(
                                                          "arrow-upward"),
                                                      color: Color(0xffb2a5f2),
                                                      size: 30,
                                                    )
                                                  ],
                                                )
                                              ],
                                            ),
                                            Container(
                                                padding: EdgeInsets.only(top: 10),
                                                width: MediaQuery.of(context)
                                                    .size
                                                    .width /
                                                    1.75,
                                                child: Row(
                                                  mainAxisAlignment:
                                                  MainAxisAlignment
                                                      .spaceBetween,
                                                  children: <Widget>[
                                                    Column(
                                                      crossAxisAlignment:
                                                      CrossAxisAlignment.start,
                                                      children: <Widget>[
                                                        Text(
                                                          "Recommended Price",
                                                          style: TextStyle(
                                                              fontSize: 10,
                                                              fontWeight:
                                                              FontWeight.w300),
                                                        ),
                                                        Text(
                                                          '\$${double.parse(stockListData[index]["recommended_price"]).toStringAsFixed(2)}',
                                                          style: TextStyle(
                                                              fontSize: 15,
                                                              color: Colors.black,
                                                              fontWeight:
                                                              FontWeight.w500),
                                                        )
                                                      ],
                                                    ),
                                                    Column(
                                                      crossAxisAlignment:
                                                      CrossAxisAlignment.start,
                                                      children: <Widget>[
                                                        Text(
                                                          "Current Price",
                                                          style: TextStyle(
                                                              fontSize: 10,
                                                              fontWeight:
                                                              FontWeight.w300),
                                                        ),
                                                        Text(
                                                          '\$${double.parse(stockListData[index]["real_time_price"]["current_price"]).toStringAsFixed(2)}',
                                                          style: TextStyle(
                                                              fontSize: 15,
                                                              color: Colors.black,
                                                              fontWeight:
                                                              FontWeight.w500),
                                                        )
                                                      ],
                                                    )
                                                  ],
                                                )),
                                            Container(
                                                padding: EdgeInsets.only(top: 10),
                                                width: MediaQuery.of(context)
                                                    .size
                                                    .width /
                                                    1.75,
                                                child: Row(
                                                  mainAxisAlignment:
                                                  MainAxisAlignment
                                                      .spaceBetween,
                                                  children: <Widget>[
                                                    Column(
                                                      crossAxisAlignment:
                                                      CrossAxisAlignment.start,
                                                      children: <Widget>[
                                                        Text(
                                                          "Suggested Date",
                                                          style: TextStyle(
                                                              fontSize: 10,
                                                              fontWeight:
                                                              FontWeight.w300),
                                                        ),
                                                        Text(
                                                          DateFormat('dd MMMM yyyy')
                                                              .format(DateTime.parse(
                                                              stockListData[
                                                              index][
                                                              "suggested_date"])),
                                                          style: TextStyle(
                                                              fontSize: 15,
                                                              color: Colors.black,
                                                              fontWeight:
                                                              FontWeight.w500),
                                                        )
                                                      ],
                                                    ),
                                                    Column(
                                                      crossAxisAlignment:
                                                      CrossAxisAlignment.start,
                                                      children: <Widget>[
                                                        Text(
                                                          "Target Price  ",
                                                          style: TextStyle(
                                                              fontSize: 10,
                                                              fontWeight:
                                                              FontWeight.w300),
                                                        ),
                                                        Text(
                                                          '\$${stockListData[index]["target_price"]}',
                                                          style: TextStyle(
                                                              fontSize: 15,
                                                              color: Colors.black,
                                                              fontWeight:
                                                              FontWeight.w500),
                                                        )
                                                      ],
                                                    )
                                                  ],
                                                ))
                                          ],
                                        ),
                                      ),
                                      stockListData[index]["addedToPortfolio"]
                                          .toString()
                                          .toLowerCase() ==
                                          "false"
                                          ? Positioned(
                                        bottom: -15,
                                        right: -15,
                                        child: Container(
                                            height: 80,
                                            width: 80,
                                            decoration: BoxDecoration(
                                                color: Color(0xff5946a8),
                                                borderRadius:
                                                BorderRadius.all(
                                                    Radius.circular(40))),
                                            child: MaterialButton(
                                              onPressed: () {
                                                _addToPortfolio(
                                                    stockListData[index]);
                                              },
                                              shape: CircleBorder(),
                                              child: Icon(
                                                Octicons.getIconData(
                                                    "plus-small"),
                                                color: Colors.white,
                                                size: 22,
                                              ),
                                            )),
                                      )
                                          : Container()
                                    ],
                                  ),
                                ))));
                      },
                    ),
                  ),
                ),
                GestureDetector(
                  onVerticalDragUpdate: (dragUpdateDetails) {},
                  child: Container(
                      color: Color(0xfff5f5f5),
                      child: Stack(
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
                              MaterialIcons.getIconData("arrow-upward"),
                              color: Colors.white,
                              size: 18,
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
                              onPressed: null,
                              child: Text(
                                "Grouping Criterea",
                                style: TextStyle(color: Colors.white),
                              ),
                            ),
                          ),
                        ],
                      )),
                )
              ]),
            )));
      } else if (details) {
        return Expanded(
          child: Container(
              child: Column(
                children: <Widget>[
                  Row(
                    children: <Widget>[
                      Container(
                        //alignment: Alignment.centerLeft,
                          child: MaterialButton(
                            minWidth: 9,
                            onPressed: () {
                              setState(() {
                                details = false;
                                stockList = true;
                              });
                            },
                            child: Icon(MaterialIcons.getIconData("arrow-back"),
                                size: 22, color: Color(0xff5946a8)),
                          )),
                      RichText(
                        text: new TextSpan(
                          style: new TextStyle(color: Colors.black),
                          children: <TextSpan>[
                            new TextSpan(
                                text: current_path[0],
                                style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                    color: Color(0xff7b67f0))),
                            new TextSpan(
                                text: " > ", style: TextStyle(color: Colors.grey)),
                            new TextSpan(
                                text: current_path[1],
                                style: TextStyle(
                                    color: Color(0xff7b67f0), fontSize: 11)),
                            new TextSpan(
                                text: " > ", style: TextStyle(color: Colors.grey)),
                            new TextSpan(
                                text: "$groupName Stocks",
                                style: TextStyle(
                                    color: Color(0xff7b67f0), fontSize: 10)),
                            new TextSpan(
                                text: " > ", style: TextStyle(color: Colors.grey)),
                            new TextSpan(
                                text: "${stockDetails["stock_name"]}",
                                style: TextStyle(color: Colors.grey, fontSize: 10)),
                            algorithm
                                ? new TextSpan(
                                text: " > ",
                                style: TextStyle(color: Colors.grey))
                                : TextSpan(text: ""),
                            algorithm
                                ? new TextSpan(
                                text: "Algorithm",
                                style:
                                TextStyle(color: Colors.grey, fontSize: 10))
                                : TextSpan(text: ""),
                            /* new TextSpan(
                            text: " > ", style: TextStyle(color: Colors.grey)),
                        new TextSpan(
                            text: algorithm? "Algorithm" :"${stockDetails["stock_name"]}",
                            style: TextStyle(color: Colors.grey))*/
                          ],
                        ),
                      ),
                    ],
                  ),
                  Expanded(
                    //flex: 1,
                      child: Container(
                          alignment: Alignment.topCenter,
                          decoration: BoxDecoration(
                              color: algorithm ? Colors.white : Color(0xfff5f5f5)),
                          padding: EdgeInsets.only(left: 10, top: 20, right: 10),
                          //child:SingleChildScrollView(
                          child: algorithm
                              ? Container(
                            width: MediaQuery.of(context).size.width / 1.2,
                            child: ListView.builder(
                              itemCount: algorithms.length,
                              itemBuilder: (BuildContext context, int index) {
                                return Container(
                                  //width: 100,
                                    width:
                                    MediaQuery.of(context).size.width / 2,
                                    margin:
                                    EdgeInsets.symmetric(vertical: 10),
                                    child: Column(
                                      crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                      children: <Widget>[
                                        Row(children: <Widget>[
                                          Text(
                                            "0${algorithms[index]["step_no"]}",
                                            style: TextStyle(
                                                color: index == 0
                                                    ? Color(0xffff9c4f)
                                                    : index == 1
                                                    ? Color(0xff46e696)
                                                    : index == 2
                                                    ? Color(
                                                    0xff00b0ed)
                                                    : Color(
                                                    0xffffdc71),
                                                fontSize: 25,
                                                fontWeight: FontWeight.w700),
                                          ),
                                          Container(
                                            margin: EdgeInsets.only(left: 10),
                                            child: Column(
                                              crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                              children: <Widget>[
                                                Text(
                                                  "Step ${algorithms[index]["step_no"] == 1 ? "One" : algorithms[index]["step_no"] == 2 ? "Two" : algorithms[index]["step_no"] == 3 ? "Three" : "Four"}",
                                                ),
                                                Text("Process",
                                                    style: TextStyle(
                                                        color: Color(
                                                            0xffb3b4b6)))
                                              ],
                                            ),
                                          )
                                        ]),
                                        Container(
                                            margin: EdgeInsets.symmetric(
                                                vertical: 5),
                                            child: Text(
                                              "${algorithms[index]["step_details"]}",
                                              style: TextStyle(
                                                  color: Color(0xffb3b4b6)),
                                            )),
                                        Container(
                                          margin: EdgeInsets.symmetric(
                                              vertical: 5),
                                          child: Text(
                                            "This completes task ${index == 0 ? "One." : index == 1 ? "Two." : index == 2 ? "Three." : "Four."}",
                                            style: TextStyle(
                                                color: Colors.black),
                                          ),
                                        )
                                      ],
                                    ));
                              },
                            ),
                          )
                              : SingleChildScrollView(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: <Widget>[
                                  Row(
                                    mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: <Widget>[
                                      Text(
                                        "NASDAQ: ${stockDetails["ticker"]}",
                                        style: TextStyle(
                                            color: Colors.black, fontSize: 20),
                                      ),
                                      Text(
                                        "New York, USA",
                                        style: TextStyle(
                                            color: Color(0xffa8a8a8),
                                            fontSize: 12),
                                      )
                                    ],
                                  ),
                                  Row(
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: <Widget>[
                                      //Text("a",style: TextStyle(fontSize: 70,color:Colors.black,fontWeight:FontWeight.bold),),
                                      Image.network(
                                        "${stockDetails["ticker_image"]}",
                                        height: 40,
                                        width: 40,
                                      ),
                                      Container(
                                        padding:
                                        EdgeInsets.only(left: 5, top: 10),
                                        child: Row(
                                          //mainAxisAlignment: MainAxisAlignment.end,
                                            crossAxisAlignment:
                                            CrossAxisAlignment.end,
                                            children: <Widget>[
                                              Text(
                                                double.parse(stockDetails[
                                                "real_time_price"]
                                                ["current_price"])
                                                    .toStringAsFixed(2),
                                                style: TextStyle(
                                                    color: Color(0xff7f63f4),
                                                    fontSize: 30),
                                              ),
                                              Icon(
                                                MaterialIcons.getIconData(
                                                    "arrow-upward"),
                                                color: Color(0xff7f63f4),
                                                size: 35,
                                              ),
                                            ]),
                                      ),
                                      Container(
                                        // margin: EdgeInsets.only(bottom: 15),
                                        width:
                                        MediaQuery.of(context).size.width / 3,
                                        child: Row(
                                          mainAxisAlignment:
                                          MainAxisAlignment.spaceAround,
                                          children: <Widget>[
                                            Text(
                                                "\$${double.parse(stockDetails["real_time_price"]["today_change"]).toStringAsFixed(2)}",
                                                style: TextStyle(
                                                    color: Color(0xffb4a4f5),
                                                    fontSize: 16,
                                                    fontWeight: FontWeight.w600)),
                                            Text(
                                                "${stockDetails["real_time_price"]["today_change_percentage"]}",
                                                style: TextStyle(
                                                    color: Color(0xff7f63f4),
                                                    fontSize: 16,
                                                    fontWeight: FontWeight.w600))
                                          ],
                                        ),
                                      )
                                    ],
                                  ),
                                  Container(
                                      padding: EdgeInsets.symmetric(vertical: 10),
                                      child: Row(
                                        mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                        children: <Widget>[
                                          Container(
                                            width: MediaQuery.of(context)
                                                .size
                                                .width /
                                                3.5,
                                            alignment: Alignment.topLeft,
                                            child: Column(
                                              crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                              children: <Widget>[
                                                Text(
                                                  "Earning Date",
                                                  style: TextStyle(
                                                      fontSize: 12,
                                                      color: Color(0xffa8a8a8)),
                                                ),
                                                Text(
                                                    DateFormat('dd.MM.yyyy')
                                                        .format(DateTime.parse(
                                                        stockDetails[
                                                        "target_date"])),
                                                    style: TextStyle(
                                                      fontSize: 18,
                                                      color: Colors.black,
                                                    ))
                                              ],
                                            ),
                                          ),
                                          Container(
                                            width: MediaQuery.of(context)
                                                .size
                                                .width /
                                                3,
                                            alignment: Alignment.topLeft,
                                            child: Column(
                                              crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                              children: <Widget>[
                                                Text(
                                                  "Recommended Price",
                                                  style: TextStyle(
                                                      fontSize: 12,
                                                      color: Color(0xffa8a8a8)),
                                                ),
                                                Text(
                                                    "\$${double.parse(stockDetails["recommended_price"]).toStringAsFixed(2)}",
                                                    style: TextStyle(
                                                      fontSize: 18,
                                                      color: Colors.black,
                                                    ))
                                              ],
                                            ),
                                          ),
                                          Container(
                                            width: MediaQuery.of(context)
                                                .size
                                                .width /
                                                4,
                                            alignment: Alignment.topLeft,
                                            child: Column(
                                              crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                              children: <Widget>[
                                                Text(
                                                  "Group",
                                                  style: TextStyle(
                                                      fontSize: 12,
                                                      color: Color(0xffa8a8a8)),
                                                ),
                                                Text(
                                                    stockDetails[
                                                    "Prediction_group"]
                                                    ["group_name"],
                                                    style: TextStyle(
                                                      fontSize: 18,
                                                      color: Colors.black,
                                                    ))
                                              ],
                                            ),
                                          )
                                        ],
                                      )),
                                  Container(
                                      padding: EdgeInsets.symmetric(vertical: 5),
                                      child: Row(
                                        mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                        children: <Widget>[
                                          Container(
                                            width: MediaQuery.of(context)
                                                .size
                                                .width /
                                                3.5,
                                            alignment: Alignment.topLeft,
                                            child: Column(
                                              crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                              children: <Widget>[
                                                Text(
                                                  "Current Price",
                                                  style: TextStyle(
                                                      fontSize: 12,
                                                      color: Color(0xffa8a8a8)),
                                                ),
                                                Text(
                                                    "\$${double.parse(stockDetails["real_time_price"]["current_price"]).toStringAsFixed(2)}",
                                                    style: TextStyle(
                                                      fontSize: 18,
                                                      color: Colors.black,
                                                    ))
                                              ],
                                            ),
                                          ),
                                          Container(
                                            width: MediaQuery.of(context)
                                                .size
                                                .width /
                                                3,
                                            alignment: Alignment.topLeft,
                                            child: Column(
                                              crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                              children: <Widget>[
                                                Text(
                                                  "Suggested Date",
                                                  style: TextStyle(
                                                      fontSize: 12,
                                                      color: Color(0xffa8a8a8)),
                                                ),
                                                Text(
                                                    DateFormat('dd.MM.yyyy')
                                                        .format(DateTime.parse(
                                                        stockDetails[
                                                        "suggested_date"])),
                                                    style: TextStyle(
                                                      fontSize: 18,
                                                      color: Colors.black,
                                                    ))
                                              ],
                                            ),
                                          ),
                                          Container(
                                            width: MediaQuery.of(context)
                                                .size
                                                .width /
                                                4,
                                            alignment: Alignment.topLeft,
                                            child: Column(
                                              crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                              children: <Widget>[
                                                Text(
                                                  "Target Price",
                                                  style: TextStyle(
                                                      fontSize: 12,
                                                      color: Color(0xffa8a8a8)),
                                                ),
                                                Text(
                                                    "\$${double.parse(stockDetails["target_price"]).toStringAsFixed(2)}",
                                                    style: TextStyle(
                                                      fontSize: 18,
                                                      color: Colors.black,
                                                    ))
                                              ],
                                            ),
                                          )
                                        ],
                                      )),
                                  Container(
                                    padding: EdgeInsets.symmetric(vertical: 5),
                                    width:
                                    MediaQuery.of(context).size.width / 1.3,
                                    child: Column(
                                      crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                      children: <Widget>[
                                        Text(
                                          "Usefull Notes",
                                          style: TextStyle(
                                              fontSize: 12,
                                              color: Color(0xffa8a8a8)),
                                        ),
                                        Text(
                                          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                                          style: TextStyle(fontSize: 12),
                                        )
                                      ],
                                    ),
                                  ),
                                ],
                              )))),
                  Container(
                      alignment: Alignment.bottomCenter,
                      color: Color(0xfff5f5f5),
                      height: MediaQuery.of(context).size.height / 4,
                      child: Stack(
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
                              Octicons.getIconData("plus-small"),
                              color: Colors.white,
                              size: 18,
                            ),
                          ),
                          Container(
                              margin: EdgeInsets.only(top: 25),
                              //padding: EdgeInsets.symmetric(vertical: 20),
                              height: 50,
                              width: MediaQuery.of(context).size.width,
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                color: Color(0xff5946a8),
                              ),
                              child: MaterialButton(
                                height: 50,
                                minWidth: MediaQuery.of(context).size.width,
                                onPressed: () {
                                  setState(() {
                                    algorithm = false;
                                  });
                                },
                                child: Text(
                                  "Stock Prediction Groups",
                                  style: TextStyle(color: Colors.white),
                                ),
                              )),
                          Container(
                              margin: EdgeInsets.only(top: 70),
                              //padding: EdgeInsets.symmetric(vertical: 20),
                              height: 50,
                              width: MediaQuery.of(context).size.width,
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                color: Color(0xff49388b),
                              ),
                              child: MaterialButton(
                                height: 50,
                                minWidth: MediaQuery.of(context).size.width,
                                onPressed: () {
                                  setState(() {
                                    algorithm = true;
                                  });
                                },
                                child: Text(
                                  "Algorithm",
                                  style: TextStyle(color: Colors.white),
                                ),
                              )),
                          Container(
                              margin: EdgeInsets.only(top: 115),
                              //padding: EdgeInsets.symmetric(vertical: 20),
                              height: 50,
                              width: MediaQuery.of(context).size.width,
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                color: Color(0xff41327a),
                              ),
                              child: MaterialButton(
                                height: 50,
                                minWidth: MediaQuery.of(context).size.width,
                                onPressed: () {},
                                child: Text(
                                  "Amazon Vs NASDAQ",
                                  style: TextStyle(color: Colors.white),
                                ),
                              )),
                        ],
                      ))
                ],
              )),
        );
      } else {
        return Expanded(
          child: Container(
            decoration: BoxDecoration(color: Color(0xfff5f5f5)),
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
                            style: TextStyle(fontSize: 13, color: Colors.grey))
                      ],
                    ),
                  ),
                ),
                Expanded(
                  child: GridView.builder(
                    //crossAxisCount: 2,
                    gridDelegate: new SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 2.0,
                    ),
                    itemCount: stockData.length,
                    //padding: new EdgeInsets.all(8.0),
                    itemBuilder: (BuildContext context, int index) {
                      return GestureDetector(
                          onTap: () {
                            // print("object"+index.toString());
                            // setState(() {
                            //   stockList = true;
                            // });
                            _exploreGroups(stockData[index]);
                          },
                          child: Container(
                            //color: Colors.red,
                              decoration: BoxDecoration(
                                borderRadius:
                                BorderRadius.all(Radius.circular(5)),
                                color: Colors.white,
                              ),
                              margin: EdgeInsets.all(5),
                              child: Row(
                                mainAxisAlignment:
                                MainAxisAlignment.spaceBetween,
                                children: <Widget>[
                                  Container(
                                    margin: EdgeInsets.only(left: 10,right: 7),
                                    child: Image.network(
                                      //list[index]["image"],
                                      "${stockData[index]["imagePath"]}",
                                      height: 40,
                                      width: 40,
                                    ),
                                  ),
                                  Expanded(
                                    child: Container(
                                      //width: 90,
                                      height:
                                      MediaQuery.of(context).size.height,
                                      child: Column(
                                        mainAxisAlignment:
                                        MainAxisAlignment.center,
                                        crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                        children: <Widget>[
                                          Text(
                                            "Group",
                                            style: TextStyle(fontSize: 12),
                                          ),
                                          Text(
                                              '${stockData[index]["group_name"]} Stock',
                                              softWrap: true,
                                              style: TextStyle(
                                                  fontSize: 12,
                                                  color: Color(0xff5946a8)))
                                        ],
                                      ),
                                    ),
                                  ),
                                  Container(
                                      width: 30,
                                      height: double.infinity,
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.only(
                                            topRight: Radius.circular(5),
                                            bottomRight: Radius.circular(5)),
                                        color: Color(0xff5946a8),
                                      ),
                                      child: RawMaterialButton(
                                        onPressed: () {
                                          _exploreGroups(stockData[index]);
                                        },
                                        child: Icon(
                                          MaterialCommunityIcons.getIconData(
                                              "plus"),
                                          size: 18,
                                          color: Colors.white,
                                        ),
                                      )),
                                ],
                              )));
                    },
                  ),
                ),
              ],
            ),
          ),
        );
      }
    }
  }
}

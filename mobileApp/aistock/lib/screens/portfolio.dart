import 'dart:convert';
import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

import './chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_icons/flutter_icons.dart';

class Portfolio extends StatefulWidget {
  @override
  _PortfolioScreenState createState() {
    return _PortfolioScreenState();
  }
}

class GroupClassData {
  String MESSAGE;
  String ORIGINAL_ERROR;
  bool ERROR_STATUS;
  bool RECORDS;
  List<GroupClass> Data;

  GroupClassData({
    this.MESSAGE,
    this.ORIGINAL_ERROR,
    this.ERROR_STATUS,
    this.RECORDS,
    this.Data,
  });

  factory GroupClassData.fromJson(Map<String, dynamic> json) {
    return GroupClassData(
        MESSAGE: json['message'] as String,
        Data: json['data']
            .map<GroupClass>((json) => GroupClass.fromJson(json))
            .toList());
  }
}

class GroupClass {
  String group_id;
  int group_id_int;
  String group_name;

  GroupClass({this.group_id, this.group_id_int, this.group_name});

  factory GroupClass.fromJson(Map<String, dynamic> json) {
    return GroupClass(
        group_id: json['group_id'] as String,
        group_id_int: json['id'] as int,
        group_name: json['group_name'] as String);
  }
}

class stockClass {
  int stockId;
  String stockName;

  stockClass(this.stockId, this.stockName);
}

class _PortfolioScreenState extends State<Portfolio> {
  String selectedDays = 'Daily';
  bool loading = true,
      predictionGroups = false,
      details = false,
      algorithm = false;

  int firstDefaultStockId, firstDefaultGroupId;
  String firstDefaultStockName = "Select Stock",
      firstDefaultGroupName = "Select Group";

  String charge_value = '';

  List stockData;
  List filterStockData;
  List algorithms = [];
  Map stockDetails;
  String selectedGroupName = '';

  List tickerList = [];
  int no_of_stocks = 0;

  double animatedContainerSize = 80;

  List<stockClass> selectedStock = new List();
  stockClass _stockClass;

  List<GroupClass> groupList = new List();
  List<GroupClass> tempGroupList = new List();
  GroupClass _groupClass;

  List<GroupClass> chartGroupList = new List();
  List<GroupClass> tempChartGroupList = new List();
  GroupClass _chartGroupClass;

  List chartData = [];

  List<chartDataClass> UserPrice = new List();
  List<chartDataClass> RealPrice = new List();

  var current_path = ["Home", "Portfolio"];

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    _callMethods();
  }

  _callMethods() async {
    await _getPortfolio();
    await _getGroups();
  }

  _getPortfolio() async {
    SharedPreferences storage = await SharedPreferences.getInstance();
    var user = storage.getString('userData');
    var userData = jsonDecode(user);
    HttpClient client = new HttpClient();
    //client.badCertificateCallback = ((X509Certificate cert, String host, int port) => true);
    String url = 'https://api.stockzed.com/api/portfolio/getPortfolio';
    HttpClientRequest request = await client.getUrl(Uri.parse(url));
    request.headers.set('authorization', userData["token"]);
    HttpClientResponse response = await request.close();
    if (response.statusCode == 200) {
      String res = await response.transform(utf8.decoder).join();
      var result = json.decode(res);
      print("filterStock Data" + result.toString());
      setState(() {
        stockData = result["data"];
        filterStockData = result["data"];
      });
      print("-> length -> " + stockData.length.toString());
    } else {
      String res = await response.transform(utf8.decoder).join();
      var result = json.decode(res);
      print("error--------------" + result.toString());
    }
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
      //groupList.clear();
      String res = await response.transform(utf8.decoder).join();
      var result = json.decode(res);
      print(result);
      GroupClassData groupClassData = new GroupClassData.fromJson(result);
      GroupClassData chartGroupClassData = new GroupClassData.fromJson(result);
      GroupClass groupListTemp =
          new GroupClass(group_id: "0", group_id_int: 0, group_name: "All");

      setState(() {
        tempChartGroupList = chartGroupClassData.Data;
        //groupList = groupClassData.Data;
        tempGroupList = groupClassData.Data;
        groupList.insert(0, groupListTemp);
        loading = false;
      });
      _setDataAndCallChart();
    } else {
      String res = await response.transform(utf8.decoder).join();
      var result = json.decode(res);
      print(result);
      setState(() {
        loading = false;
      });
    }
  }

  _setDataAndCallChart() {
    List<stockClass> tempStock = new List();
    stockClass _stock;
    bool tickerExits = false;

    if (stockData != null) {
      if (tempChartGroupList != null && tempChartGroupList.length > 0) {
        for (int i = 0; i < stockData.length; i++) {
          if (stockData[i]["real_time_price"]["stock"]["group_id"] ==
              tempChartGroupList[0].group_id_int) {
            print("testing=" + tempChartGroupList[0].group_id_int.toString());
            _stock = new stockClass(
                stockData[i]["real_time_price"]["stock"]["id"],
                stockData[i]["real_time_price"]["stock"]["stock_name"]);
            setState(() {
              tempStock.add(_stock);
            });
          }
        }
        for (int i = 0; i < tempChartGroupList.length; i++) {
          for (int j = 0; j < stockData.length; j++) {
            if (tempChartGroupList[i].group_id_int ==
                stockData[j]["real_time_price"]["stock"]["group_id"]) {
              setState(() {
                chartGroupList.add(tempChartGroupList[i]);
                groupList.add(tempChartGroupList[i]);
              });
              break;
            }
          }
        }
        for (int i = 0; i < stockData.length; i++) {
          print("total stock length" + stockData.length.toString());
          for (int j = 0; j < tickerList.length; j++) {
            if (stockData[i]["real_time_price"]["stock"]["ticker"] ==
                tickerList[j]["ticker"]) {
              tickerExits = true;
              break;
            }
          }
          if (tickerExits != true) {
            print("added");
            setState(() {
              tickerList.add({
                "ticker": stockData[i]["real_time_price"]["stock"]["ticker"]
              });
            });
          } else
            setState(() {
              tickerExits = false;
            });
        }
        print("total ticker :" + tickerList.length.toString());
        setState(() {
          selectedStock = tempStock;
          _chartGroupClass = tempChartGroupList[0];
          firstDefaultStockId = tempStock[0].stockId;
          firstDefaultStockName = tempStock[0].stockName;
          firstDefaultGroupId = tempChartGroupList[0].group_id_int;
          firstDefaultGroupName = tempChartGroupList[0].group_name;
        });
        print("first Time Stock Data Id=" +
            firstDefaultStockId.toString() +
            " and Name =" +
            firstDefaultStockName);
        _getChartData(
            chartGroupList[0].group_id_int, selectedDays, firstDefaultStockId);
        LineChartSample1(
          UserPrice: UserPrice,
          RealPrice: RealPrice,
        );
      }
    } else {
      var snackBar = SnackBar(
        backgroundColor: Color(0xff7b67ef),
        content: Text("Portfolio Not Found"),
      );
      Scaffold.of(context).showSnackBar(snackBar);
    }
  }

  _onGroupSelect(val) {
    List tempList = new List();
    setState(() {
      print(val.group_id_int);
      _groupClass = val;
    });
    print("-> ${stockData.length}");
    if (val.group_name == "All") {
      tempList = stockData;
    } else {
      for (int i = 0; i < stockData.length; i++) {
        if (stockData[i]["real_time_price"]["stock"]["group_id"] ==
            val.group_id_int) {
          print(
              "${val.group_id_int} and ${stockData[i]["real_time_price"]["stock"]["group_id"]}");
          setState(() {
            tempList.add(stockData[i]);
          });
        }
      }
    }

    setState(() {
      filterStockData = new List();
      filterStockData = tempList;
      //print(tempList.toString());
    });
  }

  _onChartGroupSelect(val) {
    List<stockClass> tempStock = new List();
    stockClass _stock;
    setState(() {
      print(val.group_id_int);
      _chartGroupClass = val;
      _stockClass = null;
      selectedStock.clear();
      firstDefaultStockName = "Select Stock";
      firstDefaultStockId = null;
      firstDefaultGroupName = val.group_name;
      firstDefaultGroupId = val.group_id_int;
    });
    if (stockData != null) {
      for (int i = 0; i < stockData.length; i++) {
        if (stockData[i]["real_time_price"]["stock"]["group_id"] ==
            val.group_id_int) {
          _stock = new stockClass(
              stockData[i]["real_time_price"]["stock"]["id"],
              stockData[i]["real_time_price"]["stock"]["stock_name"]);
          setState(() {
            tempStock.add(_stock);
          });
        }
      }
      if (tempStock != null && tempStock.length > 0) {
        setState(() {
          selectedStock = tempStock;
          firstDefaultStockName = tempStock[0].stockName;
          firstDefaultStockId = tempStock[0].stockId;
        });
        _getChartData(val.group_id_int, selectedDays, firstDefaultStockId);
        LineChartSample1(
          UserPrice: UserPrice,
          RealPrice: RealPrice,
        );
      } else {
        setState(() {
          UserPrice.clear();
          RealPrice.clear();
        });
      }
    }
  }

  _onStockChange(val) async {
    setState(() {
      _stockClass = val;
    });
    await _getChartData(
        _chartGroupClass.group_id_int, selectedDays, _stockClass.stockId);
    LineChartSample1(
      UserPrice: UserPrice,
      RealPrice: RealPrice,
    );
  }

  _onDaysChange(val) async {
    setState(() {
      selectedDays = val;
    });

    if (_chartGroupClass != null &&
        firstDefaultStockName != null &&
        stockData != null &&
        firstDefaultGroupName != null) {
      await _getChartData(
          firstDefaultStockId, selectedDays, firstDefaultStockId);
      LineChartSample1(
        UserPrice: UserPrice,
        RealPrice: RealPrice,
      );
    } else if (_chartGroupClass != null && _stockClass != null) {
      await _getChartData(
          _chartGroupClass.group_id_int, selectedDays, _stockClass.stockId);
      LineChartSample1(
        UserPrice: UserPrice,
        RealPrice: RealPrice,
      );
    }
  }

  _getChartData(groupid, days, stockid) async {
    SharedPreferences storage = await SharedPreferences.getInstance();
    var user = storage.getString('userData');
    var userData = jsonDecode(user);
    try {
      var reqBody = {"group": groupid, "days": days, "stock": stockid};
      setState(() {
        loading = true;
      });
      HttpClient client = new HttpClient();
      // client.badCertificateCallback = ((X509Certificate cert, String host, int port) => true);
      String url = 'https://api.stockzed.com/api/portfolio/getChartData';
      HttpClientRequest request = await client.postUrl(Uri.parse(url));
      request.headers.set('Content-Type', 'application/json');
      request.headers.set('authorization', userData["token"]);
      request.add(utf8.encode(json.encode(reqBody)));
      HttpClientResponse response = await request.close();
      if (response.statusCode == 200) {
        String reply = await response.transform(utf8.decoder).join();
        Map data = json.decode(reply);
        //print(data["data"].toString());
        setState(() {
          chartData = data["data"];
          charge_value = data["charge"];
          loading = false;
        });
        setData(chartData);
        print(chartData);
      } else {
        print("response code= " + response.statusCode.toString());
        String reply = await response.transform(utf8.decoder).join();
        Map data = json.decode(reply);
        print(data["message"]);
        setState(() {
          loading = false;
        });
        print("Something Went Wrong");
      }
    } catch (e) {
      print(e.toString());
    }
  }

  setData(List chartData) {
    List<chartDataClass> TempUserPrice = new List();
    List<chartDataClass> TempListPrice = new List();

    for (int i = 0; i < chartData.length; i++) {
      setState(() {
        chartDataClass temp = new chartDataClass(
            double.parse(chartData[i]["portfolio"].toString()),
            chartData[i]["time"]);
        TempUserPrice.add(temp);

        chartDataClass temp1 = new chartDataClass(
            double.parse(chartData[i]["realTime"].toString()),
            chartData[i]["time"]);
        TempListPrice.add(temp1);
      });
    }
    setState(() {
      loading = false;
      UserPrice = TempUserPrice;
      RealPrice = TempListPrice;
    });
  }

  _getAlgorithm(stock) async {
    print("Algorithm Stock==============$stock");
    print("gropu_id->" +
        stock["real_time_price"]["stock"]["group_id"].toString());
    var reqBody = {
      "groupId": stock["real_time_price"]["stock"]["group_id"].toString(),
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
      print(data);
    }
  }

  _getStockInfo(stock) async {
    setState(() {
      loading = true;
      selectedGroupName =
          stock["real_time_price"]["stock"]["Prediction_group"]["group_name"];
    });
    var reqBody = {
      "realId": stock["real_time_price"]["id"].toString(),
      "stockId": stock["stock_id"].toString()
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
      print(data);
      setState(() {
        details = true;
        predictionGroups = false;
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

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return Expanded(
          child: Center(
              child: CircularProgressIndicator(
        backgroundColor: Colors.transparent,
        strokeWidth: 2,
        valueColor: new AlwaysStoppedAnimation(Color(0xff7b67f0)),
      )));
    } else if (predictionGroups) {
      return Expanded(
        child: Container(
          color: Color(0xfff5f5f5),
          child: Column(
            children: <Widget>[
              Row(
                children: <Widget>[
                  Container(
                      //width: MediaQuery.of(context).size.width,
                      alignment: Alignment.centerLeft,
                      child: MaterialButton(
                        minWidth: 10,
                        onPressed: () {
                          setState(() {
                            predictionGroups = false;
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
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
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
                            text: "Stocks from Prediction Groups",
                            style: TextStyle(color: Colors.grey, fontSize: 10)),
                      ],
                    ),
                  ),
                ],
              ),
              stockData != null
                  ? Align(
                      alignment: Alignment.bottomRight,
                      child: Padding(
                        padding: const EdgeInsets.only(
                            top: 8.0, right: 20, bottom: 10),
                        child: Container(
                            height: 40,
                            margin: EdgeInsets.symmetric(horizontal: 5),
                            padding: EdgeInsets.symmetric(horizontal: 10),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(5),
                              border: Border.all(
                                  color: Color(0xff5946a8),
                                  style: BorderStyle.solid,
                                  width: 1),
                            ),
                            child: DropdownButtonHideUnderline(
                                child: DropdownButton<GroupClass>(
                              hint: Text("Select Group"),
                              value: _groupClass,
                              onChanged: (val) {
                                _onGroupSelect(val);
                              },
                              icon: Icon(
                                  MaterialIcons.getIconData(
                                      "keyboard-arrow-down"),
                                  color: Color(0xff5946a8),
                                  size: 22),
                              style: TextStyle(
                                  fontSize: 10, color: Color(0xff5946a8)),
                              items: groupList.map((GroupClass groupclass) {
                                return new DropdownMenuItem<GroupClass>(
                                  value: groupclass,
                                  child: Text(
                                    groupclass.group_name,
                                    style: TextStyle(color: Colors.black),
                                  ),
                                );
                              }).toList(),
                            ))),
                      ),
                    )
                  : Container(),
              stockData != null
                  ? Expanded(
                      child: ListView.builder(
                        itemCount: filterStockData.length,
                        itemBuilder: (BuildContext context, int index) {
                          return (GestureDetector(
                              onTap: () {
                                _getStockInfo(filterStockData[index]);
                              },
                              child: Container(
                                  height: 240,
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
                                    child: Container(
                                      padding:
                                          EdgeInsets.symmetric(horizontal: 15),
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: <Widget>[
                                          RichText(
                                            text: new TextSpan(
                                              style: new TextStyle(
                                                color: Colors.black,
                                              ),
                                              children: <TextSpan>[
                                                new TextSpan(
                                                    text: "Group Name :",
                                                    style: TextStyle(
                                                        fontWeight:
                                                            FontWeight.bold,
                                                        color:
                                                            Color(0xff7b67f0))),
                                                new TextSpan(
                                                    text:
                                                        "${filterStockData[index]["real_time_price"]["stock"]["Prediction_group"]["group_name"]}",
                                                    style: TextStyle(
                                                        color: Colors.grey)),
                                              ],
                                            ),
                                          ),
                                          Padding(
                                              padding:
                                                  EdgeInsets.only(bottom: 10)),
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: <Widget>[
                                              Row(
                                                children: <Widget>[
                                                  Image.network(
                                                    "https://stockzai.com/group/company/${filterStockData[index]["real_time_price"]["stock"]["ticker_image"]}.png",
                                                    height: 40,
                                                    width: 40,
                                                  ),
                                                  Container(
                                                      padding: EdgeInsets.only(
                                                          left: 5, top: 10),
                                                      alignment: Alignment
                                                          .bottomCenter,
                                                      child: Column(
                                                        mainAxisAlignment:
                                                            MainAxisAlignment
                                                                .end,
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
                                                            "${filterStockData[index]["real_time_price"]["stock"]["stock_name"]}",
                                                            style: TextStyle(
                                                                fontSize: 16,
                                                                color: Colors
                                                                    .black,
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
                                                    double.parse(filterStockData[
                                                                    index][
                                                                "real_time_price"]
                                                            ["current_price"])
                                                        .toStringAsFixed(2),
                                                    style: TextStyle(
                                                        color:
                                                            Color(0xffb2a5f2),
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
                                                        CrossAxisAlignment
                                                            .start,
                                                    children: <Widget>[
                                                      Text(
                                                        "Recommended Price",
                                                        style: TextStyle(
                                                            fontSize: 10,
                                                            fontWeight:
                                                                FontWeight
                                                                    .w300),
                                                      ),
                                                      Text(
                                                        '\$${double.parse(filterStockData[index]["real_time_price"]["stock"]["recommended_price"]).toStringAsFixed(2)}',
                                                        style: TextStyle(
                                                            fontSize: 15,
                                                            color: Colors.black,
                                                            fontWeight:
                                                                FontWeight
                                                                    .w500),
                                                      )
                                                    ],
                                                  ),
                                                  Column(
                                                    crossAxisAlignment:
                                                        CrossAxisAlignment
                                                            .start,
                                                    children: <Widget>[
                                                      Text(
                                                        "Current Price",
                                                        style: TextStyle(
                                                            fontSize: 10,
                                                            fontWeight:
                                                                FontWeight
                                                                    .w300),
                                                      ),
                                                      Text(
                                                        '\$${double.parse(filterStockData[index]["real_time_price"]["current_price"]).toStringAsFixed(2)}',
                                                        style: TextStyle(
                                                            fontSize: 15,
                                                            color: Colors.black,
                                                            fontWeight:
                                                                FontWeight
                                                                    .w500),
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
                                                        CrossAxisAlignment
                                                            .start,
                                                    children: <Widget>[
                                                      Text(
                                                        "Suggested Date",
                                                        style: TextStyle(
                                                            fontSize: 10,
                                                            fontWeight:
                                                                FontWeight
                                                                    .w300),
                                                      ),
                                                      Text(
                                                        DateFormat(
                                                                'dd MMMM yyyy')
                                                            .format(DateTime.parse(
                                                                filterStockData[index]
                                                                            [
                                                                            "real_time_price"]
                                                                        [
                                                                        "stock"]
                                                                    [
                                                                    "suggested_date"])),
                                                        style: TextStyle(
                                                            fontSize: 15,
                                                            color: Colors.black,
                                                            fontWeight:
                                                                FontWeight
                                                                    .w500),
                                                      )
                                                    ],
                                                  ),
                                                  Column(
                                                    crossAxisAlignment:
                                                        CrossAxisAlignment
                                                            .start,
                                                    children: <Widget>[
                                                      Text(
                                                        "Target Price  ",
                                                        style: TextStyle(
                                                            fontSize: 10,
                                                            fontWeight:
                                                                FontWeight
                                                                    .w300),
                                                      ),
                                                      Text(
                                                        '\$${filterStockData[index]["real_time_price"]["stock"]["target_price"]}',
                                                        style: TextStyle(
                                                            fontSize: 15,
                                                            color: Colors.black,
                                                            fontWeight:
                                                                FontWeight
                                                                    .w500),
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
                                                  1.70,
                                              child: Row(
                                                mainAxisAlignment:
                                                    MainAxisAlignment
                                                        .spaceBetween,
                                                children: <Widget>[
                                                  Column(
                                                    crossAxisAlignment:
                                                        CrossAxisAlignment
                                                            .start,
                                                    children: <Widget>[
                                                      Text(
                                                        "Today Change %",
                                                        style: TextStyle(
                                                            fontSize: 10,
                                                            fontWeight:
                                                                FontWeight
                                                                    .w300),
                                                      ),
                                                      Text(
                                                        '${filterStockData[index]["real_time_price"]["today_change_percentage"]}',
                                                        style: TextStyle(
                                                            fontSize: 15,
                                                            color: Colors.black,
                                                            fontWeight:
                                                                FontWeight
                                                                    .w500),
                                                      )
                                                    ],
                                                  ),
                                                  Column(
                                                    crossAxisAlignment:
                                                        CrossAxisAlignment
                                                            .start,
                                                    children: <Widget>[
                                                      Text(
                                                        "Today Change",
                                                        style: TextStyle(
                                                            fontSize: 10,
                                                            fontWeight:
                                                                FontWeight
                                                                    .w300),
                                                      ),
                                                      Text(
                                                        '\$${double.parse(filterStockData[index]["real_time_price"]["today_change"]).toStringAsFixed(2)}',
                                                        style: TextStyle(
                                                            fontSize: 15,
                                                            color: Colors.black,
                                                            fontWeight:
                                                                FontWeight
                                                                    .w500),
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
                                                        CrossAxisAlignment
                                                            .start,
                                                    children: <Widget>[
                                                      Text(
                                                        "Your Change %",
                                                        style: TextStyle(
                                                            fontSize: 10,
                                                            fontWeight:
                                                                FontWeight
                                                                    .w300),
                                                      ),
                                                      Text(
                                                        '${filterStockData[index]["real_time_price"]["your_change_percentage"]}%',
                                                        style: TextStyle(
                                                            fontSize: 15,
                                                            color: Colors.black,
                                                            fontWeight:
                                                                FontWeight
                                                                    .w500),
                                                      )
                                                    ],
                                                  ),
                                                  Column(
                                                    crossAxisAlignment:
                                                        CrossAxisAlignment
                                                            .start,
                                                    children: <Widget>[
                                                      Text(
                                                        "Your Change",
                                                        style: TextStyle(
                                                            fontSize: 10,
                                                            fontWeight:
                                                                FontWeight
                                                                    .w300),
                                                      ),
                                                      Text(
                                                        '\$${double.parse(filterStockData[index]["real_time_price"]["your_change"]).toStringAsFixed(2)}',
                                                        style: TextStyle(
                                                            fontSize: 15,
                                                            color: Colors.black,
                                                            fontWeight:
                                                                FontWeight
                                                                    .w500),
                                                      )
                                                    ],
                                                  )
                                                ],
                                              ))
                                        ],
                                      ),
                                    ),
                                  ))));
                        },
                      ),
                    )
                  : Text("No Portfolio Found",
                      style:
                          TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
      );
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
                      algorithm = false;
                      predictionGroups = true;
                    });
                  },
                  child: Icon(MaterialIcons.getIconData("arrow-back"),
                      size: 22, color: Color(0xff5946a8)),
                )),
                RichText(
                  softWrap: true,
                  maxLines: 2,
                  textAlign: TextAlign.start,
                  text: new TextSpan(
                    style: new TextStyle(color: Colors.black),
                    children: <TextSpan>[
                      new TextSpan(
                          text: current_path[0],
                          style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
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
                          text: "Stocks from Prediction Groups",
                          style: TextStyle(color: Colors.grey, fontSize: 10)),
                      new TextSpan(
                          text: " > ", style: TextStyle(color: Colors.grey)),
                      new TextSpan(
                          text: "$selectedGroupName",
                          style: TextStyle(color: Colors.grey, fontSize: 10)),
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
                                    margin: EdgeInsets.symmetric(vertical: 10),
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
                                                            ? Color(0xff00b0ed)
                                                            : Color(0xffffdc71),
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
                                                        color:
                                                            Color(0xffb3b4b6)))
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
                                          margin:
                                              EdgeInsets.symmetric(vertical: 5),
                                          child: Text(
                                            "This completes task ${index == 0 ? "One." : index == 1 ? "Two." : index == 2 ? "Three." : "Four."}",
                                            style:
                                                TextStyle(color: Colors.black),
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
                                        color: Color(0xffa8a8a8), fontSize: 12),
                                  )
                                ],
                              ),
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: <Widget>[
                                  //Text("a",style: TextStyle(fontSize: 70,color:Colors.black,fontWeight:FontWeight.bold),),
                                  Image.network(
                                    "https://stockzai.com/group/company/${stockDetails["ticker_image"]}.png",
                                    height: 40,
                                    width: 40,
                                  ),
                                  Container(
                                    padding: EdgeInsets.only(left: 5, top: 10),
                                    child: Row(
                                        //mainAxisAlignment: MainAxisAlignment.end,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.end,
                                        children: <Widget>[
                                          Text(
                                            "\$${double.parse(stockDetails["real_time_price"]["current_price"]).toStringAsFixed(2)}",
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
                                            "${double.parse(stockDetails["real_time_price"]["today_change"]).toStringAsFixed(2)}",
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
                                        width:
                                            MediaQuery.of(context).size.width /
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
                                                DateFormat('dd.MM.yyyy').format(
                                                    DateTime.parse(stockDetails[
                                                        "target_date"])),
                                                style: TextStyle(
                                                  fontSize: 18,
                                                  color: Colors.black,
                                                ))
                                          ],
                                        ),
                                      ),
                                      Container(
                                        width:
                                            MediaQuery.of(context).size.width /
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
                                        width:
                                            MediaQuery.of(context).size.width /
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
                                                stockDetails["Prediction_group"]
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
                                        width:
                                            MediaQuery.of(context).size.width /
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
                                        width:
                                            MediaQuery.of(context).size.width /
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
                                                DateFormat('dd.MM.yyyy').format(
                                                    DateTime.parse(stockDetails[
                                                        "suggested_date"])),
                                                style: TextStyle(
                                                  fontSize: 18,
                                                  color: Colors.black,
                                                ))
                                          ],
                                        ),
                                      ),
                                      Container(
                                        width:
                                            MediaQuery.of(context).size.width /
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
                                      ),
                                    ],
                                  )),
                              Container(
                                padding: EdgeInsets.symmetric(vertical: 5),
                                width: MediaQuery.of(context).size.width / 1.3,
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
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
          width: MediaQuery.of(context).size.width,
          decoration: BoxDecoration(
            color: Colors.white,
          ),
          child: Column(
            children: <Widget>[
              Container(
                color: Color(0xfff5f5f5),
                padding: EdgeInsets.only(left: 20, right: 20, top: 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Padding(
                      padding: const EdgeInsets.only(top: 8.0, bottom: 30),
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
                                text: " > ",
                                style: TextStyle(color: Colors.grey)),
                            new TextSpan(
                                text: current_path[1],
                                style: TextStyle(color: Colors.grey))
                          ],
                        ),
                      ),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: <Widget>[
                        Text("Summary",
                            style:
                                TextStyle(color: Colors.black, fontSize: 16)),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: <Widget>[
                            Container(
                              margin: EdgeInsets.only(right: 5),
                              height: 4,
                              width: 16,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(5),
                                color: Color(0xff7f63f4),
                              ),
                            ),
                            Text("Portfolio",
                                style: TextStyle(
                                    color: Color(0xffa8a8a8), fontSize: 10)),
                            Container(
                              margin: EdgeInsets.only(right: 5, left: 5),
                              height: 4,
                              width: 16,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(5),
                                color: Color(0xffa8a8a8),
                              ),
                            ),
                            Text("Benchmark Portfolio",
                                style: TextStyle(
                                    color: Color(0xffa8a8a8), fontSize: 10))
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Expanded(
                child: ListView.builder(
                  itemCount: 1,
                  itemBuilder: (context, index) {
                    return Column(
                      children: <Widget>[
                        Container(
                          color: Color(0xfff5f5f5),
                          padding: EdgeInsets.only(
                              left: 20, right: 10, bottom: 10, top: 10),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: <Widget>[
                              Container(
                                  height: 40,
                                  margin: EdgeInsets.symmetric(horizontal: 5),
                                  padding: EdgeInsets.symmetric(horizontal: 10),
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(5),
                                    border: Border.all(
                                        color: Color(0xff5946a8),
                                        style: BorderStyle.solid,
                                        width: 1),
                                  ),
                                  child: DropdownButtonHideUnderline(
                                      child: DropdownButton<GroupClass>(
                                    hint: Text("$firstDefaultGroupName"),
                                    value: _chartGroupClass,
                                    onChanged: (val) {
                                      _onChartGroupSelect(val);
                                    },
                                    icon: Icon(
                                        MaterialIcons.getIconData(
                                            "keyboard-arrow-down"),
                                        color: Color(0xff5946a8),
                                        size: 22),
                                    style: TextStyle(
                                        fontSize: 10, color: Color(0xff5946a8)),
                                    items: chartGroupList
                                        .map((GroupClass groupclass1) {
                                      return new DropdownMenuItem<GroupClass>(
                                        value: groupclass1,
                                        child: Text(
                                          groupclass1.group_name,
                                          style: TextStyle(color: Colors.black),
                                        ),
                                      );
                                    }).toList(),
                                  ))),
                              Container(
                                  height: 40,
                                  margin: EdgeInsets.symmetric(horizontal: 5),
                                  padding: EdgeInsets.symmetric(horizontal: 10),
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(5),
                                    border: Border.all(
                                        color: Color(0xff5946a8),
                                        style: BorderStyle.solid,
                                        width: 1),
                                  ),
                                  child: DropdownButtonHideUnderline(
                                      child: DropdownButton<stockClass>(
                                    hint: Text("$firstDefaultStockName"),
                                    value: _stockClass,
                                    onChanged: (val) {
                                      _onStockChange(val);
                                    },
                                    icon: Icon(
                                        MaterialIcons.getIconData(
                                            "keyboard-arrow-down"),
                                        color: Color(0xff5946a8),
                                        size: 22),
                                    style: TextStyle(
                                        fontSize: 10, color: Color(0xff5946a8)),
                                    items:
                                        selectedStock.map((stockClass stock) {
                                      return new DropdownMenuItem<stockClass>(
                                        value: stock,
                                        child: Text(
                                          stock.stockName,
                                          style: TextStyle(color: Colors.black),
                                        ),
                                      );
                                    }).toList(),
                                  ))),
                              Container(
                                  height: 40,
                                  margin: EdgeInsets.symmetric(horizontal: 5),
                                  padding: EdgeInsets.symmetric(horizontal: 10),
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
                                        'Daily',
                                        'Weekly',
                                        'Monthly'
                                      ].map((String value) {
                                        return DropdownMenuItem(
                                          value: value,
                                          child: Text(value),
                                        );
                                      }).toList(),
                                      onChanged: (value) {
                                        _onDaysChange(value);
                                      },
                                      icon: Icon(
                                          MaterialIcons.getIconData(
                                              "keyboard-arrow-down"),
                                          color: Color(0xff5946a8),
                                          size: 22),
                                      style: TextStyle(
                                          fontSize: 10,
                                          color: Color(0xff5946a8)),
                                      value: selectedDays,
                                    ),
                                  ))
                            ],
                          ),
                        ),
                        Container(
                            //alignment: Alignment.topCenter,
                            height: MediaQuery.of(context).size.height / 2.7,
                            width: MediaQuery.of(context).size.width,
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Center(
                                child: UserPrice.length > 0 &&
                                        UserPrice != null &&
                                        RealPrice.length > 0 &&
                                        RealPrice != null
                                    ? LineChartSample1(
                                        UserPrice: UserPrice,
                                        RealPrice: RealPrice,
                                      )
                                    : Text("Chart Data Not Found"),
                              ),
                            )),
                        Container(
                          color: Color(0xfff5f5f5),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: <Widget>[
                              Container(
                                alignment: Alignment.bottomCenter,
                                color: Color(0xfff5f5f5),
                                //height: double.infinity,
                                padding: EdgeInsets.symmetric(
                                    horizontal: 20, vertical: 10),
                                child: Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceAround,
                                  children: <Widget>[
                                    Column(
                                      children: <Widget>[
                                        Text("${tickerList.length}",
                                            style: TextStyle(
                                                fontSize: 40,
                                                color: Color(0xff7f63f4))),
                                        Text(
                                          "No. of Stocks",
                                          style: TextStyle(
                                              fontSize: 15,
                                              color: Colors.black),
                                        )
                                      ],
                                    ),
                                    Column(
                                      children: <Widget>[
                                        Text("$charge_value%",
                                            style: TextStyle(
                                                fontSize: 40,
                                                color: Color(0xff7f63f4))),
                                        Text(
                                          "% of Change",
                                          style: TextStyle(
                                              fontSize: 15,
                                              color: Colors.black),
                                        )
                                      ],
                                    )
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),
              GestureDetector(
                onVerticalDragUpdate: (dragUpdateDetails) {
                  setState(() {
                    predictionGroups = true;
                  });
                },
                child: AnimatedContainer(
                  duration: Duration(seconds: 1),
                  height: animatedContainerSize,
                  curve: Curves.bounceOut,
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
                            "Stock Prediction Groups",
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              )
            ],
          ),
          alignment: Alignment.topCenter,
        ),
      );
    }
  }
}

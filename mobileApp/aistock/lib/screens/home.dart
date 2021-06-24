import 'dart:convert';
import 'dart:io';

import 'package:aistock/screens/mainscreen.dart';
import 'package:aistock/screens/notification.dart';
import 'package:aistock/screens/paymentScreen.dart';

import './predictiongroup.dart';
import 'portfolio.dart';
import 'productinfo.dart';
import 'settings.dart';
import 'package:flutter/material.dart';
import 'package:flutter_icons/flutter_icons.dart';
import './login.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Home extends StatefulWidget {
  static const routeName = '/Home';

  @override
  _HomeState createState() {
    return _HomeState();
  }
}

class _HomeState extends State<Home> {
  final GlobalKey<ScaffoldState> _scaffoldKey = new GlobalKey<ScaffoldState>();
  String screen = 'main';

  String userName = '';
  bool isSubscribed = false, loading = false;

  @override
  void initState() {
    _getData();
  }

  _getData() async {
    SharedPreferences storage = await SharedPreferences.getInstance();
    var user = storage.getString('userData');
    var userData = jsonDecode(user);
    setState(() {
      userName = userData["username"];
      isSubscribed = userData["isSubscribed"];
    });
  }

  _logout() async {
    SharedPreferences storage = await SharedPreferences.getInstance();
    storage.remove('userData');
    Navigator.pop(context);
    Navigator.pushReplacementNamed(context, '/');
  }

  _loginApiRefresh(reqBody) async {
    HttpClient client = new HttpClient();
    String url = 'https://api.stockzed.com/api/user/login';
    HttpClientRequest request = await client.postUrl(Uri.parse(url));
    request.headers.set('content-type', 'application/json');
    request.add(utf8.encode(json.encode(reqBody)));
    HttpClientResponse response = await request.close();
    if (response.statusCode == 200) {
      String reply = await response.transform(utf8.decoder).join();
      Map data = json.decode(reply);
      print(data);
      setState(() {
        loading = false;
      });
      if (data["message"] == "Success") {
        SharedPreferences storage = await SharedPreferences.getInstance();
        storage.setString('userData', reply);
        _getData();
      }
    } else {
      setState(() {
        loading = false;
      });
    }
  }

  header() {
    return Container(
      color: Colors.grey[100],
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: <Widget>[
          Container(
            padding: EdgeInsets.only(left: 20, right: 10),
            height: 50,
            color: Color(0xffb4a4f5),
            child: Row(
              //mainAxisAlignment: MainAxisAlignment.center,
              //crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                Icon(
                  MaterialIcons.getIconData("search"),
                  color: Color(0xff5946a8),
                  size: 22,
                ),
                Expanded(
                  flex: 2,
                  // margin: EdgeInsets.symmetric(horizontal: 5),
                  child: TextField(
                    onChanged: (text) {},
                    style: TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                        border: InputBorder.none,
                        hintText: "Search",
                        hintStyle:
                            TextStyle(color: Colors.white, fontSize: 16)),
                    cursorColor: Color(0xff5946a8),
                  ),
                ),
                Expanded(
                  flex: 2,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: <Widget>[
                      GestureDetector(
                        onTap: () {
                          setState(() {
                            screen = "settings";
                          });
                        },
                        child: Icon(AntDesign.getIconData("setting"),
                            color: Color(0xff5946a8), size: 18),
                      ),
                      Icon(Octicons.getIconData("mail"),
                          color: Color(0xff5946a8), size: 18),
                      GestureDetector(
                        onTap: () {
                          setState(() {
                            screen = "notification";
                          });
                        },
                        child: Icon(
                            MaterialIcons.getIconData("notifications-none"),
                            color: Color(0xff5946a8),
                            size: 18),
                      )
                    ],
                  ),
                ),
                //Text("$userName",style: TextStyle(fontSize: 16, color: Color(0xff5946a8))),
                Expanded(
                    flex: 2,
                    child: Container(
                        alignment: Alignment.centerRight,
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            items: <String>["$userName", "Log Out"]
                                .map((String value) {
                              return DropdownMenuItem(
                                value: value,
                                child: Text(value),
                              );
                            }).toList(),
                            onChanged: (value) {
                              if (value == "Log Out") {
                                _logout();
                              }
                            },
                            icon: Icon(
                                MaterialIcons.getIconData(
                                    "keyboard-arrow-down"),
                                color: Color(0xff5946a8),
                                size: 15),
                            style: TextStyle(
                                fontSize: 13, color: Color(0xff5946a8)),
                            value: "$userName",
                          ),
                        )))
              ],
            ),
          ),
        ],
      ),
    );
  }

  _renderScreen() {
    if (screen == 'main') {
      //return MainScreen();
      return MainScreen();
    }
    if (screen == 'prediction') {
      return PredictionGroup();
    }
    if (screen == 'portfolio') {
      return Portfolio();
    }
    if (screen == 'productinfo') {
      return Productinfo();
    }
    if (screen == 'settings') {
      return Settings();
    }
    if (screen == 'notification') {
      return notification();
    }
  }

  _callRefreshAPI() async {
    setState(() {
      loading = true;
    });
    SharedPreferences storage = await SharedPreferences.getInstance();
    var email = storage.getString('email');
    var password = storage.getString('password');
    var reqBody = {"apiType": "login", "username": email, "password": password};
    _loginApiRefresh(reqBody);
  }

  _subscribeAPI() async {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => paymentScreen((type) async {
          if (type == "reload") {
            _callRefreshAPI();
          }
        }),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final UserData data = ModalRoute.of(context).settings.arguments;
    // TODO: implement build
    return Scaffold(
        key: _scaffoldKey,
        endDrawer: Drawer(
          child: ListView(
            children: <Widget>[
              DrawerHeader(
                child: Container(
                  child: Row(
                    children: <Widget>[
                      Container(
                        height: 80,
                        width: 80,
                        margin: EdgeInsets.only(right: 10),
                        decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.all(Radius.circular(40)),
                            image: DecorationImage(
                                image: ExactAssetImage(
                                    "lib/assets/images/defaultprofile.png"),
                                fit: BoxFit.cover)),
                      ),
                      Container(
                          width: MediaQuery.of(context).size.width / 2.5,
                          child: Text(
                            data.name,
                            style: TextStyle(color: Colors.white, fontSize: 18),
                          ))
                    ],
                  ),
                ),
                decoration: BoxDecoration(
                  color: Color(0xff7b67f0),
                ),
              ),
              ListTile(
                title: Text('Change Settings'),
                onTap: () {
                  Navigator.pop(context);
                  setState(() {
                    screen = "settings";
                  });
                },
              ),
              ListTile(
                title: Text('Logout'),
                onTap: () async {
                  // Update the state of the app
                  // ...
                  // Then close the drawer
                  SharedPreferences storage =
                      await SharedPreferences.getInstance();
                  storage.remove('userData');
                  Navigator.pop(context);
                  Navigator.pushReplacementNamed(context, '/');
                },
              ),
            ],
          ),
        ),
        appBar: AppBar(
          automaticallyImplyLeading: false,
          backgroundColor: Colors.white,
          elevation: 0,
          iconTheme: IconThemeData(color: Color(0xff5946a8)),
          title: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Image.asset("lib/assets/images/logo.png", width: 150, height: 75),
              !isSubscribed
                  ? Container(
                      width: 95,
                      margin: EdgeInsets.all(6),
                      height: 35,
                      child: MaterialButton(
                        shape: RoundedRectangleBorder(
                            borderRadius: new BorderRadius.circular(7.0)),
                        color: Color(0xff5946a8),
                        onPressed: () {
                          _subscribeAPI();
                        },
                        child: Text(
                          "Subscribe Pro",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                          ),
                        ),
                      ),
                    )
                  : Container(),
            ],
          ),
        ),
        body: Container(
          height: MediaQuery.of(context).size.height,
          width: MediaQuery.of(context).size.width,
          decoration: BoxDecoration(
            color: Colors.white,
          ),
          // child:SingleChildScrollView(
          child: loading
              ? Center(
                  child: CircularProgressIndicator(
                  backgroundColor: Colors.transparent,
                  strokeWidth: 2,
                  valueColor: new AlwaysStoppedAnimation(Color(0xff7b67f0)),
                ))
              : Column(
                  children: <Widget>[header(), _renderScreen()],
                ),
        ),
        bottomNavigationBar: BottomAppBar(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: <Widget>[
              Container(
                color: screen == "main" ? Colors.grey[300] : Colors.white,
                width: MediaQuery.of(context).size.width / 5,
                height: 50,
                child: MaterialButton(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: <Widget>[
                      Icon(
                        SimpleLineIcons.getIconData("home"),
                        color: Color(0xff5946a8),
                        size: 20,
                      ),
                      Text(
                        'HOME',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Color(0xff5946a8), fontSize: 8),
                      ),
                    ],
                  ),
                  onPressed: () {
                    setState(() {
                      screen = 'main';
                    });
                  },
                ),
              ),
              Container(
                color: screen == "prediction" ? Colors.grey[300] : Colors.white,
                height: 50,
                width: MediaQuery.of(context).size.width / 3.2,
                child: MaterialButton(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: <Widget>[
                      Icon(
                        FontAwesome.getIconData("cubes"),
                        color: Color(0xff5946a8),
                        size: 20,
                      ),
                      Text(
                        'PREDICTION GROUPS',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Color(0xff5946a8), fontSize: 8),
                      ),
                    ],
                  ),
                  onPressed: () {
                    setState(() {
                      screen = 'prediction';
                    });
                  },
                ),
              ),
              Container(
                color: screen == "portfolio" ? Colors.grey[300] : Colors.white,
                height: 50,
                width: MediaQuery.of(context).size.width / 4.5,
                child: MaterialButton(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: <Widget>[
                      Icon(
                        AntDesign.getIconData("barschart"),
                        color: Color(0xff5946a8),
                        size: 20,
                      ),
                      Text(
                        'PORTFOLIO',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Color(0xff5946a8), fontSize: 8),
                      ),
                    ],
                  ),
                  onPressed: () {
                    setState(() {
                      screen = 'portfolio';
                    });
                  },
                ),
              ),
              Container(
                color:
                    screen == "productinfo" ? Colors.grey[300] : Colors.white,
                width: MediaQuery.of(context).size.width / 4,
                height: 50,
                child: MaterialButton(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: <Widget>[
                      Icon(
                        EvilIcons.getIconData("archive"),
                        color: Color(0xff5946a8),
                        size: 20,
                      ),
                      Text(
                        'PRODUCT INFO',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Color(0xff5946a8), fontSize: 8),
                      ),
                    ],
                  ),
                  onPressed: () {
                    setState(() {
                      screen = 'productinfo';
                    });
                  },
                ),
              )
            ],
          ),
        ));
  }
}

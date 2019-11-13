import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_webview_plugin/flutter_webview_plugin.dart';
import 'package:http/http.dart';
import 'package:shared_preferences/shared_preferences.dart';

class paymentScreen extends StatefulWidget {
  final Function onChange;

  paymentScreen(this.onChange);

  @override
  _paymentScreenState createState() => _paymentScreenState();
}

class _paymentScreenState extends State<paymentScreen> {
  String final_url = '';
  bool isLoading = false;

  @override
  void initState() {
    _subscribeAPI();
  }

  _subscribeAPI() async {
    setState(() {
      isLoading = true;
    });
    SharedPreferences storage = await SharedPreferences.getInstance();
    var user = storage.getString('userData');
    var userData = jsonDecode(user);
    HttpClient client = new HttpClient();
    String url = 'https://stockzai.com/api/payment/payment';
    HttpClientRequest request = await client.getUrl(Uri.parse(url));
    request.headers.set('authorization', userData["token"]);
    HttpClientResponse response = await request.close();
    if (response.statusCode == 200) {
      String res = await response.transform(utf8.decoder).join();
      var result = json.decode(res);
      print("payment Response" + result.toString());
      setState(() {
        final_url = result["redirection_link"];
        isLoading = false;
      });
    } else {
      setState(() {
        isLoading = false;
      });
      String res = await response.transform(utf8.decoder).join();
      var result = json.decode(res);
      print("error--------------" + result.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: (){
        Navigator.pop(context);
        widget.onChange("reload");
      },
      child: isLoading
          ? Scaffold(
              appBar: AppBar(
                backgroundColor: Color(0xff5946a8),
                title: Text("Payment Process"),
              ),
              body: Container(
                height: MediaQuery.of(context).size.height,
                width: MediaQuery.of(context).size.width,
                child: Center(
                    child: CircularProgressIndicator(
                  backgroundColor: Colors.transparent,
                  strokeWidth: 2,
                  valueColor: new AlwaysStoppedAnimation(Color(0xff7b67f0)),
                )),
              ))
          : WebviewScaffold(
              url: final_url,
              appBar: AppBar(
                backgroundColor: Color(0xff5946a8),
                title: Text("Payment Process"),
                leading: IconButton(
                    icon: Icon(Icons.arrow_back),
                    onPressed: () {
                      Navigator.pop(context);
                      widget.onChange("reload");
                    }),
              ),
              withZoom: true,
              withLocalStorage: true,
              hidden: true,
              allowFileURLs: true,
              initialChild: Container(
                height: MediaQuery.of(context).size.height,
                width: MediaQuery.of(context).size.width,
                child: Center(
                    child: CircularProgressIndicator(
                  backgroundColor: Colors.transparent,
                  strokeWidth: 2,
                  valueColor: new AlwaysStoppedAnimation(Color(0xff7b67f0)),
                )),
              ),
            ),
    );
  }
}

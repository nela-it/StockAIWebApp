import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
class ForgotPassword extends StatefulWidget {
  @override
  _ForgotPasswordState createState() => _ForgotPasswordState();
}

class UserData {
  final String name;
  UserData(this.name);
}

class _ForgotPasswordState extends State<ForgotPassword> {
  
 
  String email,errorMessage ;
  bool loading=false, emailError=false ;

  _forgotPassword() async {
     setState(() {
       loading = true;
     });
   if(email == null || email.isEmpty){
      print('forgot Password');
      setState(() {
        emailError = true;      
      });
   }
   else{
    setState(() {
      emailError = false;      
      });
    HttpClient client = new HttpClient();
      //client.badCertificateCallback = ((X509Certificate cert, String host, int port) => true); 
      String url = "https://api.stockzed.com/api/user/forgotPassword";
      HttpClientRequest request = await client.postUrl(Uri.parse(url));
      request.headers.set('content-type', 'application/json');
      request.add(utf8.encode(json.encode({"email":email})));
      HttpClientResponse response = await request.close();
      if(response.statusCode == 200){
        String res = await response.transform(utf8.decoder).join();
        var result = json.decode(res);
        print(result);
        setState(() {
          loading=false;
        });
        Navigator.pop(context);
      }
      else{
        print('error');
        String res = await response.transform(utf8.decoder).join();
        var result = json.decode(res);
        print(result);
        setState(() {
          loading=false;
          errorMessage=result["message"];
        });
      }
   }
  }
  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    void _showDailog(){
      showDialog(
        context: context,
        builder: (BuildContext context){
          return AlertDialog(
            title: Text('email'),
            actions: <Widget>[
              FlatButton(
                child: Text("close"),
                onPressed: () {
                  Navigator.of(context).pop();
                } 
              )
            ],
          );
        },
      );
    }
    return Scaffold(
          body: 
          Container(
            height: MediaQuery.of(context).size.height,
            width: MediaQuery.of(context).size.width,
            decoration: BoxDecoration(
              color: Color(0xff282828),
              image: DecorationImage(
                image: AssetImage("lib/assets/images/backgroundAistock.png"),
                fit: BoxFit.cover,
                alignment: Alignment.topCenter
                )
              ),
            alignment: Alignment.bottomCenter,
            child:SingleChildScrollView(
            child: Column(
            children: <Widget>[
              Container(
                margin: EdgeInsets.only(top:40),
                child: Image.asset(
                  "lib/assets/images/logo.png",
                  width: 150,
                  height: 75,
                  ),
              ),
              Container(
                child: Text(
                  "Forgot Password",
                  style: TextStyle(color:Colors.white,fontSize: 24,fontWeight: FontWeight.w300 ),
                  ),
              ),
              Container(
                padding: EdgeInsets.symmetric(vertical: 10),
                margin: EdgeInsets.only(top: 45),
                height: MediaQuery.of(context).size.height/1.38 ,
                width: MediaQuery.of(context).size.width,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.only(topLeft: Radius.circular(20),topRight: Radius.circular(20))
                ),
                child: Column(
                  children: <Widget>[
                    Container(
                      child: Column(
                        children: <Widget>[
                          Container(
                            //width: 400,
                            margin: EdgeInsets.only(top: 20,left: 20,right: 20),
                            child: Text(
                              "Email ID",
                              style: TextStyle(fontSize: 16),
                              ),
                            alignment: AlignmentDirectional.topStart,
                          ),
                          Container(
                            margin: EdgeInsets.only(top: 10,left: 20,right: 20),
                            child:TextField(
                            cursorColor: Color(0xff7b67f0),
                            decoration: InputDecoration(
                              contentPadding: EdgeInsets.symmetric(vertical: 10,horizontal: 10),
                              border: new OutlineInputBorder(
                                borderSide: new BorderSide(color: Colors.red)
                              ),
                              focusedBorder: new OutlineInputBorder(
                                borderSide: new BorderSide(color: Color(0xff7b67f0),width: 2)
                              ),
                              errorText: emailError ? 'Please Enter Email' : errorMessage ?? null  
                            ),
                            onChanged: (text){
                              setState(() {
                                email=text;
                              });
                            },
                          ) ,
                          )
                          
                        ],
                      ),
                    ),
                    Container(
                      margin: EdgeInsets.symmetric(horizontal: 20,vertical: 20),
                      height: 40,
                      width: MediaQuery.of(context).size.width,
                      decoration: BoxDecoration(borderRadius: BorderRadius.all(Radius.circular(50)),color: Color(0xff7b67f0)),
                      child: MaterialButton(
                        onPressed: (){
                          _forgotPassword();
                        },
                        child:
                        loading ?
                        SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                          backgroundColor: Colors.transparent,
                          strokeWidth: 2,
                          valueColor: new AlwaysStoppedAnimation(Colors.white),
                          ) ,
                        )
                        :
                         Text(
                          "Submit",
                          style: TextStyle(color: Colors.white,fontSize:16),
                          ),
                      ),
                    ),
                    Container(
                      margin: EdgeInsets.symmetric(horizontal: 20),
                      height: 40,
                      width: MediaQuery.of(context).size.width,
                      decoration: BoxDecoration(borderRadius: BorderRadius.all(Radius.circular(50)),color: Color(0xff7b67f0).withOpacity(0.5)),
                      child: MaterialButton(
                        onPressed: (){
                           Navigator.pop(context);
                        },
                        child: Text(
                          "Back To Login",
                          style: TextStyle(color: Colors.white,fontSize:16),
                          ),
                      ),
                    ),

                  ],
                ),
              )
            ],
            ),
          ),
        )  
      );
  }
}

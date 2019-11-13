import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:bezier_chart/bezier_chart.dart';
//import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

class LineChartSample1 extends StatefulWidget {
  final List<chartDataClass> UserPrice;
  final List<chartDataClass> RealPrice;

  const LineChartSample1({
    Key key,
    this.UserPrice,
    this.RealPrice,
  }) : super(key: key);

  @override
  State<StatefulWidget> createState() => LineChartSample1State();
}

class chartDataClass {
  chartDataClass(this.price, this.time);

  final double price;
  final String time;
}

class LineChartSample1State extends State<LineChartSample1> {
  //StreamController<LineTouchResponse> controller;

  bool loading = false;

  List chartData = [];

  @override
  void initState() {
    super.initState();
    //_getChartData();
    /*controller = StreamController();
    controller.stream.distinct().listen((LineTouchResponse response) {
      print('response: ${response.touchInput}');
    });*/
  }

  @override
  Widget build(BuildContext context) {
    return loading
        ? CircularProgressIndicator(
            backgroundColor: Colors.transparent,
            strokeWidth: 2,
            valueColor: new AlwaysStoppedAnimation(Color(0xff7b67f0)),
          )
        : //AspectRatio(
        /*Container(
            color: Colors.white,
             decoration: BoxDecoration(
               borderRadius: BorderRadius.all(Radius.circular(18)),
                gradient: LinearGradient(
                  colors: [
                    Color(0xff2c274c),
                    Color(0xff46426c),
                  ],
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                )
             ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                SizedBox(
                  height: 37,
                ),
                // Text("Unfold Shop 2018", style: TextStyle(color: Color(0xff827daa), fontSize: 16,), textAlign: TextAlign.center,),
                // SizedBox(
                //   height: 4,
                // ),
                // Text("Monthly Sales", style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold, letterSpacing: 2), textAlign: TextAlign.center,),
                // SizedBox(
                //   height: 37,
                // ),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(right: 16.0, left: 0),
                    child: FlChart(
                      chart: LineChart(
                        LineChartData(
                          // lineTouchData: LineTouchData(
                          //   touchResponseSink: controller.sink,
                          //   touchTooltipData: TouchTooltipData (
                          //     tooltipBgColor: Colors.blueGrey.withOpacity(0.8),
                          //   )
                          // ),
                          gridData: FlGridData(
                            show: false,
                          ),
                          titlesData: FlTitlesData(
                            bottomTitles: SideTitles(
                              showTitles: true,
                              reservedSize: 22,
                              textStyle: TextStyle(
                                color: const Color(0xff72719b),
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                              margin: 10,
                              getTitles: (value) {
                                // switch(value.toInt()) {
                                //   case 2:
                                //     return 'SEPT';
                                //   case 7:
                                //     return 'OCT';
                                //   case 12:
                                //     return 'DEC';
                                // }
                                return '';
                              },
                            ),
                            leftTitles: SideTitles(
                              showTitles: true,
                              textStyle: TextStyle(
                                color: Color(0xff75729e),
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                              getTitles: (value) {
                                // switch(value.toInt()) {
                                //   case 1: return '1m';
                                //   case 2: return '2m';
                                //   case 3: return '3m';
                                //   case 4: return '5m';
                                // }
                                return '';
                              },
                              margin: 8,
                              reservedSize: 0,
                            ),
                          ),
                          borderData: FlBorderData(
                              show: false,
                              border: Border(
                                bottom: BorderSide(
                                  color: Color(0xff4e4965),
                                  width: 1,
                                ),
                                left: BorderSide(
                                  color: Colors.transparent,
                                ),
                                right: BorderSide(
                                  color: Colors.transparent,
                                ),
                                top: BorderSide(
                                  color: Colors.transparent,
                                ),
                              )),
                          minX: 0,
                          maxX: 14,
                          maxY: 4,
                          minY: 0,
                          lineBarsData: [
                            LineChartBarData(
                              spots: [
                                FlSpot(1, 1),
                                FlSpot(3, 2.8),
                                FlSpot(7, 1.2),
                                FlSpot(10, 2.8),
                                FlSpot(12, 2.6),
                                FlSpot(13, 3.9),
                                FlSpot(15, 3.1),
                                FlSpot(18, 4.5),
                              ],
                              isCurved: true,
                              colors: [
                                Color(0xff7f63f4),
                              ],
                              barWidth: 2,
                              isStrokeCapRound: true,
                              dotData: FlDotData(
                                show: false,
                              ),
                              belowBarData: BelowBarData(
                                show: false,
                              ),
                            ),
                            LineChartBarData(
                              spots: [
                                FlSpot(1, 2.8),
                                FlSpot(3, 1.9),
                                FlSpot(6, 3),
                                FlSpot(10, 1.3),
                                FlSpot(13, 2.5),
                                FlSpot(15, 2.1),
                                FlSpot(18, 1.5),
                              ],
                              isCurved: true,
                              colors: [
                                Color(0xffa8a8a8),
                              ],
                              barWidth: 2,
                              isStrokeCapRound: true,
                              dotData: FlDotData(
                                show: false,
                              ),
                              belowBarData: BelowBarData(
                                show: false,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
                SizedBox(
                  height: 10,
                ),
              ],
            ),
            // ),
          );*/
        SfCartesianChart(
            primaryXAxis: CategoryAxis(),
            legend: Legend(isVisible: true,position: LegendPosition.bottom),
            zoomPanBehavior: ZoomPanBehavior(enablePinching: true,enableDoubleTapZooming: true),
            tooltipBehavior: TooltipBehavior(enable: true),
            series: <ChartSeries<chartDataClass, String>>[
                LineSeries<chartDataClass, String>(
                  dataSource: widget.UserPrice,
                  xValueMapper: (chartDataClass time, _) => "${time.time}",
                  yValueMapper: (chartDataClass time, _) => time.price,
                  name: "User Portflio Price",
                  markerSettings: MarkerSettings(isVisible: true),
                  legendIconType: LegendIconType.circle
                  //dataLabelSettings: DataLabelSettings(isVisible: true)
                ),
                LineSeries<chartDataClass, String>(
                    dataSource: widget.RealPrice,
                    xValueMapper: (chartDataClass time, _) => "${time.time}",
                    yValueMapper: (chartDataClass time, _) => time.price,
                    name: "Real Time Price",
                    markerSettings: MarkerSettings(isVisible: true),
                    legendIconType: LegendIconType.circle
                    //dataLabelSettings: DataLabelSettings(isVisible: true)
                    )
              ]);
    /*Container(
            //color: Colors.red,
            height: MediaQuery.of(context).size.height / 2,
            width: MediaQuery.of(context).size.width,
            child: BezierChart(
              bezierChartScale: BezierChartScale.CUSTOM,
              xAxisCustomValues: const [0, 5, 10, 15, 20, 25, 30, 35],
              series: const [
                BezierLine(
                  lineColor: Colors.blue,
                  lineStrokeWidth: 2.0,
                  label: "Custom 2",
                  data: const [
                    DataPoint<double>(value: 5),
                    DataPoint<double>(value: 50),
                    DataPoint<double>(value: 30),
                    DataPoint<double>(value: 30),
                    DataPoint<double>(value: 50),
                    DataPoint<double>(value: 40),
                    DataPoint<double>(value: 10),
                    DataPoint<double>(value: 30),
                  ],
                ),
                BezierLine(
                  lineColor: Colors.black,
                  lineStrokeWidth: 2.0,
                  label: "Custom 3",
                  data: const [
                    DataPoint<double>(value: 5),
                    DataPoint<double>(value: 10),
                    DataPoint<double>(value: 35),
                    DataPoint<double>(value: 40),
                    DataPoint<double>(value: 40),
                    DataPoint<double>(value: 40),
                    DataPoint<double>(value: 9),
                    DataPoint<double>(value: 11),
                  ],
                ),
              ],
              config: BezierChartConfig(
                verticalIndicatorStrokeWidth: 2.0,
                verticalIndicatorColor: Colors.black12,
                showVerticalIndicator: true,
                contentWidth: MediaQuery.of(context).size.width * 2,
                backgroundColor: Colors.grey[500],
              ),
            ),
          );*/
  }
/*
  @override
  void dispose() {
    super.dispose();
    controller.close();
  }*/
}

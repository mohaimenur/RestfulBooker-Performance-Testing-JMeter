/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 96.95333333333333, "KoPercent": 3.046666666666667};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5384, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4019, 500, 1500, "PartialUpdateBooking"], "isController": false}, {"data": [0.9132, 500, 1500, "Auth"], "isController": false}, {"data": [0.5652, 500, 1500, "GetBooking"], "isController": false}, {"data": [0.387, 500, 1500, "DeleteBooking"], "isController": false}, {"data": [0.5536, 500, 1500, "CreateBooking"], "isController": false}, {"data": [0.4095, 500, 1500, "UpdateBooking"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 30000, 914, 3.046666666666667, 1016.8973666666714, 45, 10403, 933.0, 1600.0, 1698.9500000000007, 7253.0, 406.08037684258966, 152.42971161102238, 139.71309046624796], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["PartialUpdateBooking", 5000, 217, 4.34, 1321.4790000000007, 45, 10272, 1417.0, 1635.0, 1701.0, 1862.9599999999991, 70.8054831766172, 29.535954139288545, 26.42070648826045], "isController": false}, {"data": ["Auth", 5000, 86, 1.72, 422.8793999999999, 49, 10403, 252.0, 975.0, 1031.0, 6275.819999999996, 68.8838067946987, 20.343890566018242, 16.6603020899347], "isController": false}, {"data": ["GetBooking", 5000, 83, 1.66, 774.9672000000007, 50, 10268, 832.0, 931.0, 991.0, 1101.9699999999993, 70.8596695105014, 29.748674592025452, 11.644707181273207], "isController": false}, {"data": ["DeleteBooking", 5000, 346, 6.92, 1341.7470000000014, 52, 10272, 1417.0, 1635.0, 1710.9499999999998, 6357.969999999999, 70.9733282232537, 19.46105294255419, 20.941234971397748], "isController": false}, {"data": ["CreateBooking", 5000, 48, 0.96, 885.8819999999994, 229, 10305, 832.0, 945.0, 1010.9499999999998, 7262.969999999999, 70.8877987920719, 30.773307243669716, 32.32871292568123], "isController": false}, {"data": ["UpdateBooking", 5000, 134, 2.68, 1354.4295999999983, 53, 10398, 1418.0, 1639.9000000000005, 1715.0, 6412.819999999996, 70.83256598053521, 29.15404777125331, 37.81493376269674], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 267, 29.212253829321664, 0.89], "isController": false}, {"data": ["405/Method Not Allowed", 237, 25.929978118161927, 0.79], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: restful-booker.herokuapp.com:443 failed to respond", 251, 27.461706783369802, 0.8366666666666667], "isController": false}, {"data": ["404/Not Found", 159, 17.396061269146607, 0.53], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 30000, 914, "503/Service Unavailable", 267, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: restful-booker.herokuapp.com:443 failed to respond", 251, "405/Method Not Allowed", 237, "404/Not Found", 159, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["PartialUpdateBooking", 5000, 217, "405/Method Not Allowed", 72, "503/Service Unavailable", 61, "404/Not Found", 48, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: restful-booker.herokuapp.com:443 failed to respond", 36, "", ""], "isController": false}, {"data": ["Auth", 5000, 86, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: restful-booker.herokuapp.com:443 failed to respond", 86, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GetBooking", 5000, 83, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: restful-booker.herokuapp.com:443 failed to respond", 48, "503/Service Unavailable", 20, "404/Not Found", 15, "", "", "", ""], "isController": false}, {"data": ["DeleteBooking", 5000, 346, "405/Method Not Allowed", 135, "503/Service Unavailable", 102, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: restful-booker.herokuapp.com:443 failed to respond", 61, "404/Not Found", 48, "", ""], "isController": false}, {"data": ["CreateBooking", 5000, 48, "503/Service Unavailable", 48, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["UpdateBooking", 5000, 134, "404/Not Found", 48, "503/Service Unavailable", 36, "405/Method Not Allowed", 30, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: restful-booker.herokuapp.com:443 failed to respond", 20, "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

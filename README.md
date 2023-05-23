# RestfulBooker-Performance-Testing-JMeter
Hi,
I’ve completed performance test on frequently used API for test RestfulBooker website (https://restful-booker.herokuapp.com/). 
Test executed for the below mentioned scenario in server 000.000.000.00. 

100 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 100 And Total Concurrent API requested: 6000.
200 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 200 And Total Concurrent API requested: 12000.
300 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 256 And Total Concurrent API requested: 18000.
400 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 295 And Total Concurrent API requested: 24000.
500 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 443 And Total Concurrent API requested: 30000.

** While executed 500 concurrent request, found  914 request got connection timeout and error rate is 3.05%. 

*** Summary: Server can handle almost concurrent 29000 API call with almost zero (0) error rate. ***

# Apache JMeter Dashboard for 500 Concurrent Request: 
![apache jmeter dashboard ss](https://github.com/mohaimenur/RestfulBooker-Performance-Testing-JMeter/assets/63193648/59c17248-8401-4218-87fc-304390db12d1)

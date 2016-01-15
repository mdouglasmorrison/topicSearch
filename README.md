# topicSearch

I think the most interesting challenge of this application was figuring out how to handle returning data from two API's based on a single query. On the surface, it seems that you are stuck choosing between two less than ideal options. Those being:
1. Make two separate HTTP requests to the two different API proxies, in order to mantain asynchronicity. However, you're making once unneccesary request.
2. Make a single HTTP request to the back end, but you're essentially making your back end synchronous, because the request is dependent on the slower of the two APIs to return. This is not good either.

My solution was to implement web-sockets. Specifically Socket.io. Instead of making a request/requests, we open up a socket and emit the query that the back end is listening for. The APIs can then return when they are ready, and broadcast their results back to the front end asynchronously. This also allows for the Twitter Stream API to be used to continuously update the Twitter results in real time.

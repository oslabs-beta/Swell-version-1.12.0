/**
 * Executes a simple load test against a specified URL.
 *
 * @param {string} url - The URL to send the requests to.
 * @param {number} requestsPerSecond - The number of requests per second each user should send.
 * @param {number} durationInSeconds - The duration of the test in seconds.
 *
 * @returns {Promise<Object>} An object containing the load test results, including total sent requests,
 *                            total received responses, total missed responses, and the average response time.
 *
 * @example
 * const testResults = await simpleLoadTest('https://api.example.com/data', 10, 5, 30);
 * console.log(testResults);
 * 
 */

export type LoadTestResult = [
  { totalSent: number,
  totalReceived: number,
  totalMissed: number,
  averageResponseTime: number,
  totalNotSent: number,
  errorCounts: { [errorCode: string]: number } },
];

  
  export async function LoadTest(
    reqResObj: any,
    requestsPerSecond: number,
    durationInSeconds: number,
    abortSignal: AbortSignal
    
  ): Promise<LoadTestResult> {
    // Initialize variables for start and end times of the load test.
    const startTest = performance.now();
    const endTest = startTest + durationInSeconds * 1000;
    // Calculate the delay between each request based on the desired requests per second.
    const delayBetweenRequests = 1000 / requestsPerSecond;
  
    // Initialize counters for sent, received, and missed requests, and for the total response time.
    let totalSent = 0;
    let totalReceived = 0;
    let totalMissed = 0;
    let totalResponseTime = 0;
    let totalNotSent = 0;
    const errorCounts: { [errorCode: string]: number } = {};

    interface Header {
      
    }
  
    // Define the sendRequest function, which sends a request to the target URL and updates the counters.
    const sendRequest = async () => {
      try {
        totalSent += 1;
        const startTime = performance.now();
        const response = await loadTestComposer();
        const endTime = performance.now();
        // If the response is successful (HTTP status 200-299), increment the totalReceived counter
        // and update the totalResponseTime.
        if (response.ok) {
          totalReceived += 1;
          totalResponseTime += endTime - startTime;
        } else {
          // If the response has a non-success status, increment the totalMissed counter.
          totalMissed += 1;
        }
      } catch (error) {
        const typedError = error as { code?: string; message: string };
        // Increment the count for the error code in the errorCounts object
        // this way the user gets all errors and can look up error code to see if code is 429: Too Many Requests
        const errorCode = typedError.code || typedError.message;
        if (errorCounts[errorCode]) {
          errorCounts[errorCode] += 1;
        } else {
          errorCounts[errorCode] = 1;
        }
      }
    };

    const loadTestComposer = async () => {
      const {url, request, graphQL} = reqResObj;
      if (graphQL) {
        const headers: {[key: string]: string} = {};

        request.headers.forEach((header: any) => {
          headers[header.key] = header.value;
        });
        
        let cookies = '';
        if (request.cookies.length) {
          cookies = request.cookies.reduce(
            (acc: {}, userCookie: {key: string, value: string}) => `${acc}${userCookie.key}=${userCookie.value}; `,
            ''
          );
        }
        headers.Cookie = cookies;
        
        const variables: JSON = request.bodyVariables
        ? JSON.parse(request.bodyVariables)
        : {};

        const requestBody: string = JSON.stringify({
          query: `${request.body}`,
          variables: variables
        });

        const response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: requestBody,
        });
        return response;        
      } else {
        const response = await fetch(url);
        return response;
      }
    };
  
    // Define the runUserLoad function, which simulates a single user sending requests to the target URL.
    const runUserLoad = async () => {
      // Keep sending requests until the end time of the load test is reached.
      while (performance.now() < endTest && !abortSignal.aborted) {
        const startOfSecond: number = performance.now();
        let requestsThisSecond: number = 0;
  
        while (performance.now() - startOfSecond < 1000) {
          await sendRequest();
          requestsThisSecond++;
  
          // Wait for the calculated delay between requests before sending the next one.
          await new Promise((resolve) =>
            setTimeout(resolve, delayBetweenRequests)
          );
        }
  
        // Check if the desired number of requests were sent
        const desiredRequests: number = requestsPerSecond;
        const actualRequests: number = requestsThisSecond;
        if (actualRequests < desiredRequests) {
          totalNotSent += desiredRequests - actualRequests;
        }
      }
    };
  
    await runUserLoad();
  
    const averageResponseTime =
      totalReceived === 0 ? totalReceived : totalResponseTime / totalReceived;
  
    return [
      { totalSent,
      totalReceived,
      totalMissed,
      averageResponseTime,
      totalNotSent,
      errorCounts },
    ];
  }
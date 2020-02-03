import {
  HttpExchange,
  HttpExchangeReader,
  HttpProtocol,
  HttpRequestBuilder,
  HttpResponseBuilder,
  HttpMethod
} from "../src/index";

test("HttpRequest building from code", () => {
  const method = HttpMethod.GET;
  const request1 = new HttpRequestBuilder().withMethod(method).build();
  expect(request1.method).toBe(HttpMethod.GET);
  expect(request1.body).toBeUndefined();

  const request2 = new HttpRequestBuilder()
    .withProtocol(HttpProtocol.HTTPS)
    .withMethod(HttpMethod.POST)
    .withBody("hello, world")
    .build();
  expect(request2.protocol).toBe(HttpProtocol.HTTPS);
  expect(request2.method).toBe(HttpMethod.POST);
  expect(request2.body).toBe("hello, world");
});

test("HttpResponse building from code", () => {
  const response = new HttpResponseBuilder().withStatusCode(404).build();
  expect(response.statusCode).toBe(404);
});

test("HttpExchange building from code", () => {
  const request = new HttpRequestBuilder().withMethod(HttpMethod.GET).build();
  const response = new HttpResponseBuilder().withStatusCode(200).build();
  const exchange = new HttpExchange(request, response);

  expect(exchange.request.method).toBe(HttpMethod.GET);
  expect(exchange.response.statusCode).toBe(200);
});

test("Http exchanges from JSON", () => {
  const json = `{
    "request": {
      "protocol": "https",
      "method": "post",
      "headers": {
        "accept": "*/*",
        "multi-value": ["value1", "value2"]
      },
      "body": "a request body"
    },
    "response": {
      "statusCode": 404,
      "headers": {
        "content-length": "15",
        "Upper-Case": "yes"
      },
      "body": "a response body"
    }
  }`;

  const exchange = HttpExchangeReader.fromJson(json);

  expect(exchange.request.protocol).toBe(HttpProtocol.HTTPS);
  expect(exchange.request.method).toBe(HttpMethod.POST);
  expect(exchange.request.headers.get("accept")).toBe("*/*");
  expect(exchange.request.headers.get("multi-value")).toBe("value1");
  expect(exchange.request.headers.getAll("multi-value")).toEqual([
    "value1",
    "value2"
  ]);
  expect(exchange.request.body).toBe("a request body");

  expect(exchange.response.statusCode).toBe(404);
  expect(exchange.response.headers.get("content-length")).toBe("15");
  expect(exchange.response.headers.get("Upper-Case")).toBe("yes");
  expect(exchange.response.headers.get("upper-case")).toBe("yes");
  expect(exchange.response.body).toBe("a response body");
});

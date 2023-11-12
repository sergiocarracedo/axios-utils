# axios-scm-utils
This is a collection of utilities for [axios](https://axios-http.com) that provides out-of-the-box configurable functionalities to your applications that uses axios.

## Installation
```bash
pnpm i axios-scm-utils
```

## Usage

### `setupHeadersGuard`
This utility is used to guard your axios instance from sending requests with invalid headers. For example if your backend application limits the headers allowed in CORS requests, you can use this utility to prevent axios from sending requests with invalid headers even if your local development environment allow any header 

```ts
```

### `setupJwtAuth`
This utility is used to automatically add JWT token to your axios requests. It will automatically refresh the token if it is expired. It also provides a way to automatically execute a callback function when the token is expired or on 401 errors.

```ts
```



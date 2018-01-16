// A-> $http function is implemented in order to follow the standard Adapter pattern
export function $http (url) {

    // A small example of object
    let core = {

        // Method that performs the ajax request
        ajax: function (method, url, args, headers) {

            // Creating a promise
            let promise = new Promise(function (resolve, reject) {

                // Instantiates the XMLHttpRequest
                let client = new XMLHttpRequest()
                let uri = url

                if (args && (method === 'GET' || method === 'PUT')) {
                    uri += '?'
                    let argcount = 0
                    for (let key in args) {
                        if (args.hasOwnProperty(key)) {
                            if (argcount++) {
                                uri += '&'
                            }
                            uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key])
                        }
                    }
                }

                client.open(method, uri)

                client.timeout = 10000

                client.setRequestHeader('cache-control', 'no-cache')

                for (let key in headers) {
                    if (!headers.hasOwnProperty(key)) {
                        continue
                    }

                    client.setRequestHeader(key, headers[key])
                }

                if (args instanceof FormData) {
                    client.send(args)
                }else if (args && (method === 'POST' || method === 'PATCH' || method === 'DELETE')) {
                    client.send(JSON.stringify(args))
                }else {
                    client.send()
                }

                client.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        // Performs the function "resolve" when this.status is equal to 2xx
                        resolve(JSON.parse(this.response))
                    } else {
                        // Performs the function "reject" when this.status is different than 2xx
                        reject(this.statusText)
                    }
                }
                client.onerror = function () {
                    reject('An error occurred during the transaction')
                }
                client.ontimeout = function () {
                	reject('timeout')
                }
            })

            // Return the promise
            return promise
        }
    }

    // Adapter pattern
    return {
        'get': function (args, headers = {}) {
            return core.ajax('GET', url, args, headers)
        },
        'post': function (args, headers = {}) {
            return core.ajax('POST', url, args, headers)
        },
        'put': function (args, headers = {}) {
            return core.ajax('PUT', url, args, headers)
        },
        'delete': function (args, headers = {}) {
            return core.ajax('DELETE', url, args, headers)
        },
        'patch': function (args, headers = {}) {
            return core.ajax('PATCH', url, args, headers)
        }
    }
}

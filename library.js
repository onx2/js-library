// MIT License

// Copyright (c) 2017 Jeffrey Rooks

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

'use strict'

const _Lib = (function () {
    /**
     *
     * @param {array} els
     * @constructor
     */
    function Lib (els) {
        for (let i = 0; i < els.length; i++) {
            this[i] = els[i]
        }
        this.length = els.length
    }

    Lib.prototype.forEach = function (callback) {
        this.map(callback)
        return this
    }

    Lib.prototype.map = function (callback) {
        const results = []
        for (let i = 0, length = this.length; i < length; i++) {
            results.push(callback.call(this, this[i], i))
        }
        return results
    }

    Lib.prototype.text = function (text) {
        if (typeof text !== 'undefined') {
            return this.forEach(function (el) {
                el.innerText = text
            })
        } else {
            return this.map(function (el) {
                return el.innerText
            })
        }
    }

    Lib.prototype.html = function (html) {
        if (typeof html !== 'undefined') {
            return this.forEach(function (el) {
                el.innerHTML = html
            })
        } else {
            return this.map(function (el) {
                return el.innerHTML
            })
        }
    }

    Lib.prototype.val = function (val) {
        if (typeof val !== 'undefined') {
            return this.forEach(function (el) {
                el.value = val
            })
        } else {
            return this.map(function (el) {
                return el.value
            })
        }
    }

    Lib.prototype.siblings = function () {
        const siblings = []
        for (let i = 0, length = this[0].parentElement.children.length; i < length; i++) {
            if (!this[0].parentElement.children[i].isSameNode(this[0])) {
                siblings.push(this[0].parentElement.children[i])
            }
        }
        return siblings.length === 0 ? undefined : _Lib.get(siblings)
    }

    Lib.prototype.children = function () {
        const children = []
        for (let i = 0; i < this[0].children.length; i++) {
            children.push(this[0].children[i])
        }
        return _Lib.get(children)
    }

    Lib.prototype.parent = function () {
        const parent = []
        let tempEl
        this.forEach(function (el) {
            if (!el.parentElement.isSameNode(tempEl)) {
                parent.push(el.parentElement)
            }
            tempEl = el.parentElement
        })
        return _Lib.get(parent)
    }

    Lib.prototype.show = function () {
        return this.forEach(function (el) {
            el.style.display = 'block'
        })
    }

    Lib.prototype.hide = function () {
        return this.forEach(function (el) {
            el.style.display = 'none'
        })
    }

    Lib.prototype.toggle = function () {
        return this.forEach(function (el) {
            if (el.style.display === 'block') {
                el.style.display = 'none'
            } else {
                el.style.display = 'block'
            }
        })
    }

    Lib.prototype.isDisabled = function () {
        return !!this[0].disabled
    }

    Lib.prototype.enable = function () {
        return this.forEach(function (el) {
            el.disabled = false
        })
    }

    Lib.prototype.disable = function () {
        return this.forEach(function (el) {
            el.disabled = true
        })
    }

    Lib.prototype.hasClass = function (className) {
        return this[0].classList.contains(className)
    }

    Lib.prototype.addClass = function (classes) {
        if (Object.prototype.toString.call(classes) !== '[object Array]') {
            /*
             * Remove all whitespace from the comma separated string
             */
            classes = classes.replace(/\s+/g, '').split(',')
        }
        return this.forEach(function (el) {
            let _thisClassList
            (_thisClassList = el.classList).add.apply(_thisClassList, classes)
        })
    }

    Lib.prototype.removeClass = function (classes) {
        if (Object.prototype.toString.call(classes) !== '[object Array]') {
            /*
             * Remove all whitespace from the comma separated string
             */
            classes = classes.replace(/\s+/g, '').split(',')
        }
        return this.forEach(function (el) {
            let _thisClassList
            (_thisClassList = el.classList).remove.apply(_thisClassList, classes)
        })
    }

    Lib.prototype.attr = function (attr, val) {
        if (typeof val !== 'undefined') {
            return this.forEach(function (el) {
                el.setAttribute(attr, val)
            })
        } else {
            return this.map(function (el) {
                return el.getAttribute(attr)
            })
        }
    }

    Lib.prototype.append = function (els) {
        return this.forEach(function (parEl, index) {
            els.forEach(function (childEl) {
                parEl.appendChild((index > 0) ? childEl.cloneNode(true) : childEl)
            })
        })
    }

    Lib.prototype.prepend = function (els) {
        return this.forEach(function (parEl, index) {
            els.forEach(function (childEl) {
                parEl.insertBefore((index > 0) ? childEl.cloneNode(true) : childEl, parEl.firstChild)
            })
        })
    }

    Lib.prototype.remove = function () {
        return this.forEach(function (el) {
            return el.parentNode.removeChild(el)
        })
    }

    Lib.prototype.on = (function () {
        return function (evt, fn) {
            return this.forEach(function (el) {
                el.addEventListener(evt, fn, false)
            })
        }
    }())

    Lib.prototype.off = (function () {
        return function (evt, fn) {
            return this.forEach(function (el) {
                el.removeEventListener(evt, fn, false)
            })
        }
    }())

    const _Lib = {
        /**
         *
         * @param {string|array} selector
         * @returns {Lib}
         */
        get: function (selector) {
            let els
            if (this.isType(selector, 'String')) {
                els = document.querySelectorAll(selector)
            } else if (this.isType(selector, 'Array')) {
                els = selector
            } else {
                els = [selector]
            }
            return new Lib(els)
        },
        /**
         *
         * @param {string} tagName
         * @param {Object} [attributes]
         * @returns {Lib}
         */
        create: function (tagName, attributes) {
            const el = new Lib([document.createElement(tagName)])
            if (attributes) {
                if (attributes.className) {
                    el.addClass(attributes.className)
                    delete attributes.className
                }
                if (attributes.text) {
                    el.text(attributes.text)
                    delete attributes.text
                }
                for (let key in attributes) {
                    if (attributes.hasOwnProperty(key)) {
                        el.attr(key, attributes[key])
                    }
                }
            }
            return el
        },
        /**
         *
         * @param {string} requestType
         * @param {string} url - relative URLS (local)
         * @param {string} data - JSON string
         * @param {boolean} [handleError=true]
         * @param {function} [responseHandler] - callback function is optional
         */
        ajax: function (requestType, url, data, responseHandler, handleError) {
            if (typeof handleError === 'undefined') {
                const handleError = true
            }
            const xhr = new XMLHttpRequest()
            xhr.open(requestType, url, true)

            /*
             * Send the proper header information along with the request
             */
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

            /*
             * Send a token for specific request types
             */
            if (requestType === 'POST' || requestType === 'PUT' || requestType === 'DELETE') {
                /*
                 * Only send the token to relative URLs (i.e. locally)
                 */
                if (!(/^http:.*/.test(url) || /^https:.*/.test(url))) {
                    xhr.setRequestHeader('X-CSRF-Token', document.querySelector('meta[name="csrf-token"]').content)
                }
            }

            /*
             * Call a function when the state changes
             */
            const _this = this
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    /*
                     * When responseHandler is defined, use it
                     */
                    responseHandler && responseHandler(xhr.response)
                } else if (xhr.readyState === 4 && xhr.status !== 200) {
                    /*
                     * When responseHandler is defined, use it
                     */
                    responseHandler && responseHandler(xhr.response)
                    if (handleError) {
                        _this.handleError(xhr.response)
                    } else {
                        /*
                         * Used for debugging the error handler itself breaking
                         */
                        _this.debug && console.error('Error logging the error')
                    }
                }
            }

            /*
             * Submit request
             */
            xhr.send(data)
        },
        /**
         *
         * @param {Object} obj - Handles object's one level deep with values as string|array
         * @returns {string} - Serialized object string
         */
        serializeObject: function (obj) {
            if (!this.isType(obj, 'Object')) {
                return this.handleError(new Error('Object required for serializeObject method'))
            }

            let serializedObject = ''
            for (let i = 0, len = Object.keys(obj).length; i < len; i++) {
                let oKeyI = Object.keys(obj)[i]
                let oValI = Object.values(obj)[i]

                /*
                 * First iteration doesn't need `&`
                 */
                if (i === 0) {
                    if (Object.prototype.toString.call(oValI) === '[object Array]') {
                        for (let i = 0, len = oValI.length; i < len; i++) {
                            /*
                             * First iteration of array doesn't require `&`, all others do
                             */
                            serializedObject += (i !== 0) && '&'
                            /*
                             * Each iteration requires `[]` to indicate it is part of an array
                             */
                            serializedObject += oValI + '[]=' + Object.values(oValI)[i]
                        }
                    } else {
                        /*
                         * Non-array's on first iteration
                         */
                        serializedObject += oKeyI + '=' + oValI
                    }
                } else {
                    if (Object.prototype.toString.call(oValI) === '[object Array]') {
                        for (let i = 0, len = oValI.length; i < len; i++) {
                            serializedObject += '&' + oKeyI + '[]=' + Object.values(oValI)[i]
                        }
                    } else {
                        serializedObject += '&' + oKeyI + '=' + oValI
                    }
                }
            }

            return serializedObject
        },
        /**
         *
         * @param {string} string
         * @returns {string} - First letter is capitalized
         */
        capitalizeFirstLetter: function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1)
        },
        /**
         *
         * @param {*} params
         * @param {string} type
         * @returns {boolean}
         */
        isType: function (params, type) {
            return Object.prototype.toString.call(params) === '[object ' + this.capitalizeFirstLetter(type) + ']'
        },
        errorLogUrl: '/some/url/error-log',
        /**
         *
         * @param {Object} error - new Error('some message content')
         * @returns {boolean}
         */
        handleError: function (error) {
            this.debug && console.error(error)
            const dataObj = {
                url: location.href,
                message: error.message
            }
            const _this = this
            const data = this.serializeObject(dataObj)
            this.ajax('POST', this.errorLogUrl, data, function (response) {
                _this.debug && console.log(response)
            }, false)
        },
        /**
         *
         * @param {number} [min=Number.MIN_SAFE_INTEGER]
         * @param {number} [max=Number.MAX_SAFE_INTEGER]
         * @returns {number}
         */
        randomNumber: function (min, max) {
            const Min = min || Number.MIN_SAFE_INTEGER
            const Max = max || Number.MAX_SAFE_INTEGER
            /*
             * Bitwise OR -- https://mzl.la/2HY7dwf
             */
            return Math.random() * Max | Min
        },
        /**
         *
         * @param {number} a
         * @param {number} b
         * @param {string} inclusive
         * @returns {boolean}
         */
        isBetween: function (a, b, inclusive) {
            const min = Math.min(a, b)
            const max = Math.max(a, b)
            return inclusive ? this >= min && this <= max : this > min && this < max
        },
        /**
         *
         * @param {number} number - the number being rounded
         * @param {number} [digits=0] - number of digits to round to
         * @param {boolean} [toString=false] - should the return be a string
         * @returns {string|number}
         */
        round: function (number, digits, toString) {
            if (typeof number === 'undefined') {
                return this.handleError(new Error('No number provided for rounding'))
            }
            const Digits = digits || 0
            const ToString = toString || false
            const multiplier = Math.pow(10, Digits)
            let roundedNumber = Math.round(number * multiplier) / multiplier

            return ToString ? roundedNumber + '' : roundedNumber
        }
    }
    return _Lib
}())

var XDC = function() {
    "use strict";
    var n = {}
      , e = {}
      , t = []
      , o = "*"
      , r = "*"
      , i = []
      , a = function(n) {
        return window === n
    }
      , s = {};
    s.setTarget = function(n) {
        return !n || a(n.window) ? this : (o = n.window || o,
        r = n.origin || r,
        this.setTrustedOrigins(),
        this)
    }
    ,
    s.setTrustedOrigins = function(n) {
        i = n || i,
        r && i.indexOf(r) === -1 && i.push(r)
    }
    ,
    s.addTargetChildById = function(n) {
        t.push(n)
    }
    ;
    var c = function(n, e) {
        n.length && n.forEach(function(n) {
            n.postMessage(e, r)
        })
    };
    s.postMessage = function(e) {
        if (!o || !r)
            throw new TypeError("Target window or origin not configured!");
        var i = [];
        !a(window.parent) && i.push(window.parent),
        "string" != typeof o && i.push(o),
        t.forEach(function(n) {
            frames[n] && i.push(frames[n].contentWindow)
        }),
        i.length && ("function" != typeof e.oncomplete && "function" != typeof e.onexception || (n[e.id = d()] = [e],
        e = f(e),
        delete e.oncomplete,
        delete e.onexception),
        c(i, e))
    }
    ,
    s.receiveMessage = function(n) {
        if (!o || !r)
            throw new TypeError("Target window or origin not configured!");
        var t = arguments[0];
        if ("string" == typeof t) {
            var i = arguments[1];
            if (!i)
                throw new TypeError("Handler not defined!");
            n = {},
            n[t] = i;
            var a = arguments[2];
            a && a.hasOwnProperty("async") && (i.async = a.async)
        }
        for (var t in n) {
            var s = e[t];
            s ? s.push(n[t]) : e[t] = [n[t]]
        }
    }
    ;
    var d = function(n) {
        for (var e = n || 12, t = "", o = "abcdefghijklmnopqrstuvwxyz0123456789", r = 0; r < e; r++) {
            var i = Math.floor(Math.random() * o.length);
            t += o.substring(i, i + 1)
        }
        return t
    }
      , f = function(n) {
        if (null === n || "object" != typeof n)
            return n;
        if (Array.isArray(n)) {
            for (var e = [], t = 0, o = n.length; t < o; t++)
                e[t] = f(n[t]);
            return e
        }
        var r = {};
        for (var i in n)
            n.hasOwnProperty(i) && (r[i] = f(n[i]));
        return r
    }
      , u = function(t) {
        console.log(t.origin);
        if (i.indexOf(t.origin) === -1 || "*" !== o && t.source !== o || "*" !== r && t.origin !== r)
            return void (!a(t.source) && c([t.source], {
                id: t.data.id,
                exception: {
                    code: 1108,
                    message: "Domain not registered",
                    ref: "https://help.zoho.com/portal/en/kb/office-integrator/common/common-customization/articles/how-to-add-postmessage-domains"
                }
            }));
        for (var s, d, u = t.data, p = u.message, h = e[p] || [], g = 0, w = h.length; g < w; g++) {
            d = f(u);
            try {
                s = h[g],
                s.async ? !function(n, e) {
                    var o = new Promise(function(t, o) {
                        setTimeout(function() {
                            n(t, o, e.data)
                        }, 300)
                    }
                    );
                    o.then(function(n) {
                        e.data = n,
                        c([t.source], e)
                    })
                }(s, d) : d.data = s(d.data)
            } catch (n) {
                d.exception = n.stack
            }
            (!s.async && void 0 !== d.data && null !== d.data || void 0 !== d.exception && null !== d.exception) && c([t.source], d)
        }
        for (h = n[t.data.id] || []; s = h.shift(); )
            t.data.hasOwnProperty("exception") ? !!s.onexception && s.onexception(t.data.exception) : t.data.hasOwnProperty("data") && !!s.oncomplete && s.oncomplete(t.data.data);
        delete n[t.data.id]
    };
    return window.addEventListener ? addEventListener("message", u, !1) : attachEvent("onmessage", u),
    s
}();

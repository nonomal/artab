(() => {
  var nt = !1,
    it = !1,
    W = [],
    ot = -1;
  function Ut(e) {
    Rn(e);
  }
  function Rn(e) {
    W.includes(e) || W.push(e), Mn();
  }
  function Wt(e) {
    let t = W.indexOf(e);
    t !== -1 && t > ot && W.splice(t, 1);
  }
  function Mn() {
    !it && !nt && ((nt = !0), queueMicrotask(Nn));
  }
  function Nn() {
    (nt = !1), (it = !0);
    for (let e = 0; e < W.length; e++) W[e](), (ot = e);
    (W.length = 0), (ot = -1), (it = !1);
  }
  var T,
    N,
    $,
    at,
    st = !0;
  function Gt(e) {
    (st = !1), e(), (st = !0);
  }
  function Jt(e) {
    (T = e.reactive),
      ($ = e.release),
      (N = t =>
        e.effect(t, {
          scheduler: r => {
            st ? Ut(r) : r();
          },
        })),
      (at = e.raw);
  }
  function ct(e) {
    N = e;
  }
  function Yt(e) {
    let t = () => {};
    return [
      n => {
        let i = N(n);
        return (
          e._x_effects ||
            ((e._x_effects = new Set()),
            (e._x_runEffects = () => {
              e._x_effects.forEach(o => o());
            })),
          e._x_effects.add(i),
          (t = () => {
            i !== void 0 && (e._x_effects.delete(i), $(i));
          }),
          i
        );
      },
      () => {
        t();
      },
    ];
  }
  function ve(e, t) {
    let r = !0,
      n,
      i = N(() => {
        let o = e();
        JSON.stringify(o),
          r
            ? (n = o)
            : queueMicrotask(() => {
                t(o, n), (n = o);
              }),
          (r = !1);
      });
    return () => $(i);
  }
  var Xt = [],
    Zt = [],
    Qt = [];
  function er(e) {
    Qt.push(e);
  }
  function te(e, t) {
    typeof t == 'function' ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : ((t = e), Zt.push(t));
  }
  function Ae(e) {
    Xt.push(e);
  }
  function Oe(e, t, r) {
    e._x_attributeCleanups || (e._x_attributeCleanups = {}),
      e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []),
      e._x_attributeCleanups[t].push(r);
  }
  function lt(e, t) {
    e._x_attributeCleanups &&
      Object.entries(e._x_attributeCleanups).forEach(([r, n]) => {
        (t === void 0 || t.includes(r)) && (n.forEach(i => i()), delete e._x_attributeCleanups[r]);
      });
  }
  function tr(e) {
    for (e._x_effects?.forEach(Wt); e._x_cleanups?.length; ) e._x_cleanups.pop()();
  }
  var ut = new MutationObserver(mt),
    ft = !1;
  function ue() {
    ut.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), (ft = !0);
  }
  function dt() {
    kn(), ut.disconnect(), (ft = !1);
  }
  var le = [];
  function kn() {
    let e = ut.takeRecords();
    le.push(() => e.length > 0 && mt(e));
    let t = le.length;
    queueMicrotask(() => {
      if (le.length === t) for (; le.length > 0; ) le.shift()();
    });
  }
  function m(e) {
    if (!ft) return e();
    dt();
    let t = e();
    return ue(), t;
  }
  var pt = !1,
    Se = [];
  function rr() {
    pt = !0;
  }
  function nr() {
    (pt = !1), mt(Se), (Se = []);
  }
  function mt(e) {
    if (pt) {
      Se = Se.concat(e);
      return;
    }
    let t = [],
      r = new Set(),
      n = new Map(),
      i = new Map();
    for (let o = 0; o < e.length; o++)
      if (
        !e[o].target._x_ignoreMutationObserver &&
        (e[o].type === 'childList' &&
          (e[o].removedNodes.forEach(s => {
            s.nodeType === 1 && s._x_marker && r.add(s);
          }),
          e[o].addedNodes.forEach(s => {
            if (s.nodeType === 1) {
              if (r.has(s)) {
                r.delete(s);
                return;
              }
              s._x_marker || t.push(s);
            }
          })),
        e[o].type === 'attributes')
      ) {
        let s = e[o].target,
          a = e[o].attributeName,
          c = e[o].oldValue,
          l = () => {
            n.has(s) || n.set(s, []), n.get(s).push({ name: a, value: s.getAttribute(a) });
          },
          u = () => {
            i.has(s) || i.set(s, []), i.get(s).push(a);
          };
        s.hasAttribute(a) && c === null ? l() : s.hasAttribute(a) ? (u(), l()) : u();
      }
    i.forEach((o, s) => {
      lt(s, o);
    }),
      n.forEach((o, s) => {
        Xt.forEach(a => a(s, o));
      });
    for (let o of r) t.some(s => s.contains(o)) || Zt.forEach(s => s(o));
    for (let o of t) o.isConnected && Qt.forEach(s => s(o));
    (t = null), (r = null), (n = null), (i = null);
  }
  function Ce(e) {
    return z(B(e));
  }
  function k(e, t, r) {
    return (
      (e._x_dataStack = [t, ...B(r || e)]),
      () => {
        e._x_dataStack = e._x_dataStack.filter(n => n !== t);
      }
    );
  }
  function B(e) {
    return e._x_dataStack
      ? e._x_dataStack
      : typeof ShadowRoot == 'function' && e instanceof ShadowRoot
        ? B(e.host)
        : e.parentNode
          ? B(e.parentNode)
          : [];
  }
  function z(e) {
    return new Proxy({ objects: e }, Dn);
  }
  var Dn = {
    ownKeys({ objects: e }) {
      return Array.from(new Set(e.flatMap(t => Object.keys(t))));
    },
    has({ objects: e }, t) {
      return t == Symbol.unscopables
        ? !1
        : e.some(r => Object.prototype.hasOwnProperty.call(r, t) || Reflect.has(r, t));
    },
    get({ objects: e }, t, r) {
      return t == 'toJSON' ? Pn : Reflect.get(e.find(n => Reflect.has(n, t)) || {}, t, r);
    },
    set({ objects: e }, t, r, n) {
      let i = e.find(s => Object.prototype.hasOwnProperty.call(s, t)) || e[e.length - 1],
        o = Object.getOwnPropertyDescriptor(i, t);
      return o?.set && o?.get ? o.set.call(n, r) || !0 : Reflect.set(i, t, r);
    },
  };
  function Pn() {
    return Reflect.ownKeys(this).reduce((t, r) => ((t[r] = Reflect.get(this, r)), t), {});
  }
  function Te(e) {
    let t = n => typeof n == 'object' && !Array.isArray(n) && n !== null,
      r = (n, i = '') => {
        Object.entries(Object.getOwnPropertyDescriptors(n)).forEach(([o, { value: s, enumerable: a }]) => {
          if (a === !1 || s === void 0 || (typeof s == 'object' && s !== null && s.__v_skip)) return;
          let c = i === '' ? o : `${i}.${o}`;
          typeof s == 'object' && s !== null && s._x_interceptor
            ? (n[o] = s.initialize(e, c, o))
            : t(s) && s !== n && !(s instanceof Element) && r(s, c);
        });
      };
    return r(e);
  }
  function Re(e, t = () => {}) {
    let r = {
      initialValue: void 0,
      _x_interceptor: !0,
      initialize(n, i, o) {
        return e(
          this.initialValue,
          () => In(n, i),
          s => ht(n, i, s),
          i,
          o,
        );
      },
    };
    return (
      t(r),
      n => {
        if (typeof n == 'object' && n !== null && n._x_interceptor) {
          let i = r.initialize.bind(r);
          r.initialize = (o, s, a) => {
            let c = n.initialize(o, s, a);
            return (r.initialValue = c), i(o, s, a);
          };
        } else r.initialValue = n;
        return r;
      }
    );
  }
  function In(e, t) {
    return t.split('.').reduce((r, n) => r[n], e);
  }
  function ht(e, t, r) {
    if ((typeof t == 'string' && (t = t.split('.')), t.length === 1)) e[t[0]] = r;
    else {
      if (t.length === 0) throw error;
      return e[t[0]] || (e[t[0]] = {}), ht(e[t[0]], t.slice(1), r);
    }
  }
  var ir = {};
  function y(e, t) {
    ir[e] = t;
  }
  function fe(e, t) {
    let r = Ln(t);
    return (
      Object.entries(ir).forEach(([n, i]) => {
        Object.defineProperty(e, `$${n}`, {
          get() {
            return i(t, r);
          },
          enumerable: !1,
        });
      }),
      e
    );
  }
  function Ln(e) {
    let [t, r] = _t(e),
      n = { interceptor: Re, ...t };
    return te(e, r), n;
  }
  function or(e, t, r, ...n) {
    try {
      return r(...n);
    } catch (i) {
      re(i, e, t);
    }
  }
  function re(e, t, r = void 0) {
    (e = Object.assign(e ?? { message: 'No error message given.' }, { el: t, expression: r })),
      console.warn(
        `Alpine Expression Error: ${e.message}

${
  r
    ? 'Expression: "' +
      r +
      `"

`
    : ''
}`,
        t,
      ),
      setTimeout(() => {
        throw e;
      }, 0);
  }
  var Me = !0;
  function ke(e) {
    let t = Me;
    Me = !1;
    let r = e();
    return (Me = t), r;
  }
  function R(e, t, r = {}) {
    let n;
    return x(e, t)(i => (n = i), r), n;
  }
  function x(...e) {
    return sr(...e);
  }
  var sr = xt;
  function ar(e) {
    sr = e;
  }
  function xt(e, t) {
    let r = {};
    fe(r, e);
    let n = [r, ...B(e)],
      i = typeof t == 'function' ? $n(n, t) : Fn(n, t, e);
    return or.bind(null, e, t, i);
  }
  function $n(e, t) {
    return (r = () => {}, { scope: n = {}, params: i = [] } = {}) => {
      let o = t.apply(z([n, ...e]), i);
      Ne(r, o);
    };
  }
  var gt = {};
  function jn(e, t) {
    if (gt[e]) return gt[e];
    let r = Object.getPrototypeOf(async function () {}).constructor,
      n = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(async()=>{ ${e} })()` : e,
      o = (() => {
        try {
          let s = new r(
            ['__self', 'scope'],
            `with (scope) { __self.result = ${n} }; __self.finished = true; return __self.result;`,
          );
          return Object.defineProperty(s, 'name', { value: `[Alpine] ${e}` }), s;
        } catch (s) {
          return re(s, t, e), Promise.resolve();
        }
      })();
    return (gt[e] = o), o;
  }
  function Fn(e, t, r) {
    let n = jn(t, r);
    return (i = () => {}, { scope: o = {}, params: s = [] } = {}) => {
      (n.result = void 0), (n.finished = !1);
      let a = z([o, ...e]);
      if (typeof n == 'function') {
        let c = n(n, a).catch(l => re(l, r, t));
        n.finished
          ? (Ne(i, n.result, a, s, r), (n.result = void 0))
          : c
              .then(l => {
                Ne(i, l, a, s, r);
              })
              .catch(l => re(l, r, t))
              .finally(() => (n.result = void 0));
      }
    };
  }
  function Ne(e, t, r, n, i) {
    if (Me && typeof t == 'function') {
      let o = t.apply(r, n);
      o instanceof Promise ? o.then(s => Ne(e, s, r, n)).catch(s => re(s, i, t)) : e(o);
    } else typeof t == 'object' && t instanceof Promise ? t.then(o => e(o)) : e(t);
  }
  var wt = 'x-';
  function C(e = '') {
    return wt + e;
  }
  function cr(e) {
    wt = e;
  }
  var De = {};
  function d(e, t) {
    return (
      (De[e] = t),
      {
        before(r) {
          if (!De[r]) {
            console.warn(String.raw`Cannot find directive \`${r}\`. \`${e}\` will use the default order of execution`);
            return;
          }
          let n = G.indexOf(r);
          G.splice(n >= 0 ? n : G.indexOf('DEFAULT'), 0, e);
        },
      }
    );
  }
  function lr(e) {
    return Object.keys(De).includes(e);
  }
  function pe(e, t, r) {
    if (((t = Array.from(t)), e._x_virtualDirectives)) {
      let o = Object.entries(e._x_virtualDirectives).map(([a, c]) => ({ name: a, value: c })),
        s = Et(o);
      (o = o.map(a => (s.find(c => c.name === a.name) ? { name: `x-bind:${a.name}`, value: `"${a.value}"` } : a))),
        (t = t.concat(o));
    }
    let n = {};
    return t
      .map(dr((o, s) => (n[o] = s)))
      .filter(mr)
      .map(zn(n, r))
      .sort(Kn)
      .map(o => Bn(e, o));
  }
  function Et(e) {
    return Array.from(e)
      .map(dr())
      .filter(t => !mr(t));
  }
  var yt = !1,
    de = new Map(),
    ur = Symbol();
  function fr(e) {
    yt = !0;
    let t = Symbol();
    (ur = t), de.set(t, []);
    let r = () => {
        for (; de.get(t).length; ) de.get(t).shift()();
        de.delete(t);
      },
      n = () => {
        (yt = !1), r();
      };
    e(r), n();
  }
  function _t(e) {
    let t = [],
      r = a => t.push(a),
      [n, i] = Yt(e);
    return (
      t.push(i),
      [
        { Alpine: K, effect: n, cleanup: r, evaluateLater: x.bind(x, e), evaluate: R.bind(R, e) },
        () => t.forEach(a => a()),
      ]
    );
  }
  function Bn(e, t) {
    let r = () => {},
      n = De[t.type] || r,
      [i, o] = _t(e);
    Oe(e, t.original, o);
    let s = () => {
      e._x_ignore ||
        e._x_ignoreSelf ||
        (n.inline && n.inline(e, t, i), (n = n.bind(n, e, t, i)), yt ? de.get(ur).push(n) : n());
    };
    return (s.runCleanups = o), s;
  }
  var Pe =
      (e, t) =>
      ({ name: r, value: n }) => (r.startsWith(e) && (r = r.replace(e, t)), { name: r, value: n }),
    Ie = e => e;
  function dr(e = () => {}) {
    return ({ name: t, value: r }) => {
      let { name: n, value: i } = pr.reduce((o, s) => s(o), { name: t, value: r });
      return n !== t && e(n, t), { name: n, value: i };
    };
  }
  var pr = [];
  function ne(e) {
    pr.push(e);
  }
  function mr({ name: e }) {
    return hr().test(e);
  }
  var hr = () => new RegExp(`^${wt}([^:^.]+)\\b`);
  function zn(e, t) {
    return ({ name: r, value: n }) => {
      let i = r.match(hr()),
        o = r.match(/:([a-zA-Z0-9\-_:]+)/),
        s = r.match(/\.[^.\]]+(?=[^\]]*$)/g) || [],
        a = t || e[r] || r;
      return {
        type: i ? i[1] : null,
        value: o ? o[1] : null,
        modifiers: s.map(c => c.replace('.', '')),
        expression: n,
        original: a,
      };
    };
  }
  var bt = 'DEFAULT',
    G = [
      'ignore',
      'ref',
      'data',
      'id',
      'anchor',
      'bind',
      'init',
      'for',
      'model',
      'modelable',
      'transition',
      'show',
      'if',
      bt,
      'teleport',
    ];
  function Kn(e, t) {
    let r = G.indexOf(e.type) === -1 ? bt : e.type,
      n = G.indexOf(t.type) === -1 ? bt : t.type;
    return G.indexOf(r) - G.indexOf(n);
  }
  function J(e, t, r = {}) {
    e.dispatchEvent(new CustomEvent(t, { detail: r, bubbles: !0, composed: !0, cancelable: !0 }));
  }
  function D(e, t) {
    if (typeof ShadowRoot == 'function' && e instanceof ShadowRoot) {
      Array.from(e.children).forEach(i => D(i, t));
      return;
    }
    let r = !1;
    if ((t(e, () => (r = !0)), r)) return;
    let n = e.firstElementChild;
    for (; n; ) D(n, t, !1), (n = n.nextElementSibling);
  }
  function E(e, ...t) {
    console.warn(`Alpine Warning: ${e}`, ...t);
  }
  var _r = !1;
  function gr() {
    _r &&
      E('Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems.'),
      (_r = !0),
      document.body ||
        E(
          "Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?",
        ),
      J(document, 'alpine:init'),
      J(document, 'alpine:initializing'),
      ue(),
      er(t => S(t, D)),
      te(t => P(t)),
      Ae((t, r) => {
        pe(t, r).forEach(n => n());
      });
    let e = t => !Y(t.parentElement, !0);
    Array.from(document.querySelectorAll(br().join(',')))
      .filter(e)
      .forEach(t => {
        S(t);
      }),
      J(document, 'alpine:initialized'),
      setTimeout(() => {
        Vn();
      });
  }
  var vt = [],
    xr = [];
  function yr() {
    return vt.map(e => e());
  }
  function br() {
    return vt.concat(xr).map(e => e());
  }
  function Le(e) {
    vt.push(e);
  }
  function $e(e) {
    xr.push(e);
  }
  function Y(e, t = !1) {
    return j(e, r => {
      if ((t ? br() : yr()).some(i => r.matches(i))) return !0;
    });
  }
  function j(e, t) {
    if (e) {
      if (t(e)) return e;
      if ((e._x_teleportBack && (e = e._x_teleportBack), !!e.parentElement)) return j(e.parentElement, t);
    }
  }
  function wr(e) {
    return yr().some(t => e.matches(t));
  }
  var Er = [];
  function vr(e) {
    Er.push(e);
  }
  var Hn = 1;
  function S(e, t = D, r = () => {}) {
    j(e, n => n._x_ignore) ||
      fr(() => {
        t(e, (n, i) => {
          n._x_marker ||
            (r(n, i),
            Er.forEach(o => o(n, i)),
            pe(n, n.attributes).forEach(o => o()),
            n._x_ignore || (n._x_marker = Hn++),
            n._x_ignore && i());
        });
      });
  }
  function P(e, t = D) {
    t(e, r => {
      tr(r), lt(r), delete r._x_marker;
    });
  }
  function Vn() {
    [
      ['ui', 'dialog', ['[x-dialog], [x-popover]']],
      ['anchor', 'anchor', ['[x-anchor]']],
      ['sort', 'sort', ['[x-sort]']],
    ].forEach(([t, r, n]) => {
      lr(r) ||
        n.some(i => {
          if (document.querySelector(i)) return E(`found "${i}", but missing ${t} plugin`), !0;
        });
    });
  }
  var St = [],
    At = !1;
  function ie(e = () => {}) {
    return (
      queueMicrotask(() => {
        At ||
          setTimeout(() => {
            je();
          });
      }),
      new Promise(t => {
        St.push(() => {
          e(), t();
        });
      })
    );
  }
  function je() {
    for (At = !1; St.length; ) St.shift()();
  }
  function Sr() {
    At = !0;
  }
  function me(e, t) {
    return Array.isArray(t)
      ? Ar(e, t.join(' '))
      : typeof t == 'object' && t !== null
        ? qn(e, t)
        : typeof t == 'function'
          ? me(e, t())
          : Ar(e, t);
  }
  function Ar(e, t) {
    let r = o => o.split(' ').filter(Boolean),
      n = o =>
        o
          .split(' ')
          .filter(s => !e.classList.contains(s))
          .filter(Boolean),
      i = o => (
        e.classList.add(...o),
        () => {
          e.classList.remove(...o);
        }
      );
    return (t = t === !0 ? (t = '') : t || ''), i(n(t));
  }
  function qn(e, t) {
    let r = a => a.split(' ').filter(Boolean),
      n = Object.entries(t)
        .flatMap(([a, c]) => (c ? r(a) : !1))
        .filter(Boolean),
      i = Object.entries(t)
        .flatMap(([a, c]) => (c ? !1 : r(a)))
        .filter(Boolean),
      o = [],
      s = [];
    return (
      i.forEach(a => {
        e.classList.contains(a) && (e.classList.remove(a), s.push(a));
      }),
      n.forEach(a => {
        e.classList.contains(a) || (e.classList.add(a), o.push(a));
      }),
      () => {
        s.forEach(a => e.classList.add(a)), o.forEach(a => e.classList.remove(a));
      }
    );
  }
  function X(e, t) {
    return typeof t == 'object' && t !== null ? Un(e, t) : Wn(e, t);
  }
  function Un(e, t) {
    let r = {};
    return (
      Object.entries(t).forEach(([n, i]) => {
        (r[n] = e.style[n]), n.startsWith('--') || (n = Gn(n)), e.style.setProperty(n, i);
      }),
      setTimeout(() => {
        e.style.length === 0 && e.removeAttribute('style');
      }),
      () => {
        X(e, r);
      }
    );
  }
  function Wn(e, t) {
    let r = e.getAttribute('style', t);
    return (
      e.setAttribute('style', t),
      () => {
        e.setAttribute('style', r || '');
      }
    );
  }
  function Gn(e) {
    return e.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
  function he(e, t = () => {}) {
    let r = !1;
    return function () {
      r ? t.apply(this, arguments) : ((r = !0), e.apply(this, arguments));
    };
  }
  d('transition', (e, { value: t, modifiers: r, expression: n }, { evaluate: i }) => {
    typeof n == 'function' && (n = i(n)), n !== !1 && (!n || typeof n == 'boolean' ? Yn(e, r, t) : Jn(e, n, t));
  });
  function Jn(e, t, r) {
    Or(e, me, ''),
      {
        enter: i => {
          e._x_transition.enter.during = i;
        },
        'enter-start': i => {
          e._x_transition.enter.start = i;
        },
        'enter-end': i => {
          e._x_transition.enter.end = i;
        },
        leave: i => {
          e._x_transition.leave.during = i;
        },
        'leave-start': i => {
          e._x_transition.leave.start = i;
        },
        'leave-end': i => {
          e._x_transition.leave.end = i;
        },
      }[r](t);
  }
  function Yn(e, t, r) {
    Or(e, X);
    let n = !t.includes('in') && !t.includes('out') && !r,
      i = n || t.includes('in') || ['enter'].includes(r),
      o = n || t.includes('out') || ['leave'].includes(r);
    t.includes('in') && !n && (t = t.filter((g, b) => b < t.indexOf('out'))),
      t.includes('out') && !n && (t = t.filter((g, b) => b > t.indexOf('out')));
    let s = !t.includes('opacity') && !t.includes('scale'),
      a = s || t.includes('opacity'),
      c = s || t.includes('scale'),
      l = a ? 0 : 1,
      u = c ? _e(t, 'scale', 95) / 100 : 1,
      p = _e(t, 'delay', 0) / 1e3,
      h = _e(t, 'origin', 'center'),
      w = 'opacity, transform',
      F = _e(t, 'duration', 150) / 1e3,
      Ee = _e(t, 'duration', 75) / 1e3,
      f = 'cubic-bezier(0.4, 0.0, 0.2, 1)';
    i &&
      ((e._x_transition.enter.during = {
        transformOrigin: h,
        transitionDelay: `${p}s`,
        transitionProperty: w,
        transitionDuration: `${F}s`,
        transitionTimingFunction: f,
      }),
      (e._x_transition.enter.start = { opacity: l, transform: `scale(${u})` }),
      (e._x_transition.enter.end = { opacity: 1, transform: 'scale(1)' })),
      o &&
        ((e._x_transition.leave.during = {
          transformOrigin: h,
          transitionDelay: `${p}s`,
          transitionProperty: w,
          transitionDuration: `${Ee}s`,
          transitionTimingFunction: f,
        }),
        (e._x_transition.leave.start = { opacity: 1, transform: 'scale(1)' }),
        (e._x_transition.leave.end = { opacity: l, transform: `scale(${u})` }));
  }
  function Or(e, t, r = {}) {
    e._x_transition ||
      (e._x_transition = {
        enter: { during: r, start: r, end: r },
        leave: { during: r, start: r, end: r },
        in(n = () => {}, i = () => {}) {
          Fe(e, t, { during: this.enter.during, start: this.enter.start, end: this.enter.end }, n, i);
        },
        out(n = () => {}, i = () => {}) {
          Fe(e, t, { during: this.leave.during, start: this.leave.start, end: this.leave.end }, n, i);
        },
      });
  }
  window.Element.prototype._x_toggleAndCascadeWithTransitions = function (e, t, r, n) {
    let i = document.visibilityState === 'visible' ? requestAnimationFrame : setTimeout,
      o = () => i(r);
    if (t) {
      e._x_transition && (e._x_transition.enter || e._x_transition.leave)
        ? e._x_transition.enter &&
          (Object.entries(e._x_transition.enter.during).length ||
            Object.entries(e._x_transition.enter.start).length ||
            Object.entries(e._x_transition.enter.end).length)
          ? e._x_transition.in(r)
          : o()
        : e._x_transition
          ? e._x_transition.in(r)
          : o();
      return;
    }
    (e._x_hidePromise = e._x_transition
      ? new Promise((s, a) => {
          e._x_transition.out(
            () => {},
            () => s(n),
          ),
            e._x_transitioning && e._x_transitioning.beforeCancel(() => a({ isFromCancelledTransition: !0 }));
        })
      : Promise.resolve(n)),
      queueMicrotask(() => {
        let s = Cr(e);
        s
          ? (s._x_hideChildren || (s._x_hideChildren = []), s._x_hideChildren.push(e))
          : i(() => {
              let a = c => {
                let l = Promise.all([c._x_hidePromise, ...(c._x_hideChildren || []).map(a)]).then(([u]) => u?.());
                return delete c._x_hidePromise, delete c._x_hideChildren, l;
              };
              a(e).catch(c => {
                if (!c.isFromCancelledTransition) throw c;
              });
            });
      });
  };
  function Cr(e) {
    let t = e.parentNode;
    if (t) return t._x_hidePromise ? t : Cr(t);
  }
  function Fe(e, t, { during: r, start: n, end: i } = {}, o = () => {}, s = () => {}) {
    if (
      (e._x_transitioning && e._x_transitioning.cancel(),
      Object.keys(r).length === 0 && Object.keys(n).length === 0 && Object.keys(i).length === 0)
    ) {
      o(), s();
      return;
    }
    let a, c, l;
    Xn(e, {
      start() {
        a = t(e, n);
      },
      during() {
        c = t(e, r);
      },
      before: o,
      end() {
        a(), (l = t(e, i));
      },
      after: s,
      cleanup() {
        c(), l();
      },
    });
  }
  function Xn(e, t) {
    let r,
      n,
      i,
      o = he(() => {
        m(() => {
          (r = !0),
            n || t.before(),
            i || (t.end(), je()),
            t.after(),
            e.isConnected && t.cleanup(),
            delete e._x_transitioning;
        });
      });
    (e._x_transitioning = {
      beforeCancels: [],
      beforeCancel(s) {
        this.beforeCancels.push(s);
      },
      cancel: he(function () {
        for (; this.beforeCancels.length; ) this.beforeCancels.shift()();
        o();
      }),
      finish: o,
    }),
      m(() => {
        t.start(), t.during();
      }),
      Sr(),
      requestAnimationFrame(() => {
        if (r) return;
        let s = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, '').replace('s', '')) * 1e3,
          a = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, '').replace('s', '')) * 1e3;
        s === 0 && (s = Number(getComputedStyle(e).animationDuration.replace('s', '')) * 1e3),
          m(() => {
            t.before();
          }),
          (n = !0),
          requestAnimationFrame(() => {
            r ||
              (m(() => {
                t.end();
              }),
              je(),
              setTimeout(e._x_transitioning.finish, s + a),
              (i = !0));
          });
      });
  }
  function _e(e, t, r) {
    if (e.indexOf(t) === -1) return r;
    let n = e[e.indexOf(t) + 1];
    if (!n || (t === 'scale' && isNaN(n))) return r;
    if (t === 'duration' || t === 'delay') {
      let i = n.match(/([0-9]+)ms/);
      if (i) return i[1];
    }
    return t === 'origin' && ['top', 'right', 'left', 'center', 'bottom'].includes(e[e.indexOf(t) + 2])
      ? [n, e[e.indexOf(t) + 2]].join(' ')
      : n;
  }
  var I = !1;
  function A(e, t = () => {}) {
    return (...r) => (I ? t(...r) : e(...r));
  }
  function Tr(e) {
    return (...t) => I && e(...t);
  }
  var Rr = [];
  function H(e) {
    Rr.push(e);
  }
  function Mr(e, t) {
    Rr.forEach(r => r(e, t)),
      (I = !0),
      kr(() => {
        S(t, (r, n) => {
          n(r, () => {});
        });
      }),
      (I = !1);
  }
  var Be = !1;
  function Nr(e, t) {
    t._x_dataStack || (t._x_dataStack = e._x_dataStack),
      (I = !0),
      (Be = !0),
      kr(() => {
        Zn(t);
      }),
      (I = !1),
      (Be = !1);
  }
  function Zn(e) {
    let t = !1;
    S(e, (n, i) => {
      D(n, (o, s) => {
        if (t && wr(o)) return s();
        (t = !0), i(o, s);
      });
    });
  }
  function kr(e) {
    let t = N;
    ct((r, n) => {
      let i = t(r);
      return $(i), () => {};
    }),
      e(),
      ct(t);
  }
  function ge(e, t, r, n = []) {
    switch (
      (e._x_bindings || (e._x_bindings = T({})), (e._x_bindings[t] = r), (t = n.includes('camel') ? si(t) : t), t)
    ) {
      case 'value':
        Qn(e, r);
        break;
      case 'style':
        ti(e, r);
        break;
      case 'class':
        ei(e, r);
        break;
      case 'selected':
      case 'checked':
        ri(e, t, r);
        break;
      default:
        Pr(e, t, r);
        break;
    }
  }
  function Qn(e, t) {
    if (Ot(e))
      e.attributes.value === void 0 && (e.value = t),
        window.fromModel && (typeof t == 'boolean' ? (e.checked = xe(e.value) === t) : (e.checked = Dr(e.value, t)));
    else if (ze(e))
      Number.isInteger(t)
        ? (e.value = t)
        : !Array.isArray(t) && typeof t != 'boolean' && ![null, void 0].includes(t)
          ? (e.value = String(t))
          : Array.isArray(t)
            ? (e.checked = t.some(r => Dr(r, e.value)))
            : (e.checked = !!t);
    else if (e.tagName === 'SELECT') oi(e, t);
    else {
      if (e.value === t) return;
      e.value = t === void 0 ? '' : t;
    }
  }
  function ei(e, t) {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), (e._x_undoAddedClasses = me(e, t));
  }
  function ti(e, t) {
    e._x_undoAddedStyles && e._x_undoAddedStyles(), (e._x_undoAddedStyles = X(e, t));
  }
  function ri(e, t, r) {
    Pr(e, t, r), ii(e, t, r);
  }
  function Pr(e, t, r) {
    [null, void 0, !1].includes(r) && ci(t) ? e.removeAttribute(t) : (Ir(t) && (r = t), ni(e, t, r));
  }
  function ni(e, t, r) {
    e.getAttribute(t) != r && e.setAttribute(t, r);
  }
  function ii(e, t, r) {
    e[t] !== r && (e[t] = r);
  }
  function oi(e, t) {
    let r = [].concat(t).map(n => n + '');
    Array.from(e.options).forEach(n => {
      n.selected = r.includes(n.value);
    });
  }
  function si(e) {
    return e.toLowerCase().replace(/-(\w)/g, (t, r) => r.toUpperCase());
  }
  function Dr(e, t) {
    return e == t;
  }
  function xe(e) {
    return [1, '1', 'true', 'on', 'yes', !0].includes(e)
      ? !0
      : [0, '0', 'false', 'off', 'no', !1].includes(e)
        ? !1
        : e
          ? Boolean(e)
          : null;
  }
  var ai = new Set([
    'allowfullscreen',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'controls',
    'default',
    'defer',
    'disabled',
    'formnovalidate',
    'inert',
    'ismap',
    'itemscope',
    'loop',
    'multiple',
    'muted',
    'nomodule',
    'novalidate',
    'open',
    'playsinline',
    'readonly',
    'required',
    'reversed',
    'selected',
    'shadowrootclonable',
    'shadowrootdelegatesfocus',
    'shadowrootserializable',
  ]);
  function Ir(e) {
    return ai.has(e);
  }
  function ci(e) {
    return !['aria-pressed', 'aria-checked', 'aria-expanded', 'aria-selected'].includes(e);
  }
  function Lr(e, t, r) {
    return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : jr(e, t, r);
  }
  function $r(e, t, r, n = !0) {
    if (e._x_bindings && e._x_bindings[t] !== void 0) return e._x_bindings[t];
    if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
      let i = e._x_inlineBindings[t];
      return (i.extract = n), ke(() => R(e, i.expression));
    }
    return jr(e, t, r);
  }
  function jr(e, t, r) {
    let n = e.getAttribute(t);
    return n === null ? (typeof r == 'function' ? r() : r) : n === '' ? !0 : Ir(t) ? !![t, 'true'].includes(n) : n;
  }
  function ze(e) {
    return e.type === 'checkbox' || e.localName === 'ui-checkbox' || e.localName === 'ui-switch';
  }
  function Ot(e) {
    return e.type === 'radio' || e.localName === 'ui-radio';
  }
  function Ke(e, t) {
    var r;
    return function () {
      var n = this,
        i = arguments,
        o = function () {
          (r = null), e.apply(n, i);
        };
      clearTimeout(r), (r = setTimeout(o, t));
    };
  }
  function He(e, t) {
    let r;
    return function () {
      let n = this,
        i = arguments;
      r || (e.apply(n, i), (r = !0), setTimeout(() => (r = !1), t));
    };
  }
  function Ve({ get: e, set: t }, { get: r, set: n }) {
    let i = !0,
      o,
      s,
      a = N(() => {
        let c = e(),
          l = r();
        if (i) n(Ct(c)), (i = !1);
        else {
          let u = JSON.stringify(c),
            p = JSON.stringify(l);
          u !== o ? n(Ct(c)) : u !== p && t(Ct(l));
        }
        (o = JSON.stringify(e())), (s = JSON.stringify(r()));
      });
    return () => {
      $(a);
    };
  }
  function Ct(e) {
    return typeof e == 'object' ? JSON.parse(JSON.stringify(e)) : e;
  }
  function Fr(e) {
    (Array.isArray(e) ? e : [e]).forEach(r => r(K));
  }
  var Z = {},
    Br = !1;
  function zr(e, t) {
    if ((Br || ((Z = T(Z)), (Br = !0)), t === void 0)) return Z[e];
    (Z[e] = t),
      Te(Z[e]),
      typeof t == 'object' && t !== null && t.hasOwnProperty('init') && typeof t.init == 'function' && Z[e].init();
  }
  function Kr() {
    return Z;
  }
  var Hr = {};
  function Vr(e, t) {
    let r = typeof t != 'function' ? () => t : t;
    return e instanceof Element ? Tt(e, r()) : ((Hr[e] = r), () => {});
  }
  function qr(e) {
    return (
      Object.entries(Hr).forEach(([t, r]) => {
        Object.defineProperty(e, t, {
          get() {
            return (...n) => r(...n);
          },
        });
      }),
      e
    );
  }
  function Tt(e, t, r) {
    let n = [];
    for (; n.length; ) n.pop()();
    let i = Object.entries(t).map(([s, a]) => ({ name: s, value: a })),
      o = Et(i);
    return (
      (i = i.map(s => (o.find(a => a.name === s.name) ? { name: `x-bind:${s.name}`, value: `"${s.value}"` } : s))),
      pe(e, i, r).map(s => {
        n.push(s.runCleanups), s();
      }),
      () => {
        for (; n.length; ) n.pop()();
      }
    );
  }
  var Ur = {};
  function Wr(e, t) {
    Ur[e] = t;
  }
  function Gr(e, t) {
    return (
      Object.entries(Ur).forEach(([r, n]) => {
        Object.defineProperty(e, r, {
          get() {
            return (...i) => n.bind(t)(...i);
          },
          enumerable: !1,
        });
      }),
      e
    );
  }
  var li = {
      get reactive() {
        return T;
      },
      get release() {
        return $;
      },
      get effect() {
        return N;
      },
      get raw() {
        return at;
      },
      version: '3.14.7',
      flushAndStopDeferringMutations: nr,
      dontAutoEvaluateFunctions: ke,
      disableEffectScheduling: Gt,
      startObservingMutations: ue,
      stopObservingMutations: dt,
      setReactivityEngine: Jt,
      onAttributeRemoved: Oe,
      onAttributesAdded: Ae,
      closestDataStack: B,
      skipDuringClone: A,
      onlyDuringClone: Tr,
      addRootSelector: Le,
      addInitSelector: $e,
      interceptClone: H,
      addScopeToNode: k,
      deferMutations: rr,
      mapAttributes: ne,
      evaluateLater: x,
      interceptInit: vr,
      setEvaluator: ar,
      mergeProxies: z,
      extractProp: $r,
      findClosest: j,
      onElRemoved: te,
      closestRoot: Y,
      destroyTree: P,
      interceptor: Re,
      transition: Fe,
      setStyles: X,
      mutateDom: m,
      directive: d,
      entangle: Ve,
      throttle: He,
      debounce: Ke,
      evaluate: R,
      initTree: S,
      nextTick: ie,
      prefixed: C,
      prefix: cr,
      plugin: Fr,
      magic: y,
      store: zr,
      start: gr,
      clone: Nr,
      cloneNode: Mr,
      bound: Lr,
      $data: Ce,
      watch: ve,
      walk: D,
      data: Wr,
      bind: Vr,
    },
    K = li;
  function Rt(e, t) {
    let r = Object.create(null),
      n = e.split(',');
    for (let i = 0; i < n.length; i++) r[n[i]] = !0;
    return t ? i => !!r[i.toLowerCase()] : i => !!r[i];
  }
  var ui = 'itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly';
  var Ls = Rt(
    ui +
      ',async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected',
  );
  var Jr = Object.freeze({}),
    $s = Object.freeze([]);
  var fi = Object.prototype.hasOwnProperty,
    ye = (e, t) => fi.call(e, t),
    V = Array.isArray,
    oe = e => Yr(e) === '[object Map]';
  var di = e => typeof e == 'string',
    qe = e => typeof e == 'symbol',
    be = e => e !== null && typeof e == 'object';
  var pi = Object.prototype.toString,
    Yr = e => pi.call(e),
    Mt = e => Yr(e).slice(8, -1);
  var Ue = e => di(e) && e !== 'NaN' && e[0] !== '-' && '' + parseInt(e, 10) === e;
  var We = e => {
      let t = Object.create(null);
      return r => t[r] || (t[r] = e(r));
    },
    mi = /-(\w)/g,
    js = We(e => e.replace(mi, (t, r) => (r ? r.toUpperCase() : ''))),
    hi = /\B([A-Z])/g,
    Fs = We(e => e.replace(hi, '-$1').toLowerCase()),
    Nt = We(e => e.charAt(0).toUpperCase() + e.slice(1)),
    Bs = We(e => (e ? `on${Nt(e)}` : '')),
    kt = (e, t) => e !== t && (e === e || t === t);
  var Dt = new WeakMap(),
    we = [],
    L,
    Q = Symbol('iterate'),
    Pt = Symbol('Map key iterate');
  function _i(e) {
    return e && e._isEffect === !0;
  }
  function rn(e, t = Jr) {
    _i(e) && (e = e.raw);
    let r = xi(e, t);
    return t.lazy || r(), r;
  }
  function nn(e) {
    e.active && (on(e), e.options.onStop && e.options.onStop(), (e.active = !1));
  }
  var gi = 0;
  function xi(e, t) {
    let r = function () {
      if (!r.active) return e();
      if (!we.includes(r)) {
        on(r);
        try {
          return bi(), we.push(r), (L = r), e();
        } finally {
          we.pop(), sn(), (L = we[we.length - 1]);
        }
      }
    };
    return (
      (r.id = gi++),
      (r.allowRecurse = !!t.allowRecurse),
      (r._isEffect = !0),
      (r.active = !0),
      (r.raw = e),
      (r.deps = []),
      (r.options = t),
      r
    );
  }
  function on(e) {
    let { deps: t } = e;
    if (t.length) {
      for (let r = 0; r < t.length; r++) t[r].delete(e);
      t.length = 0;
    }
  }
  var se = !0,
    Lt = [];
  function yi() {
    Lt.push(se), (se = !1);
  }
  function bi() {
    Lt.push(se), (se = !0);
  }
  function sn() {
    let e = Lt.pop();
    se = e === void 0 ? !0 : e;
  }
  function M(e, t, r) {
    if (!se || L === void 0) return;
    let n = Dt.get(e);
    n || Dt.set(e, (n = new Map()));
    let i = n.get(r);
    i || n.set(r, (i = new Set())),
      i.has(L) ||
        (i.add(L), L.deps.push(i), L.options.onTrack && L.options.onTrack({ effect: L, target: e, type: t, key: r }));
  }
  function U(e, t, r, n, i, o) {
    let s = Dt.get(e);
    if (!s) return;
    let a = new Set(),
      c = u => {
        u &&
          u.forEach(p => {
            (p !== L || p.allowRecurse) && a.add(p);
          });
      };
    if (t === 'clear') s.forEach(c);
    else if (r === 'length' && V(e))
      s.forEach((u, p) => {
        (p === 'length' || p >= n) && c(u);
      });
    else
      switch ((r !== void 0 && c(s.get(r)), t)) {
        case 'add':
          V(e) ? Ue(r) && c(s.get('length')) : (c(s.get(Q)), oe(e) && c(s.get(Pt)));
          break;
        case 'delete':
          V(e) || (c(s.get(Q)), oe(e) && c(s.get(Pt)));
          break;
        case 'set':
          oe(e) && c(s.get(Q));
          break;
      }
    let l = u => {
      u.options.onTrigger &&
        u.options.onTrigger({ effect: u, target: e, key: r, type: t, newValue: n, oldValue: i, oldTarget: o }),
        u.options.scheduler ? u.options.scheduler(u) : u();
    };
    a.forEach(l);
  }
  var wi = Rt('__proto__,__v_isRef,__isVue'),
    an = new Set(
      Object.getOwnPropertyNames(Symbol)
        .map(e => Symbol[e])
        .filter(qe),
    ),
    Ei = cn();
  var vi = cn(!0);
  var Xr = Si();
  function Si() {
    let e = {};
    return (
      ['includes', 'indexOf', 'lastIndexOf'].forEach(t => {
        e[t] = function (...r) {
          let n = _(this);
          for (let o = 0, s = this.length; o < s; o++) M(n, 'get', o + '');
          let i = n[t](...r);
          return i === -1 || i === !1 ? n[t](...r.map(_)) : i;
        };
      }),
      ['push', 'pop', 'shift', 'unshift', 'splice'].forEach(t => {
        e[t] = function (...r) {
          yi();
          let n = _(this)[t].apply(this, r);
          return sn(), n;
        };
      }),
      e
    );
  }
  function cn(e = !1, t = !1) {
    return function (n, i, o) {
      if (i === '__v_isReactive') return !e;
      if (i === '__v_isReadonly') return e;
      if (i === '__v_raw' && o === (e ? (t ? Bi : dn) : t ? Fi : fn).get(n)) return n;
      let s = V(n);
      if (!e && s && ye(Xr, i)) return Reflect.get(Xr, i, o);
      let a = Reflect.get(n, i, o);
      return (qe(i) ? an.has(i) : wi(i)) || (e || M(n, 'get', i), t)
        ? a
        : It(a)
          ? !s || !Ue(i)
            ? a.value
            : a
          : be(a)
            ? e
              ? pn(a)
              : et(a)
            : a;
    };
  }
  var Ai = Oi();
  function Oi(e = !1) {
    return function (r, n, i, o) {
      let s = r[n];
      if (!e && ((i = _(i)), (s = _(s)), !V(r) && It(s) && !It(i))) return (s.value = i), !0;
      let a = V(r) && Ue(n) ? Number(n) < r.length : ye(r, n),
        c = Reflect.set(r, n, i, o);
      return r === _(o) && (a ? kt(i, s) && U(r, 'set', n, i, s) : U(r, 'add', n, i)), c;
    };
  }
  function Ci(e, t) {
    let r = ye(e, t),
      n = e[t],
      i = Reflect.deleteProperty(e, t);
    return i && r && U(e, 'delete', t, void 0, n), i;
  }
  function Ti(e, t) {
    let r = Reflect.has(e, t);
    return (!qe(t) || !an.has(t)) && M(e, 'has', t), r;
  }
  function Ri(e) {
    return M(e, 'iterate', V(e) ? 'length' : Q), Reflect.ownKeys(e);
  }
  var Mi = { get: Ei, set: Ai, deleteProperty: Ci, has: Ti, ownKeys: Ri },
    Ni = {
      get: vi,
      set(e, t) {
        return console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
      },
      deleteProperty(e, t) {
        return console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
      },
    };
  var $t = e => (be(e) ? et(e) : e),
    jt = e => (be(e) ? pn(e) : e),
    Ft = e => e,
    Qe = e => Reflect.getPrototypeOf(e);
  function Ge(e, t, r = !1, n = !1) {
    e = e.__v_raw;
    let i = _(e),
      o = _(t);
    t !== o && !r && M(i, 'get', t), !r && M(i, 'get', o);
    let { has: s } = Qe(i),
      a = n ? Ft : r ? jt : $t;
    if (s.call(i, t)) return a(e.get(t));
    if (s.call(i, o)) return a(e.get(o));
    e !== i && e.get(t);
  }
  function Je(e, t = !1) {
    let r = this.__v_raw,
      n = _(r),
      i = _(e);
    return e !== i && !t && M(n, 'has', e), !t && M(n, 'has', i), e === i ? r.has(e) : r.has(e) || r.has(i);
  }
  function Ye(e, t = !1) {
    return (e = e.__v_raw), !t && M(_(e), 'iterate', Q), Reflect.get(e, 'size', e);
  }
  function Zr(e) {
    e = _(e);
    let t = _(this);
    return Qe(t).has.call(t, e) || (t.add(e), U(t, 'add', e, e)), this;
  }
  function Qr(e, t) {
    t = _(t);
    let r = _(this),
      { has: n, get: i } = Qe(r),
      o = n.call(r, e);
    o ? un(r, n, e) : ((e = _(e)), (o = n.call(r, e)));
    let s = i.call(r, e);
    return r.set(e, t), o ? kt(t, s) && U(r, 'set', e, t, s) : U(r, 'add', e, t), this;
  }
  function en(e) {
    let t = _(this),
      { has: r, get: n } = Qe(t),
      i = r.call(t, e);
    i ? un(t, r, e) : ((e = _(e)), (i = r.call(t, e)));
    let o = n ? n.call(t, e) : void 0,
      s = t.delete(e);
    return i && U(t, 'delete', e, void 0, o), s;
  }
  function tn() {
    let e = _(this),
      t = e.size !== 0,
      r = oe(e) ? new Map(e) : new Set(e),
      n = e.clear();
    return t && U(e, 'clear', void 0, void 0, r), n;
  }
  function Xe(e, t) {
    return function (n, i) {
      let o = this,
        s = o.__v_raw,
        a = _(s),
        c = t ? Ft : e ? jt : $t;
      return !e && M(a, 'iterate', Q), s.forEach((l, u) => n.call(i, c(l), c(u), o));
    };
  }
  function Ze(e, t, r) {
    return function (...n) {
      let i = this.__v_raw,
        o = _(i),
        s = oe(o),
        a = e === 'entries' || (e === Symbol.iterator && s),
        c = e === 'keys' && s,
        l = i[e](...n),
        u = r ? Ft : t ? jt : $t;
      return (
        !t && M(o, 'iterate', c ? Pt : Q),
        {
          next() {
            let { value: p, done: h } = l.next();
            return h ? { value: p, done: h } : { value: a ? [u(p[0]), u(p[1])] : u(p), done: h };
          },
          [Symbol.iterator]() {
            return this;
          },
        }
      );
    };
  }
  function q(e) {
    return function (...t) {
      {
        let r = t[0] ? `on key "${t[0]}" ` : '';
        console.warn(`${Nt(e)} operation ${r}failed: target is readonly.`, _(this));
      }
      return e === 'delete' ? !1 : this;
    };
  }
  function ki() {
    let e = {
        get(o) {
          return Ge(this, o);
        },
        get size() {
          return Ye(this);
        },
        has: Je,
        add: Zr,
        set: Qr,
        delete: en,
        clear: tn,
        forEach: Xe(!1, !1),
      },
      t = {
        get(o) {
          return Ge(this, o, !1, !0);
        },
        get size() {
          return Ye(this);
        },
        has: Je,
        add: Zr,
        set: Qr,
        delete: en,
        clear: tn,
        forEach: Xe(!1, !0),
      },
      r = {
        get(o) {
          return Ge(this, o, !0);
        },
        get size() {
          return Ye(this, !0);
        },
        has(o) {
          return Je.call(this, o, !0);
        },
        add: q('add'),
        set: q('set'),
        delete: q('delete'),
        clear: q('clear'),
        forEach: Xe(!0, !1),
      },
      n = {
        get(o) {
          return Ge(this, o, !0, !0);
        },
        get size() {
          return Ye(this, !0);
        },
        has(o) {
          return Je.call(this, o, !0);
        },
        add: q('add'),
        set: q('set'),
        delete: q('delete'),
        clear: q('clear'),
        forEach: Xe(!0, !0),
      };
    return (
      ['keys', 'values', 'entries', Symbol.iterator].forEach(o => {
        (e[o] = Ze(o, !1, !1)), (r[o] = Ze(o, !0, !1)), (t[o] = Ze(o, !1, !0)), (n[o] = Ze(o, !0, !0));
      }),
      [e, r, t, n]
    );
  }
  var [Di, Pi, Ii, Li] = ki();
  function ln(e, t) {
    let r = t ? (e ? Li : Ii) : e ? Pi : Di;
    return (n, i, o) =>
      i === '__v_isReactive'
        ? !e
        : i === '__v_isReadonly'
          ? e
          : i === '__v_raw'
            ? n
            : Reflect.get(ye(r, i) && i in n ? r : n, i, o);
  }
  var $i = { get: ln(!1, !1) };
  var ji = { get: ln(!0, !1) };
  function un(e, t, r) {
    let n = _(r);
    if (n !== r && t.call(e, n)) {
      let i = Mt(e);
      console.warn(
        `Reactive ${i} contains both the raw and reactive versions of the same object${i === 'Map' ? ' as keys' : ''}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`,
      );
    }
  }
  var fn = new WeakMap(),
    Fi = new WeakMap(),
    dn = new WeakMap(),
    Bi = new WeakMap();
  function zi(e) {
    switch (e) {
      case 'Object':
      case 'Array':
        return 1;
      case 'Map':
      case 'Set':
      case 'WeakMap':
      case 'WeakSet':
        return 2;
      default:
        return 0;
    }
  }
  function Ki(e) {
    return e.__v_skip || !Object.isExtensible(e) ? 0 : zi(Mt(e));
  }
  function et(e) {
    return e && e.__v_isReadonly ? e : mn(e, !1, Mi, $i, fn);
  }
  function pn(e) {
    return mn(e, !0, Ni, ji, dn);
  }
  function mn(e, t, r, n, i) {
    if (!be(e)) return console.warn(`value cannot be made reactive: ${String(e)}`), e;
    if (e.__v_raw && !(t && e.__v_isReactive)) return e;
    let o = i.get(e);
    if (o) return o;
    let s = Ki(e);
    if (s === 0) return e;
    let a = new Proxy(e, s === 2 ? n : r);
    return i.set(e, a), a;
  }
  function _(e) {
    return (e && _(e.__v_raw)) || e;
  }
  function It(e) {
    return Boolean(e && e.__v_isRef === !0);
  }
  y('nextTick', () => ie);
  y('dispatch', e => J.bind(J, e));
  y('watch', (e, { evaluateLater: t, cleanup: r }) => (n, i) => {
    let o = t(n),
      a = ve(() => {
        let c;
        return o(l => (c = l)), c;
      }, i);
    r(a);
  });
  y('store', Kr);
  y('data', e => Ce(e));
  y('root', e => Y(e));
  y('refs', e => (e._x_refs_proxy || (e._x_refs_proxy = z(Hi(e))), e._x_refs_proxy));
  function Hi(e) {
    let t = [];
    return (
      j(e, r => {
        r._x_refs && t.push(r._x_refs);
      }),
      t
    );
  }
  var Bt = {};
  function zt(e) {
    return Bt[e] || (Bt[e] = 0), ++Bt[e];
  }
  function hn(e, t) {
    return j(e, r => {
      if (r._x_ids && r._x_ids[t]) return !0;
    });
  }
  function _n(e, t) {
    e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = zt(t));
  }
  y('id', (e, { cleanup: t }) => (r, n = null) => {
    let i = `${r}${n ? `-${n}` : ''}`;
    return Vi(e, i, t, () => {
      let o = hn(e, r),
        s = o ? o._x_ids[r] : zt(r);
      return n ? `${r}-${s}-${n}` : `${r}-${s}`;
    });
  });
  H((e, t) => {
    e._x_id && (t._x_id = e._x_id);
  });
  function Vi(e, t, r, n) {
    if ((e._x_id || (e._x_id = {}), e._x_id[t])) return e._x_id[t];
    let i = n();
    return (
      (e._x_id[t] = i),
      r(() => {
        delete e._x_id[t];
      }),
      i
    );
  }
  y('el', e => e);
  gn('Focus', 'focus', 'focus');
  gn('Persist', 'persist', 'persist');
  function gn(e, t, r) {
    y(t, n =>
      E(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${r}`, n),
    );
  }
  d('modelable', (e, { expression: t }, { effect: r, evaluateLater: n, cleanup: i }) => {
    let o = n(t),
      s = () => {
        let u;
        return o(p => (u = p)), u;
      },
      a = n(`${t} = __placeholder`),
      c = u => a(() => {}, { scope: { __placeholder: u } }),
      l = s();
    c(l),
      queueMicrotask(() => {
        if (!e._x_model) return;
        e._x_removeModelListeners.default();
        let u = e._x_model.get,
          p = e._x_model.set,
          h = Ve(
            {
              get() {
                return u();
              },
              set(w) {
                p(w);
              },
            },
            {
              get() {
                return s();
              },
              set(w) {
                c(w);
              },
            },
          );
        i(h);
      });
  });
  d('teleport', (e, { modifiers: t, expression: r }, { cleanup: n }) => {
    e.tagName.toLowerCase() !== 'template' && E('x-teleport can only be used on a <template> tag', e);
    let i = xn(r),
      o = e.content.cloneNode(!0).firstElementChild;
    (e._x_teleport = o),
      (o._x_teleportBack = e),
      e.setAttribute('data-teleport-template', !0),
      o.setAttribute('data-teleport-target', !0),
      e._x_forwardEvents &&
        e._x_forwardEvents.forEach(a => {
          o.addEventListener(a, c => {
            c.stopPropagation(), e.dispatchEvent(new c.constructor(c.type, c));
          });
        }),
      k(o, {}, e);
    let s = (a, c, l) => {
      l.includes('prepend')
        ? c.parentNode.insertBefore(a, c)
        : l.includes('append')
          ? c.parentNode.insertBefore(a, c.nextSibling)
          : c.appendChild(a);
    };
    m(() => {
      s(o, i, t),
        A(() => {
          S(o);
        })();
    }),
      (e._x_teleportPutBack = () => {
        let a = xn(r);
        m(() => {
          s(e._x_teleport, a, t);
        });
      }),
      n(() =>
        m(() => {
          o.remove(), P(o);
        }),
      );
  });
  var qi = document.createElement('div');
  function xn(e) {
    let t = A(
      () => document.querySelector(e),
      () => qi,
    )();
    return t || E(`Cannot find x-teleport element for selector: "${e}"`), t;
  }
  var yn = () => {};
  yn.inline = (e, { modifiers: t }, { cleanup: r }) => {
    t.includes('self') ? (e._x_ignoreSelf = !0) : (e._x_ignore = !0),
      r(() => {
        t.includes('self') ? delete e._x_ignoreSelf : delete e._x_ignore;
      });
  };
  d('ignore', yn);
  d(
    'effect',
    A((e, { expression: t }, { effect: r }) => {
      r(x(e, t));
    }),
  );
  function ae(e, t, r, n) {
    let i = e,
      o = c => n(c),
      s = {},
      a = (c, l) => u => l(c, u);
    if (
      (r.includes('dot') && (t = Ui(t)),
      r.includes('camel') && (t = Wi(t)),
      r.includes('passive') && (s.passive = !0),
      r.includes('capture') && (s.capture = !0),
      r.includes('window') && (i = window),
      r.includes('document') && (i = document),
      r.includes('debounce'))
    ) {
      let c = r[r.indexOf('debounce') + 1] || 'invalid-wait',
        l = tt(c.split('ms')[0]) ? Number(c.split('ms')[0]) : 250;
      o = Ke(o, l);
    }
    if (r.includes('throttle')) {
      let c = r[r.indexOf('throttle') + 1] || 'invalid-wait',
        l = tt(c.split('ms')[0]) ? Number(c.split('ms')[0]) : 250;
      o = He(o, l);
    }
    return (
      r.includes('prevent') &&
        (o = a(o, (c, l) => {
          l.preventDefault(), c(l);
        })),
      r.includes('stop') &&
        (o = a(o, (c, l) => {
          l.stopPropagation(), c(l);
        })),
      r.includes('once') &&
        (o = a(o, (c, l) => {
          c(l), i.removeEventListener(t, o, s);
        })),
      (r.includes('away') || r.includes('outside')) &&
        ((i = document),
        (o = a(o, (c, l) => {
          e.contains(l.target) ||
            (l.target.isConnected !== !1 &&
              ((e.offsetWidth < 1 && e.offsetHeight < 1) || (e._x_isShown !== !1 && c(l))));
        }))),
      r.includes('self') &&
        (o = a(o, (c, l) => {
          l.target === e && c(l);
        })),
      (Ji(t) || wn(t)) &&
        (o = a(o, (c, l) => {
          Yi(l, r) || c(l);
        })),
      i.addEventListener(t, o, s),
      () => {
        i.removeEventListener(t, o, s);
      }
    );
  }
  function Ui(e) {
    return e.replace(/-/g, '.');
  }
  function Wi(e) {
    return e.toLowerCase().replace(/-(\w)/g, (t, r) => r.toUpperCase());
  }
  function tt(e) {
    return !Array.isArray(e) && !isNaN(e);
  }
  function Gi(e) {
    return [' ', '_'].includes(e)
      ? e
      : e
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .replace(/[_\s]/, '-')
          .toLowerCase();
  }
  function Ji(e) {
    return ['keydown', 'keyup'].includes(e);
  }
  function wn(e) {
    return ['contextmenu', 'click', 'mouse'].some(t => e.includes(t));
  }
  function Yi(e, t) {
    let r = t.filter(
      o =>
        !['window', 'document', 'prevent', 'stop', 'once', 'capture', 'self', 'away', 'outside', 'passive'].includes(o),
    );
    if (r.includes('debounce')) {
      let o = r.indexOf('debounce');
      r.splice(o, tt((r[o + 1] || 'invalid-wait').split('ms')[0]) ? 2 : 1);
    }
    if (r.includes('throttle')) {
      let o = r.indexOf('throttle');
      r.splice(o, tt((r[o + 1] || 'invalid-wait').split('ms')[0]) ? 2 : 1);
    }
    if (r.length === 0 || (r.length === 1 && bn(e.key).includes(r[0]))) return !1;
    let i = ['ctrl', 'shift', 'alt', 'meta', 'cmd', 'super'].filter(o => r.includes(o));
    return (
      (r = r.filter(o => !i.includes(o))),
      !(
        i.length > 0 &&
        i.filter(s => ((s === 'cmd' || s === 'super') && (s = 'meta'), e[`${s}Key`])).length === i.length &&
        (wn(e.type) || bn(e.key).includes(r[0]))
      )
    );
  }
  function bn(e) {
    if (!e) return [];
    e = Gi(e);
    let t = {
      ctrl: 'control',
      slash: '/',
      space: ' ',
      spacebar: ' ',
      cmd: 'meta',
      esc: 'escape',
      up: 'arrow-up',
      down: 'arrow-down',
      left: 'arrow-left',
      right: 'arrow-right',
      period: '.',
      comma: ',',
      equal: '=',
      minus: '-',
      underscore: '_',
    };
    return (
      (t[e] = e),
      Object.keys(t)
        .map(r => {
          if (t[r] === e) return r;
        })
        .filter(r => r)
    );
  }
  d('model', (e, { modifiers: t, expression: r }, { effect: n, cleanup: i }) => {
    let o = e;
    t.includes('parent') && (o = e.parentNode);
    let s = x(o, r),
      a;
    typeof r == 'string'
      ? (a = x(o, `${r} = __placeholder`))
      : typeof r == 'function' && typeof r() == 'string'
        ? (a = x(o, `${r()} = __placeholder`))
        : (a = () => {});
    let c = () => {
        let h;
        return s(w => (h = w)), En(h) ? h.get() : h;
      },
      l = h => {
        let w;
        s(F => (w = F)), En(w) ? w.set(h) : a(() => {}, { scope: { __placeholder: h } });
      };
    typeof r == 'string' &&
      e.type === 'radio' &&
      m(() => {
        e.hasAttribute('name') || e.setAttribute('name', r);
      });
    var u =
      e.tagName.toLowerCase() === 'select' || ['checkbox', 'radio'].includes(e.type) || t.includes('lazy')
        ? 'change'
        : 'input';
    let p = I
      ? () => {}
      : ae(e, u, t, h => {
          l(Kt(e, t, h, c()));
        });
    if (
      (t.includes('fill') &&
        ([void 0, null, ''].includes(c()) ||
          (ze(e) && Array.isArray(c())) ||
          (e.tagName.toLowerCase() === 'select' && e.multiple)) &&
        l(Kt(e, t, { target: e }, c())),
      e._x_removeModelListeners || (e._x_removeModelListeners = {}),
      (e._x_removeModelListeners.default = p),
      i(() => e._x_removeModelListeners.default()),
      e.form)
    ) {
      let h = ae(e.form, 'reset', [], w => {
        ie(() => e._x_model && e._x_model.set(Kt(e, t, { target: e }, c())));
      });
      i(() => h());
    }
    (e._x_model = {
      get() {
        return c();
      },
      set(h) {
        l(h);
      },
    }),
      (e._x_forceModelUpdate = h => {
        h === void 0 && typeof r == 'string' && r.match(/\./) && (h = ''),
          (window.fromModel = !0),
          m(() => ge(e, 'value', h)),
          delete window.fromModel;
      }),
      n(() => {
        let h = c();
        (t.includes('unintrusive') && document.activeElement.isSameNode(e)) || e._x_forceModelUpdate(h);
      });
  });
  function Kt(e, t, r, n) {
    return m(() => {
      if (r instanceof CustomEvent && r.detail !== void 0)
        return r.detail !== null && r.detail !== void 0 ? r.detail : r.target.value;
      if (ze(e))
        if (Array.isArray(n)) {
          let i = null;
          return (
            t.includes('number')
              ? (i = Ht(r.target.value))
              : t.includes('boolean')
                ? (i = xe(r.target.value))
                : (i = r.target.value),
            r.target.checked ? (n.includes(i) ? n : n.concat([i])) : n.filter(o => !Xi(o, i))
          );
        } else return r.target.checked;
      else {
        if (e.tagName.toLowerCase() === 'select' && e.multiple)
          return t.includes('number')
            ? Array.from(r.target.selectedOptions).map(i => {
                let o = i.value || i.text;
                return Ht(o);
              })
            : t.includes('boolean')
              ? Array.from(r.target.selectedOptions).map(i => {
                  let o = i.value || i.text;
                  return xe(o);
                })
              : Array.from(r.target.selectedOptions).map(i => i.value || i.text);
        {
          let i;
          return (
            Ot(e) ? (r.target.checked ? (i = r.target.value) : (i = n)) : (i = r.target.value),
            t.includes('number') ? Ht(i) : t.includes('boolean') ? xe(i) : t.includes('trim') ? i.trim() : i
          );
        }
      }
    });
  }
  function Ht(e) {
    let t = e ? parseFloat(e) : null;
    return Zi(t) ? t : e;
  }
  function Xi(e, t) {
    return e == t;
  }
  function Zi(e) {
    return !Array.isArray(e) && !isNaN(e);
  }
  function En(e) {
    return e !== null && typeof e == 'object' && typeof e.get == 'function' && typeof e.set == 'function';
  }
  d('cloak', e => queueMicrotask(() => m(() => e.removeAttribute(C('cloak')))));
  $e(() => `[${C('init')}]`);
  d(
    'init',
    A((e, { expression: t }, { evaluate: r }) => (typeof t == 'string' ? !!t.trim() && r(t, {}, !1) : r(t, {}, !1))),
  );
  d('text', (e, { expression: t }, { effect: r, evaluateLater: n }) => {
    let i = n(t);
    r(() => {
      i(o => {
        m(() => {
          e.textContent = o;
        });
      });
    });
  });
  d('html', (e, { expression: t }, { effect: r, evaluateLater: n }) => {
    let i = n(t);
    r(() => {
      i(o => {
        m(() => {
          (e.innerHTML = o), (e._x_ignoreSelf = !0), S(e), delete e._x_ignoreSelf;
        });
      });
    });
  });
  ne(Pe(':', Ie(C('bind:'))));
  var vn = (e, { value: t, modifiers: r, expression: n, original: i }, { effect: o, cleanup: s }) => {
    if (!t) {
      let c = {};
      qr(c),
        x(e, n)(
          u => {
            Tt(e, u, i);
          },
          { scope: c },
        );
      return;
    }
    if (t === 'key') return Qi(e, n);
    if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract) return;
    let a = x(e, n);
    o(() =>
      a(c => {
        c === void 0 && typeof n == 'string' && n.match(/\./) && (c = ''), m(() => ge(e, t, c, r));
      }),
    ),
      s(() => {
        e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
      });
  };
  vn.inline = (e, { value: t, modifiers: r, expression: n }) => {
    t && (e._x_inlineBindings || (e._x_inlineBindings = {}), (e._x_inlineBindings[t] = { expression: n, extract: !1 }));
  };
  d('bind', vn);
  function Qi(e, t) {
    e._x_keyExpression = t;
  }
  Le(() => `[${C('data')}]`);
  d('data', (e, { expression: t }, { cleanup: r }) => {
    if (eo(e)) return;
    t = t === '' ? '{}' : t;
    let n = {};
    fe(n, e);
    let i = {};
    Gr(i, n);
    let o = R(e, t, { scope: i });
    (o === void 0 || o === !0) && (o = {}), fe(o, e);
    let s = T(o);
    Te(s);
    let a = k(e, s);
    s.init && R(e, s.init),
      r(() => {
        s.destroy && R(e, s.destroy), a();
      });
  });
  H((e, t) => {
    e._x_dataStack && ((t._x_dataStack = e._x_dataStack), t.setAttribute('data-has-alpine-state', !0));
  });
  function eo(e) {
    return I ? (Be ? !0 : e.hasAttribute('data-has-alpine-state')) : !1;
  }
  d('show', (e, { modifiers: t, expression: r }, { effect: n }) => {
    let i = x(e, r);
    e._x_doHide ||
      (e._x_doHide = () => {
        m(() => {
          e.style.setProperty('display', 'none', t.includes('important') ? 'important' : void 0);
        });
      }),
      e._x_doShow ||
        (e._x_doShow = () => {
          m(() => {
            e.style.length === 1 && e.style.display === 'none'
              ? e.removeAttribute('style')
              : e.style.removeProperty('display');
          });
        });
    let o = () => {
        e._x_doHide(), (e._x_isShown = !1);
      },
      s = () => {
        e._x_doShow(), (e._x_isShown = !0);
      },
      a = () => setTimeout(s),
      c = he(
        p => (p ? s() : o()),
        p => {
          typeof e._x_toggleAndCascadeWithTransitions == 'function'
            ? e._x_toggleAndCascadeWithTransitions(e, p, s, o)
            : p
              ? a()
              : o();
        },
      ),
      l,
      u = !0;
    n(() =>
      i(p => {
        (!u && p === l) || (t.includes('immediate') && (p ? a() : o()), c(p), (l = p), (u = !1));
      }),
    );
  });
  d('for', (e, { expression: t }, { effect: r, cleanup: n }) => {
    let i = ro(t),
      o = x(e, i.items),
      s = x(e, e._x_keyExpression || 'index');
    (e._x_prevKeys = []),
      (e._x_lookup = {}),
      r(() => to(e, i, o, s)),
      n(() => {
        Object.values(e._x_lookup).forEach(a =>
          m(() => {
            P(a), a.remove();
          }),
        ),
          delete e._x_prevKeys,
          delete e._x_lookup;
      });
  });
  function to(e, t, r, n) {
    let i = s => typeof s == 'object' && !Array.isArray(s),
      o = e;
    r(s => {
      no(s) && s >= 0 && (s = Array.from(Array(s).keys(), f => f + 1)), s === void 0 && (s = []);
      let a = e._x_lookup,
        c = e._x_prevKeys,
        l = [],
        u = [];
      if (i(s))
        s = Object.entries(s).map(([f, g]) => {
          let b = Sn(t, g, f, s);
          n(
            v => {
              u.includes(v) && E('Duplicate key on x-for', e), u.push(v);
            },
            { scope: { index: f, ...b } },
          ),
            l.push(b);
        });
      else
        for (let f = 0; f < s.length; f++) {
          let g = Sn(t, s[f], f, s);
          n(
            b => {
              u.includes(b) && E('Duplicate key on x-for', e), u.push(b);
            },
            { scope: { index: f, ...g } },
          ),
            l.push(g);
        }
      let p = [],
        h = [],
        w = [],
        F = [];
      for (let f = 0; f < c.length; f++) {
        let g = c[f];
        u.indexOf(g) === -1 && w.push(g);
      }
      c = c.filter(f => !w.includes(f));
      let Ee = 'template';
      for (let f = 0; f < u.length; f++) {
        let g = u[f],
          b = c.indexOf(g);
        if (b === -1) c.splice(f, 0, g), p.push([Ee, f]);
        else if (b !== f) {
          let v = c.splice(f, 1)[0],
            O = c.splice(b - 1, 1)[0];
          c.splice(f, 0, O), c.splice(b, 0, v), h.push([v, O]);
        } else F.push(g);
        Ee = g;
      }
      for (let f = 0; f < w.length; f++) {
        let g = w[f];
        g in a &&
          (m(() => {
            P(a[g]), a[g].remove();
          }),
          delete a[g]);
      }
      for (let f = 0; f < h.length; f++) {
        let [g, b] = h[f],
          v = a[g],
          O = a[b],
          ee = document.createElement('div');
        m(() => {
          O || E('x-for ":key" is undefined or invalid', o, b, a),
            O.after(ee),
            v.after(O),
            O._x_currentIfEl && O.after(O._x_currentIfEl),
            ee.before(v),
            v._x_currentIfEl && v.after(v._x_currentIfEl),
            ee.remove();
        }),
          O._x_refreshXForScope(l[u.indexOf(b)]);
      }
      for (let f = 0; f < p.length; f++) {
        let [g, b] = p[f],
          v = g === 'template' ? o : a[g];
        v._x_currentIfEl && (v = v._x_currentIfEl);
        let O = l[b],
          ee = u[b],
          ce = document.importNode(o.content, !0).firstElementChild,
          qt = T(O);
        k(ce, qt, o),
          (ce._x_refreshXForScope = On => {
            Object.entries(On).forEach(([Cn, Tn]) => {
              qt[Cn] = Tn;
            });
          }),
          m(() => {
            v.after(ce), A(() => S(ce))();
          }),
          typeof ee == 'object' && E('x-for key cannot be an object, it must be a string or an integer', o),
          (a[ee] = ce);
      }
      for (let f = 0; f < F.length; f++) a[F[f]]._x_refreshXForScope(l[u.indexOf(F[f])]);
      o._x_prevKeys = u;
    });
  }
  function ro(e) {
    let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/,
      r = /^\s*\(|\)\s*$/g,
      n = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,
      i = e.match(n);
    if (!i) return;
    let o = {};
    o.items = i[2].trim();
    let s = i[1].replace(r, '').trim(),
      a = s.match(t);
    return (
      a
        ? ((o.item = s.replace(t, '').trim()), (o.index = a[1].trim()), a[2] && (o.collection = a[2].trim()))
        : (o.item = s),
      o
    );
  }
  function Sn(e, t, r, n) {
    let i = {};
    return (
      /^\[.*\]$/.test(e.item) && Array.isArray(t)
        ? e.item
            .replace('[', '')
            .replace(']', '')
            .split(',')
            .map(s => s.trim())
            .forEach((s, a) => {
              i[s] = t[a];
            })
        : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == 'object'
          ? e.item
              .replace('{', '')
              .replace('}', '')
              .split(',')
              .map(s => s.trim())
              .forEach(s => {
                i[s] = t[s];
              })
          : (i[e.item] = t),
      e.index && (i[e.index] = r),
      e.collection && (i[e.collection] = n),
      i
    );
  }
  function no(e) {
    return !Array.isArray(e) && !isNaN(e);
  }
  function An() {}
  An.inline = (e, { expression: t }, { cleanup: r }) => {
    let n = Y(e);
    n._x_refs || (n._x_refs = {}), (n._x_refs[t] = e), r(() => delete n._x_refs[t]);
  };
  d('ref', An);
  d('if', (e, { expression: t }, { effect: r, cleanup: n }) => {
    e.tagName.toLowerCase() !== 'template' && E('x-if can only be used on a <template> tag', e);
    let i = x(e, t),
      o = () => {
        if (e._x_currentIfEl) return e._x_currentIfEl;
        let a = e.content.cloneNode(!0).firstElementChild;
        return (
          k(a, {}, e),
          m(() => {
            e.after(a), A(() => S(a))();
          }),
          (e._x_currentIfEl = a),
          (e._x_undoIf = () => {
            m(() => {
              P(a), a.remove();
            }),
              delete e._x_currentIfEl;
          }),
          a
        );
      },
      s = () => {
        e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
      };
    r(() =>
      i(a => {
        a ? o() : s();
      }),
    ),
      n(() => e._x_undoIf && e._x_undoIf());
  });
  d('id', (e, { expression: t }, { evaluate: r }) => {
    r(t).forEach(i => _n(e, i));
  });
  H((e, t) => {
    e._x_ids && (t._x_ids = e._x_ids);
  });
  ne(Pe('@', Ie(C('on:'))));
  d(
    'on',
    A((e, { value: t, modifiers: r, expression: n }, { cleanup: i }) => {
      let o = n ? x(e, n) : () => {};
      e.tagName.toLowerCase() === 'template' &&
        (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
      let s = ae(e, t, r, a => {
        o(() => {}, { scope: { $event: a }, params: [a] });
      });
      i(() => s());
    }),
  );
  rt('Collapse', 'collapse', 'collapse');
  rt('Intersect', 'intersect', 'intersect');
  rt('Focus', 'trap', 'focus');
  rt('Mask', 'mask', 'mask');
  function rt(e, t, r) {
    d(t, n =>
      E(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${r}`, n),
    );
  }
  K.setEvaluator(xt);
  K.setReactivityEngine({ reactive: et, effect: rn, release: nn, raw: _ });
  var Vt = K;
  window.Alpine = Vt;
  queueMicrotask(() => {
    Vt.start();
  });
})();

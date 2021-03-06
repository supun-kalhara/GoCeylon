$(document).ready(function () {
    var slider = $("#slider");
    var thumb = $("#thumb");
    var slidesPerPage = 4; //globaly define number of elements per page
    var syncedSecondary = true;
    slider
      .owlCarousel({
        items: 1,
        slideSpeed: 2000,
        nav: false,
        autoplay: false,
        dots: false,
        loop: true,
        responsiveRefreshRate: 200
      })
      .on("changed.owl.carousel", syncPosition);
    thumb
      .on("initialized.owl.carousel", function () {
        thumb.find(".owl-item").eq(0).addClass("current");
      })
      .owlCarousel({
        items: slidesPerPage,
        dots: false,
        nav: true,
        item: 4,
        smartSpeed: 200,
        slideSpeed: 500,
        slideBy: slidesPerPage,
        navText: [
          '<svg width="18px" height="18px" viewBox="0 0 11 20"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M9.554,1.001l-8.607,8.607l8.607,8.606"/></svg>',
          '<svg width="25px" height="25px" viewBox="0 0 11 20" version="1.1"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M1.054,18.214l8.606,-8.606l-8.606,-8.607"/></svg>'
        ],
        responsiveRefreshRate: 100
      })
      .on("changed.owl.carousel", syncPosition2);
    function syncPosition(el) {
      var count = el.item.count - 1;
      var current = Math.round(el.item.index - el.item.count / 2 - 0.5);
      if (current < 0) {
        current = count;
      }
      if (current > count) {
        current = 0;
      }
      thumb
        .find(".owl-item")
        .removeClass("current")
        .eq(current)
        .addClass("current");
      var onscreen = thumb.find(".owl-item.active").length - 1;
      var start = thumb.find(".owl-item.active").first().index();
      var end = thumb.find(".owl-item.active").last().index();
      if (current > end) {
        thumb.data("owl.carousel").to(current, 100, true);
      }
      if (current < start) {
        thumb.data("owl.carousel").to(current - onscreen, 100, true);
      }
    }
    function syncPosition2(el) {
      if (syncedSecondary) {
        var number = el.item.index;
        slider.data("owl.carousel").to(number, 100, true);
      }
    }
    thumb.on("click", ".owl-item", function (e) {
      e.preventDefault();
      var number = $(this).index();
      slider.data("owl.carousel").to(number, 300, true);
    });
  
    $(".qtyminus").on("click", function () {
      var now = $(".qty").val();
      if ($.isNumeric(now)) {
        if (parseInt(now) - 1 > 0) {
          now--;
        }
        $(".qty").val(now);
      }
    });
    $(".qtyplus").on("click", function () {
      var now = $(".qty").val();
      if ($.isNumeric(now)) {
        $(".qty").val(parseInt(now) + 1);
      }
    });
  });


  /**
 * Owl Carousel v2.3.4
 * Copyright 2013-2018 David Deutsch
 * Licensed under: SEE LICENSE IN https://github.com/OwlCarousel2/OwlCarousel2/blob/master/LICENSE
 */
!(function (a, b, c, d) {
  function e(b, c) {
    (this.settings = null),
      (this.options = a.extend({}, e.Defaults, c)),
      (this.$element = a(b)),
      (this._handlers = {}),
      (this._plugins = {}),
      (this._supress = {}),
      (this._current = null),
      (this._speed = null),
      (this._coordinates = []),
      (this._breakpoint = null),
      (this._width = null),
      (this._items = []),
      (this._clones = []),
      (this._mergers = []),
      (this._widths = []),
      (this._invalidated = {}),
      (this._pipe = []),
      (this._drag = {
        time: null,
        target: null,
        pointer: null,
        stage: { start: null, current: null },
        direction: null
      }),
      (this._states = {
        current: {},
        tags: {
          initializing: ["busy"],
          animating: ["busy"],
          dragging: ["interacting"]
        }
      }),
      a.each(
        ["onResize", "onThrottledResize"],
        a.proxy(function (b, c) {
          this._handlers[c] = a.proxy(this[c], this);
        }, this)
      ),
      a.each(
        e.Plugins,
        a.proxy(function (a, b) {
          this._plugins[a.charAt(0).toLowerCase() + a.slice(1)] = new b(this);
        }, this)
      ),
      a.each(
        e.Workers,
        a.proxy(function (b, c) {
          this._pipe.push({ filter: c.filter, run: a.proxy(c.run, this) });
        }, this)
      ),
      this.setup(),
      this.initialize();
  }
  (e.Defaults = {
    items: 3,
    loop: !1,
    center: !1,
    rewind: !1,
    checkVisibility: !0,
    mouseDrag: !0,
    touchDrag: !0,
    pullDrag: !0,
    freeDrag: !1,
    margin: 0,
    stagePadding: 0,
    merge: !1,
    mergeFit: !0,
    autoWidth: !1,
    startPosition: 0,
    rtl: !1,
    smartSpeed: 250,
    fluidSpeed: !1,
    dragEndSpeed: !1,
    responsive: {},
    responsiveRefreshRate: 200,
    responsiveBaseElement: b,
    fallbackEasing: "swing",
    slideTransition: "",
    info: !1,
    nestedItemSelector: !1,
    itemElement: "div",
    stageElement: "div",
    refreshClass: "owl-refresh",
    loadedClass: "owl-loaded",
    loadingClass: "owl-loading",
    rtlClass: "owl-rtl",
    responsiveClass: "owl-responsive",
    dragClass: "owl-drag",
    itemClass: "owl-item",
    stageClass: "owl-stage",
    stageOuterClass: "owl-stage-outer",
    grabClass: "owl-grab"
  }),
    (e.Width = { Default: "default", Inner: "inner", Outer: "outer" }),
    (e.Type = { Event: "event", State: "state" }),
    (e.Plugins = {}),
    (e.Workers = [
      {
        filter: ["width", "settings"],
        run: function () {
          this._width = this.$element.width();
        }
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          a.current = this._items && this._items[this.relative(this._current)];
        }
      },
      {
        filter: ["items", "settings"],
        run: function () {
          this.$stage.children(".cloned").remove();
        }
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          var b = this.settings.margin || "",
            c = !this.settings.autoWidth,
            d = this.settings.rtl,
            e = {
              width: "auto",
              "margin-left": d ? b : "",
              "margin-right": d ? "" : b
            };
          !c && this.$stage.children().css(e), (a.css = e);
        }
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          var b =
              (this.width() / this.settings.items).toFixed(3) -
              this.settings.margin,
            c = null,
            d = this._items.length,
            e = !this.settings.autoWidth,
            f = [];
          for (a.items = { merge: !1, width: b }; d--; )
            (c = this._mergers[d]),
              (c =
                (this.settings.mergeFit && Math.min(c, this.settings.items)) ||
                c),
              (a.items.merge = c > 1 || a.items.merge),
              (f[d] = e ? b * c : this._items[d].width());
          this._widths = f;
        }
      },
      {
        filter: ["items", "settings"],
        run: function () {
          var b = [],
            c = this._items,
            d = this.settings,
            e = Math.max(2 * d.items, 4),
            f = 2 * Math.ceil(c.length / 2),
            g = d.loop && c.length ? (d.rewind ? e : Math.max(e, f)) : 0,
            h = "",
            i = "";
          for (g /= 2; g > 0; )
            b.push(this.normalize(b.length / 2, !0)),
              (h += c[b[b.length - 1]][0].outerHTML),
              b.push(this.normalize(c.length - 1 - (b.length - 1) / 2, !0)),
              (i = c[b[b.length - 1]][0].outerHTML + i),
              (g -= 1);
          (this._clones = b),
            a(h).addClass("cloned").appendTo(this.$stage),
            a(i).addClass("cloned").prependTo(this.$stage);
        }
      },
      {
        filter: ["width", "items", "settings"],
        run: function () {
          for (
            var a = this.settings.rtl ? 1 : -1,
              b = this._clones.length + this._items.length,
              c = -1,
              d = 0,
              e = 0,
              f = [];
            ++c < b;

          )
            (d = f[c - 1] || 0),
              (e = this._widths[this.relative(c)] + this.settings.margin),
              f.push(d + e * a);
          this._coordinates = f;
        }
      },
      {
        filter: ["width", "items", "settings"],
        run: function () {
          var a = this.settings.stagePadding,
            b = this._coordinates,
            c = {
              width: Math.ceil(Math.abs(b[b.length - 1])) + 2 * a,
              "padding-left": a || "",
              "padding-right": a || ""
            };
          this.$stage.css(c);
        }
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          var b = this._coordinates.length,
            c = !this.settings.autoWidth,
            d = this.$stage.children();
          if (c && a.items.merge)
            for (; b--; )
              (a.css.width = this._widths[this.relative(b)]),
                d.eq(b).css(a.css);
          else c && ((a.css.width = a.items.width), d.css(a.css));
        }
      },
      {
        filter: ["items"],
        run: function () {
          this._coordinates.length < 1 && this.$stage.removeAttr("style");
        }
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          (a.current = a.current ? this.$stage.children().index(a.current) : 0),
            (a.current = Math.max(
              this.minimum(),
              Math.min(this.maximum(), a.current)
            )),
            this.reset(a.current);
        }
      },
      {
        filter: ["position"],
        run: function () {
          this.animate(this.coordinates(this._current));
        }
      },
      {
        filter: ["width", "position", "items", "settings"],
        run: function () {
          var a,
            b,
            c,
            d,
            e = this.settings.rtl ? 1 : -1,
            f = 2 * this.settings.stagePadding,
            g = this.coordinates(this.current()) + f,
            h = g + this.width() * e,
            i = [];
          for (c = 0, d = this._coordinates.length; c < d; c++)
            (a = this._coordinates[c - 1] || 0),
              (b = Math.abs(this._coordinates[c]) + f * e),
              ((this.op(a, "<=", g) && this.op(a, ">", h)) ||
                (this.op(b, "<", g) && this.op(b, ">", h))) &&
                i.push(c);
          this.$stage.children(".active").removeClass("active"),
            this.$stage
              .children(":eq(" + i.join("), :eq(") + ")")
              .addClass("active"),
            this.$stage.children(".center").removeClass("center"),
            this.settings.center &&
              this.$stage.children().eq(this.current()).addClass("center");
        }
      }
    ]),
    (e.prototype.initializeStage = function () {
      (this.$stage = this.$element.find("." + this.settings.stageClass)),
        this.$stage.length ||
          (this.$element.addClass(this.options.loadingClass),
          (this.$stage = a("<" + this.settings.stageElement + ">", {
            class: this.settings.stageClass
          }).wrap(a("<div/>", { class: this.settings.stageOuterClass }))),
          this.$element.append(this.$stage.parent()));
    }),
    (e.prototype.initializeItems = function () {
      var b = this.$element.find(".owl-item");
      if (b.length)
        return (
          (this._items = b.get().map(function (b) {
            return a(b);
          })),
          (this._mergers = this._items.map(function () {
            return 1;
          })),
          void this.refresh()
        );
      this.replace(this.$element.children().not(this.$stage.parent())),
        this.isVisible() ? this.refresh() : this.invalidate("width"),
        this.$element
          .removeClass(this.options.loadingClass)
          .addClass(this.options.loadedClass);
    }),
    (e.prototype.initialize = function () {
      if (
        (this.enter("initializing"),
        this.trigger("initialize"),
        this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl),
        this.settings.autoWidth && !this.is("pre-loading"))
      ) {
        var a, b, c;
        (a = this.$element.find("img")),
          (b = this.settings.nestedItemSelector
            ? "." + this.settings.nestedItemSelector
            : d),
          (c = this.$element.children(b).width()),
          a.length && c <= 0 && this.preloadAutoWidthImages(a);
      }
      this.initializeStage(),
        this.initializeItems(),
        this.registerEventHandlers(),
        this.leave("initializing"),
        this.trigger("initialized");
    }),
    (e.prototype.isVisible = function () {
      return !this.settings.checkVisibility || this.$element.is(":visible");
    }),
    (e.prototype.setup = function () {
      var b = this.viewport(),
        c = this.options.responsive,
        d = -1,
        e = null;
      c
        ? (a.each(c, function (a) {
            a <= b && a > d && (d = Number(a));
          }),
          (e = a.extend({}, this.options, c[d])),
          "function" == typeof e.stagePadding &&
            (e.stagePadding = e.stagePadding()),
          delete e.responsive,
          e.responsiveClass &&
            this.$element.attr(
              "class",
              this.$element
                .attr("class")
                .replace(
                  new RegExp(
                    "(" + this.options.responsiveClass + "-)\\S+\\s",
                    "g"
                  ),
                  "$1" + d
                )
            ))
        : (e = a.extend({}, this.options)),
        this.trigger("change", { property: { name: "settings", value: e } }),
        (this._breakpoint = d),
        (this.settings = e),
        this.invalidate("settings"),
        this.trigger("changed", {
          property: { name: "settings", value: this.settings }
        });
    }),
    (e.prototype.optionsLogic = function () {
      this.settings.autoWidth &&
        ((this.settings.stagePadding = !1), (this.settings.merge = !1));
    }),
    (e.prototype.prepare = function (b) {
      var c = this.trigger("prepare", { content: b });
      return (
        c.data ||
          (c.data = a("<" + this.settings.itemElement + "/>")
            .addClass(this.options.itemClass)
            .append(b)),
        this.trigger("prepared", { content: c.data }),
        c.data
      );
    }),
    (e.prototype.update = function () {
      for (
        var b = 0,
          c = this._pipe.length,
          d = a.proxy(function (a) {
            return this[a];
          }, this._invalidated),
          e = {};
        b < c;

      )
        (this._invalidated.all || a.grep(this._pipe[b].filter, d).length > 0) &&
          this._pipe[b].run(e),
          b++;
      (this._invalidated = {}), !this.is("valid") && this.enter("valid");
    }),
    (e.prototype.width = function (a) {
      switch ((a = a || e.Width.Default)) {
        case e.Width.Inner:
        case e.Width.Outer:
          return this._width;
        default:
          return (
            this._width - 2 * this.settings.stagePadding + this.settings.margin
          );
      }
    }),
    (e.prototype.refresh = function () {
      this.enter("refreshing"),
        this.trigger("refresh"),
        this.setup(),
        this.optionsLogic(),
        this.$element.addClass(this.options.refreshClass),
        this.update(),
        this.$element.removeClass(this.options.refreshClass),
        this.leave("refreshing"),
        this.trigger("refreshed");
    }),
    (e.prototype.onThrottledResize = function () {
      b.clearTimeout(this.resizeTimer),
        (this.resizeTimer = b.setTimeout(
          this._handlers.onResize,
          this.settings.responsiveRefreshRate
        ));
    }),
    (e.prototype.onResize = function () {
      return (
        !!this._items.length &&
        this._width !== this.$element.width() &&
        !!this.isVisible() &&
        (this.enter("resizing"),
        this.trigger("resize").isDefaultPrevented()
          ? (this.leave("resizing"), !1)
          : (this.invalidate("width"),
            this.refresh(),
            this.leave("resizing"),
            void this.trigger("resized")))
      );
    }),
    (e.prototype.registerEventHandlers = function () {
      a.support.transition &&
        this.$stage.on(
          a.support.transition.end + ".owl.core",
          a.proxy(this.onTransitionEnd, this)
        ),
        !1 !== this.settings.responsive &&
          this.on(b, "resize", this._handlers.onThrottledResize),
        this.settings.mouseDrag &&
          (this.$element.addClass(this.options.dragClass),
          this.$stage.on("mousedown.owl.core", a.proxy(this.onDragStart, this)),
          this.$stage.on(
            "dragstart.owl.core selectstart.owl.core",
            function () {
              return !1;
            }
          )),
        this.settings.touchDrag &&
          (this.$stage.on(
            "touchstart.owl.core",
            a.proxy(this.onDragStart, this)
          ),
          this.$stage.on(
            "touchcancel.owl.core",
            a.proxy(this.onDragEnd, this)
          ));
    }),
    (e.prototype.onDragStart = function (b) {
      var d = null;
      3 !== b.which &&
        (a.support.transform
          ? ((d = this.$stage
              .css("transform")
              .replace(/.*\(|\)| /g, "")
              .split(",")),
            (d = {
              x: d[16 === d.length ? 12 : 4],
              y: d[16 === d.length ? 13 : 5]
            }))
          : ((d = this.$stage.position()),
            (d = {
              x: this.settings.rtl
                ? d.left +
                  this.$stage.width() -
                  this.width() +
                  this.settings.margin
                : d.left,
              y: d.top
            })),
        this.is("animating") &&
          (a.support.transform ? this.animate(d.x) : this.$stage.stop(),
          this.invalidate("position")),
        this.$element.toggleClass(
          this.options.grabClass,
          "mousedown" === b.type
        ),
        this.speed(0),
        (this._drag.time = new Date().getTime()),
        (this._drag.target = a(b.target)),
        (this._drag.stage.start = d),
        (this._drag.stage.current = d),
        (this._drag.pointer = this.pointer(b)),
        a(c).on(
          "mouseup.owl.core touchend.owl.core",
          a.proxy(this.onDragEnd, this)
        ),
        a(c).one(
          "mousemove.owl.core touchmove.owl.core",
          a.proxy(function (b) {
            var d = this.difference(this._drag.pointer, this.pointer(b));
            a(c).on(
              "mousemove.owl.core touchmove.owl.core",
              a.proxy(this.onDragMove, this)
            ),
              (Math.abs(d.x) < Math.abs(d.y) && this.is("valid")) ||
                (b.preventDefault(),
                this.enter("dragging"),
                this.trigger("drag"));
          }, this)
        ));
    }),
    (e.prototype.onDragMove = function (a) {
      var b = null,
        c = null,
        d = null,
        e = this.difference(this._drag.pointer, this.pointer(a)),
        f = this.difference(this._drag.stage.start, e);
      this.is("dragging") &&
        (a.preventDefault(),
        this.settings.loop
          ? ((b = this.coordinates(this.minimum())),
            (c = this.coordinates(this.maximum() + 1) - b),
            (f.x = ((((f.x - b) % c) + c) % c) + b))
          : ((b = this.settings.rtl
              ? this.coordinates(this.maximum())
              : this.coordinates(this.minimum())),
            (c = this.settings.rtl
              ? this.coordinates(this.minimum())
              : this.coordinates(this.maximum())),
            (d = this.settings.pullDrag ? (-1 * e.x) / 5 : 0),
            (f.x = Math.max(Math.min(f.x, b + d), c + d))),
        (this._drag.stage.current = f),
        this.animate(f.x));
    }),
    (e.prototype.onDragEnd = function (b) {
      var d = this.difference(this._drag.pointer, this.pointer(b)),
        e = this._drag.stage.current,
        f = (d.x > 0) ^ this.settings.rtl ? "left" : "right";
      a(c).off(".owl.core"),
        this.$element.removeClass(this.options.grabClass),
        ((0 !== d.x && this.is("dragging")) || !this.is("valid")) &&
          (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed),
          this.current(this.closest(e.x, 0 !== d.x ? f : this._drag.direction)),
          this.invalidate("position"),
          this.update(),
          (this._drag.direction = f),
          (Math.abs(d.x) > 3 || new Date().getTime() - this._drag.time > 300) &&
            this._drag.target.one("click.owl.core", function () {
              return !1;
            })),
        this.is("dragging") &&
          (this.leave("dragging"), this.trigger("dragged"));
    }),
    (e.prototype.closest = function (b, c) {
      var e = -1,
        f = 30,
        g = this.width(),
        h = this.coordinates();
      return (
        this.settings.freeDrag ||
          a.each(
            h,
            a.proxy(function (a, i) {
              return (
                "left" === c && b > i - f && b < i + f
                  ? (e = a)
                  : "right" === c && b > i - g - f && b < i - g + f
                  ? (e = a + 1)
                  : this.op(b, "<", i) &&
                    this.op(b, ">", h[a + 1] !== d ? h[a + 1] : i - g) &&
                    (e = "left" === c ? a + 1 : a),
                -1 === e
              );
            }, this)
          ),
        this.settings.loop ||
          (this.op(b, ">", h[this.minimum()])
            ? (e = b = this.minimum())
            : this.op(b, "<", h[this.maximum()]) && (e = b = this.maximum())),
        e
      );
    }),
    (e.prototype.animate = function (b) {
      var c = this.speed() > 0;
      this.is("animating") && this.onTransitionEnd(),
        c && (this.enter("animating"), this.trigger("translate")),
        a.support.transform3d && a.support.transition
          ? this.$stage.css({
              transform: "translate3d(" + b + "px,0px,0px)",
              transition:
                this.speed() / 1e3 +
                "s" +
                (this.settings.slideTransition
                  ? " " + this.settings.slideTransition
                  : "")
            })
          : c
          ? this.$stage.animate(
              { left: b + "px" },
              this.speed(),
              this.settings.fallbackEasing,
              a.proxy(this.onTransitionEnd, this)
            )
          : this.$stage.css({ left: b + "px" });
    }),
    (e.prototype.is = function (a) {
      return this._states.current[a] && this._states.current[a] > 0;
    }),
    (e.prototype.current = function (a) {
      if (a === d) return this._current;
      if (0 === this._items.length) return d;
      if (((a = this.normalize(a)), this._current !== a)) {
        var b = this.trigger("change", {
          property: { name: "position", value: a }
        });
        b.data !== d && (a = this.normalize(b.data)),
          (this._current = a),
          this.invalidate("position"),
          this.trigger("changed", {
            property: { name: "position", value: this._current }
          });
      }
      return this._current;
    }),
    (e.prototype.invalidate = function (b) {
      return (
        "string" === a.type(b) &&
          ((this._invalidated[b] = !0),
          this.is("valid") && this.leave("valid")),
        a.map(this._invalidated, function (a, b) {
          return b;
        })
      );
    }),
    (e.prototype.reset = function (a) {
      (a = this.normalize(a)) !== d &&
        ((this._speed = 0),
        (this._current = a),
        this.suppress(["translate", "translated"]),
        this.animate(this.coordinates(a)),
        this.release(["translate", "translated"]));
    }),
    (e.prototype.normalize = function (a, b) {
      var c = this._items.length,
        e = b ? 0 : this._clones.length;
      return (
        !this.isNumeric(a) || c < 1
          ? (a = d)
          : (a < 0 || a >= c + e) &&
            (a = ((((a - e / 2) % c) + c) % c) + e / 2),
        a
      );
    }),
    (e.prototype.relative = function (a) {
      return (a -= this._clones.length / 2), this.normalize(a, !0);
    }),
    (e.prototype.maximum = function (a) {
      var b,
        c,
        d,
        e = this.settings,
        f = this._coordinates.length;
      if (e.loop) f = this._clones.length / 2 + this._items.length - 1;
      else if (e.autoWidth || e.merge) {
        if ((b = this._items.length))
          for (
            c = this._items[--b].width(), d = this.$element.width();
            b-- && !((c += this._items[b].width() + this.settings.margin) > d);

          );
        f = b + 1;
      } else
        f = e.center ? this._items.length - 1 : this._items.length - e.items;
      return a && (f -= this._clones.length / 2), Math.max(f, 0);
    }),
    (e.prototype.minimum = function (a) {
      return a ? 0 : this._clones.length / 2;
    }),
    (e.prototype.items = function (a) {
      return a === d
        ? this._items.slice()
        : ((a = this.normalize(a, !0)), this._items[a]);
    }),
    (e.prototype.mergers = function (a) {
      return a === d
        ? this._mergers.slice()
        : ((a = this.normalize(a, !0)), this._mergers[a]);
    }),
    (e.prototype.clones = function (b) {
      var c = this._clones.length / 2,
        e = c + this._items.length,
        f = function (a) {
          return a % 2 == 0 ? e + a / 2 : c - (a + 1) / 2;
        };
      return b === d
        ? a.map(this._clones, function (a, b) {
            return f(b);
          })
        : a.map(this._clones, function (a, c) {
            return a === b ? f(c) : null;
          });
    }),
    (e.prototype.speed = function (a) {
      return a !== d && (this._speed = a), this._speed;
    }),
    (e.prototype.coordinates = function (b) {
      var c,
        e = 1,
        f = b - 1;
      return b === d
        ? a.map(
            this._coordinates,
            a.proxy(function (a, b) {
              return this.coordinates(b);
            }, this)
          )
        : (this.settings.center
            ? (this.settings.rtl && ((e = -1), (f = b + 1)),
              (c = this._coordinates[b]),
              (c += ((this.width() - c + (this._coordinates[f] || 0)) / 2) * e))
            : (c = this._coordinates[f] || 0),
          (c = Math.ceil(c)));
    }),
    (e.prototype.duration = function (a, b, c) {
      return 0 === c
        ? 0
        : Math.min(Math.max(Math.abs(b - a), 1), 6) *
            Math.abs(c || this.settings.smartSpeed);
    }),
    (e.prototype.to = function (a, b) {
      var c = this.current(),
        d = null,
        e = a - this.relative(c),
        f = (e > 0) - (e < 0),
        g = this._items.length,
        h = this.minimum(),
        i = this.maximum();
      this.settings.loop
        ? (!this.settings.rewind && Math.abs(e) > g / 2 && (e += -1 * f * g),
          (a = c + e),
          (d = ((((a - h) % g) + g) % g) + h) !== a &&
            d - e <= i &&
            d - e > 0 &&
            ((c = d - e), (a = d), this.reset(c)))
        : this.settings.rewind
        ? ((i += 1), (a = ((a % i) + i) % i))
        : (a = Math.max(h, Math.min(i, a))),
        this.speed(this.duration(c, a, b)),
        this.current(a),
        this.isVisible() && this.update();
    }),
    (e.prototype.next = function (a) {
      (a = a || !1), this.to(this.relative(this.current()) + 1, a);
    }),
    (e.prototype.prev = function (a) {
      (a = a || !1), this.to(this.relative(this.current()) - 1, a);
    }),
    (e.prototype.onTransitionEnd = function (a) {
      if (
        a !== d &&
        (a.stopPropagation(),
        (a.target || a.srcElement || a.originalTarget) !== this.$stage.get(0))
      )
        return !1;
      this.leave("animating"), this.trigger("translated");
    }),
    (e.prototype.viewport = function () {
      var d;
      return (
        this.options.responsiveBaseElement !== b
          ? (d = a(this.options.responsiveBaseElement).width())
          : b.innerWidth
          ? (d = b.innerWidth)
          : c.documentElement && c.documentElement.clientWidth
          ? (d = c.documentElement.clientWidth)
          : console.warn("Can not detect viewport width."),
        d
      );
    }),
    (e.prototype.replace = function (b) {
      this.$stage.empty(),
        (this._items = []),
        b && (b = b instanceof jQuery ? b : a(b)),
        this.settings.nestedItemSelector &&
          (b = b.find("." + this.settings.nestedItemSelector)),
        b
          .filter(function () {
            return 1 === this.nodeType;
          })
          .each(
            a.proxy(function (a, b) {
              (b = this.prepare(b)),
                this.$stage.append(b),
                this._items.push(b),
                this._mergers.push(
                  1 *
                    b
                      .find("[data-merge]")
                      .addBack("[data-merge]")
                      .attr("data-merge") || 1
                );
            }, this)
          ),
        this.reset(
          this.isNumeric(this.settings.startPosition)
            ? this.settings.startPosition
            : 0
        ),
        this.invalidate("items");
    }),
    (e.prototype.add = function (b, c) {
      var e = this.relative(this._current);
      (c = c === d ? this._items.length : this.normalize(c, !0)),
        (b = b instanceof jQuery ? b : a(b)),
        this.trigger("add", { content: b, position: c }),
        (b = this.prepare(b)),
        0 === this._items.length || c === this._items.length
          ? (0 === this._items.length && this.$stage.append(b),
            0 !== this._items.length && this._items[c - 1].after(b),
            this._items.push(b),
            this._mergers.push(
              1 *
                b
                  .find("[data-merge]")
                  .addBack("[data-merge]")
                  .attr("data-merge") || 1
            ))
          : (this._items[c].before(b),
            this._items.splice(c, 0, b),
            this._mergers.splice(
              c,
              0,
              1 *
                b
                  .find("[data-merge]")
                  .addBack("[data-merge]")
                  .attr("data-merge") || 1
            )),
        this._items[e] && this.reset(this._items[e].index()),
        this.invalidate("items"),
        this.trigger("added", { content: b, position: c });
    }),
    (e.prototype.remove = function (a) {
      (a = this.normalize(a, !0)) !== d &&
        (this.trigger("remove", { content: this._items[a], position: a }),
        this._items[a].remove(),
        this._items.splice(a, 1),
        this._mergers.splice(a, 1),
        this.invalidate("items"),
        this.trigger("removed", { content: null, position: a }));
    }),
    (e.prototype.preloadAutoWidthImages = function (b) {
      b.each(
        a.proxy(function (b, c) {
          this.enter("pre-loading"),
            (c = a(c)),
            a(new Image())
              .one(
                "load",
                a.proxy(function (a) {
                  c.attr("src", a.target.src),
                    c.css("opacity", 1),
                    this.leave("pre-loading"),
                    !this.is("pre-loading") &&
                      !this.is("initializing") &&
                      this.refresh();
                }, this)
              )
              .attr(
                "src",
                c.attr("src") || c.attr("data-src") || c.attr("data-src-retina")
              );
        }, this)
      );
    }),
    (e.prototype.destroy = function () {
      this.$element.off(".owl.core"),
        this.$stage.off(".owl.core"),
        a(c).off(".owl.core"),
        !1 !== this.settings.responsive &&
          (b.clearTimeout(this.resizeTimer),
          this.off(b, "resize", this._handlers.onThrottledResize));
      for (var d in this._plugins) this._plugins[d].destroy();
      this.$stage.children(".cloned").remove(),
        this.$stage.unwrap(),
        this.$stage.children().contents().unwrap(),
        this.$stage.children().unwrap(),
        this.$stage.remove(),
        this.$element
          .removeClass(this.options.refreshClass)
          .removeClass(this.options.loadingClass)
          .removeClass(this.options.loadedClass)
          .removeClass(this.options.rtlClass)
          .removeClass(this.options.dragClass)
          .removeClass(this.options.grabClass)
          .attr(
            "class",
            this.$element
              .attr("class")
              .replace(
                new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"),
                ""
              )
          )
          .removeData("owl.carousel");
    }),
    (e.prototype.op = function (a, b, c) {
      var d = this.settings.rtl;
      switch (b) {
        case "<":
          return d ? a > c : a < c;
        case ">":
          return d ? a < c : a > c;
        case ">=":
          return d ? a <= c : a >= c;
        case "<=":
          return d ? a >= c : a <= c;
      }
    }),
    (e.prototype.on = function (a, b, c, d) {
      a.addEventListener
        ? a.addEventListener(b, c, d)
        : a.attachEvent && a.attachEvent("on" + b, c);
    }),
    (e.prototype.off = function (a, b, c, d) {
      a.removeEventListener
        ? a.removeEventListener(b, c, d)
        : a.detachEvent && a.detachEvent("on" + b, c);
    }),
    (e.prototype.trigger = function (b, c, d, f, g) {
      var h = { item: { count: this._items.length, index: this.current() } },
        i = a.camelCase(
          a
            .grep(["on", b, d], function (a) {
              return a;
            })
            .join("-")
            .toLowerCase()
        ),
        j = a.Event(
          [b, "owl", d || "carousel"].join(".").toLowerCase(),
          a.extend({ relatedTarget: this }, h, c)
        );
      return (
        this._supress[b] ||
          (a.each(this._plugins, function (a, b) {
            b.onTrigger && b.onTrigger(j);
          }),
          this.register({ type: e.Type.Event, name: b }),
          this.$element.trigger(j),
          this.settings &&
            "function" == typeof this.settings[i] &&
            this.settings[i].call(this, j)),
        j
      );
    }),
    (e.prototype.enter = function (b) {
      a.each(
        [b].concat(this._states.tags[b] || []),
        a.proxy(function (a, b) {
          this._states.current[b] === d && (this._states.current[b] = 0),
            this._states.current[b]++;
        }, this)
      );
    }),
    (e.prototype.leave = function (b) {
      a.each(
        [b].concat(this._states.tags[b] || []),
        a.proxy(function (a, b) {
          this._states.current[b]--;
        }, this)
      );
    }),
    (e.prototype.register = function (b) {
      if (b.type === e.Type.Event) {
        if (
          (a.event.special[b.name] || (a.event.special[b.name] = {}),
          !a.event.special[b.name].owl)
        ) {
          var c = a.event.special[b.name]._default;
          (a.event.special[b.name]._default = function (a) {
            return !c ||
              !c.apply ||
              (a.namespace && -1 !== a.namespace.indexOf("owl"))
              ? a.namespace && a.namespace.indexOf("owl") > -1
              : c.apply(this, arguments);
          }),
            (a.event.special[b.name].owl = !0);
        }
      } else
        b.type === e.Type.State &&
          (this._states.tags[b.name]
            ? (this._states.tags[b.name] = this._states.tags[b.name].concat(
                b.tags
              ))
            : (this._states.tags[b.name] = b.tags),
          (this._states.tags[b.name] = a.grep(
            this._states.tags[b.name],
            a.proxy(function (c, d) {
              return a.inArray(c, this._states.tags[b.name]) === d;
            }, this)
          )));
    }),
    (e.prototype.suppress = function (b) {
      a.each(
        b,
        a.proxy(function (a, b) {
          this._supress[b] = !0;
        }, this)
      );
    }),
    (e.prototype.release = function (b) {
      a.each(
        b,
        a.proxy(function (a, b) {
          delete this._supress[b];
        }, this)
      );
    }),
    (e.prototype.pointer = function (a) {
      var c = { x: null, y: null };
      return (
        (a = a.originalEvent || a || b.event),
        (a =
          a.touches && a.touches.length
            ? a.touches[0]
            : a.changedTouches && a.changedTouches.length
            ? a.changedTouches[0]
            : a),
        a.pageX
          ? ((c.x = a.pageX), (c.y = a.pageY))
          : ((c.x = a.clientX), (c.y = a.clientY)),
        c
      );
    }),
    (e.prototype.isNumeric = function (a) {
      return !isNaN(parseFloat(a));
    }),
    (e.prototype.difference = function (a, b) {
      return { x: a.x - b.x, y: a.y - b.y };
    }),
    (a.fn.owlCarousel = function (b) {
      var c = Array.prototype.slice.call(arguments, 1);
      return this.each(function () {
        var d = a(this),
          f = d.data("owl.carousel");
        f ||
          ((f = new e(this, "object" == typeof b && b)),
          d.data("owl.carousel", f),
          a.each(
            [
              "next",
              "prev",
              "to",
              "destroy",
              "refresh",
              "replace",
              "add",
              "remove"
            ],
            function (b, c) {
              f.register({ type: e.Type.Event, name: c }),
                f.$element.on(
                  c + ".owl.carousel.core",
                  a.proxy(function (a) {
                    a.namespace &&
                      a.relatedTarget !== this &&
                      (this.suppress([c]),
                      f[c].apply(this, [].slice.call(arguments, 1)),
                      this.release([c]));
                  }, f)
                );
            }
          )),
          "string" == typeof b && "_" !== b.charAt(0) && f[b].apply(f, c);
      });
    }),
    (a.fn.owlCarousel.Constructor = e);
})(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._interval = null),
        (this._visible = null),
        (this._handlers = {
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace && this._core.settings.autoRefresh && this.watch();
          }, this)
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers);
    };
    (e.Defaults = { autoRefresh: !0, autoRefreshInterval: 500 }),
      (e.prototype.watch = function () {
        this._interval ||
          ((this._visible = this._core.isVisible()),
          (this._interval = b.setInterval(
            a.proxy(this.refresh, this),
            this._core.settings.autoRefreshInterval
          )));
      }),
      (e.prototype.refresh = function () {
        this._core.isVisible() !== this._visible &&
          ((this._visible = !this._visible),
          this._core.$element.toggleClass("owl-hidden", !this._visible),
          this._visible &&
            this._core.invalidate("width") &&
            this._core.refresh());
      }),
      (e.prototype.destroy = function () {
        var a, c;
        b.clearInterval(this._interval);
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (c in Object.getOwnPropertyNames(this))
          "function" != typeof this[c] && (this[c] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.AutoRefresh = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._loaded = []),
        (this._handlers = {
          "initialized.owl.carousel change.owl.carousel resized.owl.carousel": a.proxy(
            function (b) {
              if (
                b.namespace &&
                this._core.settings &&
                this._core.settings.lazyLoad &&
                ((b.property && "position" == b.property.name) ||
                  "initialized" == b.type)
              ) {
                var c = this._core.settings,
                  e = (c.center && Math.ceil(c.items / 2)) || c.items,
                  f = (c.center && -1 * e) || 0,
                  g =
                    (b.property && b.property.value !== d
                      ? b.property.value
                      : this._core.current()) + f,
                  h = this._core.clones().length,
                  i = a.proxy(function (a, b) {
                    this.load(b);
                  }, this);
                for (
                  c.lazyLoadEager > 0 &&
                  ((e += c.lazyLoadEager),
                  c.loop && ((g -= c.lazyLoadEager), e++));
                  f++ < e;

                )
                  this.load(h / 2 + this._core.relative(g)),
                    h && a.each(this._core.clones(this._core.relative(g)), i),
                    g++;
              }
            },
            this
          )
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers);
    };
    (e.Defaults = { lazyLoad: !1, lazyLoadEager: 0 }),
      (e.prototype.load = function (c) {
        var d = this._core.$stage.children().eq(c),
          e = d && d.find(".owl-lazy");
        !e ||
          a.inArray(d.get(0), this._loaded) > -1 ||
          (e.each(
            a.proxy(function (c, d) {
              var e,
                f = a(d),
                g =
                  (b.devicePixelRatio > 1 && f.attr("data-src-retina")) ||
                  f.attr("data-src") ||
                  f.attr("data-srcset");
              this._core.trigger("load", { element: f, url: g }, "lazy"),
                f.is("img")
                  ? f
                      .one(
                        "load.owl.lazy",
                        a.proxy(function () {
                          f.css("opacity", 1),
                            this._core.trigger(
                              "loaded",
                              { element: f, url: g },
                              "lazy"
                            );
                        }, this)
                      )
                      .attr("src", g)
                  : f.is("source")
                  ? f
                      .one(
                        "load.owl.lazy",
                        a.proxy(function () {
                          this._core.trigger(
                            "loaded",
                            { element: f, url: g },
                            "lazy"
                          );
                        }, this)
                      )
                      .attr("srcset", g)
                  : ((e = new Image()),
                    (e.onload = a.proxy(function () {
                      f.css({
                        "background-image": 'url("' + g + '")',
                        opacity: "1"
                      }),
                        this._core.trigger(
                          "loaded",
                          { element: f, url: g },
                          "lazy"
                        );
                    }, this)),
                    (e.src = g));
            }, this)
          ),
          this._loaded.push(d.get(0)));
      }),
      (e.prototype.destroy = function () {
        var a, b;
        for (a in this.handlers) this._core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Lazy = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (c) {
      (this._core = c),
        (this._previousHeight = null),
        (this._handlers = {
          "initialized.owl.carousel refreshed.owl.carousel": a.proxy(function (
            a
          ) {
            a.namespace && this._core.settings.autoHeight && this.update();
          },
          this),
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.autoHeight &&
              "position" === a.property.name &&
              this.update();
          }, this),
          "loaded.owl.lazy": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.autoHeight &&
              a.element.closest("." + this._core.settings.itemClass).index() ===
                this._core.current() &&
              this.update();
          }, this)
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers),
        (this._intervalId = null);
      var d = this;
      a(b).on("load", function () {
        d._core.settings.autoHeight && d.update();
      }),
        a(b).resize(function () {
          d._core.settings.autoHeight &&
            (null != d._intervalId && clearTimeout(d._intervalId),
            (d._intervalId = setTimeout(function () {
              d.update();
            }, 250)));
        });
    };
    (e.Defaults = { autoHeight: !1, autoHeightClass: "owl-height" }),
      (e.prototype.update = function () {
        var b = this._core._current,
          c = b + this._core.settings.items,
          d = this._core.settings.lazyLoad,
          e = this._core.$stage.children().toArray().slice(b, c),
          f = [],
          g = 0;
        a.each(e, function (b, c) {
          f.push(a(c).height());
        }),
          (g = Math.max.apply(null, f)),
          g <= 1 && d && this._previousHeight && (g = this._previousHeight),
          (this._previousHeight = g),
          this._core.$stage
            .parent()
            .height(g)
            .addClass(this._core.settings.autoHeightClass);
      }),
      (e.prototype.destroy = function () {
        var a, b;
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.AutoHeight = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._videos = {}),
        (this._playing = null),
        (this._handlers = {
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.register({
                type: "state",
                name: "playing",
                tags: ["interacting"]
              });
          }, this),
          "resize.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.video &&
              this.isInFullScreen() &&
              a.preventDefault();
          }, this),
          "refreshed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.is("resizing") &&
              this._core.$stage.find(".cloned .owl-video-frame").remove();
          }, this),
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              "position" === a.property.name &&
              this._playing &&
              this.stop();
          }, this),
          "prepared.owl.carousel": a.proxy(function (b) {
            if (b.namespace) {
              var c = a(b.content).find(".owl-video");
              c.length &&
                (c.css("display", "none"), this.fetch(c, a(b.content)));
            }
          }, this)
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers),
        this._core.$element.on(
          "click.owl.video",
          ".owl-video-play-icon",
          a.proxy(function (a) {
            this.play(a);
          }, this)
        );
    };
    (e.Defaults = { video: !1, videoHeight: !1, videoWidth: !1 }),
      (e.prototype.fetch = function (a, b) {
        var c = (function () {
            return a.attr("data-vimeo-id")
              ? "vimeo"
              : a.attr("data-vzaar-id")
              ? "vzaar"
              : "youtube";
          })(),
          d =
            a.attr("data-vimeo-id") ||
            a.attr("data-youtube-id") ||
            a.attr("data-vzaar-id"),
          e = a.attr("data-width") || this._core.settings.videoWidth,
          f = a.attr("data-height") || this._core.settings.videoHeight,
          g = a.attr("href");
        if (!g) throw new Error("Missing video URL.");
        if (
          ((d = g.match(
            /(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
          )),
          d[3].indexOf("youtu") > -1)
        )
          c = "youtube";
        else if (d[3].indexOf("vimeo") > -1) c = "vimeo";
        else {
          if (!(d[3].indexOf("vzaar") > -1))
            throw new Error("Video URL not supported.");
          c = "vzaar";
        }
        (d = d[6]),
          (this._videos[g] = { type: c, id: d, width: e, height: f }),
          b.attr("data-video", g),
          this.thumbnail(a, this._videos[g]);
      }),
      (e.prototype.thumbnail = function (b, c) {
        var d,
          e,
          f,
          g =
            c.width && c.height
              ? "width:" + c.width + "px;height:" + c.height + "px;"
              : "",
          h = b.find("img"),
          i = "src",
          j = "",
          k = this._core.settings,
          l = function (c) {
            (e = '<div class="owl-video-play-icon"></div>'),
              (d = k.lazyLoad
                ? a("<div/>", { class: "owl-video-tn " + j, srcType: c })
                : a("<div/>", {
                    class: "owl-video-tn",
                    style: "opacity:1;background-image:url(" + c + ")"
                  })),
              b.after(d),
              b.after(e);
          };
        if (
          (b.wrap(a("<div/>", { class: "owl-video-wrapper", style: g })),
          this._core.settings.lazyLoad && ((i = "data-src"), (j = "owl-lazy")),
          h.length)
        )
          return l(h.attr(i)), h.remove(), !1;
        "youtube" === c.type
          ? ((f = "//img.youtube.com/vi/" + c.id + "/hqdefault.jpg"), l(f))
          : "vimeo" === c.type
          ? a.ajax({
              type: "GET",
              url: "//vimeo.com/api/v2/video/" + c.id + ".json",
              jsonp: "callback",
              dataType: "jsonp",
              success: function (a) {
                (f = a[0].thumbnail_large), l(f);
              }
            })
          : "vzaar" === c.type &&
            a.ajax({
              type: "GET",
              url: "//vzaar.com/api/videos/" + c.id + ".json",
              jsonp: "callback",
              dataType: "jsonp",
              success: function (a) {
                (f = a.framegrab_url), l(f);
              }
            });
      }),
      (e.prototype.stop = function () {
        this._core.trigger("stop", null, "video"),
          this._playing.find(".owl-video-frame").remove(),
          this._playing.removeClass("owl-video-playing"),
          (this._playing = null),
          this._core.leave("playing"),
          this._core.trigger("stopped", null, "video");
      }),
      (e.prototype.play = function (b) {
        var c,
          d = a(b.target),
          e = d.closest("." + this._core.settings.itemClass),
          f = this._videos[e.attr("data-video")],
          g = f.width || "100%",
          h = f.height || this._core.$stage.height();
        this._playing ||
          (this._core.enter("playing"),
          this._core.trigger("play", null, "video"),
          (e = this._core.items(this._core.relative(e.index()))),
          this._core.reset(e.index()),
          (c = a(
            '<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>'
          )),
          c.attr("height", h),
          c.attr("width", g),
          "youtube" === f.type
            ? c.attr(
                "src",
                "//www.youtube.com/embed/" +
                  f.id +
                  "?autoplay=1&rel=0&v=" +
                  f.id
              )
            : "vimeo" === f.type
            ? c.attr("src", "//player.vimeo.com/video/" + f.id + "?autoplay=1")
            : "vzaar" === f.type &&
              c.attr(
                "src",
                "//view.vzaar.com/" + f.id + "/player?autoplay=true"
              ),
          a(c)
            .wrap('<div class="owl-video-frame" />')
            .insertAfter(e.find(".owl-video")),
          (this._playing = e.addClass("owl-video-playing")));
      }),
      (e.prototype.isInFullScreen = function () {
        var b =
          c.fullscreenElement ||
          c.mozFullScreenElement ||
          c.webkitFullscreenElement;
        return b && a(b).parent().hasClass("owl-video-frame");
      }),
      (e.prototype.destroy = function () {
        var a, b;
        this._core.$element.off("click.owl.video");
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Video = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this.core = b),
        (this.core.options = a.extend({}, e.Defaults, this.core.options)),
        (this.swapping = !0),
        (this.previous = d),
        (this.next = d),
        (this.handlers = {
          "change.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              "position" == a.property.name &&
              ((this.previous = this.core.current()),
              (this.next = a.property.value));
          }, this),
          "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": a.proxy(
            function (a) {
              a.namespace && (this.swapping = "translated" == a.type);
            },
            this
          ),
          "translate.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this.swapping &&
              (this.core.options.animateOut || this.core.options.animateIn) &&
              this.swap();
          }, this)
        }),
        this.core.$element.on(this.handlers);
    };
    (e.Defaults = { animateOut: !1, animateIn: !1 }),
      (e.prototype.swap = function () {
        if (
          1 === this.core.settings.items &&
          a.support.animation &&
          a.support.transition
        ) {
          this.core.speed(0);
          var b,
            c = a.proxy(this.clear, this),
            d = this.core.$stage.children().eq(this.previous),
            e = this.core.$stage.children().eq(this.next),
            f = this.core.settings.animateIn,
            g = this.core.settings.animateOut;
          this.core.current() !== this.previous &&
            (g &&
              ((b =
                this.core.coordinates(this.previous) -
                this.core.coordinates(this.next)),
              d
                .one(a.support.animation.end, c)
                .css({ left: b + "px" })
                .addClass("animated owl-animated-out")
                .addClass(g)),
            f &&
              e
                .one(a.support.animation.end, c)
                .addClass("animated owl-animated-in")
                .addClass(f));
        }
      }),
      (e.prototype.clear = function (b) {
        a(b.target)
          .css({ left: "" })
          .removeClass("animated owl-animated-out owl-animated-in")
          .removeClass(this.core.settings.animateIn)
          .removeClass(this.core.settings.animateOut),
          this.core.onTransitionEnd();
      }),
      (e.prototype.destroy = function () {
        var a, b;
        for (a in this.handlers) this.core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Animate = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._call = null),
        (this._time = 0),
        (this._timeout = 0),
        (this._paused = !0),
        (this._handlers = {
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace && "settings" === a.property.name
              ? this._core.settings.autoplay
                ? this.play()
                : this.stop()
              : a.namespace &&
                "position" === a.property.name &&
                this._paused &&
                (this._time = 0);
          }, this),
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace && this._core.settings.autoplay && this.play();
          }, this),
          "play.owl.autoplay": a.proxy(function (a, b, c) {
            a.namespace && this.play(b, c);
          }, this),
          "stop.owl.autoplay": a.proxy(function (a) {
            a.namespace && this.stop();
          }, this),
          "mouseover.owl.autoplay": a.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.pause();
          }, this),
          "mouseleave.owl.autoplay": a.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.play();
          }, this),
          "touchstart.owl.core": a.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.pause();
          }, this),
          "touchend.owl.core": a.proxy(function () {
            this._core.settings.autoplayHoverPause && this.play();
          }, this)
        }),
        this._core.$element.on(this._handlers),
        (this._core.options = a.extend({}, e.Defaults, this._core.options));
    };
    (e.Defaults = {
      autoplay: !1,
      autoplayTimeout: 5e3,
      autoplayHoverPause: !1,
      autoplaySpeed: !1
    }),
      (e.prototype._next = function (d) {
        (this._call = b.setTimeout(
          a.proxy(this._next, this, d),
          this._timeout * (Math.round(this.read() / this._timeout) + 1) -
            this.read()
        )),
          this._core.is("interacting") ||
            c.hidden ||
            this._core.next(d || this._core.settings.autoplaySpeed);
      }),
      (e.prototype.read = function () {
        return new Date().getTime() - this._time;
      }),
      (e.prototype.play = function (c, d) {
        var e;
        this._core.is("rotating") || this._core.enter("rotating"),
          (c = c || this._core.settings.autoplayTimeout),
          (e = Math.min(this._time % (this._timeout || c), c)),
          this._paused
            ? ((this._time = this.read()), (this._paused = !1))
            : b.clearTimeout(this._call),
          (this._time += (this.read() % c) - e),
          (this._timeout = c),
          (this._call = b.setTimeout(a.proxy(this._next, this, d), c - e));
      }),
      (e.prototype.stop = function () {
        this._core.is("rotating") &&
          ((this._time = 0),
          (this._paused = !0),
          b.clearTimeout(this._call),
          this._core.leave("rotating"));
      }),
      (e.prototype.pause = function () {
        this._core.is("rotating") &&
          !this._paused &&
          ((this._time = this.read()),
          (this._paused = !0),
          b.clearTimeout(this._call));
      }),
      (e.prototype.destroy = function () {
        var a, b;
        this.stop();
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.autoplay = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    "use strict";
    var e = function (b) {
      (this._core = b),
        (this._initialized = !1),
        (this._pages = []),
        (this._controls = {}),
        (this._templates = []),
        (this.$element = this._core.$element),
        (this._overrides = {
          next: this._core.next,
          prev: this._core.prev,
          to: this._core.to
        }),
        (this._handlers = {
          "prepared.owl.carousel": a.proxy(function (b) {
            b.namespace &&
              this._core.settings.dotsData &&
              this._templates.push(
                '<div class="' +
                  this._core.settings.dotClass +
                  '">' +
                  a(b.content)
                    .find("[data-dot]")
                    .addBack("[data-dot]")
                    .attr("data-dot") +
                  "</div>"
              );
          }, this),
          "added.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.dotsData &&
              this._templates.splice(a.position, 0, this._templates.pop());
          }, this),
          "remove.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.dotsData &&
              this._templates.splice(a.position, 1);
          }, this),
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace && "position" == a.property.name && this.draw();
          }, this),
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              !this._initialized &&
              (this._core.trigger("initialize", null, "navigation"),
              this.initialize(),
              this.update(),
              this.draw(),
              (this._initialized = !0),
              this._core.trigger("initialized", null, "navigation"));
          }, this),
          "refreshed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._initialized &&
              (this._core.trigger("refresh", null, "navigation"),
              this.update(),
              this.draw(),
              this._core.trigger("refreshed", null, "navigation"));
          }, this)
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this.$element.on(this._handlers);
    };
    (e.Defaults = {
      nav: !1,
      navText: [
        '<span aria-label="Previous">&#x2039;</span>',
        '<span aria-label="Next">&#x203a;</span>'
      ],
      navSpeed: !1,
      navElement: 'button type="button" role="presentation"',
      navContainer: !1,
      navContainerClass: "owl-nav",
      navClass: ["owl-prev", "owl-next"],
      slideBy: 1,
      dotClass: "owl-dot",
      dotsClass: "owl-dots",
      dots: !0,
      dotsEach: !1,
      dotsData: !1,
      dotsSpeed: !1,
      dotsContainer: !1
    }),
      (e.prototype.initialize = function () {
        var b,
          c = this._core.settings;
        (this._controls.$relative = (c.navContainer
          ? a(c.navContainer)
          : a("<div>").addClass(c.navContainerClass).appendTo(this.$element)
        ).addClass("disabled")),
          (this._controls.$previous = a("<" + c.navElement + ">")
            .addClass(c.navClass[0])
            .html(c.navText[0])
            .prependTo(this._controls.$relative)
            .on(
              "click",
              a.proxy(function (a) {
                this.prev(c.navSpeed);
              }, this)
            )),
          (this._controls.$next = a("<" + c.navElement + ">")
            .addClass(c.navClass[1])
            .html(c.navText[1])
            .appendTo(this._controls.$relative)
            .on(
              "click",
              a.proxy(function (a) {
                this.next(c.navSpeed);
              }, this)
            )),
          c.dotsData ||
            (this._templates = [
              a('<button role="button">')
                .addClass(c.dotClass)
                .append(a("<span>"))
                .prop("outerHTML")
            ]),
          (this._controls.$absolute = (c.dotsContainer
            ? a(c.dotsContainer)
            : a("<div>").addClass(c.dotsClass).appendTo(this.$element)
          ).addClass("disabled")),
          this._controls.$absolute.on(
            "click",
            "button",
            a.proxy(function (b) {
              var d = a(b.target).parent().is(this._controls.$absolute)
                ? a(b.target).index()
                : a(b.target).parent().index();
              b.preventDefault(), this.to(d, c.dotsSpeed);
            }, this)
          );
        for (b in this._overrides) this._core[b] = a.proxy(this[b], this);
      }),
      (e.prototype.destroy = function () {
        var a, b, c, d, e;
        e = this._core.settings;
        for (a in this._handlers) this.$element.off(a, this._handlers[a]);
        for (b in this._controls)
          "$relative" === b && e.navContainer
            ? this._controls[b].html("")
            : this._controls[b].remove();
        for (d in this.overides) this._core[d] = this._overrides[d];
        for (c in Object.getOwnPropertyNames(this))
          "function" != typeof this[c] && (this[c] = null);
      }),
      (e.prototype.update = function () {
        var a,
          b,
          c,
          d = this._core.clones().length / 2,
          e = d + this._core.items().length,
          f = this._core.maximum(!0),
          g = this._core.settings,
          h = g.center || g.autoWidth || g.dotsData ? 1 : g.dotsEach || g.items;
        if (
          ("page" !== g.slideBy && (g.slideBy = Math.min(g.slideBy, g.items)),
          g.dots || "page" == g.slideBy)
        )
          for (this._pages = [], a = d, b = 0, c = 0; a < e; a++) {
            if (b >= h || 0 === b) {
              if (
                (this._pages.push({
                  start: Math.min(f, a - d),
                  end: a - d + h - 1
                }),
                Math.min(f, a - d) === f)
              )
                break;
              (b = 0), ++c;
            }
            b += this._core.mergers(this._core.relative(a));
          }
      }),
      (e.prototype.draw = function () {
        var b,
          c = this._core.settings,
          d = this._core.items().length <= c.items,
          e = this._core.relative(this._core.current()),
          f = c.loop || c.rewind;
        this._controls.$relative.toggleClass("disabled", !c.nav || d),
          c.nav &&
            (this._controls.$previous.toggleClass(
              "disabled",
              !f && e <= this._core.minimum(!0)
            ),
            this._controls.$next.toggleClass(
              "disabled",
              !f && e >= this._core.maximum(!0)
            )),
          this._controls.$absolute.toggleClass("disabled", !c.dots || d),
          c.dots &&
            ((b =
              this._pages.length - this._controls.$absolute.children().length),
            c.dotsData && 0 !== b
              ? this._controls.$absolute.html(this._templates.join(""))
              : b > 0
              ? this._controls.$absolute.append(
                  new Array(b + 1).join(this._templates[0])
                )
              : b < 0 && this._controls.$absolute.children().slice(b).remove(),
            this._controls.$absolute.find(".active").removeClass("active"),
            this._controls.$absolute
              .children()
              .eq(a.inArray(this.current(), this._pages))
              .addClass("active"));
      }),
      (e.prototype.onTrigger = function (b) {
        var c = this._core.settings;
        b.page = {
          index: a.inArray(this.current(), this._pages),
          count: this._pages.length,
          size:
            c &&
            (c.center || c.autoWidth || c.dotsData ? 1 : c.dotsEach || c.items)
        };
      }),
      (e.prototype.current = function () {
        var b = this._core.relative(this._core.current());
        return a
          .grep(
            this._pages,
            a.proxy(function (a, c) {
              return a.start <= b && a.end >= b;
            }, this)
          )
          .pop();
      }),
      (e.prototype.getPosition = function (b) {
        var c,
          d,
          e = this._core.settings;
        return (
          "page" == e.slideBy
            ? ((c = a.inArray(this.current(), this._pages)),
              (d = this._pages.length),
              b ? ++c : --c,
              (c = this._pages[((c % d) + d) % d].start))
            : ((c = this._core.relative(this._core.current())),
              (d = this._core.items().length),
              b ? (c += e.slideBy) : (c -= e.slideBy)),
          c
        );
      }),
      (e.prototype.next = function (b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!0), b);
      }),
      (e.prototype.prev = function (b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!1), b);
      }),
      (e.prototype.to = function (b, c, d) {
        var e;
        !d && this._pages.length
          ? ((e = this._pages.length),
            a.proxy(this._overrides.to, this._core)(
              this._pages[((b % e) + e) % e].start,
              c
            ))
          : a.proxy(this._overrides.to, this._core)(b, c);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Navigation = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    "use strict";
    var e = function (c) {
      (this._core = c),
        (this._hashes = {}),
        (this.$element = this._core.$element),
        (this._handlers = {
          "initialized.owl.carousel": a.proxy(function (c) {
            c.namespace &&
              "URLHash" === this._core.settings.startPosition &&
              a(b).trigger("hashchange.owl.navigation");
          }, this),
          "prepared.owl.carousel": a.proxy(function (b) {
            if (b.namespace) {
              var c = a(b.content)
                .find("[data-hash]")
                .addBack("[data-hash]")
                .attr("data-hash");
              if (!c) return;
              this._hashes[c] = b.content;
            }
          }, this),
          "changed.owl.carousel": a.proxy(function (c) {
            if (c.namespace && "position" === c.property.name) {
              var d = this._core.items(
                  this._core.relative(this._core.current())
                ),
                e = a
                  .map(this._hashes, function (a, b) {
                    return a === d ? b : null;
                  })
                  .join();
              if (!e || b.location.hash.slice(1) === e) return;
              b.location.hash = e;
            }
          }, this)
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this.$element.on(this._handlers),
        a(b).on(
          "hashchange.owl.navigation",
          a.proxy(function (a) {
            var c = b.location.hash.substring(1),
              e = this._core.$stage.children(),
              f = this._hashes[c] && e.index(this._hashes[c]);
            f !== d &&
              f !== this._core.current() &&
              this._core.to(this._core.relative(f), !1, !0);
          }, this)
        );
    };
    (e.Defaults = { URLhashListener: !1 }),
      (e.prototype.destroy = function () {
        var c, d;
        a(b).off("hashchange.owl.navigation");
        for (c in this._handlers) this._core.$element.off(c, this._handlers[c]);
        for (d in Object.getOwnPropertyNames(this))
          "function" != typeof this[d] && (this[d] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Hash = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    function e(b, c) {
      var e = !1,
        f = b.charAt(0).toUpperCase() + b.slice(1);
      return (
        a.each((b + " " + h.join(f + " ") + f).split(" "), function (a, b) {
          if (g[b] !== d) return (e = !c || b), !1;
        }),
        e
      );
    }
    function f(a) {
      return e(a, !0);
    }
    var g = a("<support>").get(0).style,
      h = "Webkit Moz O ms".split(" "),
      i = {
        transition: {
          end: {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd",
            transition: "transitionend"
          }
        },
        animation: {
          end: {
            WebkitAnimation: "webkitAnimationEnd",
            MozAnimation: "animationend",
            OAnimation: "oAnimationEnd",
            animation: "animationend"
          }
        }
      },
      j = {
        csstransforms: function () {
          return !!e("transform");
        },
        csstransforms3d: function () {
          return !!e("perspective");
        },
        csstransitions: function () {
          return !!e("transition");
        },
        cssanimations: function () {
          return !!e("animation");
        }
      };
    j.csstransitions() &&
      ((a.support.transition = new String(f("transition"))),
      (a.support.transition.end = i.transition.end[a.support.transition])),
      j.cssanimations() &&
        ((a.support.animation = new String(f("animation"))),
        (a.support.animation.end = i.animation.end[a.support.animation])),
      j.csstransforms() &&
        ((a.support.transform = new String(f("transform"))),
        (a.support.transform3d = j.csstransforms3d()));
  })(window.Zepto || window.jQuery, window, document);


  /*!
 * Bootstrap v4.0.0 (https://getbootstrap.com)
 * Copyright 2011-2018 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? e(exports, require("jquery"), require("popper.js"))
    : "function" == typeof define && define.amd
    ? define(["exports", "jquery", "popper.js"], e)
    : e((t.bootstrap = {}), t.jQuery, t.Popper);
})(this, function (t, e, n) {
  "use strict";
  function i(t, e) {
    for (var n = 0; n < e.length; n++) {
      var i = e[n];
      (i.enumerable = i.enumerable || !1),
        (i.configurable = !0),
        "value" in i && (i.writable = !0),
        Object.defineProperty(t, i.key, i);
    }
  }
  function s(t, e, n) {
    return e && i(t.prototype, e), n && i(t, n), t;
  }
  function r() {
    return (r =
      Object.assign ||
      function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = arguments[e];
          for (var i in n)
            Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
        }
        return t;
      }).apply(this, arguments);
  }
  (e = e && e.hasOwnProperty("default") ? e.default : e),
    (n = n && n.hasOwnProperty("default") ? n.default : n);
  var o,
    a,
    l,
    h,
    c,
    u,
    f,
    d,
    _,
    g,
    p,
    m,
    v,
    E,
    T,
    y,
    C,
    I,
    A,
    b,
    D,
    S,
    w,
    N,
    O,
    k,
    P = (function (t) {
      var e = !1;
      function n(e) {
        var n = this,
          s = !1;
        return (
          t(this).one(i.TRANSITION_END, function () {
            s = !0;
          }),
          setTimeout(function () {
            s || i.triggerTransitionEnd(n);
          }, e),
          this
        );
      }
      var i = {
        TRANSITION_END: "bsTransitionEnd",
        getUID: function (t) {
          do {
            t += ~~(1e6 * Math.random());
          } while (document.getElementById(t));
          return t;
        },
        getSelectorFromElement: function (e) {
          var n,
            i = e.getAttribute("data-target");
          (i && "#" !== i) || (i = e.getAttribute("href") || ""),
            "#" === i.charAt(0) &&
              ((n = i),
              (i = n =
                "function" == typeof t.escapeSelector
                  ? t.escapeSelector(n).substr(1)
                  : n.replace(/(:|\.|\[|\]|,|=|@)/g, "\\$1")));
          try {
            return t(document).find(i).length > 0 ? i : null;
          } catch (t) {
            return null;
          }
        },
        reflow: function (t) {
          return t.offsetHeight;
        },
        triggerTransitionEnd: function (n) {
          t(n).trigger(e.end);
        },
        supportsTransitionEnd: function () {
          return Boolean(e);
        },
        isElement: function (t) {
          return (t[0] || t).nodeType;
        },
        typeCheckConfig: function (t, e, n) {
          for (var s in n)
            if (Object.prototype.hasOwnProperty.call(n, s)) {
              var r = n[s],
                o = e[s],
                a =
                  o && i.isElement(o)
                    ? "element"
                    : ((l = o),
                      {}.toString
                        .call(l)
                        .match(/\s([a-zA-Z]+)/)[1]
                        .toLowerCase());
              if (!new RegExp(r).test(a))
                throw new Error(
                  t.toUpperCase() +
                    ': Option "' +
                    s +
                    '" provided type "' +
                    a +
                    '" but expected type "' +
                    r +
                    '".'
                );
            }
          var l;
        }
      };
      return (
        (e = ("undefined" == typeof window || !window.QUnit) && {
          end: "transitionend"
        }),
        (t.fn.emulateTransitionEnd = n),
        i.supportsTransitionEnd() &&
          (t.event.special[i.TRANSITION_END] = {
            bindType: e.end,
            delegateType: e.end,
            handle: function (e) {
              if (t(e.target).is(this))
                return e.handleObj.handler.apply(this, arguments);
            }
          }),
        i
      );
    })(e),
    L =
      ((a = "alert"),
      (h = "." + (l = "bs.alert")),
      (c = (o = e).fn[a]),
      (u = {
        CLOSE: "close" + h,
        CLOSED: "closed" + h,
        CLICK_DATA_API: "click" + h + ".data-api"
      }),
      (f = "alert"),
      (d = "fade"),
      (_ = "show"),
      (g = (function () {
        function t(t) {
          this._element = t;
        }
        var e = t.prototype;
        return (
          (e.close = function (t) {
            t = t || this._element;
            var e = this._getRootElement(t);
            this._triggerCloseEvent(e).isDefaultPrevented() ||
              this._removeElement(e);
          }),
          (e.dispose = function () {
            o.removeData(this._element, l), (this._element = null);
          }),
          (e._getRootElement = function (t) {
            var e = P.getSelectorFromElement(t),
              n = !1;
            return e && (n = o(e)[0]), n || (n = o(t).closest("." + f)[0]), n;
          }),
          (e._triggerCloseEvent = function (t) {
            var e = o.Event(u.CLOSE);
            return o(t).trigger(e), e;
          }),
          (e._removeElement = function (t) {
            var e = this;
            o(t).removeClass(_),
              P.supportsTransitionEnd() && o(t).hasClass(d)
                ? o(t)
                    .one(P.TRANSITION_END, function (n) {
                      return e._destroyElement(t, n);
                    })
                    .emulateTransitionEnd(150)
                : this._destroyElement(t);
          }),
          (e._destroyElement = function (t) {
            o(t).detach().trigger(u.CLOSED).remove();
          }),
          (t._jQueryInterface = function (e) {
            return this.each(function () {
              var n = o(this),
                i = n.data(l);
              i || ((i = new t(this)), n.data(l, i)),
                "close" === e && i[e](this);
            });
          }),
          (t._handleDismiss = function (t) {
            return function (e) {
              e && e.preventDefault(), t.close(this);
            };
          }),
          s(t, null, [
            {
              key: "VERSION",
              get: function () {
                return "4.0.0";
              }
            }
          ]),
          t
        );
      })()),
      o(document).on(
        u.CLICK_DATA_API,
        '[data-dismiss="alert"]',
        g._handleDismiss(new g())
      ),
      (o.fn[a] = g._jQueryInterface),
      (o.fn[a].Constructor = g),
      (o.fn[a].noConflict = function () {
        return (o.fn[a] = c), g._jQueryInterface;
      }),
      g),
    R =
      ((m = "button"),
      (E = "." + (v = "bs.button")),
      (T = ".data-api"),
      (y = (p = e).fn[m]),
      (C = "active"),
      (I = "btn"),
      (A = "focus"),
      (b = '[data-toggle^="button"]'),
      (D = '[data-toggle="buttons"]'),
      (S = "input"),
      (w = ".active"),
      (N = ".btn"),
      (O = {
        CLICK_DATA_API: "click" + E + T,
        FOCUS_BLUR_DATA_API: "focus" + E + T + " blur" + E + T
      }),
      (k = (function () {
        function t(t) {
          this._element = t;
        }
        var e = t.prototype;
        return (
          (e.toggle = function () {
            var t = !0,
              e = !0,
              n = p(this._element).closest(D)[0];
            if (n) {
              var i = p(this._element).find(S)[0];
              if (i) {
                if ("radio" === i.type)
                  if (i.checked && p(this._element).hasClass(C)) t = !1;
                  else {
                    var s = p(n).find(w)[0];
                    s && p(s).removeClass(C);
                  }
                if (t) {
                  if (
                    i.hasAttribute("disabled") ||
                    n.hasAttribute("disabled") ||
                    i.classList.contains("disabled") ||
                    n.classList.contains("disabled")
                  )
                    return;
                  (i.checked = !p(this._element).hasClass(C)),
                    p(i).trigger("change");
                }
                i.focus(), (e = !1);
              }
            }
            e &&
              this._element.setAttribute(
                "aria-pressed",
                !p(this._element).hasClass(C)
              ),
              t && p(this._element).toggleClass(C);
          }),
          (e.dispose = function () {
            p.removeData(this._element, v), (this._element = null);
          }),
          (t._jQueryInterface = function (e) {
            return this.each(function () {
              var n = p(this).data(v);
              n || ((n = new t(this)), p(this).data(v, n)),
                "toggle" === e && n[e]();
            });
          }),
          s(t, null, [
            {
              key: "VERSION",
              get: function () {
                return "4.0.0";
              }
            }
          ]),
          t
        );
      })()),
      p(document)
        .on(O.CLICK_DATA_API, b, function (t) {
          t.preventDefault();
          var e = t.target;
          p(e).hasClass(I) || (e = p(e).closest(N)),
            k._jQueryInterface.call(p(e), "toggle");
        })
        .on(O.FOCUS_BLUR_DATA_API, b, function (t) {
          var e = p(t.target).closest(N)[0];
          p(e).toggleClass(A, /^focus(in)?$/.test(t.type));
        }),
      (p.fn[m] = k._jQueryInterface),
      (p.fn[m].Constructor = k),
      (p.fn[m].noConflict = function () {
        return (p.fn[m] = y), k._jQueryInterface;
      }),
      k),
    j = (function (t) {
      var e = "carousel",
        n = "bs.carousel",
        i = "." + n,
        o = t.fn[e],
        a = {
          interval: 5e3,
          keyboard: !0,
          slide: !1,
          pause: "hover",
          wrap: !0
        },
        l = {
          interval: "(number|boolean)",
          keyboard: "boolean",
          slide: "(boolean|string)",
          pause: "(string|boolean)",
          wrap: "boolean"
        },
        h = "next",
        c = "prev",
        u = "left",
        f = "right",
        d = {
          SLIDE: "slide" + i,
          SLID: "slid" + i,
          KEYDOWN: "keydown" + i,
          MOUSEENTER: "mouseenter" + i,
          MOUSELEAVE: "mouseleave" + i,
          TOUCHEND: "touchend" + i,
          LOAD_DATA_API: "load" + i + ".data-api",
          CLICK_DATA_API: "click" + i + ".data-api"
        },
        _ = "carousel",
        g = "active",
        p = "slide",
        m = "carousel-item-right",
        v = "carousel-item-left",
        E = "carousel-item-next",
        T = "carousel-item-prev",
        y = {
          ACTIVE: ".active",
          ACTIVE_ITEM: ".active.carousel-item",
          ITEM: ".carousel-item",
          NEXT_PREV: ".carousel-item-next, .carousel-item-prev",
          INDICATORS: ".carousel-indicators",
          DATA_SLIDE: "[data-slide], [data-slide-to]",
          DATA_RIDE: '[data-ride="carousel"]'
        },
        C = (function () {
          function o(e, n) {
            (this._items = null),
              (this._interval = null),
              (this._activeElement = null),
              (this._isPaused = !1),
              (this._isSliding = !1),
              (this.touchTimeout = null),
              (this._config = this._getConfig(n)),
              (this._element = t(e)[0]),
              (this._indicatorsElement = t(this._element).find(
                y.INDICATORS
              )[0]),
              this._addEventListeners();
          }
          var C = o.prototype;
          return (
            (C.next = function () {
              this._isSliding || this._slide(h);
            }),
            (C.nextWhenVisible = function () {
              !document.hidden &&
                t(this._element).is(":visible") &&
                "hidden" !== t(this._element).css("visibility") &&
                this.next();
            }),
            (C.prev = function () {
              this._isSliding || this._slide(c);
            }),
            (C.pause = function (e) {
              e || (this._isPaused = !0),
                t(this._element).find(y.NEXT_PREV)[0] &&
                  P.supportsTransitionEnd() &&
                  (P.triggerTransitionEnd(this._element), this.cycle(!0)),
                clearInterval(this._interval),
                (this._interval = null);
            }),
            (C.cycle = function (t) {
              t || (this._isPaused = !1),
                this._interval &&
                  (clearInterval(this._interval), (this._interval = null)),
                this._config.interval &&
                  !this._isPaused &&
                  (this._interval = setInterval(
                    (document.visibilityState
                      ? this.nextWhenVisible
                      : this.next
                    ).bind(this),
                    this._config.interval
                  ));
            }),
            (C.to = function (e) {
              var n = this;
              this._activeElement = t(this._element).find(y.ACTIVE_ITEM)[0];
              var i = this._getItemIndex(this._activeElement);
              if (!(e > this._items.length - 1 || e < 0))
                if (this._isSliding)
                  t(this._element).one(d.SLID, function () {
                    return n.to(e);
                  });
                else {
                  if (i === e) return this.pause(), void this.cycle();
                  var s = e > i ? h : c;
                  this._slide(s, this._items[e]);
                }
            }),
            (C.dispose = function () {
              t(this._element).off(i),
                t.removeData(this._element, n),
                (this._items = null),
                (this._config = null),
                (this._element = null),
                (this._interval = null),
                (this._isPaused = null),
                (this._isSliding = null),
                (this._activeElement = null),
                (this._indicatorsElement = null);
            }),
            (C._getConfig = function (t) {
              return (t = r({}, a, t)), P.typeCheckConfig(e, t, l), t;
            }),
            (C._addEventListeners = function () {
              var e = this;
              this._config.keyboard &&
                t(this._element).on(d.KEYDOWN, function (t) {
                  return e._keydown(t);
                }),
                "hover" === this._config.pause &&
                  (t(this._element)
                    .on(d.MOUSEENTER, function (t) {
                      return e.pause(t);
                    })
                    .on(d.MOUSELEAVE, function (t) {
                      return e.cycle(t);
                    }),
                  "ontouchstart" in document.documentElement &&
                    t(this._element).on(d.TOUCHEND, function () {
                      e.pause(),
                        e.touchTimeout && clearTimeout(e.touchTimeout),
                        (e.touchTimeout = setTimeout(function (t) {
                          return e.cycle(t);
                        }, 500 + e._config.interval));
                    }));
            }),
            (C._keydown = function (t) {
              if (!/input|textarea/i.test(t.target.tagName))
                switch (t.which) {
                  case 37:
                    t.preventDefault(), this.prev();
                    break;
                  case 39:
                    t.preventDefault(), this.next();
                }
            }),
            (C._getItemIndex = function (e) {
              return (
                (this._items = t.makeArray(t(e).parent().find(y.ITEM))),
                this._items.indexOf(e)
              );
            }),
            (C._getItemByDirection = function (t, e) {
              var n = t === h,
                i = t === c,
                s = this._getItemIndex(e),
                r = this._items.length - 1;
              if (((i && 0 === s) || (n && s === r)) && !this._config.wrap)
                return e;
              var o = (s + (t === c ? -1 : 1)) % this._items.length;
              return -1 === o
                ? this._items[this._items.length - 1]
                : this._items[o];
            }),
            (C._triggerSlideEvent = function (e, n) {
              var i = this._getItemIndex(e),
                s = this._getItemIndex(t(this._element).find(y.ACTIVE_ITEM)[0]),
                r = t.Event(d.SLIDE, {
                  relatedTarget: e,
                  direction: n,
                  from: s,
                  to: i
                });
              return t(this._element).trigger(r), r;
            }),
            (C._setActiveIndicatorElement = function (e) {
              if (this._indicatorsElement) {
                t(this._indicatorsElement).find(y.ACTIVE).removeClass(g);
                var n = this._indicatorsElement.children[this._getItemIndex(e)];
                n && t(n).addClass(g);
              }
            }),
            (C._slide = function (e, n) {
              var i,
                s,
                r,
                o = this,
                a = t(this._element).find(y.ACTIVE_ITEM)[0],
                l = this._getItemIndex(a),
                c = n || (a && this._getItemByDirection(e, a)),
                _ = this._getItemIndex(c),
                C = Boolean(this._interval);
              if (
                (e === h
                  ? ((i = v), (s = E), (r = u))
                  : ((i = m), (s = T), (r = f)),
                c && t(c).hasClass(g))
              )
                this._isSliding = !1;
              else if (
                !this._triggerSlideEvent(c, r).isDefaultPrevented() &&
                a &&
                c
              ) {
                (this._isSliding = !0),
                  C && this.pause(),
                  this._setActiveIndicatorElement(c);
                var I = t.Event(d.SLID, {
                  relatedTarget: c,
                  direction: r,
                  from: l,
                  to: _
                });
                P.supportsTransitionEnd() && t(this._element).hasClass(p)
                  ? (t(c).addClass(s),
                    P.reflow(c),
                    t(a).addClass(i),
                    t(c).addClass(i),
                    t(a)
                      .one(P.TRANSITION_END, function () {
                        t(c)
                          .removeClass(i + " " + s)
                          .addClass(g),
                          t(a).removeClass(g + " " + s + " " + i),
                          (o._isSliding = !1),
                          setTimeout(function () {
                            return t(o._element).trigger(I);
                          }, 0);
                      })
                      .emulateTransitionEnd(600))
                  : (t(a).removeClass(g),
                    t(c).addClass(g),
                    (this._isSliding = !1),
                    t(this._element).trigger(I)),
                  C && this.cycle();
              }
            }),
            (o._jQueryInterface = function (e) {
              return this.each(function () {
                var i = t(this).data(n),
                  s = r({}, a, t(this).data());
                "object" == typeof e && (s = r({}, s, e));
                var l = "string" == typeof e ? e : s.slide;
                if (
                  (i || ((i = new o(this, s)), t(this).data(n, i)),
                  "number" == typeof e)
                )
                  i.to(e);
                else if ("string" == typeof l) {
                  if ("undefined" == typeof i[l])
                    throw new TypeError('No method named "' + l + '"');
                  i[l]();
                } else s.interval && (i.pause(), i.cycle());
              });
            }),
            (o._dataApiClickHandler = function (e) {
              var i = P.getSelectorFromElement(this);
              if (i) {
                var s = t(i)[0];
                if (s && t(s).hasClass(_)) {
                  var a = r({}, t(s).data(), t(this).data()),
                    l = this.getAttribute("data-slide-to");
                  l && (a.interval = !1),
                    o._jQueryInterface.call(t(s), a),
                    l && t(s).data(n).to(l),
                    e.preventDefault();
                }
              }
            }),
            s(o, null, [
              {
                key: "VERSION",
                get: function () {
                  return "4.0.0";
                }
              },
              {
                key: "Default",
                get: function () {
                  return a;
                }
              }
            ]),
            o
          );
        })();
      return (
        t(document).on(d.CLICK_DATA_API, y.DATA_SLIDE, C._dataApiClickHandler),
        t(window).on(d.LOAD_DATA_API, function () {
          t(y.DATA_RIDE).each(function () {
            var e = t(this);
            C._jQueryInterface.call(e, e.data());
          });
        }),
        (t.fn[e] = C._jQueryInterface),
        (t.fn[e].Constructor = C),
        (t.fn[e].noConflict = function () {
          return (t.fn[e] = o), C._jQueryInterface;
        }),
        C
      );
    })(e),
    H = (function (t) {
      var e = "collapse",
        n = "bs.collapse",
        i = "." + n,
        o = t.fn[e],
        a = { toggle: !0, parent: "" },
        l = { toggle: "boolean", parent: "(string|element)" },
        h = {
          SHOW: "show" + i,
          SHOWN: "shown" + i,
          HIDE: "hide" + i,
          HIDDEN: "hidden" + i,
          CLICK_DATA_API: "click" + i + ".data-api"
        },
        c = "show",
        u = "collapse",
        f = "collapsing",
        d = "collapsed",
        _ = "width",
        g = "height",
        p = {
          ACTIVES: ".show, .collapsing",
          DATA_TOGGLE: '[data-toggle="collapse"]'
        },
        m = (function () {
          function i(e, n) {
            (this._isTransitioning = !1),
              (this._element = e),
              (this._config = this._getConfig(n)),
              (this._triggerArray = t.makeArray(
                t(
                  '[data-toggle="collapse"][href="#' +
                    e.id +
                    '"],[data-toggle="collapse"][data-target="#' +
                    e.id +
                    '"]'
                )
              ));
            for (var i = t(p.DATA_TOGGLE), s = 0; s < i.length; s++) {
              var r = i[s],
                o = P.getSelectorFromElement(r);
              null !== o &&
                t(o).filter(e).length > 0 &&
                ((this._selector = o), this._triggerArray.push(r));
            }
            (this._parent = this._config.parent ? this._getParent() : null),
              this._config.parent ||
                this._addAriaAndCollapsedClass(
                  this._element,
                  this._triggerArray
                ),
              this._config.toggle && this.toggle();
          }
          var o = i.prototype;
          return (
            (o.toggle = function () {
              t(this._element).hasClass(c) ? this.hide() : this.show();
            }),
            (o.show = function () {
              var e,
                s,
                r = this;
              if (
                !this._isTransitioning &&
                !t(this._element).hasClass(c) &&
                (this._parent &&
                  0 ===
                    (e = t.makeArray(
                      t(this._parent)
                        .find(p.ACTIVES)
                        .filter('[data-parent="' + this._config.parent + '"]')
                    )).length &&
                  (e = null),
                !(
                  e &&
                  (s = t(e).not(this._selector).data(n)) &&
                  s._isTransitioning
                ))
              ) {
                var o = t.Event(h.SHOW);
                if ((t(this._element).trigger(o), !o.isDefaultPrevented())) {
                  e &&
                    (i._jQueryInterface.call(t(e).not(this._selector), "hide"),
                    s || t(e).data(n, null));
                  var a = this._getDimension();
                  t(this._element).removeClass(u).addClass(f),
                    (this._element.style[a] = 0),
                    this._triggerArray.length > 0 &&
                      t(this._triggerArray)
                        .removeClass(d)
                        .attr("aria-expanded", !0),
                    this.setTransitioning(!0);
                  var l = function () {
                    t(r._element).removeClass(f).addClass(u).addClass(c),
                      (r._element.style[a] = ""),
                      r.setTransitioning(!1),
                      t(r._element).trigger(h.SHOWN);
                  };
                  if (P.supportsTransitionEnd()) {
                    var _ = "scroll" + (a[0].toUpperCase() + a.slice(1));
                    t(this._element)
                      .one(P.TRANSITION_END, l)
                      .emulateTransitionEnd(600),
                      (this._element.style[a] = this._element[_] + "px");
                  } else l();
                }
              }
            }),
            (o.hide = function () {
              var e = this;
              if (!this._isTransitioning && t(this._element).hasClass(c)) {
                var n = t.Event(h.HIDE);
                if ((t(this._element).trigger(n), !n.isDefaultPrevented())) {
                  var i = this._getDimension();
                  if (
                    ((this._element.style[i] =
                      this._element.getBoundingClientRect()[i] + "px"),
                    P.reflow(this._element),
                    t(this._element).addClass(f).removeClass(u).removeClass(c),
                    this._triggerArray.length > 0)
                  )
                    for (var s = 0; s < this._triggerArray.length; s++) {
                      var r = this._triggerArray[s],
                        o = P.getSelectorFromElement(r);
                      if (null !== o)
                        t(o).hasClass(c) ||
                          t(r).addClass(d).attr("aria-expanded", !1);
                    }
                  this.setTransitioning(!0);
                  var a = function () {
                    e.setTransitioning(!1),
                      t(e._element)
                        .removeClass(f)
                        .addClass(u)
                        .trigger(h.HIDDEN);
                  };
                  (this._element.style[i] = ""),
                    P.supportsTransitionEnd()
                      ? t(this._element)
                          .one(P.TRANSITION_END, a)
                          .emulateTransitionEnd(600)
                      : a();
                }
              }
            }),
            (o.setTransitioning = function (t) {
              this._isTransitioning = t;
            }),
            (o.dispose = function () {
              t.removeData(this._element, n),
                (this._config = null),
                (this._parent = null),
                (this._element = null),
                (this._triggerArray = null),
                (this._isTransitioning = null);
            }),
            (o._getConfig = function (t) {
              return (
                ((t = r({}, a, t)).toggle = Boolean(t.toggle)),
                P.typeCheckConfig(e, t, l),
                t
              );
            }),
            (o._getDimension = function () {
              return t(this._element).hasClass(_) ? _ : g;
            }),
            (o._getParent = function () {
              var e = this,
                n = null;
              P.isElement(this._config.parent)
                ? ((n = this._config.parent),
                  "undefined" != typeof this._config.parent.jquery &&
                    (n = this._config.parent[0]))
                : (n = t(this._config.parent)[0]);
              var s =
                '[data-toggle="collapse"][data-parent="' +
                this._config.parent +
                '"]';
              return (
                t(n)
                  .find(s)
                  .each(function (t, n) {
                    e._addAriaAndCollapsedClass(i._getTargetFromElement(n), [
                      n
                    ]);
                  }),
                n
              );
            }),
            (o._addAriaAndCollapsedClass = function (e, n) {
              if (e) {
                var i = t(e).hasClass(c);
                n.length > 0 &&
                  t(n).toggleClass(d, !i).attr("aria-expanded", i);
              }
            }),
            (i._getTargetFromElement = function (e) {
              var n = P.getSelectorFromElement(e);
              return n ? t(n)[0] : null;
            }),
            (i._jQueryInterface = function (e) {
              return this.each(function () {
                var s = t(this),
                  o = s.data(n),
                  l = r({}, a, s.data(), "object" == typeof e && e);
                if (
                  (!o && l.toggle && /show|hide/.test(e) && (l.toggle = !1),
                  o || ((o = new i(this, l)), s.data(n, o)),
                  "string" == typeof e)
                ) {
                  if ("undefined" == typeof o[e])
                    throw new TypeError('No method named "' + e + '"');
                  o[e]();
                }
              });
            }),
            s(i, null, [
              {
                key: "VERSION",
                get: function () {
                  return "4.0.0";
                }
              },
              {
                key: "Default",
                get: function () {
                  return a;
                }
              }
            ]),
            i
          );
        })();
      return (
        t(document).on(h.CLICK_DATA_API, p.DATA_TOGGLE, function (e) {
          "A" === e.currentTarget.tagName && e.preventDefault();
          var i = t(this),
            s = P.getSelectorFromElement(this);
          t(s).each(function () {
            var e = t(this),
              s = e.data(n) ? "toggle" : i.data();
            m._jQueryInterface.call(e, s);
          });
        }),
        (t.fn[e] = m._jQueryInterface),
        (t.fn[e].Constructor = m),
        (t.fn[e].noConflict = function () {
          return (t.fn[e] = o), m._jQueryInterface;
        }),
        m
      );
    })(e),
    W = (function (t) {
      var e = "dropdown",
        i = "bs.dropdown",
        o = "." + i,
        a = ".data-api",
        l = t.fn[e],
        h = new RegExp("38|40|27"),
        c = {
          HIDE: "hide" + o,
          HIDDEN: "hidden" + o,
          SHOW: "show" + o,
          SHOWN: "shown" + o,
          CLICK: "click" + o,
          CLICK_DATA_API: "click" + o + a,
          KEYDOWN_DATA_API: "keydown" + o + a,
          KEYUP_DATA_API: "keyup" + o + a
        },
        u = "disabled",
        f = "show",
        d = "dropup",
        _ = "dropright",
        g = "dropleft",
        p = "dropdown-menu-right",
        m = "dropdown-menu-left",
        v = "position-static",
        E = '[data-toggle="dropdown"]',
        T = ".dropdown form",
        y = ".dropdown-menu",
        C = ".navbar-nav",
        I = ".dropdown-menu .dropdown-item:not(.disabled)",
        A = "top-start",
        b = "top-end",
        D = "bottom-start",
        S = "bottom-end",
        w = "right-start",
        N = "left-start",
        O = { offset: 0, flip: !0, boundary: "scrollParent" },
        k = {
          offset: "(number|string|function)",
          flip: "boolean",
          boundary: "(string|element)"
        },
        L = (function () {
          function a(t, e) {
            (this._element = t),
              (this._popper = null),
              (this._config = this._getConfig(e)),
              (this._menu = this._getMenuElement()),
              (this._inNavbar = this._detectNavbar()),
              this._addEventListeners();
          }
          var l = a.prototype;
          return (
            (l.toggle = function () {
              if (!this._element.disabled && !t(this._element).hasClass(u)) {
                var e = a._getParentFromElement(this._element),
                  i = t(this._menu).hasClass(f);
                if ((a._clearMenus(), !i)) {
                  var s = { relatedTarget: this._element },
                    r = t.Event(c.SHOW, s);
                  if ((t(e).trigger(r), !r.isDefaultPrevented())) {
                    if (!this._inNavbar) {
                      if ("undefined" == typeof n)
                        throw new TypeError(
                          "Bootstrap dropdown require Popper.js (https://popper.js.org)"
                        );
                      var o = this._element;
                      t(e).hasClass(d) &&
                        (t(this._menu).hasClass(m) ||
                          t(this._menu).hasClass(p)) &&
                        (o = e),
                        "scrollParent" !== this._config.boundary &&
                          t(e).addClass(v),
                        (this._popper = new n(
                          o,
                          this._menu,
                          this._getPopperConfig()
                        ));
                    }
                    "ontouchstart" in document.documentElement &&
                      0 === t(e).closest(C).length &&
                      t("body").children().on("mouseover", null, t.noop),
                      this._element.focus(),
                      this._element.setAttribute("aria-expanded", !0),
                      t(this._menu).toggleClass(f),
                      t(e).toggleClass(f).trigger(t.Event(c.SHOWN, s));
                  }
                }
              }
            }),
            (l.dispose = function () {
              t.removeData(this._element, i),
                t(this._element).off(o),
                (this._element = null),
                (this._menu = null),
                null !== this._popper &&
                  (this._popper.destroy(), (this._popper = null));
            }),
            (l.update = function () {
              (this._inNavbar = this._detectNavbar()),
                null !== this._popper && this._popper.scheduleUpdate();
            }),
            (l._addEventListeners = function () {
              var e = this;
              t(this._element).on(c.CLICK, function (t) {
                t.preventDefault(), t.stopPropagation(), e.toggle();
              });
            }),
            (l._getConfig = function (n) {
              return (
                (n = r(
                  {},
                  this.constructor.Default,
                  t(this._element).data(),
                  n
                )),
                P.typeCheckConfig(e, n, this.constructor.DefaultType),
                n
              );
            }),
            (l._getMenuElement = function () {
              if (!this._menu) {
                var e = a._getParentFromElement(this._element);
                this._menu = t(e).find(y)[0];
              }
              return this._menu;
            }),
            (l._getPlacement = function () {
              var e = t(this._element).parent(),
                n = D;
              return (
                e.hasClass(d)
                  ? ((n = A), t(this._menu).hasClass(p) && (n = b))
                  : e.hasClass(_)
                  ? (n = w)
                  : e.hasClass(g)
                  ? (n = N)
                  : t(this._menu).hasClass(p) && (n = S),
                n
              );
            }),
            (l._detectNavbar = function () {
              return t(this._element).closest(".navbar").length > 0;
            }),
            (l._getPopperConfig = function () {
              var t = this,
                e = {};
              return (
                "function" == typeof this._config.offset
                  ? (e.fn = function (e) {
                      return (
                        (e.offsets = r(
                          {},
                          e.offsets,
                          t._config.offset(e.offsets) || {}
                        )),
                        e
                      );
                    })
                  : (e.offset = this._config.offset),
                {
                  placement: this._getPlacement(),
                  modifiers: {
                    offset: e,
                    flip: { enabled: this._config.flip },
                    preventOverflow: {
                      boundariesElement: this._config.boundary
                    }
                  }
                }
              );
            }),
            (a._jQueryInterface = function (e) {
              return this.each(function () {
                var n = t(this).data(i);
                if (
                  (n ||
                    ((n = new a(this, "object" == typeof e ? e : null)),
                    t(this).data(i, n)),
                  "string" == typeof e)
                ) {
                  if ("undefined" == typeof n[e])
                    throw new TypeError('No method named "' + e + '"');
                  n[e]();
                }
              });
            }),
            (a._clearMenus = function (e) {
              if (
                !e ||
                (3 !== e.which && ("keyup" !== e.type || 9 === e.which))
              )
                for (var n = t.makeArray(t(E)), s = 0; s < n.length; s++) {
                  var r = a._getParentFromElement(n[s]),
                    o = t(n[s]).data(i),
                    l = { relatedTarget: n[s] };
                  if (o) {
                    var h = o._menu;
                    if (
                      t(r).hasClass(f) &&
                      !(
                        e &&
                        (("click" === e.type &&
                          /input|textarea/i.test(e.target.tagName)) ||
                          ("keyup" === e.type && 9 === e.which)) &&
                        t.contains(r, e.target)
                      )
                    ) {
                      var u = t.Event(c.HIDE, l);
                      t(r).trigger(u),
                        u.isDefaultPrevented() ||
                          ("ontouchstart" in document.documentElement &&
                            t("body").children().off("mouseover", null, t.noop),
                          n[s].setAttribute("aria-expanded", "false"),
                          t(h).removeClass(f),
                          t(r).removeClass(f).trigger(t.Event(c.HIDDEN, l)));
                    }
                  }
                }
            }),
            (a._getParentFromElement = function (e) {
              var n,
                i = P.getSelectorFromElement(e);
              return i && (n = t(i)[0]), n || e.parentNode;
            }),
            (a._dataApiKeydownHandler = function (e) {
              if (
                (/input|textarea/i.test(e.target.tagName)
                  ? !(
                      32 === e.which ||
                      (27 !== e.which &&
                        ((40 !== e.which && 38 !== e.which) ||
                          t(e.target).closest(y).length))
                    )
                  : h.test(e.which)) &&
                (e.preventDefault(),
                e.stopPropagation(),
                !this.disabled && !t(this).hasClass(u))
              ) {
                var n = a._getParentFromElement(this),
                  i = t(n).hasClass(f);
                if (
                  (i || (27 === e.which && 32 === e.which)) &&
                  (!i || (27 !== e.which && 32 !== e.which))
                ) {
                  var s = t(n).find(I).get();
                  if (0 !== s.length) {
                    var r = s.indexOf(e.target);
                    38 === e.which && r > 0 && r--,
                      40 === e.which && r < s.length - 1 && r++,
                      r < 0 && (r = 0),
                      s[r].focus();
                  }
                } else {
                  if (27 === e.which) {
                    var o = t(n).find(E)[0];
                    t(o).trigger("focus");
                  }
                  t(this).trigger("click");
                }
              }
            }),
            s(a, null, [
              {
                key: "VERSION",
                get: function () {
                  return "4.0.0";
                }
              },
              {
                key: "Default",
                get: function () {
                  return O;
                }
              },
              {
                key: "DefaultType",
                get: function () {
                  return k;
                }
              }
            ]),
            a
          );
        })();
      return (
        t(document)
          .on(c.KEYDOWN_DATA_API, E, L._dataApiKeydownHandler)
          .on(c.KEYDOWN_DATA_API, y, L._dataApiKeydownHandler)
          .on(c.CLICK_DATA_API + " " + c.KEYUP_DATA_API, L._clearMenus)
          .on(c.CLICK_DATA_API, E, function (e) {
            e.preventDefault(),
              e.stopPropagation(),
              L._jQueryInterface.call(t(this), "toggle");
          })
          .on(c.CLICK_DATA_API, T, function (t) {
            t.stopPropagation();
          }),
        (t.fn[e] = L._jQueryInterface),
        (t.fn[e].Constructor = L),
        (t.fn[e].noConflict = function () {
          return (t.fn[e] = l), L._jQueryInterface;
        }),
        L
      );
    })(e),
    M = (function (t) {
      var e = "modal",
        n = "bs.modal",
        i = "." + n,
        o = t.fn.modal,
        a = { backdrop: !0, keyboard: !0, focus: !0, show: !0 },
        l = {
          backdrop: "(boolean|string)",
          keyboard: "boolean",
          focus: "boolean",
          show: "boolean"
        },
        h = {
          HIDE: "hide" + i,
          HIDDEN: "hidden" + i,
          SHOW: "show" + i,
          SHOWN: "shown" + i,
          FOCUSIN: "focusin" + i,
          RESIZE: "resize" + i,
          CLICK_DISMISS: "click.dismiss" + i,
          KEYDOWN_DISMISS: "keydown.dismiss" + i,
          MOUSEUP_DISMISS: "mouseup.dismiss" + i,
          MOUSEDOWN_DISMISS: "mousedown.dismiss" + i,
          CLICK_DATA_API: "click" + i + ".data-api"
        },
        c = "modal-scrollbar-measure",
        u = "modal-backdrop",
        f = "modal-open",
        d = "fade",
        _ = "show",
        g = {
          DIALOG: ".modal-dialog",
          DATA_TOGGLE: '[data-toggle="modal"]',
          DATA_DISMISS: '[data-dismiss="modal"]',
          FIXED_CONTENT: ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",
          STICKY_CONTENT: ".sticky-top",
          NAVBAR_TOGGLER: ".navbar-toggler"
        },
        p = (function () {
          function o(e, n) {
            (this._config = this._getConfig(n)),
              (this._element = e),
              (this._dialog = t(e).find(g.DIALOG)[0]),
              (this._backdrop = null),
              (this._isShown = !1),
              (this._isBodyOverflowing = !1),
              (this._ignoreBackdropClick = !1),
              (this._originalBodyPadding = 0),
              (this._scrollbarWidth = 0);
          }
          var p = o.prototype;
          return (
            (p.toggle = function (t) {
              return this._isShown ? this.hide() : this.show(t);
            }),
            (p.show = function (e) {
              var n = this;
              if (!this._isTransitioning && !this._isShown) {
                P.supportsTransitionEnd() &&
                  t(this._element).hasClass(d) &&
                  (this._isTransitioning = !0);
                var i = t.Event(h.SHOW, { relatedTarget: e });
                t(this._element).trigger(i),
                  this._isShown ||
                    i.isDefaultPrevented() ||
                    ((this._isShown = !0),
                    this._checkScrollbar(),
                    this._setScrollbar(),
                    this._adjustDialog(),
                    t(document.body).addClass(f),
                    this._setEscapeEvent(),
                    this._setResizeEvent(),
                    t(this._element).on(
                      h.CLICK_DISMISS,
                      g.DATA_DISMISS,
                      function (t) {
                        return n.hide(t);
                      }
                    ),
                    t(this._dialog).on(h.MOUSEDOWN_DISMISS, function () {
                      t(n._element).one(h.MOUSEUP_DISMISS, function (e) {
                        t(e.target).is(n._element) &&
                          (n._ignoreBackdropClick = !0);
                      });
                    }),
                    this._showBackdrop(function () {
                      return n._showElement(e);
                    }));
              }
            }),
            (p.hide = function (e) {
              var n = this;
              if (
                (e && e.preventDefault(),
                !this._isTransitioning && this._isShown)
              ) {
                var i = t.Event(h.HIDE);
                if (
                  (t(this._element).trigger(i),
                  this._isShown && !i.isDefaultPrevented())
                ) {
                  this._isShown = !1;
                  var s =
                    P.supportsTransitionEnd() && t(this._element).hasClass(d);
                  s && (this._isTransitioning = !0),
                    this._setEscapeEvent(),
                    this._setResizeEvent(),
                    t(document).off(h.FOCUSIN),
                    t(this._element).removeClass(_),
                    t(this._element).off(h.CLICK_DISMISS),
                    t(this._dialog).off(h.MOUSEDOWN_DISMISS),
                    s
                      ? t(this._element)
                          .one(P.TRANSITION_END, function (t) {
                            return n._hideModal(t);
                          })
                          .emulateTransitionEnd(300)
                      : this._hideModal();
                }
              }
            }),
            (p.dispose = function () {
              t.removeData(this._element, n),
                t(window, document, this._element, this._backdrop).off(i),
                (this._config = null),
                (this._element = null),
                (this._dialog = null),
                (this._backdrop = null),
                (this._isShown = null),
                (this._isBodyOverflowing = null),
                (this._ignoreBackdropClick = null),
                (this._scrollbarWidth = null);
            }),
            (p.handleUpdate = function () {
              this._adjustDialog();
            }),
            (p._getConfig = function (t) {
              return (t = r({}, a, t)), P.typeCheckConfig(e, t, l), t;
            }),
            (p._showElement = function (e) {
              var n = this,
                i = P.supportsTransitionEnd() && t(this._element).hasClass(d);
              (this._element.parentNode &&
                this._element.parentNode.nodeType === Node.ELEMENT_NODE) ||
                document.body.appendChild(this._element),
                (this._element.style.display = "block"),
                this._element.removeAttribute("aria-hidden"),
                (this._element.scrollTop = 0),
                i && P.reflow(this._element),
                t(this._element).addClass(_),
                this._config.focus && this._enforceFocus();
              var s = t.Event(h.SHOWN, { relatedTarget: e }),
                r = function () {
                  n._config.focus && n._element.focus(),
                    (n._isTransitioning = !1),
                    t(n._element).trigger(s);
                };
              i
                ? t(this._dialog)
                    .one(P.TRANSITION_END, r)
                    .emulateTransitionEnd(300)
                : r();
            }),
            (p._enforceFocus = function () {
              var e = this;
              t(document)
                .off(h.FOCUSIN)
                .on(h.FOCUSIN, function (n) {
                  document !== n.target &&
                    e._element !== n.target &&
                    0 === t(e._element).has(n.target).length &&
                    e._element.focus();
                });
            }),
            (p._setEscapeEvent = function () {
              var e = this;
              this._isShown && this._config.keyboard
                ? t(this._element).on(h.KEYDOWN_DISMISS, function (t) {
                    27 === t.which && (t.preventDefault(), e.hide());
                  })
                : this._isShown || t(this._element).off(h.KEYDOWN_DISMISS);
            }),
            (p._setResizeEvent = function () {
              var e = this;
              this._isShown
                ? t(window).on(h.RESIZE, function (t) {
                    return e.handleUpdate(t);
                  })
                : t(window).off(h.RESIZE);
            }),
            (p._hideModal = function () {
              var e = this;
              (this._element.style.display = "none"),
                this._element.setAttribute("aria-hidden", !0),
                (this._isTransitioning = !1),
                this._showBackdrop(function () {
                  t(document.body).removeClass(f),
                    e._resetAdjustments(),
                    e._resetScrollbar(),
                    t(e._element).trigger(h.HIDDEN);
                });
            }),
            (p._removeBackdrop = function () {
              this._backdrop &&
                (t(this._backdrop).remove(), (this._backdrop = null));
            }),
            (p._showBackdrop = function (e) {
              var n = this,
                i = t(this._element).hasClass(d) ? d : "";
              if (this._isShown && this._config.backdrop) {
                var s = P.supportsTransitionEnd() && i;
                if (
                  ((this._backdrop = document.createElement("div")),
                  (this._backdrop.className = u),
                  i && t(this._backdrop).addClass(i),
                  t(this._backdrop).appendTo(document.body),
                  t(this._element).on(h.CLICK_DISMISS, function (t) {
                    n._ignoreBackdropClick
                      ? (n._ignoreBackdropClick = !1)
                      : t.target === t.currentTarget &&
                        ("static" === n._config.backdrop
                          ? n._element.focus()
                          : n.hide());
                  }),
                  s && P.reflow(this._backdrop),
                  t(this._backdrop).addClass(_),
                  !e)
                )
                  return;
                if (!s) return void e();
                t(this._backdrop)
                  .one(P.TRANSITION_END, e)
                  .emulateTransitionEnd(150);
              } else if (!this._isShown && this._backdrop) {
                t(this._backdrop).removeClass(_);
                var r = function () {
                  n._removeBackdrop(), e && e();
                };
                P.supportsTransitionEnd() && t(this._element).hasClass(d)
                  ? t(this._backdrop)
                      .one(P.TRANSITION_END, r)
                      .emulateTransitionEnd(150)
                  : r();
              } else e && e();
            }),
            (p._adjustDialog = function () {
              var t =
                this._element.scrollHeight >
                document.documentElement.clientHeight;
              !this._isBodyOverflowing &&
                t &&
                (this._element.style.paddingLeft = this._scrollbarWidth + "px"),
                this._isBodyOverflowing &&
                  !t &&
                  (this._element.style.paddingRight =
                    this._scrollbarWidth + "px");
            }),
            (p._resetAdjustments = function () {
              (this._element.style.paddingLeft = ""),
                (this._element.style.paddingRight = "");
            }),
            (p._checkScrollbar = function () {
              var t = document.body.getBoundingClientRect();
              (this._isBodyOverflowing = t.left + t.right < window.innerWidth),
                (this._scrollbarWidth = this._getScrollbarWidth());
            }),
            (p._setScrollbar = function () {
              var e = this;
              if (this._isBodyOverflowing) {
                t(g.FIXED_CONTENT).each(function (n, i) {
                  var s = t(i)[0].style.paddingRight,
                    r = t(i).css("padding-right");
                  t(i)
                    .data("padding-right", s)
                    .css(
                      "padding-right",
                      parseFloat(r) + e._scrollbarWidth + "px"
                    );
                }),
                  t(g.STICKY_CONTENT).each(function (n, i) {
                    var s = t(i)[0].style.marginRight,
                      r = t(i).css("margin-right");
                    t(i)
                      .data("margin-right", s)
                      .css(
                        "margin-right",
                        parseFloat(r) - e._scrollbarWidth + "px"
                      );
                  }),
                  t(g.NAVBAR_TOGGLER).each(function (n, i) {
                    var s = t(i)[0].style.marginRight,
                      r = t(i).css("margin-right");
                    t(i)
                      .data("margin-right", s)
                      .css(
                        "margin-right",
                        parseFloat(r) + e._scrollbarWidth + "px"
                      );
                  });
                var n = document.body.style.paddingRight,
                  i = t("body").css("padding-right");
                t("body")
                  .data("padding-right", n)
                  .css(
                    "padding-right",
                    parseFloat(i) + this._scrollbarWidth + "px"
                  );
              }
            }),
            (p._resetScrollbar = function () {
              t(g.FIXED_CONTENT).each(function (e, n) {
                var i = t(n).data("padding-right");
                "undefined" != typeof i &&
                  t(n).css("padding-right", i).removeData("padding-right");
              }),
                t(g.STICKY_CONTENT + ", " + g.NAVBAR_TOGGLER).each(function (
                  e,
                  n
                ) {
                  var i = t(n).data("margin-right");
                  "undefined" != typeof i &&
                    t(n).css("margin-right", i).removeData("margin-right");
                });
              var e = t("body").data("padding-right");
              "undefined" != typeof e &&
                t("body").css("padding-right", e).removeData("padding-right");
            }),
            (p._getScrollbarWidth = function () {
              var t = document.createElement("div");
              (t.className = c), document.body.appendChild(t);
              var e = t.getBoundingClientRect().width - t.clientWidth;
              return document.body.removeChild(t), e;
            }),
            (o._jQueryInterface = function (e, i) {
              return this.each(function () {
                var s = t(this).data(n),
                  a = r(
                    {},
                    o.Default,
                    t(this).data(),
                    "object" == typeof e && e
                  );
                if (
                  (s || ((s = new o(this, a)), t(this).data(n, s)),
                  "string" == typeof e)
                ) {
                  if ("undefined" == typeof s[e])
                    throw new TypeError('No method named "' + e + '"');
                  s[e](i);
                } else a.show && s.show(i);
              });
            }),
            s(o, null, [
              {
                key: "VERSION",
                get: function () {
                  return "4.0.0";
                }
              },
              {
                key: "Default",
                get: function () {
                  return a;
                }
              }
            ]),
            o
          );
        })();
      return (
        t(document).on(h.CLICK_DATA_API, g.DATA_TOGGLE, function (e) {
          var i,
            s = this,
            o = P.getSelectorFromElement(this);
          o && (i = t(o)[0]);
          var a = t(i).data(n) ? "toggle" : r({}, t(i).data(), t(this).data());
          ("A" !== this.tagName && "AREA" !== this.tagName) ||
            e.preventDefault();
          var l = t(i).one(h.SHOW, function (e) {
            e.isDefaultPrevented() ||
              l.one(h.HIDDEN, function () {
                t(s).is(":visible") && s.focus();
              });
          });
          p._jQueryInterface.call(t(i), a, this);
        }),
        (t.fn.modal = p._jQueryInterface),
        (t.fn.modal.Constructor = p),
        (t.fn.modal.noConflict = function () {
          return (t.fn.modal = o), p._jQueryInterface;
        }),
        p
      );
    })(e),
    U = (function (t) {
      var e = "tooltip",
        i = "bs.tooltip",
        o = "." + i,
        a = t.fn[e],
        l = new RegExp("(^|\\s)bs-tooltip\\S+", "g"),
        h = {
          animation: "boolean",
          template: "string",
          title: "(string|element|function)",
          trigger: "string",
          delay: "(number|object)",
          html: "boolean",
          selector: "(string|boolean)",
          placement: "(string|function)",
          offset: "(number|string)",
          container: "(string|element|boolean)",
          fallbackPlacement: "(string|array)",
          boundary: "(string|element)"
        },
        c = {
          AUTO: "auto",
          TOP: "top",
          RIGHT: "right",
          BOTTOM: "bottom",
          LEFT: "left"
        },
        u = {
          animation: !0,
          template:
            '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
          trigger: "hover focus",
          title: "",
          delay: 0,
          html: !1,
          selector: !1,
          placement: "top",
          offset: 0,
          container: !1,
          fallbackPlacement: "flip",
          boundary: "scrollParent"
        },
        f = "show",
        d = "out",
        _ = {
          HIDE: "hide" + o,
          HIDDEN: "hidden" + o,
          SHOW: "show" + o,
          SHOWN: "shown" + o,
          INSERTED: "inserted" + o,
          CLICK: "click" + o,
          FOCUSIN: "focusin" + o,
          FOCUSOUT: "focusout" + o,
          MOUSEENTER: "mouseenter" + o,
          MOUSELEAVE: "mouseleave" + o
        },
        g = "fade",
        p = "show",
        m = ".tooltip-inner",
        v = ".arrow",
        E = "hover",
        T = "focus",
        y = "click",
        C = "manual",
        I = (function () {
          function a(t, e) {
            if ("undefined" == typeof n)
              throw new TypeError(
                "Bootstrap tooltips require Popper.js (https://popper.js.org)"
              );
            (this._isEnabled = !0),
              (this._timeout = 0),
              (this._hoverState = ""),
              (this._activeTrigger = {}),
              (this._popper = null),
              (this.element = t),
              (this.config = this._getConfig(e)),
              (this.tip = null),
              this._setListeners();
          }
          var I = a.prototype;
          return (
            (I.enable = function () {
              this._isEnabled = !0;
            }),
            (I.disable = function () {
              this._isEnabled = !1;
            }),
            (I.toggleEnabled = function () {
              this._isEnabled = !this._isEnabled;
            }),
            (I.toggle = function (e) {
              if (this._isEnabled)
                if (e) {
                  var n = this.constructor.DATA_KEY,
                    i = t(e.currentTarget).data(n);
                  i ||
                    ((i = new this.constructor(
                      e.currentTarget,
                      this._getDelegateConfig()
                    )),
                    t(e.currentTarget).data(n, i)),
                    (i._activeTrigger.click = !i._activeTrigger.click),
                    i._isWithActiveTrigger()
                      ? i._enter(null, i)
                      : i._leave(null, i);
                } else {
                  if (t(this.getTipElement()).hasClass(p))
                    return void this._leave(null, this);
                  this._enter(null, this);
                }
            }),
            (I.dispose = function () {
              clearTimeout(this._timeout),
                t.removeData(this.element, this.constructor.DATA_KEY),
                t(this.element).off(this.constructor.EVENT_KEY),
                t(this.element).closest(".modal").off("hide.bs.modal"),
                this.tip && t(this.tip).remove(),
                (this._isEnabled = null),
                (this._timeout = null),
                (this._hoverState = null),
                (this._activeTrigger = null),
                null !== this._popper && this._popper.destroy(),
                (this._popper = null),
                (this.element = null),
                (this.config = null),
                (this.tip = null);
            }),
            (I.show = function () {
              var e = this;
              if ("none" === t(this.element).css("display"))
                throw new Error("Please use show on visible elements");
              var i = t.Event(this.constructor.Event.SHOW);
              if (this.isWithContent() && this._isEnabled) {
                t(this.element).trigger(i);
                var s = t.contains(
                  this.element.ownerDocument.documentElement,
                  this.element
                );
                if (i.isDefaultPrevented() || !s) return;
                var r = this.getTipElement(),
                  o = P.getUID(this.constructor.NAME);
                r.setAttribute("id", o),
                  this.element.setAttribute("aria-describedby", o),
                  this.setContent(),
                  this.config.animation && t(r).addClass(g);
                var l =
                    "function" == typeof this.config.placement
                      ? this.config.placement.call(this, r, this.element)
                      : this.config.placement,
                  h = this._getAttachment(l);
                this.addAttachmentClass(h);
                var c =
                  !1 === this.config.container
                    ? document.body
                    : t(this.config.container);
                t(r).data(this.constructor.DATA_KEY, this),
                  t.contains(
                    this.element.ownerDocument.documentElement,
                    this.tip
                  ) || t(r).appendTo(c),
                  t(this.element).trigger(this.constructor.Event.INSERTED),
                  (this._popper = new n(this.element, r, {
                    placement: h,
                    modifiers: {
                      offset: { offset: this.config.offset },
                      flip: { behavior: this.config.fallbackPlacement },
                      arrow: { element: v },
                      preventOverflow: {
                        boundariesElement: this.config.boundary
                      }
                    },
                    onCreate: function (t) {
                      t.originalPlacement !== t.placement &&
                        e._handlePopperPlacementChange(t);
                    },
                    onUpdate: function (t) {
                      e._handlePopperPlacementChange(t);
                    }
                  })),
                  t(r).addClass(p),
                  "ontouchstart" in document.documentElement &&
                    t("body").children().on("mouseover", null, t.noop);
                var u = function () {
                  e.config.animation && e._fixTransition();
                  var n = e._hoverState;
                  (e._hoverState = null),
                    t(e.element).trigger(e.constructor.Event.SHOWN),
                    n === d && e._leave(null, e);
                };
                P.supportsTransitionEnd() && t(this.tip).hasClass(g)
                  ? t(this.tip)
                      .one(P.TRANSITION_END, u)
                      .emulateTransitionEnd(a._TRANSITION_DURATION)
                  : u();
              }
            }),
            (I.hide = function (e) {
              var n = this,
                i = this.getTipElement(),
                s = t.Event(this.constructor.Event.HIDE),
                r = function () {
                  n._hoverState !== f &&
                    i.parentNode &&
                    i.parentNode.removeChild(i),
                    n._cleanTipClass(),
                    n.element.removeAttribute("aria-describedby"),
                    t(n.element).trigger(n.constructor.Event.HIDDEN),
                    null !== n._popper && n._popper.destroy(),
                    e && e();
                };
              t(this.element).trigger(s),
                s.isDefaultPrevented() ||
                  (t(i).removeClass(p),
                  "ontouchstart" in document.documentElement &&
                    t("body").children().off("mouseover", null, t.noop),
                  (this._activeTrigger[y] = !1),
                  (this._activeTrigger[T] = !1),
                  (this._activeTrigger[E] = !1),
                  P.supportsTransitionEnd() && t(this.tip).hasClass(g)
                    ? t(i).one(P.TRANSITION_END, r).emulateTransitionEnd(150)
                    : r(),
                  (this._hoverState = ""));
            }),
            (I.update = function () {
              null !== this._popper && this._popper.scheduleUpdate();
            }),
            (I.isWithContent = function () {
              return Boolean(this.getTitle());
            }),
            (I.addAttachmentClass = function (e) {
              t(this.getTipElement()).addClass("bs-tooltip-" + e);
            }),
            (I.getTipElement = function () {
              return (
                (this.tip = this.tip || t(this.config.template)[0]), this.tip
              );
            }),
            (I.setContent = function () {
              var e = t(this.getTipElement());
              this.setElementContent(e.find(m), this.getTitle()),
                e.removeClass(g + " " + p);
            }),
            (I.setElementContent = function (e, n) {
              var i = this.config.html;
              "object" == typeof n && (n.nodeType || n.jquery)
                ? i
                  ? t(n).parent().is(e) || e.empty().append(n)
                  : e.text(t(n).text())
                : e[i ? "html" : "text"](n);
            }),
            (I.getTitle = function () {
              var t = this.element.getAttribute("data-original-title");
              return (
                t ||
                  (t =
                    "function" == typeof this.config.title
                      ? this.config.title.call(this.element)
                      : this.config.title),
                t
              );
            }),
            (I._getAttachment = function (t) {
              return c[t.toUpperCase()];
            }),
            (I._setListeners = function () {
              var e = this;
              this.config.trigger.split(" ").forEach(function (n) {
                if ("click" === n)
                  t(e.element).on(
                    e.constructor.Event.CLICK,
                    e.config.selector,
                    function (t) {
                      return e.toggle(t);
                    }
                  );
                else if (n !== C) {
                  var i =
                      n === E
                        ? e.constructor.Event.MOUSEENTER
                        : e.constructor.Event.FOCUSIN,
                    s =
                      n === E
                        ? e.constructor.Event.MOUSELEAVE
                        : e.constructor.Event.FOCUSOUT;
                  t(e.element)
                    .on(i, e.config.selector, function (t) {
                      return e._enter(t);
                    })
                    .on(s, e.config.selector, function (t) {
                      return e._leave(t);
                    });
                }
                t(e.element)
                  .closest(".modal")
                  .on("hide.bs.modal", function () {
                    return e.hide();
                  });
              }),
                this.config.selector
                  ? (this.config = r({}, this.config, {
                      trigger: "manual",
                      selector: ""
                    }))
                  : this._fixTitle();
            }),
            (I._fixTitle = function () {
              var t = typeof this.element.getAttribute("data-original-title");
              (this.element.getAttribute("title") || "string" !== t) &&
                (this.element.setAttribute(
                  "data-original-title",
                  this.element.getAttribute("title") || ""
                ),
                this.element.setAttribute("title", ""));
            }),
            (I._enter = function (e, n) {
              var i = this.constructor.DATA_KEY;
              (n = n || t(e.currentTarget).data(i)) ||
                ((n = new this.constructor(
                  e.currentTarget,
                  this._getDelegateConfig()
                )),
                t(e.currentTarget).data(i, n)),
                e && (n._activeTrigger["focusin" === e.type ? T : E] = !0),
                t(n.getTipElement()).hasClass(p) || n._hoverState === f
                  ? (n._hoverState = f)
                  : (clearTimeout(n._timeout),
                    (n._hoverState = f),
                    n.config.delay && n.config.delay.show
                      ? (n._timeout = setTimeout(function () {
                          n._hoverState === f && n.show();
                        }, n.config.delay.show))
                      : n.show());
            }),
            (I._leave = function (e, n) {
              var i = this.constructor.DATA_KEY;
              (n = n || t(e.currentTarget).data(i)) ||
                ((n = new this.constructor(
                  e.currentTarget,
                  this._getDelegateConfig()
                )),
                t(e.currentTarget).data(i, n)),
                e && (n._activeTrigger["focusout" === e.type ? T : E] = !1),
                n._isWithActiveTrigger() ||
                  (clearTimeout(n._timeout),
                  (n._hoverState = d),
                  n.config.delay && n.config.delay.hide
                    ? (n._timeout = setTimeout(function () {
                        n._hoverState === d && n.hide();
                      }, n.config.delay.hide))
                    : n.hide());
            }),
            (I._isWithActiveTrigger = function () {
              for (var t in this._activeTrigger)
                if (this._activeTrigger[t]) return !0;
              return !1;
            }),
            (I._getConfig = function (n) {
              return (
                "number" ==
                  typeof (n = r(
                    {},
                    this.constructor.Default,
                    t(this.element).data(),
                    n
                  )).delay && (n.delay = { show: n.delay, hide: n.delay }),
                "number" == typeof n.title && (n.title = n.title.toString()),
                "number" == typeof n.content &&
                  (n.content = n.content.toString()),
                P.typeCheckConfig(e, n, this.constructor.DefaultType),
                n
              );
            }),
            (I._getDelegateConfig = function () {
              var t = {};
              if (this.config)
                for (var e in this.config)
                  this.constructor.Default[e] !== this.config[e] &&
                    (t[e] = this.config[e]);
              return t;
            }),
            (I._cleanTipClass = function () {
              var e = t(this.getTipElement()),
                n = e.attr("class").match(l);
              null !== n && n.length > 0 && e.removeClass(n.join(""));
            }),
            (I._handlePopperPlacementChange = function (t) {
              this._cleanTipClass(),
                this.addAttachmentClass(this._getAttachment(t.placement));
            }),
            (I._fixTransition = function () {
              var e = this.getTipElement(),
                n = this.config.animation;
              null === e.getAttribute("x-placement") &&
                (t(e).removeClass(g),
                (this.config.animation = !1),
                this.hide(),
                this.show(),
                (this.config.animation = n));
            }),
            (a._jQueryInterface = function (e) {
              return this.each(function () {
                var n = t(this).data(i),
                  s = "object" == typeof e && e;
                if (
                  (n || !/dispose|hide/.test(e)) &&
                  (n || ((n = new a(this, s)), t(this).data(i, n)),
                  "string" == typeof e)
                ) {
                  if ("undefined" == typeof n[e])
                    throw new TypeError('No method named "' + e + '"');
                  n[e]();
                }
              });
            }),
            s(a, null, [
              {
                key: "VERSION",
                get: function () {
                  return "4.0.0";
                }
              },
              {
                key: "Default",
                get: function () {
                  return u;
                }
              },
              {
                key: "NAME",
                get: function () {
                  return e;
                }
              },
              {
                key: "DATA_KEY",
                get: function () {
                  return i;
                }
              },
              {
                key: "Event",
                get: function () {
                  return _;
                }
              },
              {
                key: "EVENT_KEY",
                get: function () {
                  return o;
                }
              },
              {
                key: "DefaultType",
                get: function () {
                  return h;
                }
              }
            ]),
            a
          );
        })();
      return (
        (t.fn[e] = I._jQueryInterface),
        (t.fn[e].Constructor = I),
        (t.fn[e].noConflict = function () {
          return (t.fn[e] = a), I._jQueryInterface;
        }),
        I
      );
    })(e),
    x = (function (t) {
      var e = "popover",
        n = "bs.popover",
        i = "." + n,
        o = t.fn[e],
        a = new RegExp("(^|\\s)bs-popover\\S+", "g"),
        l = r({}, U.Default, {
          placement: "right",
          trigger: "click",
          content: "",
          template:
            '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
        }),
        h = r({}, U.DefaultType, { content: "(string|element|function)" }),
        c = "fade",
        u = "show",
        f = ".popover-header",
        d = ".popover-body",
        _ = {
          HIDE: "hide" + i,
          HIDDEN: "hidden" + i,
          SHOW: "show" + i,
          SHOWN: "shown" + i,
          INSERTED: "inserted" + i,
          CLICK: "click" + i,
          FOCUSIN: "focusin" + i,
          FOCUSOUT: "focusout" + i,
          MOUSEENTER: "mouseenter" + i,
          MOUSELEAVE: "mouseleave" + i
        },
        g = (function (r) {
          var o, g;
          function p() {
            return r.apply(this, arguments) || this;
          }
          (g = r),
            ((o = p).prototype = Object.create(g.prototype)),
            (o.prototype.constructor = o),
            (o.__proto__ = g);
          var m = p.prototype;
          return (
            (m.isWithContent = function () {
              return this.getTitle() || this._getContent();
            }),
            (m.addAttachmentClass = function (e) {
              t(this.getTipElement()).addClass("bs-popover-" + e);
            }),
            (m.getTipElement = function () {
              return (
                (this.tip = this.tip || t(this.config.template)[0]), this.tip
              );
            }),
            (m.setContent = function () {
              var e = t(this.getTipElement());
              this.setElementContent(e.find(f), this.getTitle());
              var n = this._getContent();
              "function" == typeof n && (n = n.call(this.element)),
                this.setElementContent(e.find(d), n),
                e.removeClass(c + " " + u);
            }),
            (m._getContent = function () {
              return (
                this.element.getAttribute("data-content") || this.config.content
              );
            }),
            (m._cleanTipClass = function () {
              var e = t(this.getTipElement()),
                n = e.attr("class").match(a);
              null !== n && n.length > 0 && e.removeClass(n.join(""));
            }),
            (p._jQueryInterface = function (e) {
              return this.each(function () {
                var i = t(this).data(n),
                  s = "object" == typeof e ? e : null;
                if (
                  (i || !/destroy|hide/.test(e)) &&
                  (i || ((i = new p(this, s)), t(this).data(n, i)),
                  "string" == typeof e)
                ) {
                  if ("undefined" == typeof i[e])
                    throw new TypeError('No method named "' + e + '"');
                  i[e]();
                }
              });
            }),
            s(p, null, [
              {
                key: "VERSION",
                get: function () {
                  return "4.0.0";
                }
              },
              {
                key: "Default",
                get: function () {
                  return l;
                }
              },
              {
                key: "NAME",
                get: function () {
                  return e;
                }
              },
              {
                key: "DATA_KEY",
                get: function () {
                  return n;
                }
              },
              {
                key: "Event",
                get: function () {
                  return _;
                }
              },
              {
                key: "EVENT_KEY",
                get: function () {
                  return i;
                }
              },
              {
                key: "DefaultType",
                get: function () {
                  return h;
                }
              }
            ]),
            p
          );
        })(U);
      return (
        (t.fn[e] = g._jQueryInterface),
        (t.fn[e].Constructor = g),
        (t.fn[e].noConflict = function () {
          return (t.fn[e] = o), g._jQueryInterface;
        }),
        g
      );
    })(e),
    K = (function (t) {
      var e = "scrollspy",
        n = "bs.scrollspy",
        i = "." + n,
        o = t.fn[e],
        a = { offset: 10, method: "auto", target: "" },
        l = { offset: "number", method: "string", target: "(string|element)" },
        h = {
          ACTIVATE: "activate" + i,
          SCROLL: "scroll" + i,
          LOAD_DATA_API: "load" + i + ".data-api"
        },
        c = "dropdown-item",
        u = "active",
        f = {
          DATA_SPY: '[data-spy="scroll"]',
          ACTIVE: ".active",
          NAV_LIST_GROUP: ".nav, .list-group",
          NAV_LINKS: ".nav-link",
          NAV_ITEMS: ".nav-item",
          LIST_ITEMS: ".list-group-item",
          DROPDOWN: ".dropdown",
          DROPDOWN_ITEMS: ".dropdown-item",
          DROPDOWN_TOGGLE: ".dropdown-toggle"
        },
        d = "offset",
        _ = "position",
        g = (function () {
          function o(e, n) {
            var i = this;
            (this._element = e),
              (this._scrollElement = "BODY" === e.tagName ? window : e),
              (this._config = this._getConfig(n)),
              (this._selector =
                this._config.target +
                " " +
                f.NAV_LINKS +
                "," +
                this._config.target +
                " " +
                f.LIST_ITEMS +
                "," +
                this._config.target +
                " " +
                f.DROPDOWN_ITEMS),
              (this._offsets = []),
              (this._targets = []),
              (this._activeTarget = null),
              (this._scrollHeight = 0),
              t(this._scrollElement).on(h.SCROLL, function (t) {
                return i._process(t);
              }),
              this.refresh(),
              this._process();
          }
          var g = o.prototype;
          return (
            (g.refresh = function () {
              var e = this,
                n = this._scrollElement === this._scrollElement.window ? d : _,
                i = "auto" === this._config.method ? n : this._config.method,
                s = i === _ ? this._getScrollTop() : 0;
              (this._offsets = []),
                (this._targets = []),
                (this._scrollHeight = this._getScrollHeight()),
                t
                  .makeArray(t(this._selector))
                  .map(function (e) {
                    var n,
                      r = P.getSelectorFromElement(e);
                    if ((r && (n = t(r)[0]), n)) {
                      var o = n.getBoundingClientRect();
                      if (o.width || o.height) return [t(n)[i]().top + s, r];
                    }
                    return null;
                  })
                  .filter(function (t) {
                    return t;
                  })
                  .sort(function (t, e) {
                    return t[0] - e[0];
                  })
                  .forEach(function (t) {
                    e._offsets.push(t[0]), e._targets.push(t[1]);
                  });
            }),
            (g.dispose = function () {
              t.removeData(this._element, n),
                t(this._scrollElement).off(i),
                (this._element = null),
                (this._scrollElement = null),
                (this._config = null),
                (this._selector = null),
                (this._offsets = null),
                (this._targets = null),
                (this._activeTarget = null),
                (this._scrollHeight = null);
            }),
            (g._getConfig = function (n) {
              if ("string" != typeof (n = r({}, a, n)).target) {
                var i = t(n.target).attr("id");
                i || ((i = P.getUID(e)), t(n.target).attr("id", i)),
                  (n.target = "#" + i);
              }
              return P.typeCheckConfig(e, n, l), n;
            }),
            (g._getScrollTop = function () {
              return this._scrollElement === window
                ? this._scrollElement.pageYOffset
                : this._scrollElement.scrollTop;
            }),
            (g._getScrollHeight = function () {
              return (
                this._scrollElement.scrollHeight ||
                Math.max(
                  document.body.scrollHeight,
                  document.documentElement.scrollHeight
                )
              );
            }),
            (g._getOffsetHeight = function () {
              return this._scrollElement === window
                ? window.innerHeight
                : this._scrollElement.getBoundingClientRect().height;
            }),
            (g._process = function () {
              var t = this._getScrollTop() + this._config.offset,
                e = this._getScrollHeight(),
                n = this._config.offset + e - this._getOffsetHeight();
              if ((this._scrollHeight !== e && this.refresh(), t >= n)) {
                var i = this._targets[this._targets.length - 1];
                this._activeTarget !== i && this._activate(i);
              } else {
                if (
                  this._activeTarget &&
                  t < this._offsets[0] &&
                  this._offsets[0] > 0
                )
                  return (this._activeTarget = null), void this._clear();
                for (var s = this._offsets.length; s--; ) {
                  this._activeTarget !== this._targets[s] &&
                    t >= this._offsets[s] &&
                    ("undefined" == typeof this._offsets[s + 1] ||
                      t < this._offsets[s + 1]) &&
                    this._activate(this._targets[s]);
                }
              }
            }),
            (g._activate = function (e) {
              (this._activeTarget = e), this._clear();
              var n = this._selector.split(",");
              n = n.map(function (t) {
                return (
                  t + '[data-target="' + e + '"],' + t + '[href="' + e + '"]'
                );
              });
              var i = t(n.join(","));
              i.hasClass(c)
                ? (i.closest(f.DROPDOWN).find(f.DROPDOWN_TOGGLE).addClass(u),
                  i.addClass(u))
                : (i.addClass(u),
                  i
                    .parents(f.NAV_LIST_GROUP)
                    .prev(f.NAV_LINKS + ", " + f.LIST_ITEMS)
                    .addClass(u),
                  i
                    .parents(f.NAV_LIST_GROUP)
                    .prev(f.NAV_ITEMS)
                    .children(f.NAV_LINKS)
                    .addClass(u)),
                t(this._scrollElement).trigger(h.ACTIVATE, {
                  relatedTarget: e
                });
            }),
            (g._clear = function () {
              t(this._selector).filter(f.ACTIVE).removeClass(u);
            }),
            (o._jQueryInterface = function (e) {
              return this.each(function () {
                var i = t(this).data(n);
                if (
                  (i ||
                    ((i = new o(this, "object" == typeof e && e)),
                    t(this).data(n, i)),
                  "string" == typeof e)
                ) {
                  if ("undefined" == typeof i[e])
                    throw new TypeError('No method named "' + e + '"');
                  i[e]();
                }
              });
            }),
            s(o, null, [
              {
                key: "VERSION",
                get: function () {
                  return "4.0.0";
                }
              },
              {
                key: "Default",
                get: function () {
                  return a;
                }
              }
            ]),
            o
          );
        })();
      return (
        t(window).on(h.LOAD_DATA_API, function () {
          for (var e = t.makeArray(t(f.DATA_SPY)), n = e.length; n--; ) {
            var i = t(e[n]);
            g._jQueryInterface.call(i, i.data());
          }
        }),
        (t.fn[e] = g._jQueryInterface),
        (t.fn[e].Constructor = g),
        (t.fn[e].noConflict = function () {
          return (t.fn[e] = o), g._jQueryInterface;
        }),
        g
      );
    })(e),
    V = (function (t) {
      var e = "bs.tab",
        n = "." + e,
        i = t.fn.tab,
        r = {
          HIDE: "hide" + n,
          HIDDEN: "hidden" + n,
          SHOW: "show" + n,
          SHOWN: "shown" + n,
          CLICK_DATA_API: "click.bs.tab.data-api"
        },
        o = "dropdown-menu",
        a = "active",
        l = "disabled",
        h = "fade",
        c = "show",
        u = ".dropdown",
        f = ".nav, .list-group",
        d = ".active",
        _ = "> li > .active",
        g = '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
        p = ".dropdown-toggle",
        m = "> .dropdown-menu .active",
        v = (function () {
          function n(t) {
            this._element = t;
          }
          var i = n.prototype;
          return (
            (i.show = function () {
              var e = this;
              if (
                !(
                  (this._element.parentNode &&
                    this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
                    t(this._element).hasClass(a)) ||
                  t(this._element).hasClass(l)
                )
              ) {
                var n,
                  i,
                  s = t(this._element).closest(f)[0],
                  o = P.getSelectorFromElement(this._element);
                if (s) {
                  var h = "UL" === s.nodeName ? _ : d;
                  i = (i = t.makeArray(t(s).find(h)))[i.length - 1];
                }
                var c = t.Event(r.HIDE, { relatedTarget: this._element }),
                  u = t.Event(r.SHOW, { relatedTarget: i });
                if (
                  (i && t(i).trigger(c),
                  t(this._element).trigger(u),
                  !u.isDefaultPrevented() && !c.isDefaultPrevented())
                ) {
                  o && (n = t(o)[0]), this._activate(this._element, s);
                  var g = function () {
                    var n = t.Event(r.HIDDEN, { relatedTarget: e._element }),
                      s = t.Event(r.SHOWN, { relatedTarget: i });
                    t(i).trigger(n), t(e._element).trigger(s);
                  };
                  n ? this._activate(n, n.parentNode, g) : g();
                }
              }
            }),
            (i.dispose = function () {
              t.removeData(this._element, e), (this._element = null);
            }),
            (i._activate = function (e, n, i) {
              var s = this,
                r = ("UL" === n.nodeName ? t(n).find(_) : t(n).children(d))[0],
                o = i && P.supportsTransitionEnd() && r && t(r).hasClass(h),
                a = function () {
                  return s._transitionComplete(e, r, i);
                };
              r && o
                ? t(r).one(P.TRANSITION_END, a).emulateTransitionEnd(150)
                : a();
            }),
            (i._transitionComplete = function (e, n, i) {
              if (n) {
                t(n).removeClass(c + " " + a);
                var s = t(n.parentNode).find(m)[0];
                s && t(s).removeClass(a),
                  "tab" === n.getAttribute("role") &&
                    n.setAttribute("aria-selected", !1);
              }
              if (
                (t(e).addClass(a),
                "tab" === e.getAttribute("role") &&
                  e.setAttribute("aria-selected", !0),
                P.reflow(e),
                t(e).addClass(c),
                e.parentNode && t(e.parentNode).hasClass(o))
              ) {
                var r = t(e).closest(u)[0];
                r && t(r).find(p).addClass(a),
                  e.setAttribute("aria-expanded", !0);
              }
              i && i();
            }),
            (n._jQueryInterface = function (i) {
              return this.each(function () {
                var s = t(this),
                  r = s.data(e);
                if (
                  (r || ((r = new n(this)), s.data(e, r)), "string" == typeof i)
                ) {
                  if ("undefined" == typeof r[i])
                    throw new TypeError('No method named "' + i + '"');
                  r[i]();
                }
              });
            }),
            s(n, null, [
              {
                key: "VERSION",
                get: function () {
                  return "4.0.0";
                }
              }
            ]),
            n
          );
        })();
      return (
        t(document).on(r.CLICK_DATA_API, g, function (e) {
          e.preventDefault(), v._jQueryInterface.call(t(this), "show");
        }),
        (t.fn.tab = v._jQueryInterface),
        (t.fn.tab.Constructor = v),
        (t.fn.tab.noConflict = function () {
          return (t.fn.tab = i), v._jQueryInterface;
        }),
        v
      );
    })(e);
  !(function (t) {
    if ("undefined" == typeof t)
      throw new TypeError(
        "Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript."
      );
    var e = t.fn.jquery.split(" ")[0].split(".");
    if (
      (e[0] < 2 && e[1] < 9) ||
      (1 === e[0] && 9 === e[1] && e[2] < 1) ||
      e[0] >= 4
    )
      throw new Error(
        "Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0"
      );
  })(e),
    (t.Util = P),
    (t.Alert = L),
    (t.Button = R),
    (t.Carousel = j),
    (t.Collapse = H),
    (t.Dropdown = W),
    (t.Modal = M),
    (t.Popover = x),
    (t.Scrollspy = K),
    (t.Tab = V),
    (t.Tooltip = U),
    Object.defineProperty(t, "__esModule", { value: !0 });
});
//# sourceMappingURL=bootstrap.min.js.map

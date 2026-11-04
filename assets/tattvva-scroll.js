var k="1.1.18";function w(r,t,e){return Math.max(r,Math.min(t,e))}function W(r,t,e){return(1-e)*r+e*t}function z(r,t,e,i){return W(r,t,1-Math.exp(-e*i))}function x(r,t){return(r%t+t)%t}var y=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(t){if(!this.isRunning)return;let e=!1;if(this.duration&&this.easing){this.currentTime+=t;let i=w(0,this.currentTime/this.duration,1);e=i>=1;let s=e?1:this.easing(i);this.value=this.from+(this.to-this.from)*s}else this.lerp?(this.value=z(this.value,this.to,this.lerp*60,t),Math.round(this.value)===this.to&&(this.value=this.to,e=!0)):(this.value=this.to,e=!0);e&&this.stop(),this.onUpdate?.(this.value,e)}stop(){this.isRunning=!1}fromTo(t,e,{lerp:i,duration:s,easing:o,onStart:l,onUpdate:h}){this.from=this.value=t,this.to=e,this.lerp=i,this.duration=s,this.easing=o,this.currentTime=0,this.isRunning=!0,l?.(),this.onUpdate=h}};function R(r,t){let e;return function(...i){let s=this;clearTimeout(e),e=setTimeout(()=>{e=void 0,r.apply(s,i)},t)}}var E=class{constructor(t,e,{autoResize:i=!0,debounce:s=250}={}){this.wrapper=t;this.content=e;i&&(this.debouncedResize=R(this.resize,s),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize,!1):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize,!1)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}};var f=class{events={};emit(t,...e){let i=this.events[t]||[];for(let s=0,o=i.length;s<o;s++)i[s]?.(...e)}on(t,e){return this.events[t]?.push(e)||(this.events[t]=[e]),()=>{this.events[t]=this.events[t]?.filter(i=>e!==i)}}off(t,e){this.events[t]=this.events[t]?.filter(i=>e!==i)}destroy(){this.events={}}};var _=100/6,u={passive:!1},T=class{constructor(t,e={wheelMultiplier:1,touchMultiplier:1}){this.element=t;this.options=e;window.addEventListener("resize",this.onWindowResize,!1),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,u),this.element.addEventListener("touchstart",this.onTouchStart,u),this.element.addEventListener("touchmove",this.onTouchMove,u),this.element.addEventListener("touchend",this.onTouchEnd,u)}touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new f;on(t,e){return this.emitter.on(t,e)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize,!1),this.element.removeEventListener("wheel",this.onWheel,u),this.element.removeEventListener("touchstart",this.onTouchStart,u),this.element.removeEventListener("touchmove",this.onTouchMove,u),this.element.removeEventListener("touchend",this.onTouchEnd,u)}onTouchStart=t=>{let{clientX:e,clientY:i}=t.targetTouches?t.targetTouches[0]:t;this.touchStart.x=e,this.touchStart.y=i,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:t})};onTouchMove=t=>{let{clientX:e,clientY:i}=t.targetTouches?t.targetTouches[0]:t,s=-(e-this.touchStart.x)*this.options.touchMultiplier,o=-(i-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=e,this.touchStart.y=i,this.lastDelta={x:s,y:o},this.emitter.emit("scroll",{deltaX:s,deltaY:o,event:t})};onTouchEnd=t=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:t})};onWheel=t=>{let{deltaX:e,deltaY:i,deltaMode:s}=t,o=s===1?_:s===2?this.window.width:1,l=s===1?_:s===2?this.window.height:1;e*=o,i*=l,e*=this.options.wheelMultiplier,i*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:e,deltaY:i,event:t})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}};var L=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;__rafID=null;isTouching;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new y;emitter=new f;dimensions;virtualScroll;constructor({wrapper:t=window,content:e=document.documentElement,eventsTarget:i=t,smoothWheel:s=!0,syncTouch:o=!1,syncTouchLerp:l=.075,touchInertiaMultiplier:h=35,duration:S,easing:d=H=>Math.min(1,1.001-Math.pow(2,-10*H)),lerp:c=.1,infinite:p=!1,orientation:b="vertical",gestureOrientation:n="vertical",touchMultiplier:a=1,wheelMultiplier:v=1,autoResize:g=!0,prevent:m,virtualScroll:N,overscroll:M=!0,autoRaf:O=!1,__experimental__naiveDimensions:D=!1}={}){window.lenisVersion=k,(!t||t===document.documentElement||t===document.body)&&(t=window),this.options={wrapper:t,content:e,eventsTarget:i,smoothWheel:s,syncTouch:o,syncTouchLerp:l,touchInertiaMultiplier:h,duration:S,easing:d,lerp:c,infinite:p,gestureOrientation:n,orientation:b,touchMultiplier:a,wheelMultiplier:v,autoResize:g,prevent:m,virtualScroll:N,overscroll:M,autoRaf:O,__experimental__naiveDimensions:D},this.dimensions=new E(t,e,{autoResize:g}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll,!1),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown,!1),this.virtualScroll=new T(i,{touchMultiplier:a,wheelMultiplier:v}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoRaf&&(this.__rafID=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll,!1),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown,!1),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this.__rafID&&cancelAnimationFrame(this.__rafID)}on(t,e){return this.emitter.on(t,e)}off(t,e){return this.emitter.off(t,e)}setScroll(t){this.isHorizontal?this.rootElement.scrollLeft=t:this.rootElement.scrollTop=t}onPointerDown=t=>{t.button===1&&this.reset()};onVirtualScroll=t=>{if(typeof this.options.virtualScroll=="function"&&this.options.virtualScroll(t)===!1)return;let{deltaX:e,deltaY:i,event:s}=t;if(this.emitter.emit("virtual-scroll",{deltaX:e,deltaY:i,event:s}),s.ctrlKey||s.lenisStopPropagation)return;let o=s.type.includes("touch"),l=s.type.includes("wheel");this.isTouching=s.type==="touchstart"||s.type==="touchmove";let h=e===0&&i===0;if(this.options.syncTouch&&o&&s.type==="touchstart"&&h&&!this.isStopped&&!this.isLocked){this.reset();return}let d=this.options.gestureOrientation==="vertical"&&i===0||this.options.gestureOrientation==="horizontal"&&e===0;if(h||d)return;let c=s.composedPath();c=c.slice(0,c.indexOf(this.rootElement));let p=this.options.prevent;if(c.find(m=>m instanceof HTMLElement&&(typeof p=="function"&&p?.(m)||m.hasAttribute?.("data-lenis-prevent")||o&&m.hasAttribute?.("data-lenis-prevent-touch")||l&&m.hasAttribute?.("data-lenis-prevent-wheel"))))return;if(this.isStopped||this.isLocked){s.preventDefault();return}if(!(this.options.syncTouch&&o||this.options.smoothWheel&&l)){this.isScrolling="native",this.animate.stop(),s.lenisStopPropagation=!0;return}let n=i;this.options.gestureOrientation==="both"?n=Math.abs(i)>Math.abs(e)?i:e:this.options.gestureOrientation==="horizontal"&&(n=e),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&(this.animatedScroll>0&&this.animatedScroll<this.limit||this.animatedScroll===0&&i>0||this.animatedScroll===this.limit&&i<0))&&(s.lenisStopPropagation=!0),s.preventDefault();let a=o&&this.options.syncTouch,g=o&&s.type==="touchend"&&Math.abs(n)>5;g&&(n=this.velocity*this.options.touchInertiaMultiplier),this.scrollTo(this.targetScroll+n,{programmatic:!1,...a?{lerp:g?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}onNativeScroll=()=>{if(this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(this.isScrolling===!1||this.isScrolling==="native"){let t=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-t,this.direction=Math.sign(this.animatedScroll-t),this.isStopped||(this.isScrolling="native"),this.emit(),this.velocity!==0&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){this.isStopped&&(this.reset(),this.isStopped=!1)}stop(){this.isStopped||(this.reset(),this.isStopped=!0)}raf=t=>{let e=t-(this.time||t);this.time=t,this.animate.advance(e*.001),this.options.autoRaf&&(this.__rafID=requestAnimationFrame(this.raf))};scrollTo(t,{offset:e=0,immediate:i=!1,lock:s=!1,duration:o=this.options.duration,easing:l=this.options.easing,lerp:h=this.options.lerp,onStart:S,onComplete:d,force:c=!1,programmatic:p=!0,userData:b}={}){if(!((this.isStopped||this.isLocked)&&!c)){if(typeof t=="string"&&["top","left","start"].includes(t))t=0;else if(typeof t=="string"&&["bottom","right","end"].includes(t))t=this.limit;else{let n;if(typeof t=="string"?n=document.querySelector(t):t instanceof HTMLElement&&t?.nodeType&&(n=t),n){if(this.options.wrapper!==window){let v=this.rootElement.getBoundingClientRect();e-=this.isHorizontal?v.left:v.top}let a=n.getBoundingClientRect();t=(this.isHorizontal?a.left:a.top)+this.animatedScroll}}if(typeof t=="number"){if(t+=e,t=Math.round(t),this.options.infinite?p&&(this.targetScroll=this.animatedScroll=this.scroll):t=w(0,t,this.limit),t===this.targetScroll){S?.(this),d?.(this);return}if(this.userData=b??{},i){this.animatedScroll=this.targetScroll=t,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),d?.(this),this.userData={};return}p||(this.targetScroll=t),this.animate.fromTo(this.animatedScroll,t,{duration:o,easing:l,lerp:h,onStart:()=>{s&&(this.isLocked=!0),this.isScrolling="smooth",S?.(this)},onUpdate:(n,a)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=n-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=n,this.setScroll(this.scroll),p&&(this.targetScroll=n),a||this.emit(),a&&(this.reset(),this.emit(),d?.(this),this.userData={},this.preventNextNativeScrollEvent())}})}}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.__experimental__naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return this.options.orientation==="horizontal"}get actualScroll(){return this.isHorizontal?this.rootElement.scrollLeft:this.rootElement.scrollTop}get scroll(){return this.options.infinite?x(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(t){this._isScrolling!==t&&(this._isScrolling=t,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(t){this._isStopped!==t&&(this._isStopped=t,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(t){this._isLocked!==t&&(this._isLocked=t,this.updateClassName())}get isSmooth(){return this.isScrolling==="smooth"}get className(){let t="lenis";return this.isStopped&&(t+=" lenis-stopped"),this.isLocked&&(t+=" lenis-locked"),this.isScrolling&&(t+=" lenis-scrolling"),this.isScrolling==="smooth"&&(t+=" lenis-smooth"),t}updateClassName(){this.cleanUpClassName(),this.rootElement.className=`${this.rootElement.className} ${this.className}`.trim()}cleanUpClassName(){this.rootElement.className=this.rootElement.className.replace(/lenis(-\w+)?/g,"").trim()}};globalThis.Lenis=L;
//# sourceMappingURL=lenis.min.js.map


/**
 * ============================================================
 * TATTVVA LUXURY MOTION & SOBHA PRIVY COLLECTION SCROLL ENGINE
 * ============================================================
 * Features:
 * 1. Lenis Physics-Based Inertial Smooth Scroll (Momentum Lerp)
 * 2. Hero Cinematic Curtain Parallax (Scale & Fade)
 * 3. Sobha-Style Editorial Masked Line Typography Reveal
 * 4. Continuous Multi-Plane 3D Parallax on Images & Canvases
 * 5. Luxury Floating Chapter HUD Dial with Radial SVG Meter
 * 6. Bespoke Magnetic Luxury Cursor Follower (Desktop)
 * 7. Silky Anchor Scroll Interception
 */
(function initTattvvaSobhaScroll() {
  'use strict';

  if (window.__tattvvaSobhaInitialized) return;
  window.__tattvvaSobhaInitialized = true;

  // Check reduced motion preference
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Detect touch devices (phones, tablets, touchscreens)
  var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth < 1024);

  // Initialize Lenis Smooth Scroll ONLY on desktop mouse/trackpad pointer devices
  // On mobile/touch devices, native hardware 120Hz/60Hz momentum scrolling is preserved
  var lenis = null;
  if (!prefersReducedMotion && !isTouchDevice && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 0.8,
      easing: function(t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.25,
      touchMultiplier: 0,
      syncTouch: false,
      infinite: false
    });

    window.lenis = lenis;

    function raf(time) {
      if (lenis) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
    }
    requestAnimationFrame(raf);
  }

  var parallaxItems = [];
  var topProgressBar = null;

  function initMotionSystem() {
    setupUIWidgets();
    decorateTypography();
    decorateParallaxMedia();
    setupIntersectionObserver();
    setupSmoothAnchors();
    ensureHeroVideoPlayback();
    initCardStackAnimation();

    if (lenis) {
      lenis.on('scroll', onScrollFrame);
    } else {
      var scrollTicking = false;
      window.addEventListener('scroll', function() {
        if (!scrollTicking) {
          scrollTicking = true;
          requestAnimationFrame(function() {
            onScrollFrame({ scroll: window.scrollY || document.documentElement.scrollTop });
            scrollTicking = false;
          });
        }
      }, { passive: true });
    }

    // Initial tick
    onScrollFrame({ scroll: window.scrollY || document.documentElement.scrollTop });
  }

  // 1. Inject UI Elements (Top reading progress bar)
  function setupUIWidgets() {
    if (!document.getElementById('tattvvaScrollProgress')) {
      topProgressBar = document.createElement('div');
      topProgressBar.id = 'tattvvaScrollProgress';
      topProgressBar.className = 'tattvva-scroll-progress';
      topProgressBar.setAttribute('aria-hidden', 'true');
      document.body.prepend(topProgressBar);
    } else {
      topProgressBar = document.getElementById('tattvvaScrollProgress');
    }
  }

  // 2. Premium Scroll-Triggered Heading Animations & Parallax
  var parallaxHeadings = [];

  function decorateTypography() {
    parallaxHeadings = [];

    // A. Large Section Headings (H1 & H2) -> Fade-in + Upward Slide + Scroll Parallax
    var largeHeadings = document.querySelectorAll(
      '.hero-title, .hero h1, .prod-main-title, .why-header h2, .mission-statement, .testi-heading, .story-heading, .sf-title, .sfe-title, .qj-title, .ph-title, .sec > .w > h2, section:not(footer) h2'
    );

    largeHeadings.forEach(function(h) {
      if (!h.classList.contains('tattvva-heading-reveal')) {
        h.classList.add('tattvva-heading-reveal', 'tattvva-heading-parallax');
        parallaxHeadings.push({
          el: h,
          speed: -11,
          isHero: h.closest('.hero') !== null
        });
      }
    });

    // B. Sub-Headings (H3 & Secondary Feature Headers) -> Subtle Slide & Fade
    var subHeadings = document.querySelectorAll(
      '.spotlight-title, .future-title, .stack-card h3, .why-card h3, .testi-cta-title, .testi-cta-heading, .pillar-title, .story-values-title, .ph-form-title, .ph-section-subtitle, .ph-form-card h3, .c h3, .fc h3'
    );

    subHeadings.forEach(function(h) {
      if (!h.classList.contains('tattvva-heading-reveal') && !h.classList.contains('tattvva-heading-sub')) {
        h.classList.add('tattvva-heading-sub');
      }
    });

    // Decorate Kickers
    var kickers = document.querySelectorAll('.kicker, .hero-badge, .why-badge, .values-badge, .sfe-kicker-wrap, .qj-kicker-wrap, .ph-kicker-wrap, .mission-kicker');
    kickers.forEach(function(k) {
      k.classList.add('scroll-reveal-kicker');
    });

    // Decorate Subtitles / descriptions
    var subtitles = document.querySelectorAll('.sub, .sh-desc, .sfe-subtitle, .qj-subtitle, .ph-subtitle, .lead, .mission-story');
    subtitles.forEach(function(s) {
      s.classList.add('scroll-reveal-text');
    });

    // Decorate Cards with stagger
    var gridContainers = [
      { container: '.pg', items: '.pc' },
      { container: '.fg-grid, .featured-grid, .future-cards', items: '.fc' },
      { container: '.promise-bento', items: '.pb-card' },
      { container: '.tg', items: '.tc' },
      { container: '.story-grid', items: '.story-card' },
      { container: '.sfe-pills-nav', items: '.sfe-pill' },
      { container: '.qj-track', items: '.qj-step-node' },
      { container: '.ph-tiers-grid', items: '.ph-tier-card' }
    ];

    gridContainers.forEach(function(group) {
      document.querySelectorAll(group.container).forEach(function(parent) {
        parent.querySelectorAll(group.items).forEach(function(item, idx) {
          item.classList.add('scroll-reveal');
          var stagger = (idx % 6) + 1;
          item.classList.add('scroll-stagger-' + stagger);
        });
      });
    });

    // Visual stages
    document.querySelectorAll('.sfe-interactive-stage, .sfe-quick-facts, .qj-track-wrapper, .ph-form-card, .mission-card, .t-cta').forEach(function(el) {
      el.classList.add('scroll-reveal-scale');
    });

    // Sections
    document.querySelectorAll('section, footer').forEach(function(sec) {
      if (!sec.classList.contains('hero')) {
        sec.classList.add('tattvva-section-reveal');
      }
    });
  }

  // 3. Register Continuous Parallax Media (Cards, Orbs, Images)
  function decorateParallaxMedia() {
    parallaxItems = [];

    // Product Images
    document.querySelectorAll('.pc .img-wrap').forEach(function(wrap) {
      var img = wrap.querySelector('img');
      if (img) {
        wrap.classList.add('sobha-parallax-media');
        parallaxItems.push({ el: wrap, target: img, speed: 22 });
      }
    });

    // Bento Frame Images
    document.querySelectorAll('.pb-visual-frame').forEach(function(frame) {
      var img = frame.querySelector('img');
      if (img) {
        frame.classList.add('sobha-parallax-media');
        parallaxItems.push({ el: frame, target: img, speed: 28 });
      }
    });

    // Quality Journey Visual Canvas
    document.querySelectorAll('.qj-visual-canvas').forEach(function(canvas) {
      var img = canvas.querySelector('img');
      if (img) {
        canvas.classList.add('sobha-parallax-media');
        parallaxItems.push({ el: canvas, target: img, speed: 32 });
      }
    });

    // Story Cards Media
    document.querySelectorAll('.story-card .sc-img-wrap').forEach(function(wrap) {
      var img = wrap.querySelector('img');
      if (img) {
        wrap.classList.add('sobha-parallax-media');
        parallaxItems.push({ el: wrap, target: img, speed: 20 });
      }
    });

    // Atmospheric Glows
    document.querySelectorAll('.sfe-aurora-glow, .qj-ambient-glow, .ph-ambient-glow, .mission-ambient-glow').forEach(function(glow) {
      parallaxItems.push({ el: glow.parentElement, target: glow, speed: -24 });
    });
  }

  // 4. IntersectionObserver for Reveal Classes
  function setupIntersectionObserver() {
    var targets = document.querySelectorAll(
      '.tattvva-section-reveal, .scroll-reveal, .scroll-reveal-text, .scroll-reveal-kicker, .scroll-reveal-scale, .sobha-reveal-title, .tattvva-heading-reveal, .tattvva-heading-sub'
    );

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function(el) {
        el.classList.add('is-revealed');
        if (el.classList.contains('tattvva-heading-parallax')) {
          el.classList.add('parallax-active');
        }
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          target.classList.add('is-revealed');
          obs.unobserve(target);

          if (target.classList.contains('tattvva-heading-parallax')) {
            setTimeout(function() {
              target.classList.add('parallax-active');
            }, 800);
          }
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    targets.forEach(function(el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-revealed');
        if (el.classList.contains('tattvva-heading-parallax')) {
          setTimeout(function() {
            el.classList.add('parallax-active');
          }, 600);
        }
      } else {
        observer.observe(el);
      }
    });
  }

  // 5. Scroll Frame Handler (Lenis RAF & Parallax)
  var heroSection = document.querySelector('.hero');
  var heroVideo = heroSection ? heroSection.querySelector('.hero-bg-video') : null;
  var heroContent = heroSection ? heroSection.querySelector('.hero-content') : null;

  function onScrollFrame(e) {
    var scrollY = typeof e.scroll === 'number' ? e.scroll : (window.scrollY || document.documentElement.scrollTop);
    var windowH = window.innerHeight;
    var docH = document.documentElement.scrollHeight - windowH;
    var progress = docH > 0 ? (scrollY / docH) : 0;
    progress = Math.max(0, Math.min(1, progress));

    // A. Top Progress Bar
    if (topProgressBar) {
      topProgressBar.style.width = (progress * 100).toFixed(2) + '%';
    }

    // B. Hero Cinematic Curtain Parallax
    if (!heroSection) {
      heroSection = document.querySelector('.hero');
      if (heroSection) {
        heroVideo = heroSection.querySelector('.hero-bg-video');
        heroContent = heroSection.querySelector('.hero-content, .hg > div');
      }
    }
    if (heroSection) {
      var heroH = heroSection.offsetHeight || windowH;
      if (scrollY <= heroH + 100) {
        var r = Math.max(0, Math.min(1, scrollY / heroH));
        if (heroVideo) {
          if (r === 0) {
            heroVideo.style.transform = 'none';
          } else {
            heroVideo.style.transform = 'scale(' + (1 + r * 0.10).toFixed(3) + ') translate3d(0, ' + (r * 15).toFixed(1) + 'px, 0)';
          }
        }
        var hContent = heroContent || heroSection.querySelector('.hero-content, .hg > div');
        if (hContent) {
          if (r === 0) {
            hContent.style.transform = 'none';
            hContent.style.opacity = '1';
          } else {
            hContent.style.transform = 'translate3d(0, ' + (-r * 75).toFixed(1) + 'px, 0)';
            hContent.style.opacity = Math.max(0, 1 - r * 1.35).toFixed(2);
          }
        }
      }
    }

    // C. Continuous Multi-Plane 3D Parallax
    if (!prefersReducedMotion) {
      for (var i = 0; i < parallaxItems.length; i++) {
        var item = parallaxItems[i];
        var rect = item.el.getBoundingClientRect();
        if (rect.bottom > -50 && rect.top < windowH + 50) {
          var factor = (rect.top + rect.height * 0.5 - windowH * 0.5) / windowH;
          var yOffset = factor * item.speed;
          item.target.style.transform = 'translate3d(0, ' + yOffset.toFixed(1) + 'px, 0)';
        }
      }
    }

    // D. Apple-Style Scroll-Based Card Stacking
    updateCardStacks();

    // E. Dynamic Scroll-Linked Heading Parallax
    updateHeadingParallax();
  }

  // 6. Smooth Anchor Link Navigation
  function scrollToTarget(target) {
    if (lenis) {
      lenis.scrollTo(target, {
        offset: -70,
        duration: 1.35,
        easing: function(t) {
          return Math.min(1, 1.001 - Math.pow(2, -10 * t));
        }
      });
    } else {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else if (target && target.scrollIntoView) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // 8. Apple-Style Modern Scroll-Based Card Stacking Engine
  var cardStackContainers = [];

  function initCardStackAnimation() {
    cardStackContainers = Array.prototype.slice.call(document.querySelectorAll('.apple-card-stack'));
    if (!cardStackContainers.length) return;

    cardStackContainers.forEach(function(container) {
      var cards = Array.prototype.slice.call(container.querySelectorAll('.stack-card'));
      cards.forEach(function(card, idx) {
        card.style.setProperty('--card-index', idx);
      });
      var style = window.getComputedStyle(container);
      container._baseTop = parseFloat(style.getPropertyValue('--stack-top')) || 105;
      container._offset = parseFloat(style.getPropertyValue('--stack-offset')) || 24;
    });

    window.addEventListener('resize', function() {
      cardStackContainers.forEach(function(container) {
        var style = window.getComputedStyle(container);
        container._baseTop = parseFloat(style.getPropertyValue('--stack-top')) || 105;
        container._offset = parseFloat(style.getPropertyValue('--stack-offset')) || 24;
      });
    }, { passive: true });
  }

  function updateCardStacks() {
    if (!cardStackContainers.length || prefersReducedMotion || isTouchDevice) return;

    var windowH = window.innerHeight;

    for (var c = 0; c < cardStackContainers.length; c++) {
      var container = cardStackContainers[c];
      var contRect = container.getBoundingClientRect();

      // Skip calculations if container is nowhere near viewport
      if (contRect.bottom < -100 || contRect.top > windowH + 100) continue;

      var cards = Array.prototype.slice.call(container.querySelectorAll('.stack-card'));
      var n = cards.length;
      if (n < 2) continue;

      var baseTop = container._baseTop || 105;
      var offset = container._offset || 24;

      for (var i = 0; i < n; i++) {
        var card = cards[i];
        var scale = 1;

        // Check each subsequent card sliding upward over card i
        for (var j = i + 1; j < n; j++) {
          var nextCard = cards[j];
          var nextRect = nextCard.getBoundingClientRect();
          var nextTargetTop = baseTop + (j * offset);

          // Distance range over which the transition occurs
          var overlapRange = Math.max(140, windowH * 0.45);
          var dist = nextRect.top - nextTargetTop;

          if (dist < overlapRange) {
            var overlapProgress = Math.max(0, Math.min(1, 1 - (dist / overlapRange)));
            scale -= (overlapProgress * 0.04);
          }
        }

        scale = Math.max(0.88, Math.min(1, scale));
        card.style.transform = 'scale(' + scale.toFixed(3) + ') translate3d(0, 0, 0)';
      }
    }
  }

  // 9. Premium Dynamic Scroll-Linked Heading Parallax
  function updateHeadingParallax() {
    if (!parallaxHeadings.length || prefersReducedMotion || isTouchDevice) return;

    var windowH = window.innerHeight;
    var maxShift = window.innerWidth < 768 ? 6 : 11;

    for (var i = 0; i < parallaxHeadings.length; i++) {
      var item = parallaxHeadings[i];
      if (item.isHero) continue;

      var el = item.el;
      if (!el.classList.contains('parallax-active')) continue;

      var rect = el.getBoundingClientRect();
      if (rect.bottom > -50 && rect.top < windowH + 50) {
        var factor = (rect.top + rect.height * 0.5 - windowH * 0.5) / windowH;
        var yShift = factor * item.speed;
        yShift = Math.max(-maxShift, Math.min(maxShift, yShift));
        el.style.transform = 'translate3d(0, ' + yShift.toFixed(2) + 'px, 0)';
      }
    }
  }

  function setupSmoothAnchors() {
    document.addEventListener('click', function(e) {
      var anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      var hash = anchor.getAttribute('href');
      if (!hash || hash === '#') {
        e.preventDefault();
        scrollToTarget(0);
        return;
      }

      if ((hash === '#track-order' || hash === '#track') && window.tattvvaOpenTrackModal) {
        e.preventDefault();
        window.tattvvaOpenTrackModal();
        return;
      }

      if ((hash === '#queries' || hash === '#faq') && window.tattvvaOpenQueriesModal) {
        e.preventDefault();
        window.tattvvaOpenQueriesModal();
        return;
      }

      var targetEl = document.querySelector(hash);
      if (targetEl) {
        e.preventDefault();
        scrollToTarget(targetEl);
        if (window.history && window.history.pushState) {
          window.history.pushState(null, null, hash);
        }
      }
    });
  }

  function ensureHeroVideoPlayback() {
    var v = document.querySelector('.hero-bg-video');
    if (!v) return;
    var rate = parseFloat(v.getAttribute('data-speed')) || 0.45;
    v.muted = true;
    v.defaultMuted = true;
    v.defaultPlaybackRate = rate;
    v.playbackRate = rate;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('autoplay', '');
    v.setAttribute('loop', '');
    var playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.then(function() {
        v.playbackRate = rate;
      }).catch(function() {
        var startPlay = function() {
          v.playbackRate = rate;
          v.play().catch(function() {});
          window.removeEventListener('click', startPlay);
          window.removeEventListener('touchstart', startPlay);
          window.removeEventListener('scroll', startPlay);
        };
        window.addEventListener('click', startPlay, { once: true, passive: true });
        window.addEventListener('touchstart', startPlay, { once: true, passive: true });
        window.addEventListener('scroll', startPlay, { once: true, passive: true });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotionSystem);
  } else {
    initMotionSystem();
  }
})();
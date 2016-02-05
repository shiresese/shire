var TransitionGroup = React.addons.TransitionGroup;
var Config;

$(function(){

/****************************************************************************/
/***************************** Declaration **********************************/
/****************************************************************************/

  var appearWait;
  var duration = 1100;
  var body;
  var contentWave;
  var render;

  var EState = {
    TOP: 3,
    NEWS: 2,
    WORKS: 1,
    ABOUT: 0,
    START: 8,
  }

  var timerList = [];
  function resetTimer(timer){
    if(timer){
      clearTimeout(timerList[timer]);
    } else {
      timerList.forEach(function(timer){
        clearTimeout[timer];
      });
    }
  }

  var Page = React.createClass({displayName: "Page",
    getInitialState() {
      return {
        content: EState.START,
        left: true
      }
    },
    getDefaultProps: function() {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    },
    componentDidMount: function(){
      var _this = this;
      if(this.state.content === EState.START){
        var state;
        switch(window.location.hash){
          case "#top": state = EState.TOP;
            break;
          case "#news": state = EState.NEWS;
            this.switchLeft(false);
            break;
          case "#works": state = EState.WORKS;
            this.switchLeft(false);
            break;
          case "#about": state = EState.ABOUT;
            this.switchLeft(false);
            break;
          default: state = EState.TOP;
            break;
        }
        timerList["initialLoad"] = setTimeout(function(){
            _this.setState({ content: state });
          }, appearWait * 1.5);
      }
    },
    render: function() {
      var ttableBlockWidth = (this.props.height / 16 * 9 + 5) + "px";
      var exitBlockWidth = (this.props.height * 0.15 / 6 * 5 + 60) + 'px';
      switch(this.state.content){
        case EState.TOP:
          return (
            React.createElement("div", {className: "shire-content"}, 
              React.createElement(TurnTable, {blockWidth: ttableBlockWidth, left: this.state.left}), 
              React.createElement(Menu, {clickMenu: this.clickMenu, state: this.state.content, left: this.state.left}), 
              React.createElement(Exit, {blockWidth: exitBlockWidth, left: this.state.left, clickExit: this.clickExit}), 
              React.createElement(TransitionGroup, null, 
                React.createElement(Top, {state: this.state.content, switchLeft: this.switchLeft})
              ), 
              React.createElement(TransitionGroup, null
              )
            )
          );
        case EState.NEWS:
        case EState.WORKS:
        case EState.ABOUT:
          return (
            React.createElement("div", {className: "shire-content"}, 
              React.createElement(TurnTable, {blockWidth: ttableBlockWidth, left: this.state.left}), 
              React.createElement(Menu, {clickMenu: this.clickMenu, state: this.state.content, left: this.state.left}), 
              React.createElement(Exit, {blockWidth: exitBlockWidth, left: this.state.left, clickExit: this.clickExit}), 
              React.createElement(TransitionGroup, null
              ), 
              React.createElement(TransitionGroup, null, 
                React.createElement(Content, {state: this.state.content, switchLeft: this.switchLeft})
              )
            )
          );
        case EState.START:
        default:
          return (
            React.createElement("div", {className: "shire-content"}, 
              React.createElement(TurnTable, {blockWidth: ttableBlockWidth, left: this.state.left}), 
              React.createElement(Menu, {clickMenu: this.clickMenu, state: this.state.content, left: this.state.left}), 
              React.createElement(Exit, {blockWidth: exitBlockWidth, left: this.state.left, clickExit: this.clickExit}), 
              React.createElement(TransitionGroup, null
              ), 
              React.createElement(TransitionGroup, null
              )
            )
          );
      }
    },
    clickMenu: function(element) {
      resetTimer();
      switch (element.target.id) {
        case "top":
          this.setState({ content: EState.TOP });
          break;
        case "news":
          this.setState({ content: EState.NEWS });
          break;
        case "works":
          this.setState({ content: EState.WORKS });
          break;
        case "about":
          // SizeManager.offsetPosition = 0;
          this.setState({ content: EState.ABOUT });
          break;
      }
    },
    clickExit: function(){
      body.style.transition = "opacity 0.25s linear";
      body.style.opacity = "0";
      setTimeout(function(){
        location.href = Config.basePath;
      }, 250);
    },
    switchLeft: function(state){
      // if(state != undefined){
      //   this.setState({ left: state });
      // } else {
      //   this.setState({ left: !(this.state.left) });
      // }
    }
  });

  var LeftButton = React.createClass({displayName: "LeftButton",
    render: function(){
      var path = "M0 30 l30 -30 v60 z";
      var trans = (this.props.left)? "none" : "translate(-320px)";
      return(
        React.createElement("div", {className: "shire-left-button-block shire-svg-block"}, 
          React.createElement("svg", {className: "shire-left-button-svg  shire-left-side", viewBox: "0 0 30 60", xmlns: "http://www.w3.org/2000/svg", fillRule: "evenodd", clipRule: "evenodd", strokeLineJoin: "round", strokeMiterLimit: "1.41421", preserveAspectRatio: "xMinYMin slice", style: {transform:trans}}, 
            React.createElement("g", {id: "shire-left-button", pointerEvents: "all"}, 
              React.createElement("path", {className: "shire-left-button", d: path, strokeWidth: "1"})
            )
          )
        )
      )
    }
  });

  var Menu = React.createClass({displayName: "Menu",
    getDefaultProps: function() {
      return {
        menuElementsPosition: [-60, -40, -20, 0, 20, 40, 60, 80, 100, 120, 140, 160, 180],
        calcMenuElementPosition: function(angle) {
          var circleSize = body.clientHeight * 0.325;
          var cy = body.clientHeight / 2;
          var a = angle / 180 * Math.PI;
          var halfElementSize = {
            width: 100,
            height: 12,
          }
          return {
            top: (cy + circleSize * Math.sin(a) - halfElementSize.height),
            left: (circleSize * Math.cos(a) - halfElementSize.width)
          };
        },
      };
    },
    render: function() {
      var top = [];
      var left = [];
      var classLists = [];
      var offset = this.props.state;

      for(var i = 0; i < 4; i++){
        var pos = this.props.calcMenuElementPosition(this.props.menuElementsPosition[offset + i]);
        top[i] = pos.top;
        if(this.props.left){
          left[i] = pos.left;
        } else {
          left[i] = -200;
        }
        if(i == (3 - this.props.state)){
          classLists[i] = "shire-menu-active";
        } else {
          classLists[i] = "";
        }
      }

      return (
        React.createElement("div", {className: "shire-menu-block"}, 
          React.createElement("a", {className: "shire-menu-element shire-pointer " + classLists[0], href: "#top", onClick: this.props.clickMenu, style: {top:top[0], left:left[0]}}, 
            React.createElement("div", {id: "top"}, "Top")
          ), 
          React.createElement("a", {className: "shire-menu-element shire-pointer " + classLists[1], href: "#news", onClick: this.props.clickMenu, style: {top:top[1], left:left[1]}}, 
            React.createElement("div", {id: "news"}, "News")
          ), 
          React.createElement("a", {className: "shire-menu-element shire-pointer " + classLists[2], href: "#works", onClick: this.props.clickMenu, style: {top:top[2], left:left[2]}}, 
            React.createElement("div", {id: "works"}, "Works")
          ), 
          React.createElement("a", {className: "shire-menu-element shire-pointer " + classLists[3], href: "#about", onClick: this.props.clickMenu, style: {top:top[3], left:left[3]}}, 
            React.createElement("div", {id: "about"}, "About")
          )
        )
      );
    },
  });

  var Exit = React.createClass({displayName: "Exit",
    render: function() {
      var trans = (this.props.left)? "none" : "translate(-320px)";
      return (
        React.createElement("div", {className: "shire-svg-block shire-exit-block", style: {width:this.props.blockWidth}}, 
          React.createElement("svg", {className: "shire-exit-svg  shire-left-side", viewBox: "0 0 160 120", xmlns: "http://www.w3.org/2000/svg", fillRule: "evenodd", clipRule: "evenodd", strokeLineJoin: "round", strokeMiterLimit: "1.41421", preserveAspectRatio: "xMinYMin slice", style: {transform:trans}}, 
            React.createElement("g", {id: "shire-exit", pointerEvents: "all", onClick: this.props.clickExit}, 
              React.createElement("text", null, "srss"), 
              React.createElement("path", {className: "shire-exit", d: "M0 20,l50,50l-100,0z", strokeWidth: "1"}), 
              React.createElement("rect", {className: "shire-exit", x: "-50", y: "80", width: "100", height: "10", strokeWidth: "1"}), 
              React.createElement("rect", {className: "shire-exit shire-pointer", x: "-60", y: "0", width: "130", height: "120", fillOpacity: "0", strokeWidth: "0"})
            )
          )
        )
      );
    },
  });

  var TurnTable = React.createClass({displayName: "TurnTable",
    render: function() {
      var trans = (this.props.left)? "none" : "translate(-320px)";
      return (
        React.createElement("div", {className: "shire-svg-block shire-ttable-block", style: {width:this.props.blockWidth}}, 
          React.createElement("svg", {className: "shire-ttable-svg  shire-left-side", viewBox: "0 0 460 800", xmlns: "http://www.w3.org/2000/svg", fillRule: "evenodd", clipRule: "evenodd", strokeLineJoin: "round", strokeMiterLimit: "1.41421", preserveAspectRatio: "xMinYMin slice", style: {transform:trans}}, 
            React.createElement("g", {className: "shire-ttable-born"}, 
              React.createElement("circle", {className: "shire-ttable shire-fill2", cx: "0", cy: "400", r: "450", strokeWidth: "1.5", strokeLinecap: "round", transform: "scale(-1, 1) rotate(90, 0, 400)"})
            ), 
            React.createElement("g", {id: "ttable-surface"}, 
              React.createElement("circle", {className: "shire-ttable", cx: "0", cy: "400", r: "444", strokeWidth: "0.5", strokeLinecap: "butt", strokeDasharray: "5,5", transform: "rotate(-90, 0, 400)"}), 
              React.createElement("circle", {className: "shire-ttable", cx: "0", cy: "400", r: "430", strokeWidth: "1", strokeLinecap: "butt", strokeDasharray: "5,5", transform: "scale(-1, 1) rotate(90, 0, 400)"}), 
              React.createElement("circle", {className: "shire-ttable", cx: "0", cy: "400", r: "415", strokeWidth: "1.5", strokeLinecap: "round", strokeDasharray: "3,15", transform: "rotate(-100, 0, 400)"}), 
              React.createElement("circle", {className: "shire-ttable", cx: "0", cy: "400", r: "400", strokeWidth: "1", strokeLinecap: "butt", strokeDasharray: "5,5", transform: "scale(-1, 1) rotate(80, 0, 400)"}), 
              React.createElement("circle", {className: "shire-ttable", cx: "0", cy: "400", r: "380", strokeWidth: "0.5", strokeLinecap: "butt", strokeDasharray: "5,5", transform: "rotate(-110, 0, 400)"})
            ), 
            React.createElement("g", {className: "shire-ttable-born"}, 
              React.createElement("circle", {className: "shire-ttable shire-fill", cx: "0", cy: "400", r: "360", strokeWidth: "1.5", strokeLinecap: "round", transform: "rotate(-90, 0, 400)"})
            ), 
            React.createElement("g", {className: "shire-ttable-born"}, 
              React.createElement("circle", {className: "shire-ttable shire-mainfill", cx: "0", cy: "400", r: "160", strokeWidth: "1.5", strokeLinecap: "round", transform: "scale(-1, 1) rotate(70, 0, 400)"})
            ), 
            React.createElement("g", {id: "ttable-groove"}, 
              React.createElement("circle", {className: "shire-ttable", cx: "0", cy: "400", r: "330", strokeWidth: "0.5", strokeLinecap: "round", strokeDasharray: "180,120", transform: "scale(-1, 1) rotate(60, 0, 400)"}), 
              React.createElement("circle", {className: "shire-ttable", cx: "0", cy: "400", r: "205", strokeWidth: "0.5", strokeLinecap: "round", strokeDasharray: "100,200,80,150", transform: "rotate(-120, 0, 400)"})
            )
          )
        )
      );
    }
  });

  var Top = React.createClass({displayName: "Top",
    componentDidMount: function(){
      this.props.switchLeft(true);
      SVGAnimater.appearPath(document.querySelector("#title-wave > path"), duration, 100);
      timerList["appearLogo"] = setTimeout(function(){
          document.querySelector(".shire-title-logo").style.opacity = "1";
        }, duration);
    },
    componentWillLeave: function(callback){
      document.querySelector(".shire-title-logo").style.opacity = "0";
      SVGAnimater.disappearPath(document.querySelector("#title-wave > path"), duration);
      this.props.switchLeft(false);
      setTimeout(callback, duration);
    },
    render: function() {
      var center = body.clientWidth - 300;
      var waveHeight = body.clientHeight - 80;
      var wave = "M0" + " " + waveHeight + " H" + (center - 75) + " L" + (center - 65) + " "
        + (waveHeight - 100) + " L" + (center - 35) + " " + (waveHeight + 50) + " L"
        + (center - 25) + " " + (waveHeight - 40) + " L" + (center - 15) + " "
        + (waveHeight + 20) + " L" + (center - 5) + " " + (waveHeight - 10) + " L"
        + (center) + " " + waveHeight + " H" + body.clientWidth;
      //ギザギザlength = (100^2+10^2)^(1/2)+(150^2+30^2)^(1/2)+(90^2+10^2)^(1/2)+(60^2+10^2)^(1/2)+(30^2+10^2)^(1/2)+(10^2+5^2)^(1/2)
      // = 447.65...
      var length = (center - 75) + (body.clientWidth - center) + 447.65;
      return (
        React.createElement("div", {className: "shire-svg-block shire-wave-block"}, 
          React.createElement("svg", {className: "shire-wave-svg", mlns: "http://www.w3.org/2000/svg", fillRule: "evenodd", clipRule: "evenodd", strokeLineJoin: "round", strokeMiterLimit: "1.41421", preserveAspectRatio: "xMinYMin slice"}, 
            React.createElement("g", {id: "title-wave"}, 
              React.createElement("path", {className: "shire-title-wave", d: wave, fill: "none", strokeWidth: "1", style: {strokeDasharray:(length+" "+length)}})
            )
          ), 
          React.createElement("div", {className: "shire-title-logo", style: {opacity:0}}, " srss [side shire] ")
        )
      );
    }
  });

  var existWaveFlag = false;

  var Content = React.createClass({displayName: "Content",
    componentDidMount: function(){
      SVGAnimater.appearPath(document.querySelector("#content-wave > path"), duration, 100);
      timerList["appearContent"] = setTimeout(function(){
          var element = document.querySelector(".shire-content-block > span > .shire-content-sub");
          element.style.opacity = "1";
          element.style.top = "15px";
          existWaveFlag = true;
        }, duration);
    },
    componentWillLeave: function(callback){
      SVGAnimater.disappearPath(document.querySelector("#content-wave > path"), duration);
      var element = document.querySelector(".shire-content-block > span > .shire-content-sub");
      element.style.opacity = "0";
      element.style.top = body.clientHeight + "px";
      existWaveFlag = false;
      setTimeout(callback, duration);
    },
    render: function() {
      var leftp = body.clientHeight * 1.125 / 2;
      var waveHeight = body.clientHeight - 80;
      var width = (body.clientWidth - leftp) * 0.9;

      if(width > 800) {
        width = 800;
      } else if(width < 400) {
        width = 400;
      }

      leftp += 30;

      var wave = "M0 " + waveHeight + " H" + (leftp) + " V10 H" + (leftp + width) + " V" + waveHeight + " H" + body.clientWidth;
      var length = body.clientWidth + (waveHeight - 10) * 2;

      var waveHTML = (
        React.createElement("div", {className: "shire-svg-block shire-wave-block"}, 
          React.createElement("svg", {className: "shire-wave-svg", mlns: "http://www.w3.org/2000/svg", fillRule: "evenodd", clipRule: "evenodd", strokeLineJoin: "round", strokeMiterLimit: "1.41421", preserveAspectRatio: "xMinYMin slice"}, 
            React.createElement("g", {id: "content-wave"}, 
              React.createElement("path", {className: "shire-title-wave", d: wave, fill: "none", strokeWidth: "1", style: {strokeDasharray:(length+" "+length)}})
            )
          )
        )
      )
      switch(this.props.state){
        case EState.NEWS:
          return (
            React.createElement("div", {className: "shire-content-block"}, 
              waveHTML, 
              React.createElement(TransitionGroup, null, 
                React.createElement(News, {width: width-52, left: leftp+6, key: "news"})
              )
            )
          );
        case EState.WORKS:
          return (
            React.createElement("div", {className: "shire-content-block"}, 
              waveHTML, 
              React.createElement(TransitionGroup, null, 
                React.createElement(Works, {width: width-52, left: leftp+6, key: "works"})
              )
            )
          );
        case EState.ABOUT:
          return (
            React.createElement("div", {className: "shire-content-block"}, 
              waveHTML, 
              React.createElement(TransitionGroup, null, 
                React.createElement(About, {width: width-52, left: leftp+6, key: "about"})
              )
            )
          );
        default:
          return(React.createElement("div", null));
        }
      },
    disappearContent: function(element){
      element.style.opacity = "0";
      element.style.top = body.clientHeight + "px";
    }
  });

  var News = React.createClass({displayName: "News",
    componentDidMount: function(){
      if(existWaveFlag){
        var element = document.querySelector(".shire-news-block");
        element.getBoundingClientRect();
        element.style.opacity = "1";
        element.style.top = "15px";
      }
    },
    componentWillLeave: function(callback){
      var element = document.querySelector(".shire-news-block");
      element.style.opacity = "0";
      element.style.top = "-100%";
      setTimeout(callback, 500);
    },
    render: function() {
      var leftp = body.clientHeight * 1.125 / 2;
      var waveHeight = body.clientHeight - 80;
      var width = (body.clientWidth - leftp) * 0.9;

      if(width > 800) {
        width = 800;
      } else if(width < 400) {
        width = 400;
      }
      return (
        React.createElement("div", {className: "shire-news-block shire-content-sub", style: {width:this.props.width, left:this.props.left, opacity:0, top:"100%", transition: "all .5s cubic-bezier(.4,0,.2,1)"}}, 
          React.createElement("h1", null, " News "), 
          React.createElement("div", {style: {width:"100%", height: "50px"}})
        )
      );
    }
  });

  var Works = React.createClass({displayName: "Works",
    componentDidMount: function(){
      if(existWaveFlag){
        var element = document.querySelector(".shire-works-block");
        element.getBoundingClientRect();
        element.style.opacity = "1";
        element.style.top = "15px";
      }
    },
    componentWillLeave: function(callback){
      var element = document.querySelector(".shire-works-block");
      element.style.opacity = "0";
      element.style.top = "-100%";
      setTimeout(callback, 500);
    },
    render: function() {
      var leftp = body.clientHeight * 1.125 / 2;
      var waveHeight = body.clientHeight - 80;
      var width = (body.clientWidth - leftp) * 0.9;

      if(width > 800) {
        width = 800;
      } else if(width < 400) {
        width = 400;
      }
      return (
        React.createElement("div", {className: "shire-works-block shire-content-sub", style: {width:this.props.width, left:this.props.left, opacity:0, top:"100%", transition: "all .5s cubic-bezier(.4,0,.2,1)"}}, 
          React.createElement("h1", null, " Works "), 
          React.createElement("div", {style: {width:"100%", height: "50px"}})
        )
      );
    }
  });

  var About = React.createClass({displayName: "About",
    componentDidMount: function(){
      if(existWaveFlag){
        var element = document.querySelector(".shire-about-block");
        element.getBoundingClientRect();
        element.style.opacity = "1";
        element.style.top = "15px";
      }
    },
    componentWillLeave: function(callback){
      var element = document.querySelector(".shire-about-block");
      element.style.opacity = "0";
      element.style.top = "-100%";
      setTimeout(callback, 500);
    },
    render: function() {
      var leftp = body.clientHeight * 1.125 / 2;
      var waveHeight = body.clientHeight - 80;
      var width = (body.clientWidth - leftp) * 0.9;

      if(width > 800) {
        width = 800;
      } else if(width < 400) {
        width = 400;
      }
      return (
        React.createElement("div", {className: "shire-about-block shire-content-sub", style: {width:this.props.width, left:this.props.left, opacity:0, top:"100%", transition: "all .5s cubic-bezier(.4,0,.2,1)"}}, 
          React.createElement("h1", null, " About "), 
          React.createElement("div", {className: "shire-panel"}, 
            React.createElement("table", null, 
              React.createElement("tbody", null, 
                React.createElement("tr", null, React.createElement("td", {style: {width:"100px"}}, "Circle"), React.createElement("td", null, "しれせせ")), 
                React.createElement("tr", null, React.createElement("td", null, "HN"), React.createElement("td", null, "shire")), 
                React.createElement("tr", null, React.createElement("td", null, "Twitter"), React.createElement("td", null, React.createElement("a", {href: "https://twitter.com/shire001"}, "@shire001"))), 
                React.createElement("tr", null, React.createElement("td", null, "Contact"), React.createElement("td", null, "7th.shire(at)gmail.com"))
              )
            ), 
            React.createElement("p", null, 
              React.createElement("iframe", {width: "100%", height: "450", scrolling: "no", frameBorder: "no", src: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/16396492&color=f20d5e&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false"})
            )
          ), 
          React.createElement("div", {style: {width:"100%", height: "50px"}})
        )
      );
    }
  });

  function rerender(renderFunc){
    var minH = 480;
    var minW = 600;
    var height = (body.clientHeight > minH)? body.clientHeight : minH;
    var width = (body.clientWidth > minW)? body.clientWidth : minW;

    if((typeof renderFunc) == "function"){
      renderFunc(height, width);
    } else {
      ReactDOM.render(
        React.createElement(Page, {width: width, height: height, topLogoOpacity: 1}),
        document.getElementById("content")
      );
    }
  };

  function hideLeftSide(){
    var leftSideElements = document.querySelectorAll(".shire-left-side");
    for(var i = 0; i < leftSideElements.length; i++){
      leftSideElements[i].style.transform = "translate(-320px)";
    }
  };

  function appearLeftSide(){
      var leftSideElements = document.querySelectorAll(".shire-left-side");
      for(var i = 0; i < leftSideElements.length; i++){
        leftSideElements[i].style.transform = "none";
      }
  };

  window.onresize = rerender;

  var SizeManager = {
    offsetPosition: 3,
    resizeMenu: function() {
      SizeManager.reposMenu();
    },

    menuElementsPosition: [-60, -40, -20, 0, 20, 40, 60, 80, 100, 120, 140, 160, 180],

    reposMenu: function(offset) {
      if(!offset){
        offset = SizeManager.offsetPosition;
      }
      var elements = document.querySelectorAll('.shire-menu-element');
      var halfElementSize = {
        width: elements[0].clientWidth / 2,
        height: elements[0].clientHeight / 2,
      }
      for(var i = 0; i < elements.length; i++){
        var pos = SizeManager.calcMenuElementPosition(SizeManager.menuElementsPosition[i + offset]);
        elements[i].style.top = (pos.top - halfElementSize.height) + "px";
        elements[i].style.left = (pos.left - halfElementSize.width) + "px";
        if(i + offset === 3){
          elements[i].classList.add("shire-menu-active");
        } else {
          elements[i].classList.remove("shire-menu-active");
        }
      }
    },
    calcMenuElementPosition: function(angle) {
      var circleSize = body.clientHeight * 0.325;
      var cy = body.clientHeight / 2;
      var a = angle / 180 * Math.PI;
      return {
        top: (cy + circleSize * Math.sin(a)),
        left: (circleSize * Math.cos(a))
      };
    }
  };

  var Initializer = {
    initTop: function() {
      var logo = document.querySelector('.shire-title-logo');
      logo.style.transition = logo.style.WebkitTransition = "none";
      logo.style.opacity = 0;
      setTimeout(function(){
        logo.style.transition = logo.style.WebkitTransition = "";
        logo.style.opacity = 1;
      }, appearWait * 4);
    },
    initMenuPosition: function() {
      SizeManager.reposMenu(8);
    }
  }

  var SVGAnimater = {
    appearDashedCircleLine: function(element, dashArray, appearWait, offsetTime){
      var length = 2 * element.getAttribute("r") * Math.PI;
      element.style.transition = element.style.WebkitTransition = "none";
      element.style.fillOpacity = "0";
      element.style.strokeDasharray = length + " " + length;
      element.style.strokeDashoffset = length;
      element.getBoundingClientRect();
      timerList["apDashCricleLine1"] = setTimeout(function(){
          element.style.transition = element.style.WebkitTransition = "all " + (appearWait / 1000 * 2) + "s ease-in-out";
          element.style.strokeDashoffset = "0";
          timerList["apDashCricleLine2"] = setTimeout(function(){
              element.style.transition = element.style.WebkitTransition = "all " + (appearWait / 1000) + "s ease-in-out";
              element.style.strokeDasharray = dashArray;
              timerList["apDashCricleLine3"] = setTimeout(function(){
                  element.style.transition = element.style.WebkitTransition = "";
                }, appearWait);
            }, appearWait);
        }, offsetTime);
    },
    appearCircle: function(element, appearWait, offsetTime){
      var length = 2 * element.getAttribute("r") * Math.PI;
      element.style.transition = element.style.WebkitTransition = "none";
      element.style.fillOpacity = "0";
      element.style.strokeDasharray = length + " " + length;
      element.style.strokeDashoffset = length;
      element.getBoundingClientRect();
      timerList["apCricle1"] = setTimeout(function(){
          element.style.transition = element.style.WebkitTransition = "all " + (appearWait / 1000 * 2) + "s ease-in-out";
          element.style.strokeDashoffset = "0";
          timerList["apCricle2"] = setTimeout(function(){
              element.style.transition = element.style.WebkitTransition = "all " + (appearWait / 1000) + "s ease-in-out";
              element.style.fillOpacity = "1";
              timerList["apCricle3"] = setTimeout(function(){
                  element.style.transition = element.style.WebkitTransition = "";
                }, appearWait);
            }, appearWait);
        }, offsetTime);
    },
    appearPath: function(element, appearWait, offsetTime){
      var length = element.getTotalLength();
      element.style.transition = element.style.WebkitTransition = "none";
      element.style.fillOpacity = "0";
      element.style.strokeDasharray = length + " " + length;
      element.style.strokeDashoffset = length;
      element.getBoundingClientRect();
      timerList["apPath1"] = setTimeout(function(){
          element.style.transition = element.style.WebkitTransition = "all " + (appearWait / 1000) + "s ease-in-out";
          element.style.strokeDashoffset = "0";
          timerList["apPath2"] = setTimeout(function(){
              element.style.fillOpacity = "1";
              timerList["apPath3"] = setTimeout(function(){
                  element.style.transition = element.style.WebkitTransition = "";
                }, appearWait);
            }, appearWait);
        }, offsetTime);
    },
    appearRect: function(element, appearWait, offsetTime){
      var length = 2 * element.getAttribute("width") + 2 * element.getAttribute("height");
      element.style.transition = element.style.WebkitTransition = "none";
      element.style.fillOpacity = "0";
      element.style.strokeDasharray = length + " " + length;
      element.style.strokeDashoffset = length;
      element.getBoundingClientRect();
      timerList["apRect1"] = setTimeout(function(){
          element.style.transition = element.style.WebkitTransition = "all " + (appearWait / 1000) + "s ease-in-out";
          element.style.strokeDashoffset = "0";
          timerList["apRect1"] = setTimeout(function(){
              element.style.fillOpacity = "1";
              timerList["apRect1"] = setTimeout(function(){
                  element.style.transition = element.style.WebkitTransition = "";
                }, appearWait);
            }, appearWait);
        }, offsetTime);
    },
    disappearPath: function(element, appearWait, offsetTime){
      var length = element.getTotalLength();
      element.style.transition = element.style.WebkitTransition = "none";
      element.style.strokeDashoffset = "0";
      element.getBoundingClientRect();
      timerList["disapPath1"] = setTimeout(function(){
          element.style.transition = element.style.WebkitTransition = "all " + (appearWait / 1000) + "s ease-in-out";
          element.style.strokeDashoffset = -length;
            timerList["disapPath1"] = setTimeout(function(){
                element.style.transition = element.style.WebkitTransition = "";
              }, appearWait);
        }, offsetTime);
    },
  }

/****************************************************************************/
/******************************* Loading ************************************/
/****************************************************************************/

  appearWait = 800;
  body = document.querySelector("body");

  render = ReactDOM.render(
    React.createElement(Page, {height: window.innerHeight, width: window.innerWidth}),
    document.getElementById("content")
  );
  // Initializer.initMenuPosition();
  // Initializer.initTop();

  var outttables = document.querySelector('#ttable-surface').children;
  var dashArrays = ["10", "10", "2,15", "10", "10"];
  for(var key = 0; key < outttables.length; key++){
    SVGAnimater.appearDashedCircleLine(outttables[key], dashArrays[key], appearWait);
  }
  outttables = document.querySelectorAll('#ttable-groove > circle');
  dashArrays = ["180, 60", "120, 60"];
  for(var key = 0; key < outttables.length; key++){
    SVGAnimater.appearDashedCircleLine(outttables[key], dashArrays[key], appearWait);
  }
  outttables = null;
  dashArrays = null;

  var circles = document.querySelectorAll(".shire-ttable-svg > .shire-ttable-born > circle");
  for(var i = 0; i < circles.length; i++){
    SVGAnimater.appearCircle(circles[i], appearWait);
  }
  circles = null;

  SVGAnimater.appearPath(document.querySelector("#shire-exit > path"), appearWait);
  SVGAnimater.appearRect(document.querySelector("#shire-exit > rect"), appearWait);

  // SVGAnimater.appearPath(document.querySelector("#title-wave > path"), 2000, appearWait * 1.5);
});

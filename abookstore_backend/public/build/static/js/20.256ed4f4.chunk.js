(this["webpackJsonpecommarce-apps"]=this["webpackJsonpecommarce-apps"]||[]).push([[20],{299:function(e,a,t){"use strict";t.d(a,"a",(function(){return c}));var n=t(0),r=t.n(n),l=t(107);function c(e){var a=e.LabelId,t=e.TypeName,n=e.LabelTitle,c=e.Name,s=e.Value,o=e.Placeholder,i=e.ClassName,m=e.handleOnchange;return r.a.createElement(l.a.Group,{className:i},r.a.createElement(l.a.Label,{htmlFor:a}," ",n," "),r.a.createElement(l.a.Control,{type:t,id:a,name:c,value:s||"",placeholder:o,onChange:m}))}},300:function(e,a,t){},364:function(e,a,t){"use strict";t.r(a);var n=t(13),r=t(17),l=t(0),c=t.n(l),s=(t(300),t(48)),o=t(55),i=t(19),m=t(107),u=t(6),p=t(23),d=t(7),f=t.n(d),g=t(8),h=t(164),b=t(292),E=t(299),y=t(91),O=t(110),w=t.n(O);function v(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}a.default=Object(p.o)((function(e){var a=Object(l.useState)({email:""}),t=Object(r.a)(a,2),p=t[0],d=t[1],O=Object(l.useState)({show:!1,type:"unknown",message:""}),j=Object(r.a)(O,2),N=j[0],P=j[1];return c.a.createElement(c.a.Fragment,null,c.a.createElement(y.a,{loading:!1}),c.a.createElement("div",{className:"AllWrapper fullHeight"},c.a.createElement("header",{className:"header authHeader clearfix",id:"header"},c.a.createElement(s.a,{fluid:!0},c.a.createElement(o.a,null,c.a.createElement(i.a,{sm:6},c.a.createElement("div",{className:"logoWrapper mt-4 mb-4"},c.a.createElement("h1",{className:"logoText"},c.a.createElement(u.Link,{to:"/"},c.a.createElement("img",{loading:"lazy",src:w.a,style:{width:"300px"}})))))))),c.a.createElement("main",{className:"loginMainArea clearfix fullHeight bgImage loginBodyBg pb-4",id:"loginArea"},c.a.createElement(s.a,{fluid:!0},c.a.createElement(o.a,null,c.a.createElement(i.a,{sm:4},c.a.createElement("div",{className:"loginBodyContent clearfix mb-4",id:"loginBody"},c.a.createElement("h2",{className:"headTitle mb-3"},"Forgot password?"),c.a.createElement("h5",null,"Lorem ipsum dolor sit ament, consecrator advising elite, sed do elusion temporal incipient")),c.a.createElement("div",{className:"formWrapper clearfix",id:"formWrapper"},c.a.createElement(m.a,null,c.a.createElement(E.a,{LabelId:"email",TypeName:"email",LabelTitle:"Email",Name:"email",Value:p.email,Placeholder:"Enter Your Email",handleOnchange:function(e){e.preventDefault(),d(function(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?v(t,!0).forEach((function(a){Object(n.a)(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):v(t).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}({},p,Object(n.a)({},e.target.name,e.target.value)))}}),c.a.createElement(h.a,{show:N.show,variant:N.type,onClose:function(){return P({show:!1})},dismissible:!0},c.a.createElement("p",null,N.message)),c.a.createElement(b.a,{type:"submit",className:"btn mt-2 mb-3 submitBtn",onClick:function(a){a.preventDefault(),f.a.post(g.a._RESET_PASSWORD,{email:p.email}).then((function(a){return P({show:!0,type:"success",message:a.data.message}),setTimeout((function(){return P({show:!1,type:"unknown",message:null})}),2e3),!!a.data.success&&setTimeout((function(){return e.history.push("/verify-code")}),2e3)})).catch((function(e){P({show:!0,type:"danger",message:e.response.data.message}),setTimeout((function(){P({show:!1,type:"unknown",message:""})}),3e3)}))}},"SEND CODE")))))))))}))}}]);
//# sourceMappingURL=20.256ed4f4.chunk.js.map
(this["webpackJsonpecommarce-apps"]=this["webpackJsonpecommarce-apps"]||[]).push([[11],{310:function(e,a,t){"use strict";var n=t(0),r=t.n(n),c=t(93),l=t.n(c),o=t(111),m=t(17),i=t(19),s=t(18),u=t(8),E=t(7),d=t.n(E),f=function(e){var a=Object(n.useState)([]),t=Object(m.a)(a,2),c=t[0],E=t[1];return Object(n.useEffect)((function(){var e=new AbortController;return function(){var e=Object(o.a)(l.a.mark((function e(){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,d.a.get(u.a._GET_STAGE_FILTER).then((function(e){return E(e.data.categories)}));case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()(),function(){e.abort()}}),[]),r.a.createElement(r.a.Fragment,null,c?c.map((function(e,a){return r.a.createElement(i.a,{sm:"3",key:a},r.a.createElement("h3",{className:"cardWidgetTitle mb-3"},e.category),r.a.createElement("ul",{className:"cardWidgetList ".concat(1===a?"cardWidgetList2":""," text-center")},e.stage?e.stage.map((function(a,t){return r.a.createElement(s.c,{key:"primary-".concat(t),Title:a.stage,Url:"/shop/filter/category/".concat(e.id,"/stage/").concat(a.id)})})):""))})):"")};a.a=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(f,null))}},313:function(e,a,t){"use strict";var n=t(0),r=t.n(n),c=t(6),l=t(19),o=t(165),m=t(88),i=t(57),s=t.n(i),u=(t(92),t(10));a.a=Object(u.b)((function(e){return{favorite:e.favorite}}),null)((function(e){var a=e.bookId,t=e.BookImage,n=e.ProductTitle,i=e.AuthorName,u=e.ProductPrice,E=e.ImageBg,d=e.isFev,f=void 0!==d&&d,v=e.removeFavItem;e.stateFav,e.favorite;return r.a.createElement(l.a,{className:"col-auto"},r.a.createElement(s.a,{once:!0,height:200},r.a.createElement(o.a,{className:"productCard border-0 bg-transparent"},r.a.createElement("div",{className:"productMedia mb-3 ".concat(E)},r.a.createElement(m.a,{src:t,alt:"Book Image",style:{width:"163px"}})),r.a.createElement("div",{className:"productContent"},r.a.createElement(c.Link,{to:"/product/".concat(a)},r.a.createElement("h4",{className:"productTitle limit-character mb-1"},n," ",!0===f?r.a.createElement("span",{className:"favoritIcon"},r.a.createElement("i",{className:"fas fa-star"})):"")),r.a.createElement("h5",{className:"authorName mb-1"},i),r.a.createElement("p",{className:"productPrice"},"Ksh ",u),r.a.createElement("button",{className:"btn btn-danger",onClick:function(e){v(e)}.bind(undefined,a)},"Remove")))))}))},336:function(e,a,t){},373:function(e,a,t){"use strict";t.r(a);var n=t(0),r=t.n(n),c=t(48),l=t(55),o=t(19),m=t(165),i=t(10),s=t(313),u=t(62),E=t(63),d=t(60),f=t(61),v=t(166),b=t(109),p=(t(336),t(91)),g=t(310);a.default=Object(i.b)((function(e){return{cart:e.shop.cart,favorite:e.favorite}}),(function(e){return{showAllFavItem:function(){return e(Object(b.e)())},removeFavItem:function(a){return e(Object(b.d)(a))}}}))((function(e){var a=e.cart.length,t=e.favorite.items.length,i=0!==t?e.favorite.items:[];Object(n.useEffect)((function(){var a=new AbortController;return e.showAllFavItem(),function(){a.abort()}}),[]);var b=function(a){return e.removeFavItem(a)};return r.a.createElement(r.a.Fragment,null,r.a.createElement(p.a,{loading:e.favorite.pending}),r.a.createElement("div",{className:"allWrapper"},r.a.createElement(d.a,{favorite_item:t,cartItem:a}),r.a.createElement(f.a,{favorite_item:t,cartItem:a}),r.a.createElement("main",{className:"mainContent clearfix",id:"mainContent"},r.a.createElement("section",{className:"sectionBreadcrumb secGap clearfix pb-0",id:"sectionBreadcrumb"},r.a.createElement(c.a,null,r.a.createElement(l.a,null,r.a.createElement(o.a,null,r.a.createElement(v.a,null))))),0===t?r.a.createElement("section",{className:"chooseCategory clearfix",id:"chooseCategory"},r.a.createElement(c.a,null,r.a.createElement(l.a,null,r.a.createElement(o.a,{xs:12},r.a.createElement("div",{className:"contentArea text-center mt-5 mb-5"},r.a.createElement("h2",{className:"sectionTitle mb-3"},"You don\u2019t have any ",r.a.createElement("span",null," Favorites")),r.a.createElement("p",null,"It\u2019s not a problem. Just choose a category you\u2019re interested in and add goods to favorites list")))),r.a.createElement(l.a,null,r.a.createElement(o.a,null,r.a.createElement(m.a,{className:"border-0"},r.a.createElement(m.a.Body,{className:"p-0"},r.a.createElement("div",{className:"cardContentDetails pt-5 pb-5 mb-5 bgGray clearfix"},r.a.createElement(l.a,null,r.a.createElement(g.a,null))))))))):r.a.createElement(r.a.Fragment,null," ",r.a.createElement("section",{className:"favoritesItems secGap productView clearfix",id:"favoritesItems"},r.a.createElement(c.a,null,r.a.createElement(l.a,{className:"mt-5 mb-5 "},i.map((function(e,a){return r.a.createElement(s.a,{key:a,bookId:e.id,ImageBg:"bgGray",BookImage:"".concat(e.cover_images.img_1),ProductTitle:e.name,AuthorName:e.book_author.name,ProductPrice:e.price,isFev:!0,removeFavItem:b})}))))),r.a.createElement("section",{className:"mailSubscribe clearfix sectionBgImage sectionBgImg01 secGap",id:"mailSubscribe"},r.a.createElement(c.a,{className:"container"},r.a.createElement(u.a,null))))),r.a.createElement(E.a,null)))}))}}]);
//# sourceMappingURL=11.8e5a5a9d.chunk.js.map
(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{21:function(t,e,n){},23:function(t,e,n){t.exports=n(75)},28:function(t,e,n){},32:function(t,e,n){},34:function(t,e,n){},36:function(t,e,n){},38:function(t,e,n){},40:function(t,e,n){},42:function(t,e,n){},50:function(t,e,n){},52:function(t,e,n){},54:function(t,e,n){},56:function(t,e,n){},58:function(t,e,n){},61:function(t,e,n){},63:function(t,e,n){},65:function(t,e,n){},67:function(t,e,n){},69:function(t,e,n){},71:function(t,e,n){},73:function(t,e,n){},75:function(t,e,n){"use strict";n.r(e);var a=n(0),o=n.n(a),r=n(14),i=n.n(r),s=n(79),l=(n(28),n(3)),c=n.n(l),u=n(10),d=n(5),m=n(6),p=n(8),h=n(7),g=n(9),f=n(80),v=n(46),b=n(78),E=n(81),y=(n(32),function(t){return o.a.createElement(a.Fragment,null,o.a.createElement("header",{className:"main-header"},t.header),t.mobileNav,o.a.createElement("main",{className:"content"},t.children))}),w=(n(34),function(t){return i.a.createPortal(o.a.createElement("div",{className:["backdrop",t.open?"open":""].join(" "),onClick:t.onClick}),document.getElementById("backdrop-root"))}),P=(n(36),function(t){return o.a.createElement("div",{className:"toolbar"},t.children)}),S=n(77),j=(n(38),function(t){return o.a.createElement("button",{className:"mobile-toggle",onClick:t.onOpen},o.a.createElement("span",{className:"mobile-toggle__bar"}),o.a.createElement("span",{className:"mobile-toggle__bar"}),o.a.createElement("span",{className:"mobile-toggle__bar"}))}),O=(n(40),function(t){return o.a.createElement("h1",{className:"logo"},"MessageNode")}),k=n(15),I=(n(42),[{id:"feed",text:"Feed",link:"/",auth:!0},{id:"login",text:"Login",link:"/",auth:!1},{id:"signup",text:"Signup",link:"/signup",auth:!1}]),C=function(t){return[].concat(Object(k.a)(I.filter(function(e){return e.auth===t.isAuth}).map(function(e){return o.a.createElement("li",{key:e.id,className:["navigation-item",t.mobile?"mobile":""].join(" ")},o.a.createElement(S.a,{to:e.link,exact:!0,onClick:t.onChoose},e.text))})),[t.isAuth&&o.a.createElement("li",{className:["navigation-item",t.mobile?"mobile":""].join(" "),key:"logout"},o.a.createElement("button",{onClick:t.onLogout},"Logout"))])},F=(n(50),function(t){return o.a.createElement("nav",{className:"main-nav"},o.a.createElement(j,{onOpen:t.onOpenMobileNav}),o.a.createElement("div",{className:"main-nav__logo"},o.a.createElement(S.a,{to:"/"},o.a.createElement(O,null))),o.a.createElement("div",{className:"spacer"}),o.a.createElement("ul",{className:"main-nav__items"},o.a.createElement(C,{isAuth:t.isAuth,onLogout:t.onLogout})))}),N=(n(52),function(t){return o.a.createElement("nav",{className:["mobile-nav",t.open?"open":""].join(" ")},o.a.createElement("ul",{className:["mobile-nav__items",t.mobile?"mobile":""].join(" ")},o.a.createElement(C,{mobile:!0,onChoose:t.onChooseItem,isAuth:t.isAuth,onLogout:t.onLogout})))}),A=n(48),x=(n(54),function(t){return t.link?o.a.createElement(A.a,{className:["button","button--".concat(t.design),"button--".concat(t.mode)].join(" "),to:t.link},t.children):o.a.createElement("button",{className:["button","button--".concat(t.design),"button--".concat(t.mode)].join(" "),onClick:t.onClick,disabled:t.disabled||t.loading,type:t.type},t.loading?"Loading...":t.children)}),H=(n(56),function(t){return i.a.createPortal(o.a.createElement("div",{className:"modal"},o.a.createElement("header",{className:"modal__header"},o.a.createElement("h1",null,t.title)),o.a.createElement("div",{className:"modal__content"},t.children),o.a.createElement("div",{className:"modal__actions"},o.a.createElement(x,{design:"danger",mode:"flat",onClick:t.onCancelModal},"Cancel"),o.a.createElement(x,{mode:"raised",onClick:t.onAcceptModal,disabled:!t.acceptEnabled,loading:t.isLoading},"Accept"))),document.getElementById("modal-root"))}),_=function(t){return console.log(t.error),o.a.createElement(a.Fragment,null,t.error&&o.a.createElement(w,{onClick:t.onHandle}),t.error&&o.a.createElement(H,{title:"An Error Occurred",onCancelModal:t.onHandle,onAcceptModal:t.onHandle,acceptEnabled:!0},o.a.createElement("p",null,t.error.message)))},L=n(2),U=n(22),B=(n(58),function(t){var e=Object(a.useState)(!1),n=Object(U.a)(e,2),r=n[0],i=n[1];return Object(a.useEffect)(function(){Object(u.a)(c.a.mark(function e(){var n,a,o,r;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=localStorage.getItem("userId"),a={query:"\n         query getCreationStatusOperation ($userId: ID!, $postId: ID!) {\n            getCreationStatus(userId: $userId, postId: $postId) {\n                  created\n            }\n          } \n          ",variables:{userId:n,postId:t.id}},e.next=4,fetch("http://localhost:8080/graphql",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(t.token)},body:JSON.stringify(a)});case 4:return o=e.sent,e.next=7,o.json();case 7:r=e.sent,i(r.data.getCreationStatus.created);case 9:case"end":return e.stop()}},e)}))()},[]),o.a.createElement("article",{className:"post"},o.a.createElement("header",{className:"post__header"},o.a.createElement("h3",{className:"post__meta"},"Posted by ",t.author," on ",t.date),o.a.createElement("h1",{className:"post__title"},t.title)),o.a.createElement("div",{className:"post__actions"},o.a.createElement(x,{mode:"flat",link:t.id},"View"),r?o.a.createElement(a.Fragment,null,o.a.createElement(x,{mode:"flat",onClick:t.onStartEdit},"Edit"),o.a.createElement(x,{mode:"flat",design:"danger",onClick:t.onDelete},"Delete")):null))}),$=n(12),D=(n(21),function(t){return o.a.createElement("div",{className:"input"},t.label&&o.a.createElement("label",{htmlFor:t.id},t.label),"input"===t.control&&o.a.createElement("input",{className:[t.valid?"valid":"invalid",t.touched?"touched":"untouched"].join(" "),type:t.type,id:t.id,required:t.required,value:t.value,placeholder:t.placeholder,onChange:function(e){return t.onChange(t.id,e.target.value,e.target.files)},onBlur:t.onBlur}),"textarea"===t.control&&o.a.createElement("textarea",{className:[t.valid?"valid":"invalid",t.touched?"touched":"untouched"].join(" "),id:t.id,rows:t.rows,required:t.required,value:t.value,onChange:function(e){t.onChange(t.id,e.target.value,e.target.files)},onBlur:t.onBlur}))}),T=function(t){return o.a.createElement("div",{className:"input"},o.a.createElement("label",{htmlFor:t.id},t.label),o.a.createElement("input",{className:[t.valid?"valid":"invalid",t.touched?"touched":"untouched"].join(" "),type:"file",id:t.id,onChange:function(e){console.log(t.id,"line",e.target.value,"line",e.target.files),t.onChange(t.id,e.target.value,e.target.files)},onBlur:t.onBlur}))},q=(n(61),function(t){return o.a.createElement("div",{className:"image",style:{backgroundImage:"url('".concat(t.imageUrl,"')"),backgroundSize:t.contain?"contain":"cover",backgroundPosition:t.left?"left":"center"}})}),M=function(t){return""!==t.trim()},z=function(t){return function(e){var n=!0;return t.min&&(n=n&&e.trim().length>=t.min),t.max&&(n=n&&e.trim().length<=t.max),n}},V=function(t){var e=!0;if(t.match(/^[A-Za-z]+$/))return console.log("TEST"),e;console.log("INVALID"),e=!1},J=function(t,e){var n=!0;if(t===e)return console.log("TEST"),n;console.log("INVALID"),n=!1},R=function(t){return/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(t)},Y=function(t){var e=new FileReader,n=new Promise(function(t,n){e.onload=function(e){return t(e.target.result)},e.onerror=function(t){return n(t)}});return e.readAsDataURL(t),n};function G(t,e){var n="undefined"!==typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"===typeof t)return Z(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return Z(t,e)}(t))||e&&t&&"number"===typeof t.length){n&&(t=n);var a=0,o=function(){};return{s:o,n:function(){return a>=t.length?{done:!0}:{done:!1,value:t[a++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,i=!0,s=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return i=t.done,t},e:function(t){s=!0,r=t},f:function(){try{i||null==n.return||n.return()}finally{if(s)throw r}}}}function Z(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,a=new Array(e);n<e;n++)a[n]=t[n];return a}var K={title:{value:"",valid:!1,touched:!1,validators:[M,z({min:6}),V]},image:{value:"",valid:!1,touched:!1,validators:[M]},content:{value:"",valid:!1,touched:!1,validators:[M,z({min:6})]},id:{value:"",valid:!0,touched:!0}},Q=function(t){function e(){var t,n;Object(d.a)(this,e);for(var a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return(n=Object(p.a)(this,(t=Object(h.a)(e)).call.apply(t,[this].concat(o)))).state={postForm:K,formIsValid:!1,imagePreview:null},n.postInputChangedHandler=function(){var t=Object(u.a)(c.a.mark(function t(e,a,o){var r;return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,!o){t.next=6;break}return t.next=4,Y(o[0]);case 4:r=t.sent,n.setState({imagePreview:r});case 6:n.setState(function(t){var n,r=!0,i=G(t.postForm[e].validators);try{for(i.s();!(n=i.n()).done;){var s=n.value;r=r&&s(a)}}catch(d){i.e(d)}finally{i.f()}var l=Object(L.a)({},t.postForm,Object($.a)({},e,Object(L.a)({},t.postForm[e],{valid:r,value:o?o[0]:a}))),c=!0;for(var u in l)c=c&&l[u].valid;return{postForm:l,formIsValid:c}}),t.next=13;break;case 9:t.prev=9,t.t0=t.catch(0),console.log("ENTERED2"),n.setState({imagePreview:null});case 13:case"end":return t.stop()}},t,null,[[0,9]])}));return function(e,n,a){return t.apply(this,arguments)}}(),n.inputBlurHandler=function(t){n.setState(function(e){return{postForm:Object(L.a)({},e.postForm,Object($.a)({},t,Object(L.a)({},e.postForm[t],{touched:!0})))}})},n.cancelPostChangeHandler=function(){n.setState({postForm:K,formIsValid:!1}),n.props.onCancelEdit()},n.acceptPostChangeHandler=function(){var t={title:n.state.postForm.title.value,image:n.state.postForm.image.value,content:n.state.postForm.content.value,id:n.state.postForm.id.value};console.log(t),n.props.onFinishEdit(t),n.setState({postForm:K,formIsValid:!1,imagePreview:null})},n}return Object(g.a)(e,t),Object(m.a)(e,[{key:"componentDidUpdate",value:function(t,e){if(this.props.editing&&t.editing!==this.props.editing&&t.selectedPost!==this.props.selectedPost){var n={title:Object(L.a)({},e.postForm.title,{value:this.props.selectedPost.title,valid:!0}),image:Object(L.a)({},e.postForm.image,{value:this.props.selectedPost.imagePath,valid:!0}),content:Object(L.a)({},e.postForm.content,{value:this.props.selectedPost.content,valid:!0}),id:Object(L.a)({},e.postForm.id,{value:this.props.selectedPost._id,valid:!0})};this.setState({postForm:n,formIsValid:!0})}}},{key:"render",value:function(){return this.props.editing?o.a.createElement(a.Fragment,null,o.a.createElement(w,{onClick:this.cancelPostChangeHandler}),o.a.createElement(H,{title:"New Post",acceptEnabled:this.state.formIsValid,onCancelModal:this.cancelPostChangeHandler,onAcceptModal:this.acceptPostChangeHandler,isLoading:this.props.loading},o.a.createElement("form",null,o.a.createElement(D,{id:"title",label:"Title",control:"input",onChange:this.postInputChangedHandler,onBlur:this.inputBlurHandler.bind(this,"title"),valid:this.state.postForm.title.valid,touched:this.state.postForm.title.touched,value:this.state.postForm.title.value}),o.a.createElement(T,{id:"image",label:"Image",control:"input",onChange:this.postInputChangedHandler,onBlur:this.inputBlurHandler.bind(this,"image"),valid:this.state.postForm.image.valid,touched:this.state.postForm.image.touched}),o.a.createElement("div",{className:"new-post__preview-image"},!this.state.imagePreview&&o.a.createElement("p",null,"Please choose an image."),this.state.imagePreview&&o.a.createElement(q,{imageUrl:this.state.imagePreview,contain:!0,left:!0})),o.a.createElement(D,{id:"content",label:"Content",control:"textarea",onChange:this.postInputChangedHandler,onBlur:this.inputBlurHandler.bind(this,"content"),valid:this.state.postForm.content.valid,touched:this.state.postForm.content.touched,value:this.state.postForm.content.value})))):null}}]),e}(a.Component),W=(n(63),function(t){return o.a.createElement("div",{className:"paginator"},t.children,o.a.createElement("div",{className:"paginator__controls"},t.currentPage>1&&o.a.createElement("button",{className:"paginator__control",onClick:t.onPrevious},"Previous"),t.currentPage<t.lastPage&&o.a.createElement("button",{className:"paginator__control",onClick:t.onNext},"Next")))}),X=(n(65),function(t){return o.a.createElement("div",{className:"loader"},o.a.createElement("div",null),o.a.createElement("div",null),o.a.createElement("div",null),o.a.createElement("div",null))}),tt=(n(67),function(t){function e(){var t,n;Object(d.a)(this,e);for(var a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return(n=Object(p.a)(this,(t=Object(h.a)(e)).call.apply(t,[this].concat(o)))).state={isEditing:!1,posts:[],totalPosts:0,editPost:null,status:"",postPage:1,postsLoading:!0,editLoading:!1,statusLoading:!1},n.loadPosts=function(){var t=Object(u.a)(c.a.mark(function t(e){var a,o,r,i;return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,e&&n.setState({postsLoading:!0,posts:[]}),a=n.state.postPage,console.log(a),"next"===e&&(a++,n.setState({postPage:a})),"previous"===e&&(a--,console.log(n.state.postPage),n.setState({postPage:a}),console.log(n.state.postPage)),console.log(n.state.postPage,"NEEDPOSTPAGE"),o={query:"\n       \n       query FetchPosts($page: Int!) {\n          getPosts(pageNumber: $page) {\n            posts {\n              _id\n              content \n              title\n              imageUrl\n              creator {\n                name \n                _id\n              }\n              createdAt\n            }\n            page\n            totalItems\n          }\n        } ",variables:{page:a}},t.next=10,fetch("http://localhost:8080/graphql",{method:"POST",headers:{Authorization:"Bearer ".concat(n.props.token),"Content-Type":"application/json"},body:JSON.stringify(o)});case 10:return r=t.sent,t.next=13,r.json();case 13:if(i=t.sent,console.log(i),!i.errors){t.next=17;break}throw new Error("Failed to fetch posts.");case 17:console.log(i.data.getPosts,"LINE"),console.log(n.state),console.log(n.state.posts.length,n.state.postsLoading),n.setState({posts:i.data.getPosts.posts.map(function(t){return Object(L.a)({},t,{imagePath:t.imageUrl})}),totalPosts:i.data.getPosts.totalItems,postsLoading:!1}),console.log(n.state),console.log(n.state.posts.length,n.state.postsLoading),t.next=28;break;case 25:t.prev=25,t.t0=t.catch(0),n.catchError();case 28:case"end":return t.stop()}},t,null,[[0,25]])}));return function(e){return t.apply(this,arguments)}}(),n.statusUpdateHandler=function(){var t=Object(u.a)(c.a.mark(function t(e){var a,o;return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.preventDefault(),n.setState({statusLoading:!0}),a={query:"\n    mutation UpdateUserStatus($status: String!) {\n     updateUserStatus(status: $status)\n     }\n     ",variables:{status:n.state.status}},t.prev=3,t.next=6,fetch("http://localhost:8080/graphql",{method:"POST",body:JSON.stringify(a),headers:{Authorization:"Bearer ".concat(n.props.token),"Content-Type":"application/json"}});case 6:return o=t.sent,t.next=9,o.json();case 9:if(!t.sent.errors){t.next=13;break}throw n.setState({statusLoading:!1}),new Error("Could not update status!");case 13:n.setState({statusLoading:!1}),t.next=20;break;case 16:t.prev=16,t.t0=t.catch(3),n.catchError(),n.setState({statusLoading:!1});case 20:case"end":return t.stop()}},t,null,[[3,16]])}));return function(e){return t.apply(this,arguments)}}(),n.newPostHandler=function(){n.setState({isEditing:!0})},n.startEditPostHandler=function(t){n.setState(function(e){return{isEditing:!0,editPost:Object(L.a)({},e.posts.find(function(e){return e._id===t}))}})},n.cancelEditHandler=function(){n.setState({isEditing:!1,editPost:null})},n.finishEditHandler=function(){var t=Object(u.a)(c.a.mark(function t(e){var a,o,r,i,s,l,u,d;return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,n.setState({editLoading:!0}),(a=new FormData).append("image",e.image),n.state.editPost&&a.append("oldPath",n.state.editPost.imagePath),t.next=7,fetch("http://localhost:8080/post-image",{method:"PUT",body:a,headers:{Authorization:"Bearer ".concat(n.props.token)}});case 7:return o=t.sent,t.next=10,o.json();case 10:return r=t.sent,console.log(r),i=r.filePath?r.filePath.replace(/\\/g,"/"):"undefined",console.log(i,"IMAGEURL"),s={query:"\n        mutation createPostOperation($title: String!, $content: String!, $imageUrl: String!){\n          createPost(\n            userInput: {\n                  title: $title,\n                  content: $content,\n                  imageUrl: $imageUrl\n            }\n         ) {\n\n            title\n            content \n            _id\n            imageUrl\n            createdAt\n            creator {\n                name\n            }\n        }\n      }\n      ",variables:{title:e.title,content:e.content,imageUrl:i}},n.state.editPost&&(s={query:"\n          \n          mutation UpdatePostOperation($postId: ID!, $title: String!, $content: String!, $imageUrl: String!){\n            updatePost(postId: $postId, userInput: {title: $title, content: $content, imageUrl: $imageUrl } )\n           {\n              _id \n              title \n              content\n              imageUrl\n              creator {\n                name\n                posts {\n                  title\n                }\n              }\n              createdAt\n          }\n        }\n          \n          ",variables:{postId:n.state.editPost._id,title:e.title,content:e.content,imageUrl:i}}),t.next=18,fetch("http://localhost:8080/graphql",{method:"POST",body:JSON.stringify(s),headers:{Authorization:"Bearer ".concat(n.props.token),"Content-Type":"application/json"}});case 18:if(!(l=t.sent).errors||400!==l[0].status){t.next=21;break}throw new Error("Please input values that are valid and not equal to previous ones.");case 21:if(!l.errors){t.next=23;break}throw new Error("Creating or editing a post failed!");case 23:return console.log(l),t.next=26,l.json();case 26:u=t.sent,console.log(u),d=n.state.editPost?{_id:u.data.updatePost._id,title:u.data.updatePost.title,content:u.data.updatePost.content,creator:u.data.updatePost.creator,createdAt:u.data.updatePost.createdAt,imagePath:u.data.updatePost.imageUrl}:{_id:u.data.createPost._id,title:u.data.createPost.title,content:u.data.createPost.content,creator:u.data.createPost.creator,createdAt:u.data.createPost.createdAt,imagePath:u.data.createPost.imageUrl},console.log(d,"LINE646"),n.setState(function(t){var e=Object(k.a)(t.posts),n=t.totalPosts;t.editPost?e[t.posts.findIndex(function(e){return e._id===t.editPost._id})]=d:(n++,t.posts.length>=5&&e.pop(),e.unshift(d));return{posts:e,isEditing:!1,editPost:null,editLoading:!1,totalPosts:n}}),t.next=37;break;case 33:t.prev=33,t.t0=t.catch(0),n.setState({isEditing:!1,editPost:null,editLoading:!1,error:t.t0}),n.loadPosts();case 37:case"end":return t.stop()}},t,null,[[0,33]])}));return function(e){return t.apply(this,arguments)}}(),n.statusInputChangedHandler=function(t,e){n.setState({status:e})},n.updatePost=function(t,e){n.setState(function(e){var n=Object(k.a)(e.posts),a=n.findIndex(function(e){return t._id===e._id});return a>-1&&(n[a]=t),{posts:n}})},n.deletePostHandler=function(){var t=Object(u.a)(c.a.mark(function t(e){var a,o,r;return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,n.setState({postsLoading:!0}),a={query:"\n\n        mutation DeletePostOperation($postId: ID!) {\n              deletePost(postId: $postId) \n        }\n        \n        ",variables:{postId:e}},t.next=5,fetch("http://localhost:8080/graphql",{method:"POST",headers:{Authorization:"Bearer ".concat(n.props.token),"Content-Type":"application/json"},body:JSON.stringify(a)});case 5:return o=t.sent,t.next=8,o.json();case 8:if(r=t.sent,console.log(r),!r.errors){t.next=12;break}throw new Error("Post delete failed");case 12:n.loadPosts(),t.next=19;break;case 15:t.prev=15,t.t0=t.catch(0),console.log(t.t0),n.setState({postsLoading:!1});case 19:case"end":return t.stop()}},t,null,[[0,15]])}));return function(e){return t.apply(this,arguments)}}(),n.errorHandler=function(){n.setState({error:null})},n.catchError=function(t){n.setState({error:t})},n}return Object(g.a)(e,t),Object(m.a)(e,[{key:"componentDidMount",value:function(){var t=this;fetch("http://localhost:8080/graphql",{headers:{Authorization:"Bearer "+this.props.token,"Content-Type":"application/json"},body:JSON.stringify({query:"\n        {\n          getStatus\n        } \n        \n        "}),method:"POST"}).then(function(t){return t.json()}).then(function(e){if(console.log(e),e.errors)throw new Error("Failed to fetch user status.");console.log(e.data.getStatus),t.setState({status:e.data.getStatus})}).then().catch(this.catchError),this.loadPosts(),console.log("Entered")}},{key:"render",value:function(){var t=this;return o.a.createElement(a.Fragment,null,o.a.createElement(_,{error:this.state.error,onHandle:this.errorHandler}),o.a.createElement(Q,{editing:this.state.isEditing,selectedPost:this.state.editPost,loading:this.state.editLoading,onCancelEdit:this.cancelEditHandler,onFinishEdit:this.finishEditHandler}),o.a.createElement("section",{className:"feed__status"},o.a.createElement("form",{onSubmit:this.statusUpdateHandler},o.a.createElement(D,{type:"text",placeholder:"Your status",control:"input",onChange:this.statusInputChangedHandler,value:this.state.status}),this.state.statusLoading?o.a.createElement(X,null):o.a.createElement(x,{mode:"flat",type:"submit"},"Update"))),o.a.createElement("section",{className:"feed__control"},o.a.createElement(x,{mode:"raised",design:"accent",onClick:this.newPostHandler},"New Post")),o.a.createElement("section",{className:"feed"},this.state.postsLoading&&o.a.createElement("div",{style:{textAlign:"center",marginTop:"2rem"}},o.a.createElement(X,null)),this.state.posts.length<=0&&!this.state.postsLoading?o.a.createElement("p",{style:{textAlign:"center"}},"No posts found."):null,!this.state.postsLoading&&o.a.createElement(W,{onPrevious:this.loadPosts.bind(this,"previous"),onNext:this.loadPosts.bind(this,"next"),lastPage:Math.ceil(this.state.totalPosts/5),currentPage:this.state.postPage},this.state.posts.map(function(e){return o.a.createElement(B,{key:e._id,id:e._id,author:e.creator.name,date:new Date(e.createdAt).toLocaleDateString("en-US"),title:e.title,image:e.imageUrl,content:e.content,onStartEdit:t.startEditPostHandler.bind(t,e._id),onDelete:t.deletePostHandler.bind(t,e._id),token:t.props.token,userId:t.props.userId})}))))}}]),e}(a.Component)),et=(n(69),function(t){function e(){var t,n;Object(d.a)(this,e);for(var a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return(n=Object(p.a)(this,(t=Object(h.a)(e)).call.apply(t,[this].concat(o)))).state={title:"",author:"",date:"",image:"",content:""},n}return Object(g.a)(e,t),Object(m.a)(e,[{key:"componentDidMount",value:function(){var t=this,e={query:"\n      query getPostOperation ($postId: ID!) {\n        getPost(postId: $postId) {\n                title\n                content\n                imageUrl\n                creator {\n                  name\n                }\n                createdAt\n              }\n      }\n      ",variables:{postId:this.props.match.params.postId}};fetch("http://localhost:8080/graphql",{method:"POST",headers:{Authorization:"Bearer ".concat(this.props.token),"Content-Type":"application/json"},body:JSON.stringify(e)}).then(function(t){return t.json()}).then(function(e){if(console.log(e),e.errors)throw new Error("Post fetch has failed.");t.setState({title:e.data.getPost.title,author:e.data.getPost.creator.name,date:new Date(e.data.getPost.createdAt).toLocaleDateString("en-US"),image:e.data.getPost.imageUrl,content:e.data.getPost.content})}).catch(function(t){console.log(t)})}},{key:"render",value:function(){return o.a.createElement("section",{className:"single-post"},o.a.createElement("h1",null,this.state.title),o.a.createElement("h2",null,"Created by ",this.state.author," on ",this.state.date),o.a.createElement("div",{className:"single-post__image"},o.a.createElement(q,{contain:!0,imageUrl:"http://localhost:8080/".concat(this.state.image)})),o.a.createElement("p",null,this.state.content))}}]),e}(a.Component)),nt=(n(71),function(t){return o.a.createElement("section",{className:"auth-form"},t.children)});function at(t,e){var n="undefined"!==typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"===typeof t)return ot(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return ot(t,e)}(t))||e&&t&&"number"===typeof t.length){n&&(t=n);var a=0,o=function(){};return{s:o,n:function(){return a>=t.length?{done:!0}:{done:!1,value:t[a++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,i=!0,s=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return i=t.done,t},e:function(t){s=!0,r=t},f:function(){try{i||null==n.return||n.return()}finally{if(s)throw r}}}}function ot(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,a=new Array(e);n<e;n++)a[n]=t[n];return a}var rt=function(t){function e(){var t,n;Object(d.a)(this,e);for(var a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return(n=Object(p.a)(this,(t=Object(h.a)(e)).call.apply(t,[this].concat(o)))).state={loginForm:{email:{value:"",valid:!1,touched:!1,validators:[M,R]},password:{value:"",valid:!1,touched:!1,validators:[M,z({min:5})]},formIsValid:!1}},n.inputChangedHandler=function(t,e){n.setState(function(n){var a,o=!0,r=at(n.loginForm[t].validators);try{for(r.s();!(a=r.n()).done;){var i=a.value;o=o&&i(e)}}catch(u){r.e(u)}finally{r.f()}var s=Object(L.a)({},n.loginForm,Object($.a)({},t,Object(L.a)({},n.loginForm[t],{valid:o,value:e}))),l=!0;for(var c in s)l=l&&s[c].valid;return{loginForm:s,formIsValid:l}})},n.inputBlurHandler=function(t){n.setState(function(e){return{loginForm:Object(L.a)({},e.loginForm,Object($.a)({},t,Object(L.a)({},e.loginForm[t],{touched:!0})))}})},n}return Object(g.a)(e,t),Object(m.a)(e,[{key:"render",value:function(){var t=this;return o.a.createElement(nt,null,o.a.createElement("form",{onSubmit:function(e){return t.props.onLogin(e,{email:t.state.loginForm.email.value,password:t.state.loginForm.password.value})}},o.a.createElement(D,{id:"email",label:"Your E-Mail",type:"email",control:"input",onChange:this.inputChangedHandler,onBlur:this.inputBlurHandler.bind(this,"email"),value:this.state.loginForm.email.value,valid:this.state.loginForm.email.valid,touched:this.state.loginForm.email.touched}),o.a.createElement(D,{id:"password",label:"Password",type:"password",control:"input",onChange:this.inputChangedHandler,onBlur:this.inputBlurHandler.bind(this,"password"),value:this.state.loginForm.password.value,valid:this.state.loginForm.password.valid,touched:this.state.loginForm.password.touched}),o.a.createElement(x,{design:"raised",type:"submit",loading:this.props.loading},"Login")))}}]),e}(a.Component);function it(t,e){var n="undefined"!==typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"===typeof t)return st(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return st(t,e)}(t))||e&&t&&"number"===typeof t.length){n&&(t=n);var a=0,o=function(){};return{s:o,n:function(){return a>=t.length?{done:!0}:{done:!1,value:t[a++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,i=!0,s=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return i=t.done,t},e:function(t){s=!0,r=t},f:function(){try{i||null==n.return||n.return()}finally{if(s)throw r}}}}function st(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,a=new Array(e);n<e;n++)a[n]=t[n];return a}var lt=function(t){function e(){var t,n;Object(d.a)(this,e);for(var a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return(n=Object(p.a)(this,(t=Object(h.a)(e)).call.apply(t,[this].concat(o)))).state={signupForm:{email:{value:"",valid:!1,touched:!1,validators:[M,R]},password:{value:"",valid:!1,touched:!1,validators:[M,z({min:7})]},confirmPassword:{value:"",valid:!1,touched:!1,validators:[M,J]},name:{value:"",valid:!1,touched:!1,validators:[M,V,z({min:6})]},formIsValid:!1}},n.inputChangedHandler=function(t,e){n.setState(function(a){var o,r=!0,i=it(a.signupForm[t].validators);try{for(i.s();!(o=i.n()).done;){var s=o.value;r=r&&s(e,n.state.signupForm.password.value)}}catch(d){i.e(d)}finally{i.f()}var l=Object(L.a)({},a.signupForm,Object($.a)({},t,Object(L.a)({},a.signupForm[t],{valid:r,value:e}))),c=!0;for(var u in l)c=c&&l[u].valid;return{signupForm:l,formIsValid:c}})},n.inputBlurHandler=function(t){n.setState(function(e){return{signupForm:Object(L.a)({},e.signupForm,Object($.a)({},t,Object(L.a)({},e.signupForm[t],{touched:!0})))}})},n}return Object(g.a)(e,t),Object(m.a)(e,[{key:"render",value:function(){var t=this;return o.a.createElement(nt,null,o.a.createElement("form",{onSubmit:function(e){return t.props.onLogin(e,{email:t.state.signupForm.email.value,password:t.state.signupForm.password.value,name:t.state.signupForm.name.value,confirmPassword:t.state.signupForm.confirmPassword.value})}},o.a.createElement(D,{id:"email",label:"Your E-Mail",type:"email",control:"input",onChange:this.inputChangedHandler,onBlur:this.inputBlurHandler.bind(this,"email"),value:this.state.signupForm.email.value,valid:this.state.signupForm.email.valid,touched:this.state.signupForm.email.touched}),o.a.createElement(D,{id:"name",label:"Your name",type:"text",control:"input",onChange:this.inputChangedHandler,onBlur:this.inputBlurHandler.bind(this,"name"),value:this.state.signupForm.name.value,valid:this.state.signupForm.name.valid,touched:this.state.signupForm.name.touched}),o.a.createElement(D,{id:"password",label:"Password",type:"password",control:"input",onChange:this.inputChangedHandler,onBlur:this.inputBlurHandler.bind(this,"password"),value:this.state.signupForm.password.value,valid:this.state.signupForm.password.valid,touched:this.state.signupForm.password.touched}),o.a.createElement(D,{id:"confirmPassword",label:"confirm Password",type:"password",control:"input",onChange:this.inputChangedHandler,onBlur:this.inputBlurHandler.bind(this,"confirmPassword"),value:this.state.signupForm.confirmPassword.value,valid:this.state.signupForm.confirmPassword.valid,touched:this.state.signupForm.confirmPassword.touched}),!this.state.signupForm.confirmPassword.valid&&this.state.signupForm.confirmPassword.touched&&o.a.createElement("p",{style:{color:"#3b0062"}},"Passwords do not match."),o.a.createElement(x,{design:"raised",type:"submit",loading:this.props.loading,disabled:!this.state.signupForm.confirmPassword.valid||!this.state.signupForm.password.valid||!this.state.signupForm.name.valid||!this.state.signupForm.email.valid},"signup")))}}]),e}(a.Component),ct=(n(73),function(t){function e(){var t,n;Object(d.a)(this,e);for(var a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return(n=Object(p.a)(this,(t=Object(h.a)(e)).call.apply(t,[this].concat(o)))).state={showBackdrop:!1,showMobileNav:!1,isAuth:!1,token:null,userId:null,authLoading:!1,error:null},n.mobileNavHandler=function(t){n.setState({showMobileNav:t,showBackdrop:t})},n.backdropClickHandler=function(){n.setState({showMobileNav:!1,showBackdrop:!1,error:null})},n.logoutHandler=function(){n.setState({isAuth:!1,token:null}),localStorage.removeItem("token"),localStorage.removeItem("expiryDate"),localStorage.removeItem("userId")},n.loginHandler=function(){var t=Object(u.a)(c.a.mark(function t(e,a){var o,r,i,s;return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,e.preventDefault(),n.setState({authLoading:!0}),o={query:" \n       query LoginUserOperation ($email: String!, $password: String!)  {\n      loginUser(\n        email: $email\n        password: $password\n     ) {\n          token\n          userId\n        }\n    }\n    ",variables:{email:a.email,password:a.password}},t.next=6,fetch("http://localhost:8080/graphql",{body:JSON.stringify(o),headers:{"Content-Type":"application/json"},method:"POST"});case 6:return r=t.sent,t.next=9,r.json();case 9:if(i=t.sent,console.log(i),!i.errors||!i.errors[0].status){t.next=13;break}throw new Error("Validation failed. Please make sure that the email has not been used before, and that the inputted data is valid.");case 13:if(!i.errors){t.next=15;break}throw new Error("Could not log you in!");case 15:n.setState({isAuth:!0,token:i.data.loginUser.token,userId:i.data.loginUser._id,authLoading:!1}),localStorage.setItem("token",i.data.loginUser.token),localStorage.setItem("userId",i.data.loginUser.userId),36e5,s=new Date((new Date).getTime()+36e5),localStorage.setItem("expiryDate",s.toISOString()),n.setAutoLogout(36e5),t.next=28;break;case 24:t.prev=24,t.t0=t.catch(0),console.log(t.t0),n.setState({isAuth:!1,authLoading:!1,error:t.t0});case 28:case"end":return t.stop()}},t,null,[[0,24]])}));return function(e,n){return t.apply(this,arguments)}}(),n.signupHandler=function(){var t=Object(u.a)(c.a.mark(function t(e,a){var o,r,i;return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,e.preventDefault(),n.setState({authLoading:!0}),console.log(a.email,a.password,a.name),o={query:"\n              mutation CreateUserOperation {\n                createUser(userInput: {email: $email, name: $name, password: $password}) {\n                  _id\n                  email\n                }\n              }\n              ",variables:{email:a.email,password:a.password,name:a.name}},t.next=7,fetch("http://localhost:8080/graphql",{method:"POST",body:JSON.stringify(o),headers:{"Content-Type":"application/json"}});case 7:return r=t.sent,console.log(r),t.next=11,r.json();case 11:if(i=t.sent,console.log(i),!i.errors||422!==i[0].status){t.next=15;break}throw new Error("Validation failed. Make sure the email address is unused!");case 15:if(!i.errors){t.next=17;break}throw new Error("User creation failed.");case 17:console.log(i),n.setState({isAuth:!1,authLoading:!1}),n.props.history.replace("/"),t.next=26;break;case 22:t.prev=22,t.t0=t.catch(0),console.log(t.t0),n.setState({isAuth:!1,authLoading:!1,error:t.t0});case 26:case"end":return t.stop()}},t,null,[[0,22]])}));return function(e,n){return t.apply(this,arguments)}}(),n.setAutoLogout=function(t){setTimeout(function(){n.logoutHandler()},t)},n.errorHandler=function(){n.setState({error:null})},n}return Object(g.a)(e,t),Object(m.a)(e,[{key:"componentDidMount",value:function(){var t=localStorage.getItem("token"),e=localStorage.getItem("expiryDate");if(t&&e)if(new Date(e)<=new Date)this.logoutHandler();else{var n=localStorage.getItem("userId"),a=new Date(e).getTime()-(new Date).getTime();this.setState({isAuth:!0,token:t,userId:n}),this.setAutoLogout(a)}}},{key:"render",value:function(){var t=this,e=o.a.createElement(f.a,null,o.a.createElement(v.a,{path:"/",exact:!0,render:function(e){return o.a.createElement(rt,Object.assign({},e,{onLogin:t.loginHandler,loading:t.state.authLoading}))}}),o.a.createElement(v.a,{path:"/signup",exact:!0,render:function(e){return o.a.createElement(lt,Object.assign({},e,{onLogin:t.signupHandler,loading:t.state.authLoading}))}}),o.a.createElement(b.a,{to:"/"}));return this.state.isAuth&&(e=o.a.createElement(f.a,null,o.a.createElement(v.a,{path:"/",exact:!0,render:function(e){return o.a.createElement(tt,{userId:t.state.userId,token:t.state.token})}}),o.a.createElement(v.a,{path:"/:postId",render:function(e){return o.a.createElement(et,Object.assign({},e,{userId:t.state.userId,token:t.state.token}))}}),o.a.createElement(b.a,{to:"/"}))),o.a.createElement(a.Fragment,null,this.state.showBackdrop&&o.a.createElement(w,{onClick:this.backdropClickHandler}),o.a.createElement(_,{error:this.state.error,onHandle:this.errorHandler}),o.a.createElement(y,{header:o.a.createElement(P,null,o.a.createElement(F,{onOpenMobileNav:this.mobileNavHandler.bind(this,!0),onLogout:this.logoutHandler,isAuth:this.state.isAuth})),mobileNav:o.a.createElement(N,{open:this.state.showMobileNav,mobile:!0,onChooseItem:this.mobileNavHandler.bind(this,!1),onLogout:this.logoutHandler,isAuth:this.state.isAuth})}),e)}}]),e}(a.Component)),ut=Object(E.a)(ct);i.a.render(o.a.createElement(s.a,null,o.a.createElement(ut,null)),document.getElementById("root"))}},[[23,2,1]]]);
//# sourceMappingURL=main.cb07fcf3.chunk.js.map
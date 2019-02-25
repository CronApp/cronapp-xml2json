!function(){var ISO_PATTERN=new RegExp("(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z))|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z))|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z))"),TIME_PATTERN=new RegExp("PT(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+)(?:\\.(\\d+)?)?S)?");window.objToOData=function(e){return null==e||void 0==e?"null":"number"==typeof e||"boolean"==typeof e?e+"":e instanceof Date?"datetimeoffset'"+e.toISOString()+"'":"'"+e+"'"},window.oDataToObj=function(e,t){if(null!=t&&void 0!=t||(t=!0),"string"==typeof e){if(e.length>=10&&e.match(ISO_PATTERN)&&e.length<100)return new Date(e);if(e.length>=8&&e.match(TIME_PATTERN)&&e.length<100){var n=TIME_PATTERN.exec(e);return new Date(Date.UTC(1970,0,1,n[1],n[2],n[3]))}if(e.length>=10&&"/Date("==e.substring(0,6)&&")/"==e.substring(e.length-2,e.length)){var r=e.substring(6,e.length-2);return new Date(parseInt(r))}if(e.length>=20&&"datetime'"==e.substring(0,9)&&"'"==e.substring(e.length-1,e.length)){var r=e.substring(9,e.length-1);return new Date(r)}if(e.length>=20&&"datetimeoffset'"==e.substring(0,15)&&"'"==e.substring(e.length-1,e.length)){var r=e.substring(15,e.length-1);return new Date(r)}if(t){if(e.length>=2&&("'"==e.charAt(0)&&"'"==e.charAt(e.length-1)||'"'==e.charAt(0)&&'"'==e.charAt(e.length-1))){var r=e.substring(1,e.length-1);return r}if("true"==e||"false"==e)return"true"==e;if("null"==e)return null;if(""!=e)return parseFloat(e)}}return e},window.parseXml=function(e){var t=null;if(window.DOMParser)try{t=(new DOMParser).parseFromString(e,"text/xml")}catch(e){t=null}else if(window.ActiveXObject)try{t=new ActiveXObject("Microsoft.XMLDOM"),t.async=!1,t.loadXML(e)||console.log(t.parseError.reason+t.parseError.srcText)}catch(e){t=null}return t},window.xml2json=function(e,t){var n={toObj:function(e){var t={};if(1==e.nodeType){if(e.attributes.length)for(var r=0;r<e.attributes.length;r++)t["@"+e.attributes[r].nodeName]=(e.attributes[r].nodeValue||"").toString();if(e.firstChild){for(var i=0,o=0,a=!1,l=e.firstChild;l;l=l.nextSibling)1==l.nodeType?a=!0:3==l.nodeType&&l.nodeValue.match(/[^ \f\n\r\t\v]/)?i++:4==l.nodeType&&o++;if(a)if(i<2&&o<2){n.removeWhite(e);for(var l=e.firstChild;l;l=l.nextSibling)3==l.nodeType?t["#text"]=n.escape(l.nodeValue):4==l.nodeType?t["#cdata"]=n.escape(l.nodeValue):t[n.normalizeName(l.nodeName)]?t[n.normalizeName(l.nodeName)]instanceof Array?t[n.normalizeName(l.nodeName)][t[n.normalizeName(l.nodeName)].length]=n.toObj(l):t[n.normalizeName(l.nodeName)]=[t[n.normalizeName(l.nodeName)],n.toObj(l)]:t[n.normalizeName(l.nodeName)]=n.toObj(l)}else e.attributes.length?t["#text"]=n.escape(n.innerXml(e)):t=n.escape(n.innerXml(e));else if(i)e.attributes.length?t["#text"]=n.escape(n.innerXml(e)):t=n.escape(n.innerXml(e));else if(o)if(o>1)t=n.escape(n.innerXml(e));else for(var l=e.firstChild;l;l=l.nextSibling)t["#cdata"]=n.escape(l.nodeValue)}e.attributes.length||e.firstChild||(t=null)}else 9==e.nodeType?t=n.toObj(e.documentElement):console.log("unhandled node type: "+e.nodeType);return t},normalizeName:function(e){if(e&&e.length>5&&0==e.indexOf("cron-")){e=e.substr(5);var t="",n=!1;for(var r in e){var i=e.charAt(r);n&&"-"!=i?(t+=i.toUpperCase(),n=!1):"-"==i?n=!0:t+=i.toLowerCase()}return t}},toJson:function(e,t,r){var i=t?'"'+t+'"':"";if(e instanceof Array){for(var o=0,a=e.length;o<a;o++)e[o]=n.toJson(e[o],"",r+"\t");i+=(t?":[":"[")+(e.length>1?"\n"+r+"\t"+e.join(",\n"+r+"\t")+"\n"+r:e.join(""))+"]"}else if(null==e)i+=(t&&":")+"null";else if("object"==typeof e){var l=[];for(var s in e)l[l.length]=n.toJson(e[s],s,r+"\t");i+=(t?":{":"{")+(l.length>1?"\n"+r+"\t"+l.join(",\n"+r+"\t")+"\n"+r:l.join(""))+"}"}else if("string"==typeof e){var u=$.trim(e.toString());i+=(t&&":")+'"'+n.htmlDecode(u)+'"'}else i+=(t&&":")+n.htmlDecode($.trim(e.toString()));return i},htmlDecode:function(e){return(new DOMParser).parseFromString(e,"text/html").documentElement.textContent},innerXml:function(e){var t="";if("innerHTML"in e)t=e.innerHTML;else for(var n=function(e){var t="";if(1==e.nodeType){t+="<"+e.nodeName;for(var r=0;r<e.attributes.length;r++)t+=" "+e.attributes[r].nodeName+'="'+(e.attributes[r].nodeValue||"").toString()+'"';if(e.firstChild){t+=">";for(var i=e.firstChild;i;i=i.nextSibling)t+=n(i);t+="</"+e.nodeName+">"}else t+="/>"}else 3==e.nodeType?t+=e.nodeValue:4==e.nodeType&&(t+="<![CDATA["+e.nodeValue+"]]>");return t},r=e.firstChild;r;r=r.nextSibling)t+=n(r);return t},escape:function(e){return e.trim().replace(/[\\]/g,"\\\\").replace(/[\"]/g,'\\"').replace(/[\n]/g,"\\n").replace(/[\r]/g,"\\r")},removeWhite:function(e){e.normalize();for(var t=e.firstChild;t;)if(3==t.nodeType)if(t.nodeValue.match(/[^ \f\n\r\t\v]/))t=t.nextSibling;else{var r=t.nextSibling;e.removeChild(t),t=r}else 1==t.nodeType?(n.removeWhite(t),t=t.nextSibling):t=t.nextSibling;return e}};9==e.nodeType&&(e=e.documentElement);var r=n.toJson(n.toObj(n.removeWhite(e)),e.nodeName,"\t");return"{\n"+t+(t?r.replace(/\t/g,t):r.replace(/\t|\n/g,""))+"\n}"},window.json2xml=function(e,t){var n=e,r=document.createElement(t),i=function(e){return{}.toString.call(e).split(" ")[1].slice(0,-1).toLowerCase()},o=function(e){var t="";for(var n in e){var r=e.charAt(n);n>0&&r==r.toUpperCase()&&(t+="-"),t+=r.toLowerCase()}return"cron-"+t},a=function(e,t,n,r){if("array"!=i(n)&&"object"!=i(n))"null"!=i(n)&&t.appendChild(document.createTextNode(n));else for(var a in n){var l=n[a];if("__type"==a&&"object"==i(n))t.setAttribute("__type",l);else if("object"==i(l)){var s=t.appendChild(document.createElementNS(null,o(a)));e(e,s,l)}else if("array"==i(l))for(var u in l){var s=t.appendChild(document.createElementNS(null,o(a)));e(e,s,l[u],!0)}else{var d=document.createElementNS(null,o(a));"null"!=i(l)&&("string"==i(l)&&(l=l.trim()),d.appendChild(document.createTextNode(l)));var s=t.appendChild(d)}}};return a(a,r,n,i(n)),r.outerHTML},window.buildElementOptions=function(e){var t=$(e).closest("[data-component]").find("cron-options"),n=parseXml("<cron-options>"+$(t).html()+"</cron-options>"),r=xml2json(n);return r&&(r=r.slice(1),r=r.substring(0,r.length-1),r=r.trim(),r=r.replace(/undefined"cron-options":/gm,""),r=r.replace(/"undefined"/gm,""),r=r.replace(/"undefined:"/gm,""),r=r.replace(/undefined:/gm,""),r=r.replace(/undefined/gm,""),r=r.replace(/"cron-options":/gm,"")),r},window.objectClone=function(e,t){var n;if(null==e||"object"!=typeof e)return e;if(e instanceof Date)return n=new Date,n.setTime(e.getTime()),n;if(e instanceof Array){n=[];for(var r=0,i=e.length;r<i;r++)n[r]=objectClone(e[r],void 0);return n}if(e instanceof Object){n={};for(var o in e)e.hasOwnProperty(o)&&void 0!=e[o]&&"_"!=o.substr(0,1)&&!function(e){return e&&"[object Function]"==={}.toString.call(e)}(e[o])&&function(e,t){if(t){for(var n in t)if(e==n)return!0;return!1}return!0}(o,t)&&(n[o]=objectClone(e[o],t[o]));return n}throw new Error("Unable to copy obj! Its type isn't supported.")},window.getOperatorODATA=function(e,t,n){return"%"==t?"substringof("+n+", "+e+")":"="==t?e+" eq "+n:"!="==t?e+" ne "+n:">"==t?e+" gt "+n:">="==t?e+" ge "+n:"<"==t?e+" lt "+n:"<="==t?e+" le "+n:void 0},window.executeRight=function(right){var result="null";return null!=right&&void 0!=right&&(right.startsWith(":")||right.startsWith("datetimeoffset'")||right.startsWith("datetime'")?result=right:(result=eval(right),result instanceof Date?result="datetimeoffset'"+result.toISOString()+"'":"string"==typeof result?result="'"+result+"'":void 0!==result&&null!=result||(result="null"))),result},window.parserOdata=function(e){var t="",n=e.type;if(e.args)for(var r=0;r<e.args.length;r++){var i=e.args[r],o=n;0==r&&(o=""),t=i.args&&i.args.length>0?t+" "+o.toLowerCase()+" ( "+parserOdata(i)+" ) ":t+" "+o.toLowerCase()+" "+getOperatorODATA(i.left,i.type,executeRight(i.right))}return t.trim()}}();
(()=>{var Y={55:(e,o,i)=>{"use strict";i.r(o),i.d(o,{default:()=>$});var r=i(537),d=i.n(r),m=i(645),V=i.n(m),B=i(667),w=i.n(B),P=new URL(i(558),i.b),O=new URL(i(798),i.b),M=V()(d()),D=w()(P),g=w()(O);M.push([e.id,`
.preload-transition[data-v-5a648f89] {
    transition: none !important;
}
.settings-title[data-v-5a648f89] {
    font-size: calc(1.1 * var(--vscode-font-size)); /* TODO: make this configurable */
    font-weight: bold;
    margin: 0 0 2px 0;
    padding: 0;
}
.sub-pane[data-v-5a648f89] {
    transition: max-height 0.5s, padding 0.5s;
    padding: 1rem;
    overflow: hidden;
}
[data-v-5a648f89] .sub-pane div:first-child {
    margin-top: 0;
}
.collapse-leave-from[data-v-5a648f89] {
    max-height: var(--max-height);
}
.collapse-leave-active[data-v-5a648f89] {
    transition: max-height 0.5s, visibility 0.5s, padding 0.5s;
    visibility: hidden;
    padding: 0 1rem;
    max-height: 0;
}
.collapse-enter-active[data-v-5a648f89] {
    transition: max-height 0.5s, padding 0.5s;
    max-height: 0;
    padding: 0 1rem;
}
.collapse-enter-to[data-v-5a648f89] {
    max-height: var(--max-height);
    padding: 1rem;
}
.collapse-button[data-v-5a648f89] {
    width: 24px;
    height: 24px;
    -webkit-appearance: none;
    display: inline;
    margin: -4px 12px 0 0;
    padding: 0;
    background: transparent;
    background-size: 24px;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.8;
    transition: transform 0.5s;
}
body.vscode-dark .collapse-button[data-v-5a648f89] {
    background-image: url(`+D+`);
}
body.vscode-light .collapse-button[data-v-5a648f89] {
    background-image: url(`+g+`);
}
.collapse-button[data-v-5a648f89] {
    transform: rotate(180deg);
}
.collapse-button[data-v-5a648f89]:checked {
    transform: rotate(90deg);
}
.settings-panel[data-v-5a648f89] {
    background: var(--vscode-menu-background);
    margin: 16px 0;
}
`,"",{version:3,sources:["webpack://./src/webviews/components/settingsPanel.vue"],names:[],mappings:";AA0FA;IACI,2BAA2B;AAC/B;AACA;IACI,8CAA8C,EAAE,iCAAiC;IACjF,iBAAiB;IACjB,iBAAiB;IACjB,UAAU;AACd;AACA;IACI,yCAAyC;IACzC,aAAa;IACb,gBAAgB;AACpB;AACA;IACI,aAAa;AACjB;AACA;IACI,6BAA6B;AACjC;AACA;IACI,0DAA0D;IAC1D,kBAAkB;IAClB,eAAe;IACf,aAAa;AACjB;AACA;IACI,yCAAyC;IACzC,aAAa;IACb,eAAe;AACnB;AACA;IACI,6BAA6B;IAC7B,aAAa;AACjB;AACA;IACI,WAAW;IACX,YAAY;IACZ,wBAAwB;IACxB,eAAe;IACf,qBAAqB;IACrB,UAAU;IACV,uBAAuB;IACvB,qBAAqB;IACrB,4BAA4B;IAC5B,2BAA2B;IAC3B,YAAY;IACZ,0BAA0B;AAC9B;AACA;IACI,yDAAwD;AAC5D;AACA;IACI,yDAAyD;AAC7D;AACA;IACI,yBAAyB;AAC7B;AACA;IACI,wBAAwB;AAC5B;AACA;IACI,yCAAyC;IACzC,cAAc;AAClB",sourcesContent:[`<template>
    <div :id="id" class="settings-panel">
        <div class="header">
            <input
                ref="button"
                v-bind:id="buttonId"
                class="preload-transition collapse-button"
                type="checkbox"
                v-if="collapseable || startCollapsed"
                v-model="collapsed"
            />
            <label v-bind:for="buttonId">
                <p class="settings-title">{{ title }}</p>
                <p class="soft no-spacing">{{ description }}</p>
            </label>
        </div>
        <transition
            @enter="updateHeight"
            @beforeLeave="updateHeight"
            :name="collapseable || startCollapsed ? 'collapse' : ''"
        >
            <div ref="subPane" v-show="!collapsed" class="sub-pane">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { WebviewApi } from 'vscode-webview'
import { defineComponent } from 'vue'
import saveData from '../mixins/saveData'

declare const vscode: WebviewApi<{ [key: string]: VueModel }>

let count = 0

interface VueModel {
    collapsed: boolean
    buttonId: string
    lastHeight?: number
    subPane?: HTMLElement
}

/**
 * Settings panel is header + body, which may be collapseable
 */
export default defineComponent({
    name: 'settings-panel',
    props: {
        id: String,
        startCollapsed: Boolean,
        collapseable: Boolean,
        title: String,
        description: String,
    },
    data() {
        count += 1
        return {
            collapsed: this.$props.startCollapsed ?? false,
            buttonId: \`settings-panel-button-\${count}\`,
            lastHeight: undefined,
        } as VueModel
    },
    mixins: [saveData],
    methods: {
        updateHeight(el: Element & { style?: CSSStyleDeclaration }) {
            if (el.style) {
                this.lastHeight = el.scrollHeight
                el.style.setProperty('--max-height', \`\${this.lastHeight}px\`)
            }
        },
    },
    mounted() {
        this.subPane = this.$refs.subPane as HTMLElement | undefined
        this.lastHeight = this.collapsed ? this.lastHeight : this.subPane?.scrollHeight ?? this.lastHeight

        // TODO: write 'initial-style' as a directive
        // it will force a style until the first render
        // or just use Vue's transition element, but this is pretty heavy
        this.$nextTick(() => {
            setTimeout(() => {
                ;(this.$refs.button as HTMLElement | undefined)?.classList.remove('preload-transition')
            }, 100)
        })
    },
})
<\/script>

<style scoped>
.preload-transition {
    transition: none !important;
}
.settings-title {
    font-size: calc(1.1 * var(--vscode-font-size)); /* TODO: make this configurable */
    font-weight: bold;
    margin: 0 0 2px 0;
    padding: 0;
}
.sub-pane {
    transition: max-height 0.5s, padding 0.5s;
    padding: 1rem;
    overflow: hidden;
}
:deep(.sub-pane div:first-child) {
    margin-top: 0;
}
.collapse-leave-from {
    max-height: var(--max-height);
}
.collapse-leave-active {
    transition: max-height 0.5s, visibility 0.5s, padding 0.5s;
    visibility: hidden;
    padding: 0 1rem;
    max-height: 0;
}
.collapse-enter-active {
    transition: max-height 0.5s, padding 0.5s;
    max-height: 0;
    padding: 0 1rem;
}
.collapse-enter-to {
    max-height: var(--max-height);
    padding: 1rem;
}
.collapse-button {
    width: 24px;
    height: 24px;
    -webkit-appearance: none;
    display: inline;
    margin: -4px 12px 0 0;
    padding: 0;
    background: transparent;
    background-size: 24px;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.8;
    transition: transform 0.5s;
}
body.vscode-dark .collapse-button {
    background-image: url('/resources/dark/expand-less.svg');
}
body.vscode-light .collapse-button {
    background-image: url('/resources/light/expand-less.svg');
}
.collapse-button {
    transform: rotate(180deg);
}
.collapse-button:checked {
    transform: rotate(90deg);
}
.settings-panel {
    background: var(--vscode-menu-background);
    margin: 16px 0;
}
</style>
`],sourceRoot:""}]);const $=M},120:(e,o,i)=>{"use strict";i.r(o),i.d(o,{default:()=>w});var r=i(537),d=i.n(r),m=i(645),V=i.n(m),B=V()(d());B.push([e.id,`form[data-v-3b06d2ea] {
    padding: 15px;
}
.section-header[data-v-3b06d2ea] {
    margin: 0px;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
}
textarea[data-v-3b06d2ea] {
    max-width: 100%;
}
.config-item[data-v-3b06d2ea] {
    border-bottom: 1px solid var(--vscode-menubar-selectionBackground);
    display: grid;
    grid-template-columns: 1fr 3fr;
    padding: 8px 0px;
}
.col2[data-v-3b06d2ea] {
    grid-column: 2;
}
.data-view[data-v-3b06d2ea] {
    display: none;
    border: dashed rgb(218, 31, 31) 1px;
    color: rgb(218, 31, 31);
}
#invoke-button-container[data-v-3b06d2ea] {
    padding: 15px 15px;
    position: sticky;
    bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    border: 1px solid var(--vscode-menu-separatorBackground);
    margin-top: 32px;
}
.required[data-v-3b06d2ea] {
    color: red;
}
#form-title[data-v-3b06d2ea] {
    font-size: large;
    font-weight: bold;
}
.form-buttons[data-v-3b06d2ea] {
    margin-left: 20px;
}
.margin-bottom-16[data-v-3b06d2ea] {
    margin-bottom: 16px;
}
#target-type-selector[data-v-3b06d2ea] {
    margin-bottom: 15px;
    margin-left: 8px;
}
`,"",{version:3,sources:["webpack://./src/lambda/vue/samInvoke.css"],names:[],mappings:"AAAA;IACI,aAAa;AACjB;AACA;IACI,WAAW;IACX,mBAAmB;IACnB,aAAa;IACb,2BAA2B;AAC/B;AACA;IACI,eAAe;AACnB;AACA;IACI,kEAAkE;IAClE,aAAa;IACb,8BAA8B;IAC9B,gBAAgB;AACpB;AACA;IACI,cAAc;AAClB;AACA;IACI,aAAa;IACb,mCAAmC;IACnC,uBAAuB;AAC3B;AACA;IACI,kBAAkB;IAClB,gBAAgB;IAChB,YAAY;IACZ,aAAa;IACb,mBAAmB;IACnB,yBAAyB;IACzB,wDAAwD;IACxD,gBAAgB;AACpB;AACA;IACI,UAAU;AACd;AACA;IACI,gBAAgB;IAChB,iBAAiB;AACrB;AACA;IACI,iBAAiB;AACrB;AACA;IACI,mBAAmB;AACvB;AACA;IACI,mBAAmB;IACnB,gBAAgB;AACpB",sourcesContent:[`form[data-v-3b06d2ea] {
    padding: 15px;
}
.section-header[data-v-3b06d2ea] {
    margin: 0px;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
}
textarea[data-v-3b06d2ea] {
    max-width: 100%;
}
.config-item[data-v-3b06d2ea] {
    border-bottom: 1px solid var(--vscode-menubar-selectionBackground);
    display: grid;
    grid-template-columns: 1fr 3fr;
    padding: 8px 0px;
}
.col2[data-v-3b06d2ea] {
    grid-column: 2;
}
.data-view[data-v-3b06d2ea] {
    display: none;
    border: dashed rgb(218, 31, 31) 1px;
    color: rgb(218, 31, 31);
}
#invoke-button-container[data-v-3b06d2ea] {
    padding: 15px 15px;
    position: sticky;
    bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    border: 1px solid var(--vscode-menu-separatorBackground);
    margin-top: 32px;
}
.required[data-v-3b06d2ea] {
    color: red;
}
#form-title[data-v-3b06d2ea] {
    font-size: large;
    font-weight: bold;
}
.form-buttons[data-v-3b06d2ea] {
    margin-left: 20px;
}
.margin-bottom-16[data-v-3b06d2ea] {
    margin-bottom: 16px;
}
#target-type-selector[data-v-3b06d2ea] {
    margin-bottom: 15px;
    margin-left: 8px;
}
`],sourceRoot:""}]);const w=B},645:e=>{"use strict";e.exports=function(o){var i=[];return i.toString=function(){return this.map(function(d){var m="",V=typeof d[5]!="undefined";return d[4]&&(m+="@supports (".concat(d[4],") {")),d[2]&&(m+="@media ".concat(d[2]," {")),V&&(m+="@layer".concat(d[5].length>0?" ".concat(d[5]):""," {")),m+=o(d),V&&(m+="}"),d[2]&&(m+="}"),d[4]&&(m+="}"),m}).join("")},i.i=function(d,m,V,B,w){typeof d=="string"&&(d=[[null,d,void 0]]);var P={};if(V)for(var O=0;O<this.length;O++){var M=this[O][0];M!=null&&(P[M]=!0)}for(var D=0;D<d.length;D++){var g=[].concat(d[D]);V&&P[g[0]]||(typeof w!="undefined"&&(typeof g[5]=="undefined"||(g[1]="@layer".concat(g[5].length>0?" ".concat(g[5]):""," {").concat(g[1],"}")),g[5]=w),m&&(g[2]&&(g[1]="@media ".concat(g[2]," {").concat(g[1],"}")),g[2]=m),B&&(g[4]?(g[1]="@supports (".concat(g[4],") {").concat(g[1],"}"),g[4]=B):g[4]="".concat(B)),i.push(g))}},i}},667:e=>{"use strict";e.exports=function(o,i){return i||(i={}),o&&(o=String(o.__esModule?o.default:o),/^['"].*['"]$/.test(o)&&(o=o.slice(1,-1)),i.hash&&(o+=i.hash),/["'() \t\n]|(%20)/.test(o)||i.needQuotes?'"'.concat(o.replace(/"/g,'\\"').replace(/\n/g,"\\n"),'"'):o)}},537:e=>{"use strict";e.exports=function(o){var i=o[1],r=o[3];if(!r)return i;if(typeof btoa=="function"){var d=btoa(unescape(encodeURIComponent(JSON.stringify(r)))),m="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(d),V="/*# ".concat(m," */"),B=r.sources.map(function(w){return"/*# sourceURL=".concat(r.sourceRoot||"").concat(w," */")});return[i].concat(B).concat([V]).join(`
`)}return[i].join(`
`)}},744:(e,o)=>{"use strict";var i;i={value:!0},o.Z=(r,d)=>{for(const[m,V]of d)r[m]=V;return r}},684:(e,o,i)=>{var r=i(55);r.__esModule&&(r=r.default),typeof r=="string"&&(r=[[e.id,r,""]]),r.locals&&(e.exports=r.locals);var d=i(346).Z,m=d("39a0a972",r,!1,{})},538:(e,o,i)=>{var r=i(120);r.__esModule&&(r=r.default),typeof r=="string"&&(r=[[e.id,r,""]]),r.locals&&(e.exports=r.locals);var d=i(346).Z,m=d("309ea886",r,!1,{})},346:(e,o,i)=>{"use strict";i.d(o,{Z:()=>$});function r(s,h){for(var p=[],c={},l=0;l<h.length;l++){var I=h[l],C=I[0],L=I[1],T=I[2],J=I[3],S={id:s+":"+l,css:L,media:T,sourceMap:J};c[C]?c[C].parts.push(S):p.push(c[C]={id:C,parts:[S]})}return p}var d=typeof document!="undefined";if(typeof DEBUG!="undefined"&&DEBUG&&!d)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var m={},V=d&&(document.head||document.getElementsByTagName("head")[0]),B=null,w=0,P=!1,O=function(){},M=null,D="data-vue-ssr-id",g=typeof navigator!="undefined"&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function $(s,h,p,c){P=p,M=c||{};var l=r(s,h);return j(l),function(C){for(var L=[],T=0;T<l.length;T++){var J=l[T],S=m[J.id];S.refs--,L.push(S)}C?(l=r(s,C),j(l)):l=[];for(var T=0;T<L.length;T++){var S=L[T];if(S.refs===0){for(var H=0;H<S.parts.length;H++)S.parts[H]();delete m[S.id]}}}}function j(s){for(var h=0;h<s.length;h++){var p=s[h],c=m[p.id];if(c){c.refs++;for(var l=0;l<c.parts.length;l++)c.parts[l](p.parts[l]);for(;l<p.parts.length;l++)c.parts.push(W(p.parts[l]));c.parts.length>p.parts.length&&(c.parts.length=p.parts.length)}else{for(var I=[],l=0;l<p.parts.length;l++)I.push(W(p.parts[l]));m[p.id]={id:p.id,refs:1,parts:I}}}}function x(){var s=document.createElement("style");return s.type="text/css",V.appendChild(s),s}function W(s){var h,p,c=document.querySelector("style["+D+'~="'+s.id+'"]');if(c){if(P)return O;c.parentNode.removeChild(c)}if(g){var l=w++;c=B||(B=x()),h=F.bind(null,c,l,!1),p=F.bind(null,c,l,!0)}else c=x(),h=X.bind(null,c),p=function(){c.parentNode.removeChild(c)};return h(s),function(C){if(C){if(C.css===s.css&&C.media===s.media&&C.sourceMap===s.sourceMap)return;h(s=C)}else p()}}var G=function(){var s=[];return function(h,p){return s[h]=p,s.filter(Boolean).join(`
`)}}();function F(s,h,p,c){var l=p?"":c.css;if(s.styleSheet)s.styleSheet.cssText=G(h,l);else{var I=document.createTextNode(l),C=s.childNodes;C[h]&&s.removeChild(C[h]),C.length?s.insertBefore(I,C[h]):s.appendChild(I)}}function X(s,h){var p=h.css,c=h.media,l=h.sourceMap;if(c&&s.setAttribute("media",c),M.ssrId&&s.setAttribute(D,h.id),l&&(p+=`
/*# sourceURL=`+l.sources[0]+" */",p+=`
/*# sourceMappingURL=data:application/json;base64,`+btoa(unescape(encodeURIComponent(JSON.stringify(l))))+" */"),s.styleSheet)s.styleSheet.cssText=p;else{for(;s.firstChild;)s.removeChild(s.firstChild);s.appendChild(document.createTextNode(p))}}},558:(e,o,i)=>{"use strict";e.exports=i.p+"cc7dacc55d3a9f3f983f.svg"},798:(e,o,i)=>{"use strict";e.exports=i.p+"44d827b5740d008688e0.svg"}},q={};function y(e){var o=q[e];if(o!==void 0)return o.exports;var i=q[e]={id:e,exports:{}};return Y[e](i,i.exports,y),i.exports}y.m=Y,(()=>{y.n=e=>{var o=e&&e.__esModule?()=>e.default:()=>e;return y.d(o,{a:o}),o}})(),(()=>{y.d=(e,o)=>{for(var i in o)y.o(o,i)&&!y.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:o[i]})}})(),(()=>{y.g=function(){if(typeof globalThis=="object")return globalThis;try{return this||new Function("return this")()}catch(e){if(typeof window=="object")return window}}()})(),(()=>{y.o=(e,o)=>Object.prototype.hasOwnProperty.call(e,o)})(),(()=>{y.r=e=>{typeof Symbol!="undefined"&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}})(),(()=>{var e;y.g.importScripts&&(e=y.g.location+"");var o=y.g.document;if(!e&&o&&(o.currentScript&&(e=o.currentScript.src),!e)){var i=o.getElementsByTagName("script");i.length&&(e=i[i.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),y.p=e})(),(()=>{y.b=document.baseURI||self.location.href;var e={668:0}})();var Q={};(()=>{"use strict";y.r(Q);const e=Vue,o=t=>((0,e.pushScopeId)("data-v-3b06d2ea"),t=t(),(0,e.popScopeId)(),t),i={class:"invoke-lambda-form"},r=o(()=>(0,e.createElementVNode)("h1",null,"SAM Debug Configuration Editor",-1)),d=o(()=>(0,e.createElementVNode)("label",{for:"target-type-selector"},"Invoke Target Type",-1)),m=["value"],V={class:"data-view"},B={key:0,class:"target-code"},w={class:"config-item"},P=o(()=>(0,e.createElementVNode)("label",{for:"select-directory"},"Project Root",-1)),O={class:"data-view"},M={class:"config-item"},D=o(()=>(0,e.createElementVNode)("label",{for:"lambda-handler"},"Lambda Handler",-1)),g={class:"data-view"},$={class:"config-item"},j=o(()=>(0,e.createElementVNode)("label",{for:"runtime-selector"},"Runtime",-1)),x=o(()=>(0,e.createElementVNode)("option",{disabled:""},"Choose a runtime...",-1)),W=["value"],G={class:"data-view"},F={key:1,class:"target-template"},X=o(()=>(0,e.createElementVNode)("br",null,null,-1)),s={class:"config-item"},h=o(()=>(0,e.createElementVNode)("label",{for:"template-path"},"Template Path",-1)),p={class:"data-view"},c={class:"config-item"},l=o(()=>(0,e.createElementVNode)("label",{for:"logicalID"},"Resource (Logical Id)",-1)),I={class:"data-view"},C={class:"config-item"},L=o(()=>(0,e.createElementVNode)("label",{for:"runtime-selector"},"Runtime",-1)),T=o(()=>(0,e.createElementVNode)("option",{disabled:""},"Choose a runtime...",-1)),J=["value"],S={class:"data-view"},H={key:2,class:"target-apigw"},de=o(()=>(0,e.createElementVNode)("br",null,null,-1)),ce={class:"config-item"},pe=o(()=>(0,e.createElementVNode)("label",{for:"template-path"},"Template Path",-1)),ue={class:"data-view"},me={class:"config-item"},ve=o(()=>(0,e.createElementVNode)("label",{for:"logicalID"},"Resource (Logical Id)",-1)),ge={class:"config-item"},he=o(()=>(0,e.createElementVNode)("label",{for:"runtime-selector"},"Runtime",-1)),fe=o(()=>(0,e.createElementVNode)("option",{disabled:""},"Choose a runtime...",-1)),_e=["value"],Ae={class:"data-view"},be={class:"config-item"},Ce=o(()=>(0,e.createElementVNode)("label",{for:"path"},"Path",-1)),ye={class:"config-item"},Ee=o(()=>(0,e.createElementVNode)("label",{for:"http-method-selector"},"HTTP Method",-1)),Ve=o(()=>(0,e.createElementVNode)("option",{disabled:""},"Choose an HTTP Method",-1)),Be=["value"],Ne={class:"data-view"},ke={class:"config-item"},we=o(()=>(0,e.createElementVNode)("label",{for:"query-string"},"Query String",-1)),Ie={class:"config-item"},Se=o(()=>(0,e.createElementVNode)("label",{for:"headers"},"Headers",-1)),Te=["data-invalid"],Me={key:0,class:"input-validation col2"},De={key:3},Pe=o(()=>(0,e.createElementVNode)("h3",null,"aws",-1)),Oe={class:"config-item"},Le=o(()=>(0,e.createElementVNode)("label",{for:"awsConnection"},"Credentials:",-1)),Ue={class:"config-item"},Re=o(()=>(0,e.createElementVNode)("label",{for:"region"},"Region",-1)),$e=o(()=>(0,e.createElementVNode)("h3",null,"lambda",-1)),Je={class:"config-item"},He=o(()=>(0,e.createElementVNode)("label",{for:""},"Environment Variables",-1)),je=["data-invalid"],xe={key:0,class:"input-validation col2"},We={class:"config-item"},Fe=o(()=>(0,e.createElementVNode)("label",{for:"memory"},"Memory (MB)",-1)),ze={class:"config-item"},Ke=o(()=>(0,e.createElementVNode)("label",{for:"timeoutSec"},"Timeout (s)",-1)),Ze=o(()=>(0,e.createElementVNode)("h3",null,"sam",-1)),Ge={class:"config-item"},Xe=o(()=>(0,e.createElementVNode)("label",{for:"buildArguments"},"Build Arguments",-1)),Ye={class:"config-item"},qe=o(()=>(0,e.createElementVNode)("label",{for:"containerBuild"},"Container Build",-1)),Qe={class:"config-item"},et=o(()=>(0,e.createElementVNode)("label",{for:"dockerNetwork"},"Docker Network",-1)),tt={class:"config-item"},at=o(()=>(0,e.createElementVNode)("label",{for:"localArguments"},"Local Arguments",-1)),nt={class:"config-item"},ot=o(()=>(0,e.createElementVNode)("label",{for:"skipNewImageCheck"},"Skip New Image Check",-1)),it={class:"config-item"},st=o(()=>(0,e.createElementVNode)("label",{for:"templateParameters"},"Template - Parameters",-1)),rt=["data-invalid"],lt={key:0,class:"input-validation col2"},dt=o(()=>(0,e.createElementVNode)("h3",null,"api",-1)),ct={class:"config-item"},pt=o(()=>(0,e.createElementVNode)("label",{for:"querystring"},"Query String",-1)),ut={class:"config-item"},mt=o(()=>(0,e.createElementVNode)("label",{for:"stageVariables"},"Stage Variables",-1)),vt=["data-invalid"],gt={key:0,class:"input-validation col2"},ht={class:"config-item"},ft=o(()=>(0,e.createElementVNode)("label",{for:"clientCerificateId"},"Client Certificate ID",-1)),_t={class:"config-item"},At=o(()=>(0,e.createElementVNode)("label",{for:"apiPayload"},"API Payload",-1)),bt=["data-invalid"],Ct={key:0,class:"input-validation col2"},yt=o(()=>(0,e.createElementVNode)("br",null,null,-1)),Et={class:"data-view"},Vt={key:0,class:"input-validation"},Bt={class:"container",id:"invoke-button-container"};function Nt(t,a,u,f,b,A){const _=(0,e.resolveComponent)("settings-panel");return(0,e.openBlock)(),(0,e.createElementBlock)("form",i,[r,(0,e.createVNode)(_,{id:"config-panel",title:"Configuration",description:""},{default:(0,e.withCtx)(()=>[d,(0,e.withDirectives)((0,e.createElementVNode)("select",{name:"target-types",id:"target-type-selector","onUpdate:modelValue":a[0]||(a[0]=n=>t.launchConfig.invokeTarget.target=n)},[((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.targetTypes,(n,v)=>((0,e.openBlock)(),(0,e.createElementBlock)("option",{value:n.value,key:v},(0,e.toDisplayString)(n.name),9,m))),128))],512),[[e.vModelSelect,t.launchConfig.invokeTarget.target]]),(0,e.createElementVNode)("span",V,(0,e.toDisplayString)(t.launchConfig.invokeTarget.target),1),t.launchConfig.invokeTarget.target==="code"?((0,e.openBlock)(),(0,e.createElementBlock)("div",B,[(0,e.createElementVNode)("div",w,[P,(0,e.withDirectives)((0,e.createElementVNode)("input",{id:"select-directory",type:"text","onUpdate:modelValue":a[1]||(a[1]=n=>t.launchConfig.invokeTarget.projectRoot=n),placeholder:"Enter a directory"},null,512),[[e.vModelText,t.launchConfig.invokeTarget.projectRoot]]),(0,e.createElementVNode)("span",O,"the selected directory: "+(0,e.toDisplayString)(t.launchConfig.invokeTarget.projectRoot),1)]),(0,e.createElementVNode)("div",M,[D,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text",placeholder:"Enter the lambda handler",name:"lambda-handler",id:"lambda-handler","onUpdate:modelValue":a[2]||(a[2]=n=>t.launchConfig.invokeTarget.lambdaHandler=n)},null,512),[[e.vModelText,t.launchConfig.invokeTarget.lambdaHandler]]),(0,e.createElementVNode)("span",g,"lamda handler :"+(0,e.toDisplayString)(t.launchConfig.invokeTarget.lambdaHandler),1)]),(0,e.createElementVNode)("div",$,[j,(0,e.withDirectives)((0,e.createElementVNode)("select",{name:"runtimeType","onUpdate:modelValue":a[3]||(a[3]=n=>t.launchConfig.lambda.runtime=n)},[x,((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.runtimes,(n,v)=>((0,e.openBlock)(),(0,e.createElementBlock)("option",{value:n,key:v},(0,e.toDisplayString)(n),9,W))),128))],512),[[e.vModelSelect,t.launchConfig.lambda.runtime]]),(0,e.createElementVNode)("span",G,"runtime in data: "+(0,e.toDisplayString)(t.launchConfig.lambda.runtime),1)])])):t.launchConfig.invokeTarget.target==="template"?((0,e.openBlock)(),(0,e.createElementBlock)("div",F,[(0,e.createElementVNode)("button",{class:"margin-bottom-16",onClick:a[4]||(a[4]=(0,e.withModifiers)((...n)=>t.loadResource&&t.loadResource(...n),["prevent"]))},"Load Resource"),X,(0,e.createElementVNode)("div",s,[h,(0,e.withDirectives)((0,e.createElementVNode)("input",{id:"template-path-button",type:"text","onUpdate:modelValue":a[5]||(a[5]=n=>t.launchConfig.invokeTarget.templatePath=n),placeholder:"Enter the template path..."},null,512),[[e.vModelText,t.launchConfig.invokeTarget.templatePath]]),(0,e.createElementVNode)("span",p,"Template path from data: "+(0,e.toDisplayString)(t.launchConfig.invokeTarget.templatePath),1)]),(0,e.createElementVNode)("div",c,[l,(0,e.withDirectives)((0,e.createElementVNode)("input",{name:"template-logical-id",id:"template-logical-id",type:"text",placeholder:"Enter a resource","onUpdate:modelValue":a[6]||(a[6]=n=>t.launchConfig.invokeTarget.logicalId=n)},null,512),[[e.vModelText,t.launchConfig.invokeTarget.logicalId]]),(0,e.createElementVNode)("span",I," Logical Id from data: "+(0,e.toDisplayString)(t.launchConfig.invokeTarget.logicalId),1)]),(0,e.createElementVNode)("div",C,[L,(0,e.withDirectives)((0,e.createElementVNode)("select",{name:"runtimeType","onUpdate:modelValue":a[7]||(a[7]=n=>t.launchConfig.lambda.runtime=n)},[T,((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.runtimes,(n,v)=>((0,e.openBlock)(),(0,e.createElementBlock)("option",{value:n,key:v},(0,e.toDisplayString)(n),9,J))),128))],512),[[e.vModelSelect,t.launchConfig.lambda.runtime]]),(0,e.createElementVNode)("span",S,"runtime in data: "+(0,e.toDisplayString)(t.launchConfig.lambda.runtime),1)])])):t.launchConfig.invokeTarget.target==="api"?((0,e.openBlock)(),(0,e.createElementBlock)("div",H,[(0,e.createElementVNode)("button",{onClick:a[8]||(a[8]=(0,e.withModifiers)((...n)=>t.loadResource&&t.loadResource(...n),["prevent"]))},"Load Resource"),de,(0,e.createElementVNode)("div",ce,[pe,(0,e.withDirectives)((0,e.createElementVNode)("input",{id:"template-path-button",type:"text","onUpdate:modelValue":a[9]||(a[9]=n=>t.launchConfig.invokeTarget.templatePath=n),placeholder:"Enter the template path..."},null,512),[[e.vModelText,t.launchConfig.invokeTarget.templatePath]]),(0,e.createElementVNode)("span",ue,"Template path from data: "+(0,e.toDisplayString)(t.launchConfig.invokeTarget.templatePath),1)]),(0,e.createElementVNode)("div",me,[ve,(0,e.withDirectives)((0,e.createElementVNode)("input",{name:"template-logical-id",id:"template-logical-id",type:"text",placeholder:"Enter a resource","onUpdate:modelValue":a[10]||(a[10]=n=>t.launchConfig.invokeTarget.logicalId=n)},null,512),[[e.vModelText,t.launchConfig.invokeTarget.logicalId]])]),(0,e.createElementVNode)("div",ge,[he,(0,e.withDirectives)((0,e.createElementVNode)("select",{name:"runtimeType","onUpdate:modelValue":a[11]||(a[11]=n=>t.launchConfig.lambda.runtime=n)},[fe,((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.runtimes,(n,v)=>((0,e.openBlock)(),(0,e.createElementBlock)("option",{value:n,key:v},(0,e.toDisplayString)(n),9,_e))),128))],512),[[e.vModelSelect,t.launchConfig.lambda.runtime]]),(0,e.createElementVNode)("span",Ae,"runtime in data: "+(0,e.toDisplayString)(t.launchConfig.lambda.runtime),1)]),(0,e.createElementVNode)("div",be,[Ce,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[12]||(a[12]=n=>t.launchConfig.api.path=n)},null,512),[[e.vModelText,t.launchConfig.api.path]])]),(0,e.createElementVNode)("div",ye,[Ee,(0,e.withDirectives)((0,e.createElementVNode)("select",{name:"http-method","onUpdate:modelValue":a[13]||(a[13]=n=>t.launchConfig.api.httpMethod=n)},[Ve,((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.httpMethods,(n,v)=>((0,e.openBlock)(),(0,e.createElementBlock)("option",{value:n.toLowerCase(),key:v},(0,e.toDisplayString)(n),9,Be))),128))],512),[[e.vModelSelect,t.launchConfig.api.httpMethod]]),(0,e.createElementVNode)("span",Ne,(0,e.toDisplayString)(t.launchConfig.api.httpMethod),1)]),(0,e.createElementVNode)("div",ke,[we,(0,e.withDirectives)((0,e.createElementVNode)("input",{name:"query-string",id:"query-string",type:"text",cols:"15",rows:"2",placeholder:"Enter a query","onUpdate:modelValue":a[14]||(a[14]=n=>t.launchConfig.api.querystring=n)},null,512),[[e.vModelText,t.launchConfig.api.querystring]])]),(0,e.createElementVNode)("div",Ie,[Se,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[15]||(a[15]=n=>t.headers.value=n),placeholder:"Enter as valid JSON","data-invalid":!!t.headers.errorMsg},null,8,Te),[[e.vModelText,t.headers.value]]),t.headers.errorMsg?((0,e.openBlock)(),(0,e.createElementBlock)("div",Me," Error parsing JSON: "+(0,e.toDisplayString)(t.headers.errorMsg),1)):(0,e.createCommentVNode)("v-if",!0)])])):((0,e.openBlock)(),(0,e.createElementBlock)("div",De,"Select an Invoke Target"))]),_:1}),(0,e.createVNode)(_,{id:"more-fields-panel",title:"Additional Fields",description:"","start-collapsed":""},{default:(0,e.withCtx)(()=>[Pe,(0,e.createElementVNode)("div",Oe,[Le,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[16]||(a[16]=n=>t.launchConfig.aws.credentials=n)},null,512),[[e.vModelText,t.launchConfig.aws.credentials]])]),(0,e.createElementVNode)("div",Ue,[Re,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[17]||(a[17]=n=>t.launchConfig.aws.region=n)},null,512),[[e.vModelText,t.launchConfig.aws.region]])]),$e,(0,e.createElementVNode)("div",Je,[He,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text",placeholder:"Enter as valid JSON","onUpdate:modelValue":a[18]||(a[18]=n=>t.environmentVariables.value=n),"data-invalid":!!t.environmentVariables.errorMsg},null,8,je),[[e.vModelText,t.environmentVariables.value]]),t.environmentVariables.errorMsg?((0,e.openBlock)(),(0,e.createElementBlock)("div",xe," Error parsing JSON: "+(0,e.toDisplayString)(t.environmentVariables.errorMsg),1)):(0,e.createCommentVNode)("v-if",!0)]),(0,e.createElementVNode)("div",We,[Fe,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"number","onUpdate:modelValue":a[19]||(a[19]=n=>t.launchConfig.lambda.memoryMb=n)},null,512),[[e.vModelText,t.launchConfig.lambda.memoryMb,void 0,{number:!0}]])]),(0,e.createElementVNode)("div",ze,[Ke,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"number","onUpdate:modelValue":a[20]||(a[20]=n=>t.launchConfig.lambda.timeoutSec=n)},null,512),[[e.vModelText,t.launchConfig.lambda.timeoutSec,void 0,{number:!0}]])]),(0,e.createCommentVNode)(` <div class="config-item">
                <label for="pathMappings">Path Mappings</label>
                <input type="text" v-model="launchConfig.lambda.pathMappings" >
            </div> `),Ze,(0,e.createElementVNode)("div",Ge,[Xe,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[21]||(a[21]=n=>t.launchConfig.sam.buildArguments=n),placeholder:"Enter as a comma separated list"},null,512),[[e.vModelText,t.launchConfig.sam.buildArguments]])]),(0,e.createElementVNode)("div",Ye,[qe,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"checkbox",name:"containerBuild",id:"containerBuild","onUpdate:modelValue":a[22]||(a[22]=n=>t.containerBuild=n)},null,512),[[e.vModelCheckbox,t.containerBuild]])]),(0,e.createElementVNode)("div",Qe,[et,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[23]||(a[23]=n=>t.launchConfig.sam.dockerNetwork=n)},null,512),[[e.vModelText,t.launchConfig.sam.dockerNetwork]])]),(0,e.createElementVNode)("div",tt,[at,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[24]||(a[24]=n=>t.launchConfig.sam.localArguments=n),placeholder:"Enter as a comma separated list"},null,512),[[e.vModelText,t.launchConfig.sam.localArguments]])]),(0,e.createElementVNode)("div",nt,[ot,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"checkbox",name:"skipNewImageCheck",id:"skipNewImageCheck","onUpdate:modelValue":a[25]||(a[25]=n=>t.skipNewImageCheck=n)},null,512),[[e.vModelCheckbox,t.skipNewImageCheck]])]),(0,e.createElementVNode)("div",it,[st,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[26]||(a[26]=n=>t.parameters.value=n),"data-invalid":!!t.parameters.errorMsg},null,8,rt),[[e.vModelText,t.parameters.value]]),t.parameters.errorMsg?((0,e.openBlock)(),(0,e.createElementBlock)("div",lt," Error parsing JSON: "+(0,e.toDisplayString)(t.parameters.errorMsg),1)):(0,e.createCommentVNode)("v-if",!0)]),dt,(0,e.createElementVNode)("div",ct,[pt,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[27]||(a[27]=n=>t.launchConfig.api.querystring=n)},null,512),[[e.vModelText,t.launchConfig.api.querystring]])]),(0,e.createElementVNode)("div",ut,[mt,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[28]||(a[28]=n=>t.stageVariables.value=n),"data-invalid":!!t.stageVariables.errorMsg,placeholder:"Enter as valid JSON"},null,8,vt),[[e.vModelText,t.stageVariables.value]]),t.stageVariables.errorMsg?((0,e.openBlock)(),(0,e.createElementBlock)("div",gt," Error parsing JSON: "+(0,e.toDisplayString)(t.stageVariables.errorMsg),1)):(0,e.createCommentVNode)("v-if",!0)]),(0,e.createElementVNode)("div",ht,[ft,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[29]||(a[29]=n=>t.launchConfig.api.clientCertificateId=n)},null,512),[[e.vModelText,t.launchConfig.api.clientCertificateId]])]),(0,e.createElementVNode)("div",_t,[At,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":a[30]||(a[30]=n=>t.apiPayload.value=n),placeholder:"Enter as valid JSON","data-invalid":!!t.apiPayload.errorMsg},null,8,bt),[[e.vModelText,t.apiPayload.value]]),t.apiPayload.errorMsg?((0,e.openBlock)(),(0,e.createElementBlock)("div",Ct," Error parsing JSON: "+(0,e.toDisplayString)(t.apiPayload.errorMsg),1)):(0,e.createCommentVNode)("v-if",!0)])]),_:1}),(0,e.createVNode)(_,{id:"payload-panel",title:"Payload",description:"","start-collapsed":""},{default:(0,e.withCtx)(()=>[(0,e.createElementVNode)("button",{class:"margin-bottom-16",onClick:a[31]||(a[31]=(0,e.withModifiers)((...n)=>t.loadPayload&&t.loadPayload(...n),["prevent"]))},"Load Sample Payload"),yt,(0,e.withDirectives)((0,e.createElementVNode)("textarea",{name:"lambda-payload",id:"lambda-payload",cols:"60",rows:"5","onUpdate:modelValue":a[32]||(a[32]=n=>t.payload.value=n)},null,512),[[e.vModelText,t.payload.value]]),(0,e.createElementVNode)("span",Et,"payload from data: "+(0,e.toDisplayString)(t.payload),1),t.payload.errorMsg?((0,e.openBlock)(),(0,e.createElementBlock)("div",Vt,"Error parsing JSON: "+(0,e.toDisplayString)(t.payload.errorMsg),1)):(0,e.createCommentVNode)("v-if",!0)]),_:1}),(0,e.createElementVNode)("div",Bt,[(0,e.createElementVNode)("button",{class:"",onClick:a[33]||(a[33]=(0,e.withModifiers)((...n)=>t.loadConfig&&t.loadConfig(...n),["prevent"]))},"Load Existing Config"),(0,e.createElementVNode)("button",{class:"form-buttons",onClick:a[34]||(a[34]=(0,e.withModifiers)((...n)=>t.launch&&t.launch(...n),["prevent"]))},"Invoke"),(0,e.createElementVNode)("button",{class:"form-buttons",onClick:a[35]||(a[35]=(0,e.withModifiers)((...n)=>t.save&&t.save(...n),["prevent"]))},"Save")])])}const $t=t=>(_pushScopeId("data-v-5a648f89"),t=t(),_popScopeId(),t),kt=["id"],wt={class:"header"},It=["id"],St=["for"],Tt={class:"settings-title"},Mt={class:"soft no-spacing"},Dt={ref:"subPane",class:"sub-pane"};function Pt(t,a,u,f,b,A){return(0,e.openBlock)(),(0,e.createElementBlock)("div",{id:t.id,class:"settings-panel"},[(0,e.createElementVNode)("div",wt,[t.collapseable||t.startCollapsed?(0,e.withDirectives)(((0,e.openBlock)(),(0,e.createElementBlock)("input",{key:0,ref:"button",id:t.buttonId,class:"preload-transition collapse-button",type:"checkbox","onUpdate:modelValue":a[0]||(a[0]=_=>t.collapsed=_)},null,8,It)),[[e.vModelCheckbox,t.collapsed]]):(0,e.createCommentVNode)("v-if",!0),(0,e.createElementVNode)("label",{for:t.buttonId},[(0,e.createElementVNode)("p",Tt,(0,e.toDisplayString)(t.title),1),(0,e.createElementVNode)("p",Mt,(0,e.toDisplayString)(t.description),1)],8,St)]),(0,e.createVNode)(e.Transition,{onEnter:t.updateHeight,onBeforeLeave:t.updateHeight,name:t.collapseable||t.startCollapsed?"collapse":""},{default:(0,e.withCtx)(()=>[(0,e.withDirectives)((0,e.createElementVNode)("div",Dt,[(0,e.renderSlot)(t.$slots,"default",{},void 0,!0)],512),[[e.vShow,!t.collapsed]])]),_:3},8,["onEnter","onBeforeLeave","name"])],8,kt)}/*!
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */const z=new Set;window.addEventListener("remount",()=>z.clear());const ee={created(){var t,a,u,f,b;if(this.$data===void 0)return;const A=(t=vscode.getState())!=null?t:{};this.$options._count=((a=this.$options._count)!=null?a:0)+1;const _=(f=this.id)!=null?f:`${(u=this.name)!=null?u:`DEFAULT-${z.size}`}-${this.$options._count}`;if(this.$options._unid=_,z.has(_)){console.warn(`Component "${_}" already exists. State-saving functionality will be disabled.`);return}z.add(_);const n=(b=A[_])!=null?b:{};Object.keys(this.$data).forEach(v=>{var N;this.$data[v]=(N=n[v])!=null?N:this.$data[v]}),Object.keys(this.$data).forEach(v=>{this.$watch(v,N=>{var E,k;const R=(E=vscode.getState())!=null?E:{},Z=Object.assign((k=R[_])!=null?k:{},{[v]:JSON.parse(JSON.stringify(N))});vscode.setState(Object.assign(R,{[_]:Z}))},{deep:!0})})}};let te=0;const Ot=(0,e.defineComponent)({name:"settings-panel",props:{id:String,startCollapsed:Boolean,collapseable:Boolean,title:String,description:String},data(){var t;return te+=1,{collapsed:(t=this.$props.startCollapsed)!=null?t:!1,buttonId:`settings-panel-button-${te}`,lastHeight:void 0}},mixins:[ee],methods:{updateHeight(t){t.style&&(this.lastHeight=t.scrollHeight,t.style.setProperty("--max-height",`${this.lastHeight}px`))}},mounted(){var t,a;this.subPane=this.$refs.subPane,this.lastHeight=this.collapsed?this.lastHeight:(a=(t=this.subPane)==null?void 0:t.scrollHeight)!=null?a:this.lastHeight,this.$nextTick(()=>{setTimeout(()=>{var u;(u=this.$refs.button)==null||u.classList.remove("preload-transition")},100)})}});var Ht=y(684),ae=y(744);const Lt=(0,ae.Z)(Ot,[["render",Pt],["__scopeId","data-v-5a648f89"]]);/*!
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */class K{static registerGlobalCommands(){const a=new Event("remount");window.addEventListener("message",u=>{const{command:f}=u.data;f==="$clear"&&(vscode.setState({}),this.messageListeners.forEach(b=>this.removeListener(b)),window.dispatchEvent(a))})}static addListener(a){this.messageListeners.add(a),window.addEventListener("message",a)}static removeListener(a){this.messageListeners.delete(a),window.removeEventListener("message",a)}static sendRequest(a,u,f){const b=JSON.parse(JSON.stringify(f)),A=new Promise((_,n)=>{const v=E=>{const k=E.data;if(a===k.id)if(this.removeListener(v),window.clearTimeout(N),k.error===!0){const R=JSON.parse(k.data);n(new Error(R.message))}else k.event?(typeof f[0]!="function"&&n(new Error(`Expected frontend event handler to be a function: ${u}`)),_(this.registerEventHandler(u,f[0]))):_(k.data)},N=setTimeout(()=>{this.removeListener(v),n(new Error(`Timed out while waiting for response: id: ${a}, command: ${u}`))},3e5);this.addListener(v)});return vscode.postMessage({id:a,command:u,data:b}),A}static registerEventHandler(a,u){const f=b=>{const A=b.data;if(A.command===a){if(!A.event)throw new Error(`Expected backend handler to be an event emitter: ${a}`);u(A.data)}};return this.addListener(f),{dispose:()=>this.removeListener(f)}}static create(){return this.initialized||(this.initialized=!0,this.registerGlobalCommands()),new Proxy({},{set:()=>{throw new TypeError("Cannot set property to webview client")},get:(a,u)=>{var f;if(typeof u!="string"){console.warn(`Tried to index webview client with non-string property: ${String(u)}`);return}if(u==="init"){const A=(f=vscode.getState())!=null?f:{};if(A.__once)return()=>Promise.resolve();vscode.setState(Object.assign(A,{__once:!0}))}const b=(this.counter++).toString();return(...A)=>this.sendRequest(b,u,A)}})}}K.counter=0,K.initialized=!1,K.messageListeners=new Set;/*!
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */const U=K.create();function ne(t){var a,u,f,b,A,_,n,v,N,E,k;return{type:"aws-sam",request:"direct-invoke",name:"",aws:{credentials:"",region:"",...(t==null?void 0:t.aws)?t.aws:{}},invokeTarget:{target:"template",templatePath:"",logicalId:"",lambdaHandler:"",projectRoot:"",...t==null?void 0:t.invokeTarget},lambda:{runtime:(a=t==null?void 0:t.lambda)==null?void 0:a.runtime,memoryMb:void 0,timeoutSec:void 0,environmentVariables:{},...t==null?void 0:t.lambda,payload:{json:((f=(u=t==null?void 0:t.lambda)==null?void 0:u.payload)==null?void 0:f.json)?t.lambda.payload.json:{},path:((A=(b=t==null?void 0:t.lambda)==null?void 0:b.payload)==null?void 0:A.path)?t.lambda.payload.path:""}},sam:{buildArguments:void 0,containerBuild:!1,dockerNetwork:"",localArguments:void 0,skipNewImageCheck:!1,...(t==null?void 0:t.sam)?t.sam:{},template:{parameters:((n=(_=t==null?void 0:t.sam)==null?void 0:_.template)==null?void 0:n.parameters)?t.sam.template.parameters:{}}},api:{path:"",httpMethod:"get",clientCertificateId:"",querystring:"",headers:{},stageVariables:{},...(t==null?void 0:t.api)?t.api:{},payload:{json:((N=(v=t==null?void 0:t.api)==null?void 0:v.payload)==null?void 0:N.json)?t.api.payload.json:{},path:((k=(E=t==null?void 0:t.api)==null?void 0:E.payload)==null?void 0:k.path)?t.api.payload.path:""}}}}function oe(){return{containerBuild:!1,skipNewImageCheck:!1,launchConfig:ne(),payload:{value:"",errorMsg:""},apiPayload:{value:"",errorMsg:""},environmentVariables:{value:"",errorMsg:""},parameters:{value:"",errorMsg:""},headers:{value:"",errorMsg:""},stageVariables:{value:"",errorMsg:""}}}const Ut=(0,e.defineComponent)({name:"sam-invoke",components:{settingsPanel:Lt},created(){U.init().then(t=>this.parseConfig(t)),U.getRuntimes().then(t=>{this.runtimes=t})},mixins:[ee],data(){return{...oe(),msg:"Hello",targetTypes:[{name:"Code",value:"code"},{name:"Template",value:"template"},{name:"API Gateway (Template)",value:"api"}],runtimes:[],httpMethods:["GET","POST","PUT","DELETE","HEAD","OPTIONS","PATCH"]}},methods:{resetJsonErrors(){this.payload.errorMsg="",this.environmentVariables.errorMsg="",this.headers.errorMsg="",this.stageVariables.errorMsg=""},launch(){const t=this.formatConfig();t&&U.invokeLaunchConfig(t)},save(){const t=this.formatConfig();t&&U.saveLaunchConfig(t)},loadConfig(){U.loadSamLaunchConfig().then(t=>this.parseConfig(t))},parseConfig(t){var a,u,f,b,A,_,n,v,N,E,k,R,Z,re,le;!t||(this.clearForm(),this.launchConfig=ne(t),((a=t.lambda)==null?void 0:a.payload)&&(this.payload.value=JSON.stringify(t.lambda.payload.json,void 0,4)),((u=t.lambda)==null?void 0:u.environmentVariables)&&(this.environmentVariables.value=JSON.stringify((f=t.lambda)==null?void 0:f.environmentVariables)),((A=(b=t.sam)==null?void 0:b.template)==null?void 0:A.parameters)&&(this.parameters.value=JSON.stringify((n=(_=t.sam)==null?void 0:_.template)==null?void 0:n.parameters)),((v=t.api)==null?void 0:v.headers)&&(this.headers.value=JSON.stringify((N=t.api)==null?void 0:N.headers)),((E=t.api)==null?void 0:E.stageVariables)&&(this.stageVariables.value=JSON.stringify((k=t.api)==null?void 0:k.stageVariables)),this.containerBuild=(Z=(R=t.sam)==null?void 0:R.containerBuild)!=null?Z:!1,this.skipNewImageCheck=(le=(re=t.sam)==null?void 0:re.skipNewImageCheck)!=null?le:!1,this.msg=`Loaded config ${t}`)},loadPayload(){this.resetJsonErrors(),U.getSamplePayload().then(t=>{!t||(this.payload.value=JSON.stringify(JSON.parse(t),void 0,4))})},loadResource(){this.resetJsonErrors(),U.getTemplate().then(t=>{!t||(this.launchConfig.invokeTarget.target="template",this.launchConfig.invokeTarget.logicalId=t.logicalId,this.launchConfig.invokeTarget.templatePath=t.template)})},formatFieldToStringArray(t){if(!t)return;const a=/\s*,\s*/g;return t.trim().split(a)},formatStringtoJSON(t){if(t.errorMsg="",t.value)try{return JSON.parse(t.value)}catch(a){throw t.errorMsg=a.message,a}},formatConfig(){var t,a,u,f;this.resetJsonErrors();let b,A,_,n,v,N;try{b=this.formatStringtoJSON(this.payload),A=this.formatStringtoJSON(this.environmentVariables),_=this.formatStringtoJSON(this.headers),n=this.formatStringtoJSON(this.stageVariables),v=this.formatStringtoJSON(this.parameters),N=this.formatStringtoJSON(this.apiPayload)}catch(k){return}const E=JSON.parse(JSON.stringify(this.launchConfig));return{...E,lambda:{...E.lambda,payload:{...E.payload,json:b},environmentVariables:A},sam:{...E.sam,buildArguments:this.formatFieldToStringArray((a=(t=E.sam)==null?void 0:t.buildArguments)==null?void 0:a.toString()),localArguments:this.formatFieldToStringArray((f=(u=E.sam)==null?void 0:u.localArguments)==null?void 0:f.toString()),containerBuild:this.containerBuild,skipNewImageCheck:this.skipNewImageCheck,template:{parameters:v}},api:E.api?{...E.api,headers:_,stageVariables:n,payload:{json:N}}:void 0}},clearForm(){const t=oe();Object.keys(t).forEach(a=>this.$data[a]=t[a])}}});var xt=y(538);const Rt=(0,ae.Z)(Ut,[["render",Nt],["__scopeId","data-v-3b06d2ea"]]);/*!
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */const ie=()=>(0,e.createApp)(Rt),se=ie();se.mount("#vue-app"),window.addEventListener("remount",()=>{se.unmount(),ie().mount("#vue-app")})})(),module.exports=Q})();

//# sourceMappingURL=lambdaVue.js.map
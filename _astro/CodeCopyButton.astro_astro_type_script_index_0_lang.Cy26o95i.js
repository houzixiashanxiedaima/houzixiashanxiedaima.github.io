import{t as c}from"./page-behavior.DXNYfC4S.js";c("code-copy-buttons",n=>{document.querySelectorAll("pre:has(code)").forEach(t=>{if(t.querySelector(".copy-button"))return;if(!t.parentElement?.classList.contains("code-block-wrapper")){const r=document.createElement("div");r.className="code-block-wrapper",t.parentNode?.insertBefore(r,t),r.appendChild(t)}const e=document.createElement("button");e.className="copy-button",e.setAttribute("aria-label","复制代码"),e.title="复制代码",e.innerHTML=`
        <svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `,e.addEventListener("click",async()=>{const r=t.querySelector("code");if(r)try{const o=r.textContent||"";await navigator.clipboard.writeText(o),e.classList.add("copied"),setTimeout(()=>{e.classList.remove("copied")},2e3)}catch(o){console.error("Failed to copy:",o)}},{signal:n}),t.parentElement?.appendChild(e)})});

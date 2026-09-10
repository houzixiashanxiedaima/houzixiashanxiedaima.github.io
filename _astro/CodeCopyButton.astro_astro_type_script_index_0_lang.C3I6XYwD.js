import{t as c}from"./page-behavior.DXNYfC4S.js";c("code-copy-buttons",s=>{document.querySelectorAll("pre:has(code)").forEach(r=>{if(r.querySelector(".copy-button"))return;if(!r.parentElement?.classList.contains("code-block-wrapper")){const a=document.createElement("div");a.className="code-block-wrapper",r.parentNode?.insertBefore(a,r),a.appendChild(r)}const e=document.createElement("button");e.className="copy-button",e.setAttribute("aria-label","复制代码"),e.title="复制代码",e.innerHTML=`
        <svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;const t=document.createElement("span");t.className="copy-feedback",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.hidden=!0;let i;e.addEventListener("click",async()=>{const a=r.querySelector("code");if(a){t.hidden=!0,e.classList.remove("copy-failed"),e.classList.remove("copied"),e.setAttribute("aria-label","复制代码"),i&&clearTimeout(i);try{const o=a.textContent||"";await navigator.clipboard.writeText(o),e.classList.add("copied"),e.setAttribute("aria-label","已复制"),i=setTimeout(()=>{e.classList.remove("copied"),e.setAttribute("aria-label","复制代码")},2e3)}catch(o){console.error("Failed to copy:",o),e.classList.add("copy-failed"),e.setAttribute("aria-label","复制失败，重试"),t.textContent="复制失败，请重试或手动选择代码。",t.hidden=!1}}},{signal:s}),r.parentElement?.append(e,t)})});

let lastRetrieveTime = new Date();

chrome.webRequest.onSendHeaders.addListener((details) =>
{
   const now = new Date();
   let seconds = (now.getTime() - lastRetrieveTime.getTime()) / 1000;
   if(seconds< 2)
   {
      return;
   }
   if (details.requestHeaders)
   {
      lastRetrieveTime = now;
      details.requestHeaders.map(header =>
      {
         if (header.name === 'X-LC-Tenant')
         {
            chrome.storage.local.set({
               tenant: header.value
            });
         }
         if (header.name === 'Authorization')
         {
            chrome.storage.local.set({
               bearer: header.value
            });
         }
         if(details.url.includes('ci-languagecloud.sdl.com'))
            chrome.storage.local.set({env: 'ci'})
         else if(details.url.includes('qa-languagecloud.sdl.com'))
            chrome.storage.local.set({env: 'qa'})
         else if(details.url.includes('uat-languagecloud.sdl.com'))
            chrome.storage.local.set({env: 'uat'})
         else if(details.url.includes('staging-languagecloud.sdl.com'))
            chrome.storage.local.set({env: 'stg'})
         else
            chrome.storage.local.set({env: 'prod'})
      })
   }
},
   { urls: ["https://*.sdl.com/lc-api/*"] },
   ["requestHeaders", "extraHeaders"]
);
const copyBearer = async (includeBearer) =>
{
   const { bearer } = await chrome.storage.local.get(['bearer']);
   if (includeBearer)
      navigator.clipboard.writeText(bearer);
   else
      navigator.clipboard.writeText(bearer.replace('Bearer ', ''));

   const el = document.getElementById('loading');
   el.innerHTML = 'Copied to clipboard!';
   el.style.display = 'block';
   setTimeout(() =>
   {
      const el1 = document.getElementById('loading');
      el1.style.display = 'none';
   }, 3000);
}

const generateJwt = async () =>
{
   const el = document.getElementById('loading');
   el.innerHTML = 'Loading...';
   el.style.display = 'block';

   const {bearer} = await chrome.storage.local.get(['bearer']);
   const {tenant} = await chrome.storage.local.get(['tenant']);
   const {env} = await chrome.storage.local.get(['env']);
   if(env !== 'ci' && env !== 'qa'){
      alert(`JWT can be generated only for CI and QA envs, while you're on ${env.toUpperCase()}. For higher envs, extension can only copy your bearer token.`);
      return;
   }
   
   const myHeaders = new Headers();
   myHeaders.append("Content-Type", "application/json");

   const raw = JSON.stringify({
      "accessToken": bearer.replace('bearer ', '').replace('Bearer ', ''),
      "tenant": "LC-"+tenant
   });

   const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
   };

   try {
      const response = await fetch(`http://lc-api-gateway.lc-${env}.global.sdl.corp/jwt/generate`, requestOptions);
      const result = await response.json();
      navigator.clipboard.writeText(result.jwt);
      el.innerHTML = 'JWT generated and copied to clipboard!';
   }
   catch(error){
      el.innerHTML = 'Error! '+error.message;
   }
   setTimeout(() =>
   {
      const el1 = document.getElementById('loading');
      el1.style.display = 'none';
   }, 3000);
}

const buttonCopyWithBearer = document.querySelector('#button_copy');
buttonCopyWithBearer.addEventListener('click', () => copyBearer(true));
const buttonCopyNoBearer = document.getElementById('button_copy_no_bearer')
buttonCopyNoBearer.addEventListener('click', () => copyBearer(false));
const buttonGenerateJwt = document.getElementById('button_generate_token')
buttonGenerateJwt.addEventListener('click', generateJwt);
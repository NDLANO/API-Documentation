 import httpStaus from 'http-status';
 import config from '../config';

 export const htmlTemplate = (path, body) =>
  `<!doctype html>\n<html lang='nb' >
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <link href='/swagger/css/api-documentation.css' media='screen' rel='stylesheet' type='text/css'/>
    </head>
    <body>
      <div id='ndla_header'>
        <a href="${path}" class='home'>APIs from NDLA</a>
        <div id='slogan'>
          <a href="http://www.ndla.no">
            <img src="/swagger/pictures/ndla.png"/>
          </a>
          <p>Open Educational Resources For Secondary Schools</p>
        </div>
      </div>
      <div id='blue_bar'>
         <div id='beta'>*** BETA ***</div>
      </div>
      <div id='content'>
        <ul>${body}</ul>
      </div>
    </body>
  </html>`;

 export const apiDocsUri = (apiObj) => {
   for (const uri of apiObj.paths) {
     if (config.apiDocPath.test(uri)) {
       return uri;
     }
   }
   return undefined;
 };

 export const apiListTemplate = (path, routes) => {
   const listItems = routes.map(route =>
     `<li><a href="${path}swagger?url=${apiDocsUri(route)}">${route.name}</a></li>`
   );

   return htmlTemplate(path, listItems.join(''));
 };

 export const htmlErrorTemplate = ({ status, message, description, stacktrace }) => {
   const statusMsg = httpStaus[status];
   return htmlTemplate('/', `
    <h1>${status} ${statusMsg}</h1>
    <div><b>Message: </b>${message}</div>
    <div><b>Description: </b>${description}</div>
    <div>${stacktrace}</div>
  `);
 };


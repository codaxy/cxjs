window.addEventListener('error', function (event, url, lineNo, colNo) {

   console.log(arguments);

   let container = document.createElement('div');

   container.style.color = 'red';
   container.style.position = 'fixed';
   container.style.background = '#eee';
   container.style.padding = '2em';
   container.style.top = '1em';
   container.style.left = '1em';

   let msg = document.createElement('p');
   msg.innerText = [
      'Message: ' + event.message,
      'URL: ' + url,
      'Line: ' + lineNo,
      'Column: ' + colNo,
      'Error object: ' + event.error && JSON.stringify(event.error)
   ].join(' - ');

   container.appendChild(msg);

   if (event.error) {
      let stack = document.createElement('pre');
      stack.innerText = event.error.stack;
      container.appendChild(stack);
   }

   document.body.appendChild(container);
});

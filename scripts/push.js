'use strict';
var API_KEY = 'AIzaSyBZpOX2dCtVzLJgYz7i31wjLFJkgbzp5E0';
var PUSH_SERVER_URL = 'http://127.0.0.1:8080/myveggies/';

$(document).ready(function() {
    console.log( "I am a veggie push!" );

  //event handeler for notify enable/disable button
  $('#push_notify').change(function(e) {
    if (e.target.checked)
      subscribeDevice();
    else
      unsubscribeDevice();
  });

  // Is the Permissions API supported
  if ('permissions' in navigator)
    setUpPushPermission();

});

function subscribeDevice() {
  // We need the service worker registration to access the push manager
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true })
      .then(onPushSubscription)
      .catch(function(e) {
        // Check for a permission prompt issue
        if ('permissions' in navigator) {
          navigator.permissions.query({name: 'push', userVisibleOnly: true})
            .then(function(permissionState) {
              $('#push_notify').prop('checked', false);
            })
        } 
      });
  });
}


function unsubscribeDevice() {
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.getSubscription().then(
      function(pushSubscription) {
        // Check we have everything we need to unsubscribe
        if (!pushSubscription) {
          $('#push_notify').prop('checked', false);
          return;
        }
        console.log('Unsubscribe from push');
        pushSubscription.unsubscribe().then(function(successful) {
          console.log('Unsubscribed from push: ', successful);
          if (!successful)
            console.error('We were unable to unregister from push');
        })
      }.bind(this)).catch(function(e) {
        console.error('Error thrown while revoking push notifications. ' +
          'Most likely because push was never registered', e);
      });
  });
}


function onPushSubscription(pushSubscription) {
  console.log('pushSubscription = ', pushSubscription.endpoint);
  console.log('pushSubscription: ', pushSubscription);

  // Code to handle the XHR
  var sendPushViaXHRButton = document.querySelector('footer');
  sendPushViaXHRButton.addEventListener('click', function(e) {
    var formData = new FormData();
    var endpoint = pushSubscription.endpoint;

    if ('subscriptionId' in pushSubscription) {
      // Make the endpoint always contain the subscriptionId
      // so the server is always consistent
      if (!endpoint.includes(pushSubscription.subscriptionId)) {
        endpoint += '/' + pushSubscription.subscriptionId;
      }
    }

    formData.append('endpoint', endpoint);
    fetch(PUSH_SERVER_URL + '/send_push', {
        method: 'post',
        body: formData
      }).then(function(response) {
        console.log('Response = ', response);
      }).catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
  });

}

function setUpPushPermission() {
  navigator.permissions.query({name: 'push', userVisibleOnly: true})
    .then(function(permissionState) {
      // Check if push is supported and what the current state is
      navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        // Let's see if we have a subscription already
        serviceWorkerRegistration.pushManager.getSubscription()
          .then(function(subscription) {
            if (!subscription) {
              console.log('No subscription given');
              return;
            }
            $('#push_notify').prop('checked', true);
            onPushSubscription(subscription);
          })
          .catch(function(e) {
            console.log('An error occured while calling getSubscription()', e);
          });
      });
    })
}
export default {
   api: {
      // url: 'http://localhost:53818/'
      url: 'https://api.cxjs.io/',
      cookies: 'include'
   },
   appPath: '/',
   login: {
      google: {
         client_id: '446869185521-27js3c0hhh2a61g4sp3j6e48etp3i862.apps.googleusercontent.com',
         url: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&state=${state}&response_type=code&scope=${scope}&redirect_uri=${redirect_uri}',
         scope: "email",
         name: 'Google'
      },
      github: {
         client_id: 'a185c8146c38ff78b9aa',
         url: 'https://github.com/login/oauth/authorize?client_id=${client_id}&state=${state}&scope=${scope}',
         scope: "user:email",
         name: 'GitHub'
      }
   }
};

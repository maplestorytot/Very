mobile1a-app.component.html calls resize method when it is created or mobile1 occurs
mobile1-app.component.html resizes size of screen
mobile2-app.component.ts onResize method is called, calls responsive service checking if its a mobile device
mobile3-check mobile sends out an observable isMobile
mobile4-received by app.component



state1a- after logging in, go to user list
state1b- after sign up, go to user list
state1c- after clicking on friend's name, go to chat box
state1d- after clicking P on friend's name, go to others-profile
state1e- after clciking x on chat box, go to user list
state3-responsive service sends out to everywhere that state is changed
state4-app component receieves new state and changes display based on state

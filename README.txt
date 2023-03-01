Gameplay Demo : https://youtu.be/MSrTeee06Dc

NOTE: you can press m to set the next level to completed (when youre on the level select screen)

I'm not sure if you can run the game out of the box, but here's what I installed
    Node.js 
    Vite

To run game do "npm run dev" and it'll host it on localhost. It will give you a link to open it with. 
I did run npm run build and it did build the project but I'm not sure how that works so I just recommend using the npm run dev method.
I have all the files here so it should work.

Since there's no presentation this time around here's a reflective:

The game isn't finished. This is because I procrastinated for the first 3 weeks and also because 
 the code is really bad and hard to expand without breaking everything.
 I could improve the game by rebuilding it from the ground up and reusing most the code, but that would take more time than I have (2 days).

Here are the problems:

Can't add more features without breaking a lot of stuff:
    Because of the main menu simulation, I made the entire main menu inherit the entire game scene. This turned out to be a terrible idea because stuff breaks really easily.
    The code is alright (I know I could do better) but when I add new stuff it tends to break because of how I made the Scenes.
    The lack of a good debugger (I have to use firefox dev tools) and lack of type checking make it really hard to find issues in the code.
    I could rebuild the whole thing and fix this but that would be more work than I have time for.
    The missing features are:
        No powerups
        No sfx
        No Settings menu (because no sfx)
        Can't set default level.

Broken collision:
    I would call the collision itself robust but I wouldn't call the bouncing robust.
    The ball collision itself works but the bouncing is inconsistent, sometimes the ball will bounce the wrong direction
     because it can't properly determine what side of the brick it collided with. 
     It checks if the ball is under or above the ball, but in a few cases this doesn't give the right outcome
     and the ball will do a lot of weird things.
     The way to fix this would be to detect maths stuff with normals and such and while I do understand those
      it would take time for me to refresh my memory of them and to make a solution for it and test it, which
      I don't think is possible in 2 days.

Can't set default levels:
    There is no way to set default levels, the levels do save though.
    There isn't an easy way for me to set the default levels, I did have
     some levels created using the level creator but those don't save between 
     browsers since the levels are stored in localstorage.
     Now the game just makes a row of 12 bricks for every level unless you change them with the level creator.

I am only stating the things wrong with the game here but looking at the assignment brief the game does fit a lot of 
 the bullet points on the core task section, and I am proud of how nice the UI looks in this game. 
 CSS is super powerful and combined with js it makes it really easy to do UI design. 

I learned how to improve my code from this project because js doesn't tell you issues with your code as much as other languages.
I really need to work on a more defined coding style in regards to how I name variables, what functions do and what they're named. 
I saw a video near the end of this project that a good way to write clean code is to try and make everything self documenting,
 so that your code doesn't need comments to make sense. 
For future projects I'm going to keep the assignment brief in mind a lot more, since if I had for this project I would've made brick explosions and particles. 
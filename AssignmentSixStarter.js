//name: Adam Katz
//description: Assignment 6
//proposed points: If I neglect to change this comment and the name above, I agree that I will
// automatically be deducted 1 point (out of 15)
// 
// key bindings are set so that pressing 'W' will make the eye position move in z direction
//                                       'S' will make the eye position move in -z direction
//                                       'A' will rotate to the left
//                                       'D' will rotate to the right
//   The keys allow for the user to move within the environment
//    it's a bit of a hack, but works well enough for simple navigation here



"use strict";

var render, canvas, gl;

var pointsArray = [];
var textureArray= [];
var program;

var zPos = 10.0;  //position of Eye
var theta  = 0.0; //rotation for eye position
var eye;

var modelViewMatrix;
var modelViewMatrixLoc;

var projectionMatrix;
var projectionMatrixLoc;

var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var texCoordsArray = [];

var option = 0 

function loadPoints(points,texture) {
    //load the vertex positions and texture positions here


    //The floor
    points.push(vec4(-6.0, 0 , 15, 1));
    texture.push(vec2(0, 1));
    points.push(vec4(-6.0 , 0 , 0, 1));
    texture.push(vec2(0, .5));
    points.push(vec4(6.0 , 0 , 0, 1));
    texture.push(vec2(.5, .5));

    points.push(vec4(-6.0, 0 , 15, 1));
    texture.push(vec2(0, 1));
    points.push(vec4(6.0 , 0 , 0, 1));
    texture.push(vec2(.5, .5));
    points.push(vec4(6.0 , 0 , 15, 1));
    texture.push(vec2(.5, 1));

    //The Wall
    points.push(vec4(-6.0, 0 , 0, 1));
    texture.push(vec2(0, 0));
    points.push(vec4(-6.0 , 5 , 0, 1));
    texture.push(vec2(0, .5));
    points.push(vec4(6.0 , 0 , 0, 1));
    texture.push(vec2(.5, 0));

    //the other half of the wall 
    points.push(vec4(6,0,0,1));
    texture.push(vec2(0,.5));
    points.push(vec4(6,5,0,1));
    texture.push(vec2(0,.0))
    points.push(vec4(-6,5,0,1));
    texture.push(vec2(.5,0));


    //The Monkey lisa 
    points.push(vec4(-1,1.25,0.2,1));
    texture.push(vec2(.5,.5));
    points.push(vec4(-1,4,0.2,1));
    texture.push(vec2(.5,1));
    points.push(vec4(1,1.25,0.2,1));
    texture.push(vec2(1,.5));

    points.push(vec4(1,1.25,.2,1));
    texture.push(vec2(1,.5));
    points.push(vec4(1,4,.2,1));
    texture.push(vec2(1,1));
    points.push(vec4(-1,4,.2,1));
    texture.push(vec2(.5,1));

    //First half of the right wall
    points.push(vec4(-6,0,15,1));
    texture.push(vec2(0,0));
    points.push(vec4(-6,0,0,1));
    texture.push(vec2(.5,0));
    points.push(vec4(-6.0,5,15,1));
    texture.push(vec2(0,.5));

    //second half of the right wall
    points.push(vec4(-6,0,0,1));
    texture.push(vec2(.5,0))
    points.push(vec4(-6,5,15,1));
    texture.push(vec2(0,.5));
    points.push(vec4(-6,5,0,1));
    texture.push(vec2(.5,.5));

    //first half of the left wall 
    points.push(vec4(6,0,15,1));
    texture.push(vec2(0,0));
    points.push(vec4(6,0,0,1));
    texture.push(vec2(.5,0));
    points.push(vec4(6.0,5,15,1));
    texture.push(vec2(0,.5));

    //second half of the left wlal
    points.push(vec4(6,0,0,1));
    texture.push(vec2(.5,0))
    points.push(vec4(6,5,15,1));
    texture.push(vec2(0,.5));
    points.push(vec4(6,5,0,1));
    texture.push(vec2(.5,.5));

    //first half of the back wall 
    points.push(vec4(-6.0, 0 , 15, 1));
    texture.push(vec2(0, 0));
    points.push(vec4(-6.0 , 5 , 15, 1));
    texture.push(vec2(0, .5));
    points.push(vec4(6.0 , 0 , 15, 1));
    texture.push(vec2(.5, 0));

    //second half of teh back wall
    points.push(vec4(6,0,15,1));
    texture.push(vec2(0,.5));
    points.push(vec4(6,5,15,1));
    texture.push(vec2(0,.0))
    points.push(vec4(-6,5,15,1));
    texture.push(vec2(.5,0));

    //The Painting Monke 
    points.push(vec4(-5.8,1.25,6.125,1));
    texture.push(vec2(1,0));
    points.push(vec4(-5.8,4,6.125,1));
    texture.push(vec2(1,.5));
    points.push(vec4(-5.8,1.25,8.875,1));
    texture.push(vec2(.5,0));

    points.push(vec4(-5.8,1.25,8.875,1));
    texture.push(vec2(.5,0));
    points.push(vec4(-5.8,4,8.875,1));
    texture.push(vec2(.5,.5));
    points.push(vec4(-5.8,4,6.125,1));
    texture.push(vec2(1,.5));

  }

function configureTexture(image, option) {
    var texture = gl.createTexture();
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 
        gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap( gl.TEXTURE_2D );
    

    if (option == 0)
    {
        //point sampling
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }
    else 
    {
      //mip mapping
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
    }

}

onload = function init()  {

    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( .9, .9, .9, 1.0 );
    gl.enable(gl.DEPTH_TEST);
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    loadPoints(pointsArray, textureArray);

    //establish buffers to send to shaders
    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(textureArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    //establish texture
    var image = document.getElementById("texImage");
    configureTexture(image);

    gl.uniform1i( gl.getUniformLocation(program, "uTextureMap"), 0);
    //Initialize menu
    document.getElementById("Menu").onclick = function(event)
    {
      console.log(event.target.index);
      configureTexture(image, event.target.index);
    };
   // Initialize event handler (key codes)
    window.onkeydown = function( event ) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
          case 'W': //forward
            zPos -= .4
            break;
          case 'S': //back 
            zPos += .4
           break;
          case 'A': //pan to left
            theta-=.04;
            break;
          case 'D':  //pan to right
           theta+=.04;
           break;
        }
      };
        

  

    render();
}

render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT);

    eye = vec3(0, 1, zPos);
    at = vec3(zPos*Math.sin(theta), 1, 10 - 10*Math.cos(theta));

    //establish modelView and Projection matrices
    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(45, 1, 1.0, 100);
 
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    //draw triangles
    gl.drawArrays( gl.TRIANGLES, 0, pointsArray.length);
 
    requestAnimationFrame(render);
}

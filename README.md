# WebGL-3D-Renderer
A somewhat complex demonstration of 3D rendering in WebGL. Coded as part of an Extended Project Qualification 
in late 2016/early 2017. The 3D renderer has support for both diffuse and specular lighting, while both the test 
and ionic-lattice demos implement cannon-js as a physics engine.

A quite poor JavaScript 'hack' was employed, primarily using AJAX, to use seperate JS files with a folder structure.
This was coded before I knew of the existence of ES6/Babel/Webpack, which my later JS projects are coded in.

Javascript is a terrible language for doing anything other than web development in. Notably due to its failure to
support operator overloading, making vector/matrix mathematics incredibly complicated to conduct.

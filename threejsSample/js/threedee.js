/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2014 Adobe Inc.
* All Rights Reserved.
*
* NOTICE: Adobe permits you to use, modify, and distribute this file in
* accordance with the terms of the Adobe license agreement accompanying
* it. If you have received this file from a source other than Adobe,
* then your use, modification, or distribution of it requires the prior
* written permission of Adobe. 
**************************************************************************/

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global window, document, THREE, THREEx, dat */

(function () {
    "use strict";

    var VIEW_ANGLE = 45,
        NEAR = 0.1,
        FAR = 10000;

    var renderer,
        camera,
        scene;

    var cube1;
    var rotationSpeed = 0.01;

    //RAF
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;



    function addCube(pX, pY, pZ) {

        var material = new THREE.MeshLambertMaterial(
            {color: 0x444444}
        );

        var cube = new THREE.Mesh(
            new THREE.CubeGeometry(50, 50, 50, 1, 1, 1),
            material
        );

        cube.position.x = pX;
        cube.position.y = pY;
        cube.position.z = pZ;

        scene.add(cube);

        return cube;
    }



    function addLight(pX, pY, pZ) {
        var pointLight = new THREE.PointLight(0xFFFFFF);

        pointLight.position.x = pX;
        pointLight.position.y = pY;
        pointLight.position.z = pZ;

        scene.add(pointLight);
    }


    function setUpScene(w, h) {

        // if required to support .toDataURL():
        // {preserveDrawingBuffer   : true}
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(w, h);

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, w / h, NEAR, FAR);
        camera.position.z = 160;
        scene.add(camera);

        cube1 = addCube(0, 0, 25);

        addLight(10, 50, 130);
    }



    function setUpGUI() {

        /*
        document.getElementById("container").addEventListener("click", function () {
            // Enable fullscreen
            //THREEx.FullScreen.request();
        });
        */
        
        // Control panel
        
        var gui = new dat.GUI();
        var params = {speed: 0.1};
        var spdCtrl = gui.add(params, 'speed', 0, 0.5);
        spdCtrl.onChange(function (value) {
            rotationSpeed = value;
        });
        gui.closed = true;
        
    }



    function beforePaint() {

        cube1.rotation.y += rotationSpeed;

        renderer.render(scene, camera);
        requestAnimationFrame(beforePaint);
    }



    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }



    function init() {

        setUpScene(window.innerWidth, window.innerHeight);

        document.getElementById("container").appendChild(renderer.domElement);

        setUpGUI();
        requestAnimationFrame(beforePaint);
        
        window.addEventListener('resize', onWindowResize, false);

    }
    
    init();

}());
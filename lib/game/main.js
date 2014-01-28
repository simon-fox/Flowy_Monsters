ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	//plugins
	'plugins.box2d.game',
	'plugins.box2d.debug',
	//levels
	'game.levels.stage',
	//entities
	'game.entities.monster',
	'game.entities.monsterHead',
	'game.entities.monsterChest',
	'game.entities.monsterLimbSegment',
	'game.entities.monsterHips',
	//particles
	
	//UI classes
	'game.entities.windVector',
	'game.entities.breathCounter',
	'game.entities.breathIndicator',
	'game.entities.breatheText',
	//debug
	'impact.debug.debug'
)
.defines(function(){

MyGame = ig.Box2DGame.extend({
	font: new ig.Font( 'media/invasionFont.png' ),
	gravity: 1000,
	mouseLast: {x: 0, y: 0},
	mouseOverBody: false,
	mouseOverClass: false,
	mouseJoint: false,
	breathCount: 0,
	breaths: [ {i:3 , o: 3} , {i:3 , o: 4} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3}, {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} ],
	killList: [],
	breathIndicator: false,
	frozenBodies: [],

	init: function() {
		//box2d debug
		this.debugCollisionRects = true;
		//bind keys
		ig.input.bind( ig.KEY.UP_ARROW, 'up');
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down');
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');
		ig.input.bind( ig.KEY.MOUSE1, 'mouseLeft' );
		//set up camera trap
		this.camera = new Camera( ig.system.width/3.5 , ig.system.height/2 , 6 );
	    this.camera.trap.size.x = 160;
	    this.camera.trap.size.y = 100;
	    this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width/6 : 0;
		// Load level
		this.loadLevel( LevelStage );
		//set up contact listener
		this.setContactListener();
		//spawn monster
		ig.game.spawnEntity( EntityMonster , 100 , 10 );
		this.player = ig.game.getEntitiesByType( EntityMonsterHips )[0];
		this.camera.set( this.player );
		
	},

	loadLevel: function( level ) {        
	    this.parent( level );
	    
	    // Set camera max and reposition trap
	    this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
	    this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;
	    
	},
	
	update: function() {
		this.parent();
		this.handleMouseInput();
		this.cleanUpWindVectors();
		this.processKillList();
		this.camera.follow( this.player );
	},
	
	draw: function() {
		//draw box2d debug
		//this.debugDrawer.draw();

		this.parent();

		//get system dimensions for drawing
		//var x = ig.system.width/2,
		//y = ig.system.height/2;
		//drawing text
		//this.font.draw( "Flowy Boat" , x - 150, y - 280, ig.Font.ALIGN.LEFT );	
	},

	handleMouseInput: function() {
		//grab mouse positions and adjust for b2d
        this.mouseX = (ig.input.mouse.x + ig.game.screen.x) * Box2D.SCALE;
    	this.mouseY = (ig.input.mouse.y + ig.game.screen.y) * Box2D.SCALE;

		//click, state & release functions for mouse click
		if (ig.input.pressed('mouseLeft') ) {
			//spawn a breathIndicator
			//this.breathIndicator = ig.game.spawnEntity( EntityBreathIndicator , 0 , 0 );
			
			//do mousejoint
			this.getBodyUnderMouse();
	
			//set the timer and state in breathIndicator 
			//this.breathIndicator.state = "IN";
			//this.breathIndicator.breathTimer.set( 3 ); //hardcode breath time for now

        }
        if (ig.input.state('mouseLeft')) {
        	this.createMouseJoint();
        	/*
        	if( this.breathIndicator.fullBreathTaken == true ){ 
        		this.breathIndicator.state = "HOLDING"
        	}
        	*/
        }
        if (ig.input.released('mouseLeft') ) {
        	//kill breathIndicator
        	//this.breathIndicator.state = "OUT";
        	//this.breathIndicator.killText();
			//this.breathIndicator.breathTimer.set( 4 ); //hardcode breath time for now
			
			this.destroyMouseJoint();
        }
        this.updateMouseJointTarget();
	}, 

	setContactListener: function(){
		this.contactListener = new Box2D.Dynamics.b2ContactListener;
		ig.world.SetContactListener(this.contactListener);
		this.contactListener.BeginContact = function(contact){
		var fixtureA = contact.GetFixtureA();
		var fixtureB = contact.GetFixtureB();
			// INVESTIGATE FIXTURE A
			if ( fixtureA.m_userData != null){
				switch(fixtureA.m_userData.name){
					case 'SENSOR':
					break;
				}
			}
			// INVESTIGATE FIXTURE b
			if ( fixtureB.m_userData != null){
				switch(fixtureB.m_userData.name){
					case 'SENSOR':
					break;
				}
			}
		};

		this.contactListener.EndContact = function(contact){
			// INVESTIGATE FIXTURE A
			if ( contact.GetFixtureA().m_userData != null){
				switch(contact.GetFixtureA().m_userData.name){
				}
			}
			// INVESTIGATE FIXTURE b
			if ( contact.GetFixtureA().m_userData != null){
				switch(contact.GetFixtureA().m_userData.name){
				}
			}
		};


	},

	processKillList: function(){
		//loop through killList and destroy all bodies
		if( this.killList.length > 0 ){
			for( var i = 0 ; i < this.killList.length ; i++ ){
				this.killList[i].kill();
			}
			//empty killList 
			this.killList = [];
		}
	},

	cleanUpWindVectors: function(){
		var windVectorArray = ig.game.getEntitiesByType(EntityWindVector);
		if( windVectorArray.length > 1){
			windVectorArray[0].kill();
		}
	},

	getBodyUnderMouse: function(){
		//let's grab a body in box2d
        //Create a new bounding box
        var aabb = new Box2D.Collision.b2AABB();
        //set lower & upper bounds
        aabb.lowerBound.Set( this.mouseX - 0.01, this.mouseY - 0.01 );
        aabb.upperBound.Set( this.mouseX + 0.01, this.mouseY + 0.01 );
        //callback for the query function
        function GetBodyCallBack(fixture){
                //store body
                ig.game.mouseOverClass = fixture.GetUserData();
                ig.game.mouseOverBody = fixture.GetBody();
                console.log(fixture.GetUserData().name + " grabbed and stored");
        }
        ig.world.QueryAABB(GetBodyCallBack,aabb);
        //check if body is frozen, if so, unfreeze it
        if( ig.game.mouseOverBody.GetType() != 2 ){
        	//unfreeze body
            ig.game.mouseOverBody.SetType( Box2D.Dynamics.b2Body.b2_dynamicBody );
        }
	},

	createMouseJoint: function(){
		//is there a body stored? is there a joint already?
        if(this.mouseOverBody != false && this.mouseJoint == false){
                var mouseJointDef = new Box2D.Dynamics.Joints.b2MouseJointDef;
                mouseJointDef.bodyA = ig.world.GetGroundBody();
                mouseJointDef.bodyB = this.mouseOverBody;
                mouseJointDef.maxForce = 100000;
                mouseJointDef.target.Set((ig.input.mouse.x + ig.game.screen.x)*Box2D.SCALE,(ig.input.mouse.y + ig.game.screen.y)*Box2D.SCALE);
                this.mouseJoint = ig.world.CreateJoint(mouseJointDef);
        }
	},

	destroyMouseJoint: function(){
		if(this.mouseOverBody != false){
            //clear stored body
            //happens in breathIndicator.cleanUpAfterBreathIsFinished();

            if( 
            	ig.game.mouseOverClass.name == "MONSTERLIMBSEGMENT" || 
            	ig.game.mouseOverClass.name == "LOWERARM"
            ){
            	//freeze body
            	ig.game.mouseOverBody.SetType( Box2D.Dynamics.b2Body.b2_staticBody );
        		//store frozen body but do not duplicate
        		if( ig.game.frozenBodies[ ig.game.frozenBodies.length - 1 ] != ig.game.mouseOverBody ){
        			ig.game.frozenBodies.push( ig.game.mouseOverBody );
        		}
        		//check for number of frozen bodies
        		//if more than 3, unfreeze oldest one
        		if( ig.game.frozenBodies.length > 3 ){
        			ig.game.frozenBodies[0].SetType( Box2D.Dynamics.b2Body.b2_dynamicBody );
        			ig.game.frozenBodies.splice( 0 , 1 );
        			console.log(ig.game.frozenBodies);
        		}

        	}
        }
        if(this.mouseJoint != false){
            //destroy mouse joint
            ig.world.DestroyJoint(this.mouseJoint);
            //clear stored body
            this.mouseJoint = false;
        }
	},

	updateMouseJointTarget: function(){
		//if we have a mouse joint, keep setting the target
        if(this.mouseJoint != false){
                var target = new Box2D.Common.Math.b2Vec2((ig.input.mouse.x + ig.game.screen.x) * Box2D.SCALE , (ig.input.mouse.y + ig.game.screen.y) * Box2D.SCALE);
                this.mouseJoint.SetTarget(target);
        }
	},

	rotate: function(pointX, pointY, rectWidth, rectHeight, angle) {
	  // convert angle to radians
	  //angle = angle * Math.PI / 180.0
	  // calculate center of rectangle
	  var centerX = rectWidth / 2.0;
	  var centerY = rectHeight / 2.0;
	  // get coordinates relative to center
	  var dx = pointX - centerX;
	  var dy = pointY - centerY;
	  // calculate angle and distance
	  var a = Math.atan2(dy, dx);
	  var dist = Math.sqrt(dx * dx + dy * dy);
	  // calculate new angle
	  var a2 = a + angle;
	  // calculate new coordinates
	  var dx2 = Math.cos(a2) * dist;
	  var dy2 = Math.sin(a2) * dist;
	  // return coordinates relative to top left corner
	  return { newX: dx2 + centerX, newY: dy2 + centerY };
	}

});

var c = document.createElement('canvas');
c.id = 'canvas';
document.body.appendChild(c);

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 420, 668, 1 );

});

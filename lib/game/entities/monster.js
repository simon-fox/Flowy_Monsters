ig.module(
	'game.entities.monster'
)
.requires(
	'impact.entity',
	'plugins.box2d.entity'
)
.defines(function(){

EntityMonster = ig.Box2DEntity.extend({
	size: {x: 100, y: 100 },
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	name: "MONSTERHEAD",
	state: "ON",
	radius: 40,
	zIndex: 10,
	dampingRatio: 0.3,
	frequencyHz: 8,
	jointList: [],
	upForce: -10000,
	

	init: function( x, y, settings ) {
		//create parts
		//trunk
		this.upperChest = ig.game.spawnEntity( EntityMonsterChest , 100 , 50 );
		this.torso = ig.game.spawnEntity( EntityMonsterChest , 100 , 130 );
		this.hips = ig.game.spawnEntity( EntityMonsterHips , 100 , 210 );
		//left arm - PLAYERS LEFT
		this.leftUpperArm = ig.game.spawnEntity( EntityMonsterLimbSegment , 80 , 50 );
		this.leftLowerArm = ig.game.spawnEntity( EntityMonsterLimbSegment , 80 , 150 , {name:"LOWERARM"} );
		//right arm - PLAYERS RIGHT
		this.rightUpperArm = ig.game.spawnEntity( EntityMonsterLimbSegment , 190 , 50 );
		this.rightLowerArm = ig.game.spawnEntity( EntityMonsterLimbSegment , 190 , 150 , {name:"LOWERARM"} );
		//left leg - PLAYERS LEFT
		this.leftUpperLeg = ig.game.spawnEntity( EntityMonsterLimbSegment , 80 , 260 );
		this.leftLowerLeg = ig.game.spawnEntity( EntityMonsterLimbSegment , 80 , 360 );
		//right left - PLAYERS RIGHT
		this.rightUpperLeg = ig.game.spawnEntity( EntityMonsterLimbSegment , 190 , 260 );
		this.rightLowerLeg = ig.game.spawnEntity( EntityMonsterLimbSegment , 190 , 360 );

		//call parent
		this.parent( x, y, settings );
		
	},

	createBody: function() {
		this.createHead();

		
		//create joints
		//main body trunk
		this.createJoint( this.body/*the head*/ , this.upperChest.body , 0 , 40 , 0 , -40 );
		this.createJoint( this.upperChest.body , this.torso.body , 0 , 40 , 0 , -40 );
		this.createJoint( this.torso.body , this.hips.body , 0 , 40 , 0 , -25 );
		//arms - PLAYERS LEFT AND PLAYERS RIGHT
		//left arm
		this.createJoint( this.upperChest.body , this.leftUpperArm.body , -50 , -30 , 0 , -50 );
		this.createJoint( this.leftUpperArm.body , this.leftLowerArm.body , 0 , 50 , 0 , -50 );
		//right arm
		this.createJoint( this.upperChest.body , this.rightUpperArm.body , 50 , -30 , 0 , -50 );
		this.createJoint( this.rightUpperArm.body , this.rightLowerArm.body , 0 , 50 , 0 , -50 );
		//legs
		//left leg
		this.createJoint( this.hips.body , this.leftUpperLeg.body , -40 , 25 , 0 , -50 );
		this.createJoint( this.leftUpperLeg.body , this.leftLowerLeg.body , 0 , 50 , 0 , -50 );
		//right leg
		this.createJoint( this.hips.body , this.rightUpperLeg.body , 40 , 25 , 0 , -50 );
		this.createJoint( this.rightUpperLeg.body , this.rightLowerLeg.body , 0 , 50 , 0 , -50 );
			
	},

	update: function() {
		//apply constant upward force
		this.body.ApplyForce( new Box2D.Common.Math.b2Vec2(0,this.upForce), this.body.GetPosition() );
		this.parent();
	
	},

	createJoint: function( bodyA , bodyB , anchorA_x , anchorA_y , anchorB_x , anchorB_y ){
		//new joint definition
		var jointDef = new Box2D.Dynamics.Joints.b2DistanceJointDef;
		jointDef.localAnchorA =  new Box2D.Common.Math.b2Vec2( anchorA_x * Box2D.SCALE , anchorA_y * Box2D.SCALE );
		jointDef.localAnchorB =  new Box2D.Common.Math.b2Vec2( anchorB_x * Box2D.SCALE , anchorB_y * Box2D.SCALE );
		jointDef.bodyA = bodyA;
	    jointDef.bodyB = bodyB;
	    jointDef.length = 0.1;
	    jointDef.dampingRatio = this.dampingRatio;
	    jointDef.frequencyHz = this.frequencyHz;
	    jointDef.collideConnected = true;

	    var joint =  ig.world.CreateJoint(jointDef);
	    this.jointList.push( joint );//replace with object which refers to names later
	},

	createHead: function(){
		//build new body definition from prototype
		var bodyDef = new Box2D.Dynamics.b2BodyDef();
		//set values
	    bodyDef.position = new Box2D.Common.Math.b2Vec2(
			(this.pos.x ) * Box2D.SCALE,
			(this.pos.y ) * Box2D.SCALE
		); 
	    bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;    
	    
	    //create body, assign to this class
	    this.body = ig.world.CreateBody(bodyDef);

	    //set body properties
	    this.body.SetLinearDamping(3);
	    this.body.SetAngularDamping(3);

	    //new fixture definition from prototype
	    var fixture = new Box2D.Dynamics.b2FixtureDef;
	    //set values
		fixture.shape = new Box2D.Collision.Shapes.b2CircleShape(this.radius * Box2D.SCALE);  
	    fixture.density = 1;
	    fixture.restitution = 0;
	    fixture.friction = 10;
	    fixture.filter.groupIndex = -1;
	    //set userData
	    fixture.userData = this;

	    //create with body as parent 
	    this.headFixture = this.body.CreateFixture(fixture);
	}

});

});
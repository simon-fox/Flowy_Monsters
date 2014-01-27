ig.module(
	'game.entities.monsterHead'
)
.requires(
	'impact.entity',
	'plugins.box2d.entity'
)
.defines(function(){

EntityMonsterHead = ig.Box2DEntity.extend({
	size: {x: 80, y: 80 },
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	name: "MONSTER",
	state: "ON",
	radius: 40,
	dampingRatio: 0.5,
	frequencyHz: 12,
	zIndex: 10,
	jointList: [],
	upForce: -150,

	init: function( x, y, settings ) {
		//call parent
		this.parent( x, y, settings );
	},

	createBody: function() {
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

	    //new fixture definition from prototype
	    var fixture = new Box2D.Dynamics.b2FixtureDef;
	    //set values
		fixture.shape = new Box2D.Collision.Shapes.b2CircleShape(this.radius * Box2D.SCALE);  
	    fixture.density = 1;
	    fixture.restitution = 0;
	    fixture.friction = 10;
	    //set userData
	    fixture.userData = this;

	    //create with body as parent 
	    this.fixture = this.body.CreateFixture(fixture);
	    //set body properties
	    this.body.SetLinearDamping(0);
	    this.body.SetAngularDamping(0);
    	

	},

	update: function() {
		//apply constant upward force
		//this.body.ApplyForce( new Box2D.Common.Math.b2Vec2(0,this.upForce), this.body.GetPosition() );
		this.parent();
	
	}

});

});
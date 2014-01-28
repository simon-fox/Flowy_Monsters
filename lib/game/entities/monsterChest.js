ig.module(
	'game.entities.monsterChest'
)
.requires(
	'impact.entity',
	'plugins.box2d.entity'
)
.defines(function(){

EntityMonsterChest = ig.Box2DEntity.extend({
	size: {x: 100 , y: 80 },
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	upForce: -8000,
	name: "MONSTERCHEST",
	
	init: function( x, y, settings ) {
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
	    //set body properties
	    this.body.SetLinearDamping(1);
	    this.body.SetAngularDamping(1);

	    //new fixture definition from prototype
	    var fixture = new Box2D.Dynamics.b2FixtureDef;
	    //set values
		fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();   
	
		fixture.shape.SetAsBox( ( this.size.x / 2 ) * Box2D.SCALE , ( this.size.y / 2 ) * Box2D.SCALE );
	    fixture.density = 0.5;
	    fixture.friction = 0.1;
	    fixture.restitution = 0.4;
	    fixture.filter.groupIndex = -1;
	    //set userData
	    fixture.userData = this;
	    //create with body as parent 
	    this.fixture = this.body.CreateFixture(fixture);
	},
	
	
	update: function() {
		//apply constant upward force
		this.body.ApplyForce( new Box2D.Common.Math.b2Vec2(0,this.upForce), this.body.GetPosition() );
		this.parent();
	}
});

});

